import { useEffect, useRef, useState } from 'react';
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
  const [tagFilters, setTagFilters] = useState<string[]>(['__all__']);
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoading(true);
    setTagFilters(['__all__']);
    setViewMode('timeline');
    setIsFilterMenuOpen(false);
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

  const getLoreTags = (lore: Lore) =>
    Array.from(new Set((lore.tags ?? []).map((t) => t.trim()).filter(Boolean)));

  const tags = Array.from(new Set(lores.flatMap((l) => getLoreTags(l)))).sort((a, b) => a.localeCompare(b));

  const filtered = (() => {
    if (tagFilters.length === 0 || tagFilters.includes('__all__')) return sorted;
    const selected = new Set(tagFilters);
    return sorted.filter((lore) => {
      const loreTags = getLoreTags(lore);
      const matchesNoTag = selected.has('__no_tag__') && loreTags.length === 0;
      const matchesTag = loreTags.some((tag) => selected.has(tag));
      return matchesNoTag || matchesTag;
    });
  })();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!filterMenuRef.current) return;
      if (!filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleFilterValue = (value: string) => {
    if (value === '__all__') {
      setTagFilters(['__all__']);
      return;
    }
    setTagFilters((prev) => {
      const base = prev.filter((v) => v !== '__all__');
      const hasValue = base.includes(value);
      const next = hasValue ? base.filter((v) => v !== value) : [...base, value];
      return next.length === 0 ? ['__all__'] : next;
    });
  };

  const filterLabel = (() => {
    if (tagFilters.includes('__all__')) return 'Tous';
    if (tagFilters.length <= 2) return tagFilters.join(', ');
    return `${tagFilters.length} filtres`;
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
            <div className="lore-filter-menu" ref={filterMenuRef}>
              <button
                type="button"
                className="detail-input lore-filter-menu-trigger"
                onClick={() => setIsFilterMenuOpen((prev) => !prev)}
                aria-expanded={isFilterMenuOpen}
              >
                <span className="lore-filter-menu-label">{filterLabel}</span>
                <span aria-hidden="true">▾</span>
              </button>
              {isFilterMenuOpen && (
                <div className="lore-filter-menu-panel glass">
                  <label className="lore-filter-option">
                    <input
                      type="checkbox"
                      checked={tagFilters.includes('__all__')}
                      onChange={() => toggleFilterValue('__all__')}
                    />
                    <span>Tous</span>
                  </label>
                  <label className="lore-filter-option">
                    <input
                      type="checkbox"
                      checked={tagFilters.includes('__no_tag__')}
                      onChange={() => toggleFilterValue('__no_tag__')}
                    />
                    <span>Sans tag</span>
                  </label>
                  {tags.map((t) => (
                    <label key={t} className="lore-filter-option">
                      <input
                        type="checkbox"
                        checked={tagFilters.includes(t)}
                        onChange={() => toggleFilterValue(t)}
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </label>
          <div className="lore-modal-view-toggle">
            <button
              type="button"
              className={`lore-modal-view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              Frise
            </button>
            <button
              type="button"
              className={`lore-modal-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              Liste
            </button>
          </div>
        </div>
        {loading && <div className="detail-loading">Chargement…</div>}
        {error && <div className="detail-error">{error}</div>}
        {!loading && !error && (
          <div className="lore-modal-list">
            {filtered.length === 0 ? (
              <p className="lore-modal-empty">
                {lores.length === 0
                  ? 'Aucune lore. Cliquez sur « Créer une Lore » pour en ajouter.'
                  : 'Aucune lore pour ces filtres.'}
              </p>
            ) : viewMode === 'list' ? (
              <ul className="lore-list">
                {filtered.map((lore) => (
                  <li
                    key={lore.id}
                    className="lore-list-item glass"
                    onClick={() => onSelectLore(lore.id)}
                  >
                    <span className="lore-list-item-title">{lore.title}</span>
                    <span className="lore-list-item-meta">
                      {[getLoreTags(lore).join(', '), lore.dateInGame != null ? `Date: ${lore.dateInGame}` : '', lore.summary].filter(Boolean).join(' · ')}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="lore-timeline-wrap">
                <p className="lore-timeline-hint">Frise chronologique (ordre par date en jeu)</p>
                <div className="lore-timeline" role="list">
                  {filtered.map((lore, idx) => {
                    const side: 'left' | 'right' = idx % 2 === 0 ? 'left' : 'right';
                    const dateLabel = lore.dateInGame != null ? `An ${lore.dateInGame}` : 'Sans date';
                    return (
                      <div
                        key={lore.id}
                        className={`lore-timeline-item ${side}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelectLore(lore.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') onSelectLore(lore.id);
                        }}
                      >
                        <div className="lore-timeline-date">{dateLabel}</div>
                        <div className="lore-timeline-dot" />
                        <div className="lore-timeline-card glass">
                          <div className="lore-timeline-card-title">{lore.title}</div>
                          <div className="lore-timeline-card-meta">
                            {[getLoreTags(lore).join(', '), lore.summary].filter(Boolean).join(' · ')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
