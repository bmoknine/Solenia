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
  const [tagFilter, setTagFilter] = useState<string>('__all__');

  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoading(true);
    setTagFilter('__all__');
    listLores()
      .then(setLores)
      .catch((err) => setError(err instanceof Error ? err.message : 'Chargement échoué'))
      .finally(() => setLoading(false));
  }, [open]);

  const sorted = [...lores].sort((a, b) => {
    const da = a.dateInGame ?? Number.POSITIVE_INFINITY;
    const db = b.dateInGame ?? Number.POSITIVE_INFINITY;
    return da - db;
  });

  const tags = Array.from(
    new Set(lores.map((l) => (l.tag ?? '').trim()).filter((t) => t !== '')),
  ).sort((a, b) => a.localeCompare(b));

  const filtered = (() => {
    if (tagFilter === '__all__') return sorted;
    if (tagFilter === '__no_tag__') {
      return sorted.filter((l) => !(l.tag ?? '').trim());
    }
    return sorted.filter((l) => (l.tag ?? '').trim() === tagFilter);
  })();

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
        <div className="lore-modal-filter">
          <label className="lore-modal-filter-label">
            <span>Filtrer par tag</span>
            <select
              className="detail-input lore-modal-filter-select"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <option value="__all__">Tous</option>
              <option value="__no_tag__">Sans tag</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
        {loading && <div className="detail-loading">Chargement…</div>}
        {error && <div className="detail-error">{error}</div>}
        {!loading && !error && (
          <div className="lore-modal-list">
            {filtered.length === 0 ? (
              <p className="lore-modal-empty">
                {lores.length === 0
                  ? 'Aucune lore. Cliquez sur « Créer une Lore » pour en ajouter.'
                  : 'Aucune lore pour ce tag.'}
              </p>
            ) : (
              <ul className="lore-list">
                {filtered.map((lore) => (
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
