import { useEffect, useState } from 'react';
import { fetchStats, type Stats } from '../api/graph';
import './DashboardModal.css';

const statConfig: { key: keyof Stats; label: string; icon: string }[] = [
  { key: 'kingdoms',           label: 'Royaumes',           icon: '👑' },
  { key: 'cities',             label: 'Villes',             icon: '🏰' },
  { key: 'districts',          label: 'Quartiers',          icon: '🏘️' },
  { key: 'places',             label: 'Lieux',              icon: '📍' },
  { key: 'persons',            label: 'Personnages',        icon: '🧙' },
  { key: 'organisations',      label: 'Organisations',      icon: '⚔️' },
  { key: 'playerCharacters',   label: 'PJ',                 icon: '🎲' },
  { key: 'lores',              label: 'Entrées de lore',    icon: '📜' },
  { key: 'organisationMembers',label: 'Liens org↔PNJ',     icon: '🔗' },
  { key: 'comments',           label: 'Commentaires',       icon: '💬' },
];

/** Grille de statistiques embarquable (utilisée dans la page MJ). */
export function DashboardStats({ active }: { active: boolean }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    setError(null);
    fetchStats()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : 'Erreur'))
      .finally(() => setLoading(false));
  }, [active]);

  return (
    <>
      {loading && <div className="dashboard-loading">Chargement…</div>}
      {error && <div className="dashboard-error">{error}</div>}
      {stats && (
        <div className="dashboard-grid">
          {statConfig.map(({ key, label, icon }) => (
            <div key={key} className="dashboard-card glass">
              <span className="dashboard-card-icon">{icon}</span>
              <span className="dashboard-card-value">{stats[key]}</span>
              <span className="dashboard-card-label">{label}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
