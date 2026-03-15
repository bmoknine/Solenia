import { useEffect, useState } from 'react';
import { listLores, type Lore } from '../api/entities';
import './LoreModal.css';

type LoreModalProps = {
  open: boolean;
  onClose: () => void;
  onSelectLore: (loreId: string) => void;
  onCreateNew: () => void;
};

export function LoreModal({ open, onClose, onSelectLore, onCreateNew }: LoreModalProps) {
  const [lores, setLores] = useState<Lore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoading(true);
    listLores()
      .then(setLores)
      .catch((err) => setError(err instanceof Error ? err.message : 'Chargement échoué'))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <div className="lore-modal-overlay" onClick={onClose}>
      <div className="lore-modal glass" onClick={(e) => e.stopPropagation()}>
        <div className="lore-modal-header">
          <h2 className="lore-modal-title">Lore</h2>
          <button type="button" className="detail-close ghost" onClick={onClose}>×</button>
        </div>
        <div className="lore-modal-actions">
          <button type="button" className="primary glass" onClick={onCreateNew}>
            Créer une Lore
          </button>
        </div>
        {loading && <div className="detail-loading">Chargement…</div>}
        {error && <div className="detail-error">{error}</div>}
        {!loading && !error && (
          <div className="lore-modal-list">
            {lores.length === 0 ? (
              <p className="lore-modal-empty">Aucune lore. Cliquez sur « Créer une Lore » pour en ajouter.</p>
            ) : (
              <ul className="lore-list">
                {lores.map((lore) => (
                  <li
                    key={lore.id}
                    className="lore-list-item glass"
                    onClick={() => onSelectLore(lore.id)}
                  >
                    <span className="lore-list-item-title">{lore.title}</span>
                    <span className="lore-list-item-meta">
                      {[lore.tag, lore.dateInGame != null ? `Date: ${lore.dateInGame}` : '', lore.summary].filter(Boolean).join(' · ')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
