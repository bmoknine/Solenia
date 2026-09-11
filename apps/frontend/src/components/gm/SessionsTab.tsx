import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  listCampaigns,
  listGameSessions,
  createGameSession,
  updateGameSession,
  deleteGameSession,
  type Campaign,
  type GameSession,
} from '../../api/gm';
import { ConfirmDialog } from '../ConfirmDialog';
import { useToast } from '../../toast/ToastProvider';

const UNCLASSIFIED = '__none__';

type Props = { token: string | null };

export function SessionsTab({ token }: Props) {
  const { push } = useToast();
  const err = useCallback(
    (e: unknown, fallback = 'Erreur') => push(e instanceof Error ? e.message : fallback, 'error'),
    [push],
  );

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selected, setSelected] = useState<string>(UNCLASSIFIED);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [sessionForm, setSessionForm] = useState({ date: '', title: '', summary: '' });
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [confirmDeleteSession, setConfirmDeleteSession] = useState<string | null>(null);

  const reload = useCallback(() => {
    listCampaigns(token).then(setCampaigns).catch(err);
    listGameSessions(token).then(setSessions).catch(err);
  }, [token, err]);

  useEffect(() => {
    reload();
  }, [reload]);

  const hasUnclassified = useMemo(() => sessions.some((s) => !s.campaignId), [sessions]);

  useEffect(() => {
    if (selected === UNCLASSIFIED && campaigns.length && !hasUnclassified) {
      setSelected(campaigns[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaigns, hasUnclassified]);

  const visibleSessions = useMemo(
    () => sessions.filter((s) => (selected === UNCLASSIFIED ? !s.campaignId : s.campaignId === selected)),
    [sessions, selected],
  );
  const sessionCountFor = (id: string) => sessions.filter((s) => s.campaignId === id).length;
  const selectedCampaign = campaigns.find((c) => c.id === selected) ?? null;

  const handleCreateSession = async () => {
    if (!sessionForm.date) return;
    try {
      const session = await createGameSession(token, {
        date: new Date(sessionForm.date).toISOString(),
        title: sessionForm.title.trim() || null,
        summary: sessionForm.summary.trim() || null,
        campaignId: selected === UNCLASSIFIED ? null : selected,
      });
      setSessions((prev) => [session, ...prev]);
      setSessionForm({ date: '', title: '', summary: '' });
    } catch (e) {
      err(e);
    }
  };

  const patchSession = async (id: string, patch: Partial<Pick<GameSession, 'date' | 'title' | 'summary' | 'campaignId'>>) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    try {
      await updateGameSession(token, id, patch);
    } catch (e) {
      err(e, 'Erreur de sauvegarde');
    }
  };

  return (
    <div className="campaign-tab">
      <section className="campaign-section">
        <h3 className="campaign-section-title">Journal de sessions</h3>

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
              <span className="campaign-pill-count">{sessionCountFor(c.id)}</span>
            </button>
          ))}
          {hasUnclassified && (
            <button
              className={`campaign-pill campaign-pill--none ${selected === UNCLASSIFIED ? 'campaign-pill--on' : ''}`}
              onClick={() => setSelected(UNCLASSIFIED)}
            >
              Non classé
              <span className="campaign-pill-count">{sessions.filter((s) => !s.campaignId).length}</span>
            </button>
          )}
        </div>
      </section>

      <section className="campaign-section">
        <h3 className="campaign-section-title">
          Sessions {selectedCampaign ? `· ${selectedCampaign.name}` : selected === UNCLASSIFIED ? '· Non classé' : ''}
        </h3>

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
            <button className="primary glass" onClick={handleCreateSession} disabled={!sessionForm.date}>
              Ajouter
            </button>
          </div>
          <textarea
            className="detail-input"
            rows={2}
            placeholder="Résumé de la session…"
            value={sessionForm.summary}
            onChange={(e) => setSessionForm((f) => ({ ...f, summary: e.target.value }))}
          />
        </div>

        <div className="session-list">
          {visibleSessions.map((s) => (
            <div key={s.id} className="session-card glass">
              <div className="session-card-header">
                <span className="session-date glass">
                  {new Date(s.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <strong className="session-title">{s.title || 'Session'}</strong>
                <button className="ghost session-action" onClick={() => setEditingSession(editingSession === s.id ? null : s.id)}>
                  {editingSession === s.id ? 'Fermer' : 'Modifier'}
                </button>
                <button className="ghost session-action" onClick={() => setConfirmDeleteSession(s.id)}>×</button>
              </div>
              {editingSession === s.id ? (
                <div className="session-edit">
                  <input
                    className="detail-input"
                    defaultValue={s.title ?? ''}
                    placeholder="Titre"
                    onBlur={(e) => patchSession(s.id, { title: e.target.value || null })}
                  />
                  <label className="quest-field">
                    <span className="quest-field-label">Campagne</span>
                    <select
                      className="detail-input"
                      value={s.campaignId ?? UNCLASSIFIED}
                      onChange={(e) => patchSession(s.id, { campaignId: e.target.value === UNCLASSIFIED ? null : e.target.value })}
                    >
                      {campaigns.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                      <option value={UNCLASSIFIED}>Non classé</option>
                    </select>
                  </label>
                  <textarea
                    className="detail-input"
                    rows={5}
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
          {visibleSessions.length === 0 && <div className="gm-hint">Aucune session pour cette campagne.</div>}
        </div>
      </section>

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
            err(e);
          } finally {
            setConfirmDeleteSession(null);
          }
        }}
      />
    </div>
  );
}
