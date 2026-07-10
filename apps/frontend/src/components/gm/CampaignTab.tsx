import { useCallback, useEffect, useState } from 'react';
import {
  listQuests,
  createQuest,
  updateQuest,
  deleteQuest,
  listGameSessions,
  createGameSession,
  updateGameSession,
  deleteGameSession,
  type Quest,
  type QuestStatus,
  type GameSession,
} from '../../api/gm';
import { ConfirmDialog } from '../ConfirmDialog';
import { useToast } from '../../toast/ToastProvider';

const QUEST_STATUSES: { value: QuestStatus; label: string }[] = [
  { value: 'A_FAIRE', label: 'À faire' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'TERMINEE', label: 'Terminée' },
  { value: 'ECHOUEE', label: 'Échouée' },
];

type Props = { token: string | null };

export function CampaignTab({ token }: Props) {
  const { push } = useToast();

  // Quêtes
  const [quests, setQuests] = useState<Quest[]>([]);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);
  const [confirmDeleteQuest, setConfirmDeleteQuest] = useState<string | null>(null);

  // Sessions
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [sessionForm, setSessionForm] = useState({ date: '', title: '', summary: '' });
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [confirmDeleteSession, setConfirmDeleteSession] = useState<string | null>(null);

  const reload = useCallback(() => {
    listQuests(token).then(setQuests).catch((e) => push(e instanceof Error ? e.message : 'Erreur', 'error'));
    listGameSessions(token).then(setSessions).catch((e) => push(e instanceof Error ? e.message : 'Erreur', 'error'));
  }, [token, push]);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleCreateQuest = async () => {
    const title = newQuestTitle.trim();
    if (!title) return;
    try {
      const quest = await createQuest(token, { title });
      setQuests((prev) => [...prev, quest]);
      setNewQuestTitle('');
    } catch (e) {
      push(e instanceof Error ? e.message : 'Erreur', 'error');
    }
  };

  const patchQuest = async (id: string, patch: Partial<{ title: string; description: string | null; status: QuestStatus; notes: string | null }>) => {
    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
    try {
      await updateQuest(token, id, patch);
    } catch (e) {
      push(e instanceof Error ? e.message : 'Erreur de sauvegarde', 'error');
    }
  };

  const handleCreateSession = async () => {
    if (!sessionForm.date) return;
    try {
      const session = await createGameSession(token, {
        date: new Date(sessionForm.date).toISOString(),
        title: sessionForm.title.trim() || null,
        summary: sessionForm.summary.trim() || null,
      });
      setSessions((prev) => [session, ...prev]);
      setSessionForm({ date: '', title: '', summary: '' });
    } catch (e) {
      push(e instanceof Error ? e.message : 'Erreur', 'error');
    }
  };

  const patchSession = async (id: string, patch: Partial<{ date: string; title: string | null; summary: string | null }>) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    try {
      await updateGameSession(token, id, patch);
    } catch (e) {
      push(e instanceof Error ? e.message : 'Erreur de sauvegarde', 'error');
    }
  };

  return (
    <div className="campaign-tab">
      {/* ─── Quêtes ─────────────────────────────────────────────── */}
      <section className="campaign-section">
        <h3 className="campaign-section-title">Quêtes</h3>

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

        <div className="quest-columns">
          {QUEST_STATUSES.map(({ value, label }) => {
            const group = quests.filter((q) => q.status === value);
            return (
              <div key={value} className={`quest-column quest-column--${value.toLowerCase()}`}>
                <h4 className="quest-column-title">{label} ({group.length})</h4>
                {group.map((q) => (
                  <div key={q.id} className="quest-card glass">
                    <button
                      className="quest-card-header"
                      onClick={() => setExpandedQuest(expandedQuest === q.id ? null : q.id)}
                    >
                      {q.title}
                    </button>
                    {expandedQuest === q.id && (
                      <div className="quest-card-body">
                        <label className="quest-field">Statut
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
                        <label className="quest-field">Description
                          <textarea
                            className="detail-input"
                            rows={2}
                            defaultValue={q.description ?? ''}
                            onBlur={(e) => patchQuest(q.id, { description: e.target.value || null })}
                          />
                        </label>
                        <label className="quest-field">Notes
                          <textarea
                            className="detail-input"
                            rows={3}
                            defaultValue={q.notes ?? ''}
                            onBlur={(e) => patchQuest(q.id, { notes: e.target.value || null })}
                          />
                        </label>
                        <button className="ghost quest-delete" onClick={() => setConfirmDeleteQuest(q.id)}>
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {group.length === 0 && <div className="gm-hint">—</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Journal de sessions ────────────────────────────────── */}
      <section className="campaign-section">
        <h3 className="campaign-section-title">Journal de sessions</h3>

        <div className="session-create glass">
          <div className="session-create-row">
            <input
              className="detail-input"
              type="date"
              value={sessionForm.date}
              onChange={(e) => setSessionForm((f) => ({ ...f, date: e.target.value }))}
            />
            <input
              className="detail-input"
              placeholder="Titre (ex. Session 12)"
              value={sessionForm.title}
              onChange={(e) => setSessionForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>
          <textarea
            className="detail-input"
            rows={3}
            placeholder="Résumé de la session…"
            value={sessionForm.summary}
            onChange={(e) => setSessionForm((f) => ({ ...f, summary: e.target.value }))}
          />
          <button className="primary glass" onClick={handleCreateSession} disabled={!sessionForm.date}>
            Ajouter la session
          </button>
        </div>

        <div className="session-list">
          {sessions.map((s) => (
            <div key={s.id} className="session-card glass">
              <div className="session-card-header">
                <strong>{s.title || 'Session'}</strong>
                <span className="session-date">
                  {new Date(s.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <button className="ghost" onClick={() => setEditingSession(editingSession === s.id ? null : s.id)}>
                  {editingSession === s.id ? 'Fermer' : 'Modifier'}
                </button>
                <button className="ghost" onClick={() => setConfirmDeleteSession(s.id)}>×</button>
              </div>
              {editingSession === s.id ? (
                <div className="session-edit">
                  <input
                    className="detail-input"
                    defaultValue={s.title ?? ''}
                    placeholder="Titre"
                    onBlur={(e) => patchSession(s.id, { title: e.target.value || null })}
                  />
                  <textarea
                    className="detail-input"
                    rows={4}
                    defaultValue={s.summary ?? ''}
                    placeholder="Résumé"
                    onBlur={(e) => patchSession(s.id, { summary: e.target.value || null })}
                  />
                </div>
              ) : (
                s.summary && <p className="session-summary">{s.summary}</p>
              )}
            </div>
          ))}
          {sessions.length === 0 && <div className="gm-hint">Aucune session enregistrée.</div>}
        </div>
      </section>

      <ConfirmDialog
        open={confirmDeleteQuest !== null}
        title="Supprimer la quête"
        message="Cette action est définitive."
        onCancel={() => setConfirmDeleteQuest(null)}
        onConfirm={async () => {
          if (!confirmDeleteQuest) return;
          try {
            await deleteQuest(token, confirmDeleteQuest);
            setQuests((prev) => prev.filter((q) => q.id !== confirmDeleteQuest));
          } catch (e) {
            push(e instanceof Error ? e.message : 'Erreur', 'error');
          } finally {
            setConfirmDeleteQuest(null);
          }
        }}
      />
      <ConfirmDialog
        open={confirmDeleteSession !== null}
        title="Supprimer la session"
        message="Cette action est définitive."
        onCancel={() => setConfirmDeleteSession(null)}
        onConfirm={async () => {
          if (!confirmDeleteSession) return;
          try {
            await deleteGameSession(token, confirmDeleteSession);
            setSessions((prev) => prev.filter((s) => s.id !== confirmDeleteSession));
          } catch (e) {
            push(e instanceof Error ? e.message : 'Erreur', 'error');
          } finally {
            setConfirmDeleteSession(null);
          }
        }}
      />
    </div>
  );
}
