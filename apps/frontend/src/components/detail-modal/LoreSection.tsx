import { useState } from 'react';
import type { LoreRef } from '../../api/entities';

type LoreSectionProps = {
  lores?: LoreRef[];
  onOpenLore?: (loreId: string) => void;
};

function loreTags(lore: LoreRef) {
  return Array.from(new Set((lore.tags ?? []).map((t) => t.trim()).filter(Boolean)));
}

/** Liste des lore liées à une entité, avec filtre par tag. */
export function LoreSection({ lores, onOpenLore }: LoreSectionProps) {
  if (!lores || lores.length === 0) return null;
  const [tagFilter, setTagFilter] = useState<string>('__all__');

  const tags = Array.from(new Set(lores.flatMap((l) => loreTags(l)))).sort((a, b) => a.localeCompare(b));

  const sorted = [...lores].sort((a, b) => {
    const da = a.dateInGame ?? Number.POSITIVE_INFINITY;
    const db = b.dateInGame ?? Number.POSITIVE_INFINITY;
    return da - db;
  });

  const filtered = tagFilter === '__all__' ? sorted : sorted.filter((l) => loreTags(l).includes(tagFilter));

  return (
    <div className="detail-section lore-section">
      <div className="lore-filter-bar">
        <h3 className="section-title lore-filter-title">Lore :</h3>
        {tags.length > 0 && (
          <label className="lore-filter-label">
            <span className="lore-filter-label-text">Filtre tag</span>
            <select className="detail-input lore-tag-select" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
              <option value="__all__">Tous les tags</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <ul className="detail-list">
        {filtered.map((lore) => (
          <li
            key={lore.id}
            style={{ cursor: onOpenLore ? 'pointer' : 'default', textDecoration: onOpenLore ? 'underline' : 'none' }}
            onClick={() => onOpenLore?.(lore.id)}
          >
            <span style={{ fontWeight: 600 }}>{lore.title}</span>
            {loreTags(lore).length > 0 || lore.dateInGame != null ? (
              <span style={{ marginLeft: 8, color: '#94a3b8', fontSize: '0.9em' }}>
                {[loreTags(lore).join(', '), lore.dateInGame != null ? String(lore.dateInGame) : ''].filter(Boolean).join(' · ')}
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <div className="detail-error" style={{ marginTop: 12, padding: 0 }}>
          Aucun lore pour ce tag.
        </div>
      )}
    </div>
  );
}
