import { useEffect, useState } from 'react';
import { listLores, type LoreDetail } from '../../api/entities';
import type { LoreEditState } from './loreTypes';

type LoreViewProps = {
  data: LoreDetail | null;
  editMode: boolean;
  editState: LoreEditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
};

function normalizeTags(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

/** Formulaire / lecture d’une Lore dans la modale détail. */
export function LoreView({ data, editMode, editState, onChange, valueOrDash }: LoreViewProps) {
  const [tagDraft, setTagDraft] = useState('');
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const selectedTags = normalizeTags(editState.tags ?? []);
  const viewTags = normalizeTags(data?.tags ?? []);

  const commitTagsInput = (rawValue: string) => {
    const parsed = normalizeTags(rawValue.split(','));
    if (parsed.length === 0) return;
    onChange('tags', normalizeTags([...selectedTags, ...parsed]));
    setTagDraft('');
  };

  useEffect(() => {
    if (!editMode) setTagDraft('');
  }, [editMode]);

  useEffect(() => {
    let cancelled = false;
    listLores()
      .then((lores) => {
        if (cancelled) return;
        const tags = Array.from(
          new Set(lores.flatMap((lore) => (lore.tags ?? []).map((tag) => tag.trim())).filter(Boolean)),
        ).sort((a, b) => a.localeCompare(b));
        setExistingTags(tags);
      })
      .catch(() => {
        if (!cancelled) setExistingTags([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="detail-item">
        <span className="detail-label">Titre</span>
        {editMode ? (
          <input
            className="detail-input"
            value={editState.title ?? ''}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Titre de la lore"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.title)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Tags</span>
        {editMode ? (
          <div className="lore-tags-editor">
            <div className="tags lore-tags-list">
              {selectedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="tag lore-tag-chip"
                  onClick={() => onChange('tags', selectedTags.filter((value) => value !== tag))}
                  title={`Retirer le tag ${tag}`}
                >
                  {tag} <span aria-hidden="true">×</span>
                </button>
              ))}
            </div>
            <input
              className="detail-input lore-tag-input"
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  commitTagsInput(tagDraft);
                } else if (e.key === 'Backspace' && !tagDraft && selectedTags.length > 0) {
                  onChange('tags', selectedTags.slice(0, -1));
                }
              }}
              onBlur={() => commitTagsInput(tagDraft)}
              placeholder="Ajouter un tag (Entree ou virgule)"
            />
            <span className="detail-hint lore-tags-help">
              0 a N tags. Tu peux creer un nouveau tag en le saisissant.
            </span>
            {existingTags.length > 0 && (
              <div className="lore-tag-suggestions">
                <span className="detail-hint lore-tags-help">Tags existants (cliquer pour ajouter/retirer)</span>
                <div className="tags lore-tags-suggestions-list">
                  {existingTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`tag lore-tag-chip lore-tag-suggestion ${isSelected ? 'active' : ''}`}
                        onClick={() =>
                          onChange(
                            'tags',
                            isSelected ? selectedTags.filter((value) => value !== tag) : normalizeTags([...selectedTags, tag]),
                          )
                        }
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : viewTags.length > 0 ? (
          <div className="tags">
            {viewTags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <span className="detail-value">-</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Date (en jeu)</span>
        {editMode ? (
          <input
            className="detail-input"
            type="number"
            value={editState.dateInGame ?? ''}
            onChange={(e) => onChange('dateInGame', e.target.value === '' ? null : Number(e.target.value))}
            placeholder="ex: 859, -120, 1330"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.dateInGame)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Résumé</span>
        {editMode ? (
          <input
            className="detail-input"
            value={editState.summary ?? ''}
            onChange={(e) => onChange('summary', e.target.value || null)}
            placeholder="Résumé court (optionnel)"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.summary)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Contenu</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={editState.content ?? ''}
            onChange={(e) => onChange('content', e.target.value)}
            placeholder="Contenu de la lore"
            rows={12}
          />
        ) : (
          <p className="detail-desc" style={{ whiteSpace: 'pre-wrap' }}>
            {valueOrDash(data?.content)}
          </p>
        )}
      </div>
      {!editMode && data && (data.kingdoms?.length || data.cities?.length || data.places?.length || data.persons?.length || data.organisations?.length) ? (
        <div className="detail-section">
          <h3 className="section-title">Entités liées</h3>
          <ul className="detail-list">
            {data.kingdoms?.map((k) => (
              <li key={k.id}>{k.name} (royaume)</li>
            ))}
            {data.cities?.map((c) => (
              <li key={c.id}>{c.name} (ville)</li>
            ))}
            {data.places?.map((p) => (
              <li key={p.id}>{p.name} (lieu)</li>
            ))}
            {data.persons?.map((p) => (
              <li key={p.id}>{p.name} (personnage)</li>
            ))}
            {data.organisations?.map((o) => (
              <li key={o.id}>{o.name} (organisation)</li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
