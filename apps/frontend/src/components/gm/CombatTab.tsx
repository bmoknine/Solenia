import { useCallback, useEffect, useRef, useState } from 'react';
import {
  listCombats,
  createCombat,
  getCombat,
  updateCombat,
  deleteCombat,
  addCombatant,
  updateCombatant,
  deleteCombatant,
  type CombatSummary,
  type CombatDetail,
  type Combatant,
  type CombatantInput,
} from '../../api/gm';
import { listPersons, listPlayerCharacters, type Person, type PlayerCharacter } from '../../api/entities';
import { ConfirmDialog } from '../ConfirmDialog';
import { useToast } from '../../toast/ToastProvider';
import { usePersonInspect, PersonInspectModal } from './PersonInspect';

const CONDITIONS = [
  'Empoisonné', 'À terre', 'Aveuglé', 'Assourdi', 'Charmé', 'Effrayé', 'Agrippé',
  'Paralysé', 'Pétrifié', 'Entravé', 'Étourdi', 'Inconscient', 'Invisible', 'Concentration',
];

function dexMod(dex: number): number {
  return Math.floor((dex - 10) / 2);
}

function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

function sortCombatants(list: Combatant[]): Combatant[] {
  return [...list].sort(
    (a, b) => b.initiativeRoll - a.initiativeRoll || a.createdAt.localeCompare(b.createdAt),
  );
}

type AddMode = 'pj' | 'pnj' | 'adhoc';

type Props = { token: string | null; openCombatId?: string | null; onConsumeOpen?: () => void };

export function CombatTab({ token, openCombatId, onConsumeOpen }: Props) {
  const { push } = useToast();
  const [combats, setCombats] = useState<CombatSummary[]>([]);
  const [active, setActive] = useState<CombatDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Fiche PNJ inspectée (résumé stats/attaques/sauvegardes)
  const { inspect, inspectPerson, closeInspect } = usePersonInspect((e) =>
    push(e instanceof Error ? e.message : 'Erreur', 'error'),
  );

  // Panneau d'ajout de combattant
  const [showAdd, setShowAdd] = useState(false);
  const [addMode, setAddMode] = useState<AddMode>('pj');
  const [pjs, setPjs] = useState<PlayerCharacter[]>([]);
  const [pnjs, setPnjs] = useState<Person[]>([]);
  const [pickerSearch, setPickerSearch] = useState('');
  const [form, setForm] = useState({ name: '', maxHp: 10, currentHp: 10, ca: '', initiativeRoll: 10 });

  const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const reloadList = useCallback(() => {
    setLoading(true);
    listCombats(token)
      .then(setCombats)
      .catch((e) => push(e instanceof Error ? e.message : 'Erreur', 'error'))
      .finally(() => setLoading(false));
  }, [token, push]);

  useEffect(() => {
    reloadList();
  }, [reloadList]);

  useEffect(() => {
    if (!showAdd) return;
    if (addMode === 'pj' && pjs.length === 0) listPlayerCharacters().then(setPjs).catch(() => {});
    if (addMode === 'pnj' && pnjs.length === 0) listPersons().then(setPnjs).catch(() => {});
  }, [showAdd, addMode, pjs.length, pnjs.length]);

  const openCombat = async (id: string) => {
    try {
      const detail = await getCombat(token, id);
      setActive(detail);
    } catch (e) {
      push(e instanceof Error ? e.message : 'Erreur', 'error');
    }
  };

  // Ouverture déclenchée depuis l'onglet Campagne (« Lancer » sur une péripétie)
  useEffect(() => {
    if (openCombatId) {
      openCombat(openCombatId);
      onConsumeOpen?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCombatId]);

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      const combat = await createCombat(token, { name });
      setNewName('');
      await openCombat(combat.id);
      reloadList();
    } catch (e) {
      push(e instanceof Error ? e.message : 'Erreur', 'error');
    }
  };

  const persistCombat = (patch: Partial<{ round: number; activeTurnIndex: number; status: 'ACTIVE' | 'FINISHED' }>) => {
    if (!active) return;
    updateCombat(token, active.id, patch).catch((e) =>
      push(e instanceof Error ? e.message : 'Erreur de sauvegarde', 'error'),
    );
  };

  const nextTurn = () => {
    if (!active || active.combatants.length === 0) return;
    const count = active.combatants.length;
    const current = active.activeTurnIndex % count;
    const next = (current + 1) % count;
    const newRound = next === 0 ? active.round + 1 : active.round;
    setActive({ ...active, activeTurnIndex: next, round: newRound });
    persistCombat({ activeTurnIndex: next, round: newRound });
  };

  const setHp = (combatant: Combatant, hp: number) => {
    if (!active) return;
    const clamped = Math.max(0, Math.min(hp, combatant.maxHp));
    setActive({
      ...active,
      combatants: active.combatants.map((c) => (c.id === combatant.id ? { ...c, currentHp: clamped } : c)),
    });
    const timers = debounceTimers.current;
    const existing = timers.get(combatant.id);
    if (existing) clearTimeout(existing);
    timers.set(
      combatant.id,
      setTimeout(() => {
        updateCombatant(token, combatant.id, { currentHp: clamped }).catch((e) =>
          push(e instanceof Error ? e.message : 'Erreur de sauvegarde PV', 'error'),
        );
        timers.delete(combatant.id);
      }, 400),
    );
  };

  const toggleCondition = (combatant: Combatant, condition: string) => {
    if (!active) return;
    const conditions = combatant.conditions.includes(condition)
      ? combatant.conditions.filter((c) => c !== condition)
      : [...combatant.conditions, condition];
    setActive({
      ...active,
      combatants: active.combatants.map((c) => (c.id === combatant.id ? { ...c, conditions } : c)),
    });
    updateCombatant(token, combatant.id, { conditions }).catch((e) =>
      push(e instanceof Error ? e.message : 'Erreur de sauvegarde', 'error'),
    );
  };

  const removeCombatant = async (id: string) => {
    if (!active) return;
    try {
      await deleteCombatant(token, id);
      setActive({ ...active, combatants: active.combatants.filter((c) => c.id !== id) });
    } catch (e) {
      push(e instanceof Error ? e.message : 'Erreur', 'error');
    }
  };

  const submitAdd = async (input: CombatantInput) => {
    if (!active) return;
    try {
      const created = await addCombatant(token, active.id, input);
      setActive({ ...active, combatants: [...active.combatants, created] });
      setShowAdd(false);
      setPickerSearch('');
      setForm({ name: '', maxHp: 10, currentHp: 10, ca: '', initiativeRoll: 10 });
    } catch (e) {
      push(e instanceof Error ? e.message : 'Erreur', 'error');
    }
  };

  const addFromPj = (pj: PlayerCharacter) => {
    const maxHp = pj.pvMax ?? pj.pv ?? 10;
    submitAdd({
      name: pj.name,
      playerCharacterId: pj.id,
      initiativeRoll: rollD20() + (pj.initiative ?? dexMod(pj.DEX)),
      currentHp: pj.pv ?? maxHp,
      maxHp,
      ca: pj.ca ?? null,
    });
  };

  const addFromPnj = (pnj: Person) => {
    const maxHp = pnj.pv ?? 10;
    submitAdd({
      name: pnj.name,
      personId: pnj.id,
      initiativeRoll: rollD20() + dexMod(pnj.DEX),
      currentHp: maxHp,
      maxHp,
      ca: pnj.ca ?? null,
    });
  };

  const endCombat = () => {
    if (!active) return;
    persistCombat({ status: 'FINISHED' });
    setActive(null);
    reloadList();
  };

  // ─── Vue combat actif ─────────────────────────────────────────────────────
  if (active) {
    const sorted = sortCombatants(active.combatants);
    const activeIdx = sorted.length > 0 ? active.activeTurnIndex % sorted.length : 0;

    return (
      <div className="combat-active">
        <div className="combat-active-header">
          <button className="ghost" onClick={() => { setActive(null); reloadList(); }}>← Retour</button>
          <h3 className="combat-active-title">{active.name}</h3>
          <span className="combat-round glass">Round {active.round}</span>
          <button className="primary glass" onClick={nextTurn} disabled={sorted.length === 0}>
            Tour suivant →
          </button>
          <button className="ghost combat-end" onClick={endCombat}>Terminer le combat</button>
        </div>

        <div className="combat-rows">
          {sorted.map((c, i) => (
            <div
              key={c.id}
              className={`combat-row glass ${c.playerCharacterId ? 'combat-row--pj' : 'combat-row--pnj'} ${i === activeIdx ? 'combat-row--active' : ''} ${c.currentHp <= 0 ? 'combat-row--down' : ''}`}
            >
              <span className="combat-init glass">{c.initiativeRoll}</span>
              <div className="combat-row-main">
                <div className="combat-row-top">
                  {c.personId ? (
                    <button className="combat-name combat-name--link" onClick={() => inspectPerson(c.personId!)} title="Voir la fiche (stats, attaques, sauvegardes)">
                      {c.name}
                    </button>
                  ) : (
                    <strong className="combat-name">{c.name}</strong>
                  )}
                  {c.ca != null && <span className="combat-ca">CA {c.ca}</span>}
                  <button className="ghost combat-remove" onClick={() => removeCombatant(c.id)} title="Retirer">×</button>
                </div>
                <div className="combat-hp-controls">
                  <button className="ghost" onClick={() => setHp(c, c.currentHp - 5)}>−5</button>
                  <button className="ghost" onClick={() => setHp(c, c.currentHp - 1)}>−1</button>
                  <span className={`combat-hp ${c.currentHp <= c.maxHp / 4 ? 'combat-hp--low' : ''}`}>
                    {c.currentHp} / {c.maxHp} PV
                  </span>
                  <button className="ghost" onClick={() => setHp(c, c.currentHp + 1)}>+1</button>
                  <button className="ghost" onClick={() => setHp(c, c.currentHp + 5)}>+5</button>
                </div>
                <div className="combat-conditions">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond}
                      className={`combat-chip ${c.conditions.includes(cond) ? 'combat-chip--on' : ''}`}
                      onClick={() => toggleCondition(c, cond)}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {sorted.length === 0 && <div className="gm-hint">Aucun combattant — ajoute des participants ci-dessous.</div>}
        </div>

        {!showAdd ? (
          <button className="primary glass combat-add-btn" onClick={() => setShowAdd(true)}>
            + Ajouter un combattant
          </button>
        ) : (
          <div className="combat-add-panel glass">
            <div className="combat-add-tabs">
              <button className={addMode === 'pj' ? 'primary glass' : 'ghost'} onClick={() => setAddMode('pj')}>PJ</button>
              <button className={addMode === 'pnj' ? 'primary glass' : 'ghost'} onClick={() => setAddMode('pnj')}>PNJ</button>
              <button className={addMode === 'adhoc' ? 'primary glass' : 'ghost'} onClick={() => setAddMode('adhoc')}>Ad hoc</button>
              <button className="ghost combat-add-close" onClick={() => setShowAdd(false)}>×</button>
            </div>

            {addMode !== 'adhoc' && (
              <>
                <input
                  className="detail-input"
                  placeholder="Rechercher…"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                />
                <div className="combat-picker">
                  {(addMode === 'pj' ? pjs : pnjs)
                    .filter((p) => p.name.toLowerCase().includes(pickerSearch.toLowerCase()))
                    .slice(0, 30)
                    .map((p) => (
                      <button
                        key={p.id}
                        className="combat-picker-item"
                        onClick={() => (addMode === 'pj' ? addFromPj(p as PlayerCharacter) : addFromPnj(p as Person))}
                      >
                        <span>{p.name}</span>
                        <span className="combat-picker-stats">
                          {p.pv != null && `${p.pv} PV`}
                          {p.ca != null && ` · CA ${p.ca}`}
                          {addMode === 'pnj' && (p as Person).fp && ` · FP ${(p as Person).fp}`}
                        </span>
                      </button>
                    ))}
                </div>
                <div className="gm-hint">Initiative auto : d20 + mod. DEX (modifiable ensuite via retrait/réajout).</div>
              </>
            )}

            {addMode === 'adhoc' && (
              <div className="combat-adhoc-form">
                <input
                  className="detail-input"
                  placeholder="Nom (ex. Gobelin 1)"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <div className="combat-adhoc-row">
                  <label>PV max
                    <input className="detail-input" type="number" min={1} value={form.maxHp}
                      onChange={(e) => setForm((f) => ({ ...f, maxHp: Number(e.target.value), currentHp: Number(e.target.value) }))} />
                  </label>
                  <label>CA
                    <input className="detail-input" type="number" value={form.ca}
                      onChange={(e) => setForm((f) => ({ ...f, ca: e.target.value }))} />
                  </label>
                  <label>Initiative
                    <input className="detail-input" type="number" value={form.initiativeRoll}
                      onChange={(e) => setForm((f) => ({ ...f, initiativeRoll: Number(e.target.value) }))} />
                  </label>
                </div>
                <button
                  className="primary glass"
                  disabled={!form.name.trim() || form.maxHp < 1}
                  onClick={() =>
                    submitAdd({
                      name: form.name.trim(),
                      initiativeRoll: form.initiativeRoll,
                      currentHp: form.maxHp,
                      maxHp: form.maxHp,
                      ca: form.ca === '' ? null : Number(form.ca),
                    })
                  }
                >
                  Ajouter
                </button>
              </div>
            )}
          </div>
        )}

        <PersonInspectModal inspect={inspect} onClose={closeInspect} />
      </div>
    );
  }

  // ─── Vue liste des combats ────────────────────────────────────────────────
  return (
    <div className="combat-list">
      <div className="combat-create glass">
        <input
          className="detail-input"
          placeholder="Nom du combat (ex. Embuscade au pont)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button className="primary glass" onClick={handleCreate} disabled={!newName.trim()}>
          Nouveau combat
        </button>
      </div>

      {loading && <div className="gm-hint">Chargement…</div>}
      {!loading && combats.length === 0 && <div className="gm-hint">Aucun combat enregistré.</div>}

      {combats.map((c) => (
        <div key={c.id} className="combat-card glass">
          <div className="combat-card-info">
            <strong>{c.name}</strong>
            <span className="combat-card-meta">
              Round {c.round} · {c._count.combatants} combattant(s)
              {c.status === 'FINISHED' && ' · Terminé'}
            </span>
          </div>
          <div className="combat-card-actions">
            <button className="primary glass" onClick={() => openCombat(c.id)}>
              {c.status === 'FINISHED' ? 'Consulter' : 'Reprendre'}
            </button>
            <button className="ghost" onClick={() => setConfirmDelete(c.id)}>Supprimer</button>
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Supprimer le combat"
        message="Cette action est définitive."
        onCancel={() => setConfirmDelete(null)}
        onConfirm={async () => {
          if (!confirmDelete) return;
          try {
            await deleteCombat(token, confirmDelete);
            reloadList();
          } catch (e) {
            push(e instanceof Error ? e.message : 'Erreur', 'error');
          } finally {
            setConfirmDelete(null);
          }
        }}
      />
    </div>
  );
}
