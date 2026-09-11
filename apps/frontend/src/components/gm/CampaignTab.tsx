import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  listCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  listQuests,
  createQuest,
  updateQuest,
  deleteQuest,
  addQuestStep,
  updateQuestStep,
  deleteQuestStep,
  createCombat,
  type Campaign,
  type Quest,
  type QuestStatus,
  type QuestStep,
  type QuestStepStatus,
} from '../../api/gm';
import { listPlayerCharacters, listPersons } from '../../api/entities';
import { ConfirmDialog } from '../ConfirmDialog';
import { useToast } from '../../toast/ToastProvider';
import {
  usePersonInspect,
  PersonInspectModal,
  buildPersonMatcher,
  linkifyPersons,
  type PersonMatcher,
} from './PersonInspect';

const QUEST_STATUSES: { value: QuestStatus; label: string }[] = [
  { value: 'A_FAIRE', label: 'À faire' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'TERMINEE', label: 'Terminée' },
  { value: 'ECHOUEE', label: 'Échouée' },
];

const STEP_STATUSES: { value: QuestStepStatus; label: string }[] = [
  { value: 'A_FAIRE', label: 'À faire' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'FAITE', label: 'Faite' },
];

const statusLabel = (s: QuestStatus) => QUEST_STATUSES.find((q) => q.value === s)?.label ?? s;

const UNCLASSIFIED = '__none__';

type Props = { token: string | null; onLaunchCombat: (combatId: string) => void };

export function CampaignTab({ token, onLaunchCombat }: Props) {
  const { push } = useToast();
  const err = useCallback(
    (e: unknown, fallback = 'Erreur') => push(e instanceof Error ? e.message : fallback, 'error'),
    [push],
  );

  // Campagnes
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selected, setSelected] = useState<string>(UNCLASSIFIED);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [editingCampaign, setEditingCampaign] = useState(false);
  const [editingPlayers, setEditingPlayers] = useState(false);
  const [allPlayers, setAllPlayers] = useState<{ id: string; name: string }[]>([]);
  const [confirmDeleteCampaign, setConfirmDeleteCampaign] = useState<string | null>(null);

  // Quêtes
  const [quests, setQuests] = useState<Quest[]>([]);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<QuestStatus | 'ALL'>('ALL');
  const [confirmDeleteQuest, setConfirmDeleteQuest] = useState<string | null>(null);

  const reload = useCallback(() => {
    listCampaigns(token).then(setCampaigns).catch(err);
    listQuests(token).then(setQuests).catch(err);
  }, [token, err]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    listPlayerCharacters()
      .then((list) => setAllPlayers(list.map((p) => ({ id: p.id, name: p.name }))))
      .catch(() => {});
  }, []);

  // PNJ connus → mise en lien des noms dans les péripéties + fiche au clic
  const [persons, setPersons] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    listPersons()
      .then((list) => setPersons(list.map((p) => ({ id: p.id, name: p.name }))))
      .catch(() => {});
  }, []);
  const personMatcher = useMemo(() => buildPersonMatcher(persons), [persons]);
  const { inspect, inspectPerson, closeInspect } = usePersonInspect(err);

  const hasUnclassified = useMemo(() => quests.some((q) => !q.campaignId), [quests]);

  // Sélectionne la première campagne par défaut une fois chargées
  useEffect(() => {
    if (selected === UNCLASSIFIED && campaigns.length && !hasUnclassified) {
      setSelected(campaigns[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaigns, hasUnclassified]);

  const campaignQuests = useMemo(
    () => quests.filter((q) => (selected === UNCLASSIFIED ? !q.campaignId : q.campaignId === selected)),
    [quests, selected],
  );
  const visibleQuests =
    statusFilter === 'ALL' ? campaignQuests : campaignQuests.filter((q) => q.status === statusFilter);
  const countFor = (s: QuestStatus) => campaignQuests.filter((q) => q.status === s).length;
  const questCountFor = (id: string) => quests.filter((q) => q.campaignId === id).length;
  const selectedCampaign = campaigns.find((c) => c.id === selected) ?? null;

  // ─── Campagnes ────────────────────────────────────────────────────────────
  const handleCreateCampaign = async () => {
    const name = newCampaignName.trim();
    if (!name) return;
    try {
      const c = await createCampaign(token, { name, order: campaigns.length });
      setCampaigns((prev) => [...prev, c]);
      setNewCampaignName('');
      setSelected(c.id);
    } catch (e) {
      err(e);
    }
  };

  const patchCampaign = async (id: string, patch: Partial<Pick<Campaign, 'name' | 'description' | 'color'>>) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    try {
      await updateCampaign(token, id, patch);
    } catch (e) {
      err(e, 'Erreur de sauvegarde');
    }
  };

  const toggleCampaignPlayer = async (campaign: Campaign, playerId: string) => {
    const current = new Set((campaign.players ?? []).map((p) => p.id));
    if (current.has(playerId)) current.delete(playerId);
    else current.add(playerId);
    const ids = [...current];
    const players = allPlayers.filter((p) => current.has(p.id));
    setCampaigns((prev) => prev.map((c) => (c.id === campaign.id ? { ...c, players } : c)));
    try {
      await updateCampaign(token, campaign.id, { playerCharacterIds: ids });
    } catch (e) {
      err(e, 'Erreur de sauvegarde');
    }
  };

  const createCombatForStep = async (step: QuestStep) => {
    try {
      await createCombat(token, { name: step.title, questStepId: step.id });
      const fresh = await listQuests(token);
      setQuests(fresh);
    } catch (e) {
      err(e);
    }
  };

  // ─── Quêtes ───────────────────────────────────────────────────────────────
  const handleCreateQuest = async () => {
    const title = newQuestTitle.trim();
    if (!title) return;
    try {
      const quest = await createQuest(token, {
        title,
        campaignId: selected === UNCLASSIFIED ? null : selected,
      });
      setQuests((prev) => [...prev, quest]);
      setNewQuestTitle('');
      setExpandedQuest(quest.id);
      setStatusFilter('ALL');
    } catch (e) {
      err(e);
    }
  };

  const patchQuest = async (
    id: string,
    patch: Partial<Pick<Quest, 'title' | 'description' | 'status' | 'notes' | 'campaignId'>>,
  ) => {
    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
    try {
      await updateQuest(token, id, patch);
    } catch (e) {
      err(e, 'Erreur de sauvegarde');
    }
  };

  // ─── Péripéties ───────────────────────────────────────────────────────────
  const setStepsOf = (questId: string, fn: (steps: QuestStep[]) => QuestStep[]) =>
    setQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, steps: fn(q.steps) } : q)));

  const handleAddStep = async (questId: string, title: string) => {
    const t = title.trim();
    if (!t) return;
    try {
      const quest = quests.find((q) => q.id === questId);
      const step = await addQuestStep(token, questId, { title: t, order: quest?.steps.length ?? 0 });
      setStepsOf(questId, (steps) => [...steps, step]);
    } catch (e) {
      err(e);
    }
  };

  const patchStep = async (questId: string, stepId: string, patch: Partial<QuestStep>) => {
    setStepsOf(questId, (steps) => steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)));
    try {
      await updateQuestStep(token, stepId, patch);
    } catch (e) {
      err(e, 'Erreur de sauvegarde');
    }
  };

  const removeStep = async (questId: string, stepId: string) => {
    setStepsOf(questId, (steps) => steps.filter((s) => s.id !== stepId));
    try {
      await deleteQuestStep(token, stepId);
    } catch (e) {
      err(e);
    }
  };

  return (
    <div className="campaign-tab">
      {/* ─── Campagnes ───────────────────────────────────────────── */}
      <section className="campaign-section">
        <h3 className="campaign-section-title">Campagnes</h3>

        <div className="campaign-bar">
          {campaigns.map((c) => (
            <button
              key={c.id}
              className={`campaign-pill ${selected === c.id ? 'campaign-pill--on' : ''}`}
              onClick={() => setSelected(c.id)}
              style={selected === c.id && c.color ? { borderColor: c.color } : undefined}
            >
              <span className="campaign-dot" style={{ background: c.color ?? 'var(--accent, #8a7dff)' }} />
              {c.name}
              <span className="campaign-pill-count">{questCountFor(c.id)}</span>
            </button>
          ))}
          {hasUnclassified && (
            <button
              className={`campaign-pill campaign-pill--none ${selected === UNCLASSIFIED ? 'campaign-pill--on' : ''}`}
              onClick={() => setSelected(UNCLASSIFIED)}
            >
              Non classé
              <span className="campaign-pill-count">{quests.filter((q) => !q.campaignId).length}</span>
            </button>
          )}
          <div className="campaign-create-inline">
            <input
              className="detail-input"
              placeholder="Nouvelle campagne…"
              value={newCampaignName}
              onChange={(e) => setNewCampaignName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCampaign()}
            />
            <button className="ghost" onClick={handleCreateCampaign} disabled={!newCampaignName.trim()}>
              + Campagne
            </button>
          </div>
        </div>

        {selectedCampaign && (
          <div className="campaign-head glass">
            <div className="campaign-head-row">
              <input
                type="color"
                className="campaign-color"
                value={selectedCampaign.color ?? '#8a7dff'}
                onChange={(e) => patchCampaign(selectedCampaign.id, { color: e.target.value })}
                title="Couleur d'accent"
              />
              <input
                className="detail-input campaign-name-input"
                value={selectedCampaign.name}
                onChange={(e) =>
                  setCampaigns((prev) => prev.map((c) => (c.id === selectedCampaign.id ? { ...c, name: e.target.value } : c)))
                }
                onBlur={(e) => patchCampaign(selectedCampaign.id, { name: e.target.value.trim() || 'Sans nom' })}
              />
              <button className="ghost" onClick={() => setEditingCampaign((v) => !v)}>
                {editingCampaign ? 'Fermer' : 'Description'}
              </button>
              <button className="ghost" onClick={() => setEditingPlayers((v) => !v)}>
                Joueurs ({selectedCampaign.players?.length ?? 0})
              </button>
              <button className="ghost quest-delete" onClick={() => setConfirmDeleteCampaign(selectedCampaign.id)}>
                Supprimer
              </button>
            </div>
            {editingCampaign && (
              <textarea
                className="detail-input"
                rows={2}
                placeholder="Description / pitch de la campagne…"
                defaultValue={selectedCampaign.description ?? ''}
                onBlur={(e) => patchCampaign(selectedCampaign.id, { description: e.target.value || null })}
              />
            )}
            {!editingCampaign && selectedCampaign.description && (
              <p className="campaign-head-desc">{selectedCampaign.description}</p>
            )}
            {editingPlayers && (
              <div className="campaign-players">
                <span className="quest-field-label">Joueurs de la campagne</span>
                <div className="campaign-players-list">
                  {allPlayers.map((p) => {
                    const on = (selectedCampaign.players ?? []).some((pl) => pl.id === p.id);
                    return (
                      <button
                        key={p.id}
                        className={`campaign-player-chip ${on ? 'campaign-player-chip--on' : ''}`}
                        onClick={() => toggleCampaignPlayer(selectedCampaign, p.id)}
                      >
                        {on ? '✓ ' : ''}{p.name}
                      </button>
                    );
                  })}
                  {allPlayers.length === 0 && <span className="gm-hint">Aucun PJ.</span>}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ─── Quêtes ─────────────────────────────────────────────── */}
      <section className="campaign-section">
        <h3 className="campaign-section-title">
          Quêtes {selectedCampaign ? `· ${selectedCampaign.name}` : selected === UNCLASSIFIED ? '· Non classé' : ''}
        </h3>

        <div className="campaign-create glass">
          <input
            className="detail-input"
            placeholder="Nouvelle quête…"
            value={newQuestTitle}
            onChange={(e) => setNewQuestTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateQuest()}
          />
          <button className="primary glass" onClick={handleCreateQuest} disabled={!newQuestTitle.trim()}>
            Ajouter
          </button>
        </div>

        <div className="quest-filters">
          <button
            className={`quest-filter ${statusFilter === 'ALL' ? 'quest-filter--on' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            Toutes ({campaignQuests.length})
          </button>
          {QUEST_STATUSES.map(({ value, label }) => (
            <button
              key={value}
              className={`quest-filter quest-filter--${value.toLowerCase()} ${statusFilter === value ? 'quest-filter--on' : ''}`}
              onClick={() => setStatusFilter(value)}
            >
              {label} ({countFor(value)})
            </button>
          ))}
        </div>

        <div className="quest-list">
          {visibleQuests.map((q) => {
            const done = q.steps.filter((s) => s.status === 'FAITE').length;
            return (
              <div key={q.id} className={`quest-card glass ${expandedQuest === q.id ? 'quest-card--open' : ''}`}>
                <button
                  className="quest-card-header"
                  onClick={() => setExpandedQuest(expandedQuest === q.id ? null : q.id)}
                >
                  <span className={`quest-status-pill quest-status-pill--${q.status.toLowerCase()}`}>
                    {statusLabel(q.status)}
                  </span>
                  <span className="quest-card-title">{q.title}</span>
                  {q.steps.length > 0 && (
                    <span className="quest-step-badge" title="Péripéties faites">{done}/{q.steps.length}</span>
                  )}
                  {q.description && expandedQuest !== q.id && (
                    <span className="quest-card-preview">{q.description}</span>
                  )}
                  <span className="quest-card-chevron">{expandedQuest === q.id ? '▾' : '▸'}</span>
                </button>
                {expandedQuest === q.id && (
                  <div className="quest-card-body">
                    <div className="quest-body-row quest-body-row--head">
                      <label className="quest-field quest-field--title">
                        <span className="quest-field-label">Titre</span>
                        <input
                          className="detail-input"
                          defaultValue={q.title}
                          onBlur={(e) => {
                            const title = e.target.value.trim();
                            if (title && title !== q.title) patchQuest(q.id, { title });
                          }}
                        />
                      </label>
                      <label className="quest-field quest-field--status">
                        <span className="quest-field-label">Statut</span>
                        <select
                          className="detail-input"
                          value={q.status}
                          onChange={(e) => patchQuest(q.id, { status: e.target.value as QuestStatus })}
                        >
                          {QUEST_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </label>
                      <label className="quest-field quest-field--status">
                        <span className="quest-field-label">Campagne</span>
                        <select
                          className="detail-input"
                          value={q.campaignId ?? UNCLASSIFIED}
                          onChange={(e) =>
                            patchQuest(q.id, { campaignId: e.target.value === UNCLASSIFIED ? null : e.target.value })
                          }
                        >
                          {campaigns.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                          <option value={UNCLASSIFIED}>Non classé</option>
                        </select>
                      </label>
                    </div>

                    <div className="quest-body-row">
                      <label className="quest-field">
                        <span className="quest-field-label">Description</span>
                        <textarea
                          className="detail-input"
                          rows={4}
                          placeholder="De quoi s'agit-il, qui l'a donnée, quel est l'objectif…"
                          defaultValue={q.description ?? ''}
                          onBlur={(e) => patchQuest(q.id, { description: e.target.value || null })}
                        />
                      </label>
                      <label className="quest-field">
                        <span className="quest-field-label">Notes du MJ</span>
                        <textarea
                          className="detail-input"
                          rows={4}
                          placeholder="Avancement, secrets, récompenses prévues…"
                          defaultValue={q.notes ?? ''}
                          onBlur={(e) => patchQuest(q.id, { notes: e.target.value || null })}
                        />
                      </label>
                    </div>

                    <QuestSteps
                      quest={q}
                      onAdd={(t) => handleAddStep(q.id, t)}
                      onPatch={(stepId, patch) => patchStep(q.id, stepId, patch)}
                      onRemove={(stepId) => removeStep(q.id, stepId)}
                      onCreateCombat={createCombatForStep}
                      onLaunchCombat={onLaunchCombat}
                      personMatcher={personMatcher}
                      onInspectPerson={inspectPerson}
                    />

                    <button className="ghost quest-delete" onClick={() => setConfirmDeleteQuest(q.id)}>
                      Supprimer la quête
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {visibleQuests.length === 0 && (
            <div className="gm-hint">
              {statusFilter === 'ALL' ? 'Aucune quête — crée la première ci-dessus.' : 'Aucune quête avec ce statut.'}
            </div>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={confirmDeleteQuest !== null}
        title="Supprimer la quête"
        message="Cette action est définitive (les péripéties sont supprimées aussi)."
        onCancel={() => setConfirmDeleteQuest(null)}
        onConfirm={async () => {
          if (!confirmDeleteQuest) return;
          try {
            await deleteQuest(token, confirmDeleteQuest);
            setQuests((prev) => prev.filter((q) => q.id !== confirmDeleteQuest));
          } catch (e) {
            err(e);
          } finally {
            setConfirmDeleteQuest(null);
          }
        }}
      />
      <ConfirmDialog
        open={confirmDeleteCampaign !== null}
        title="Supprimer la campagne"
        message="Les quêtes de cette campagne ne sont pas supprimées : elles passent dans « Non classé »."
        onCancel={() => setConfirmDeleteCampaign(null)}
        onConfirm={async () => {
          if (!confirmDeleteCampaign) return;
          try {
            await deleteCampaign(token, confirmDeleteCampaign);
            setCampaigns((prev) => prev.filter((c) => c.id !== confirmDeleteCampaign));
            setQuests((prev) => prev.map((q) => (q.campaignId === confirmDeleteCampaign ? { ...q, campaignId: null } : q)));
            setSelected(UNCLASSIFIED);
          } catch (e) {
            err(e);
          } finally {
            setConfirmDeleteCampaign(null);
          }
        }}
      />

      <PersonInspectModal inspect={inspect} onClose={closeInspect} />
    </div>
  );
}

// ─── Sous-composant : péripéties d'une quête ─────────────────────────────────
function QuestSteps({
  quest,
  onAdd,
  onPatch,
  onRemove,
  onCreateCombat,
  onLaunchCombat,
  personMatcher,
  onInspectPerson,
}: {
  quest: Quest;
  onAdd: (title: string) => void;
  onPatch: (stepId: string, patch: Partial<QuestStep>) => void;
  onRemove: (stepId: string) => void;
  onCreateCombat: (step: QuestStep) => void;
  onLaunchCombat: (combatId: string) => void;
  personMatcher: PersonMatcher;
  onInspectPerson: (personId: string) => void;
}) {
  const [newStep, setNewStep] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingDesc, setEditingDesc] = useState<string | null>(null);

  const add = () => {
    if (!newStep.trim()) return;
    onAdd(newStep);
    setNewStep('');
  };

  return (
    <div className="quest-field quest-field--steps">
      <span className="quest-field-label">Péripéties</span>
      <div className="step-list">
        {quest.steps.map((s, i) => (
          <div key={s.id} className={`step-row step-row--${s.status.toLowerCase()}${s.optional ? ' step-row--optional' : ''}`}>
            <div className="step-main">
              <span className="step-index">{i + 1}</span>
              <select
                className="step-status"
                value={s.status}
                onChange={(e) => onPatch(s.id, { status: e.target.value as QuestStepStatus })}
                title="Statut de la péripétie"
              >
                {STEP_STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>{st.label}</option>
                ))}
              </select>
              <button
                className={`step-opt-toggle ${s.optional ? 'step-opt-toggle--on' : ''}`}
                onClick={() => onPatch(s.id, { optional: !s.optional })}
                title={s.optional ? 'Péripétie optionnelle (cliquer pour rendre principale)' : 'Rendre optionnelle'}
              >
                Opt
              </button>
              <button className="step-title" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                {s.title}
                {s.optional && <span className="step-optional-tag">optionnel</span>}
              </button>
              <button className="ghost step-del" title="Supprimer la péripétie" onClick={() => onRemove(s.id)}>×</button>
            </div>
            {expanded === s.id && (
              <div className="step-detail">
                <input
                  className="detail-input"
                  defaultValue={s.title}
                  placeholder="Titre de la péripétie"
                  onBlur={(e) => e.target.value.trim() && e.target.value.trim() !== s.title && onPatch(s.id, { title: e.target.value.trim() })}
                />
                {editingDesc === s.id ? (
                  <textarea
                    className="detail-input step-detail-text"
                    rows={9}
                    autoFocus
                    placeholder="Description de la péripétie, options possibles, jets…"
                    defaultValue={s.description ?? ''}
                    onBlur={(e) => {
                      onPatch(s.id, { description: e.target.value || null });
                      setEditingDesc(null);
                    }}
                  />
                ) : (
                  <div className="step-desc-view">
                    <button className="ghost step-desc-edit" title="Modifier la description" onClick={() => setEditingDesc(s.id)}>
                      ✎ Modifier
                    </button>
                    {s.description ? (
                      <div className="step-desc-rendered">
                        {linkifyPersons(s.description, personMatcher, onInspectPerson)}
                      </div>
                    ) : (
                      <div className="gm-hint">Aucune description — clique sur « ✎ Modifier ».</div>
                    )}
                  </div>
                )}
                <div className="step-combats">
                  <span className="quest-field-label">Rencontre(s)</span>
                  {(s.combats ?? []).map((cb) => (
                    <div key={cb.id} className="step-combat-row">
                      <button
                        className="primary glass step-combat-launch"
                        onClick={() => onLaunchCombat(cb.id)}
                        title="Lancer le combat avec les PJ de la campagne"
                      >
                        ▶ Lancer
                      </button>
                      <span className="step-combat-name">{cb.name}</span>
                      <span className="step-combat-meta">
                        {cb.status === 'FINISHED' ? 'Terminé' : `Round ${cb.round}`}
                      </span>
                    </div>
                  ))}
                  <button className="ghost step-combat-add" onClick={() => onCreateCombat(s)}>
                    ⚔ Créer un combat lié
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {quest.steps.length === 0 && <div className="gm-hint">Aucune péripétie pour le moment.</div>}
      </div>
      <div className="step-add">
        <input
          className="detail-input"
          placeholder="Ajouter une péripétie…"
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button className="ghost" onClick={add} disabled={!newStep.trim()}>+</button>
      </div>
    </div>
  );
}
