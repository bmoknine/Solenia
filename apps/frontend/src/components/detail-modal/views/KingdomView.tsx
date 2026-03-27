import type { NavigablePoint } from '../../../api/map';
import type { KingdomDetail } from '../../../api/entities';
import { formatSoleniaDate, toDateInputValue } from '../../../utils/solenia-date';
import { LoreSection } from '../LoreSection';
import { CommentsSection } from '../CommentsSection';
import { FlagSelect } from '../FlagSelect';
import type { EditState } from '../detailModalTypes';
import { createMapPointFromRef, organisationRefToNavPoint } from '../createMapPointFromRef';

export function KingdomView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
  onOpenLore,
}: {
  data: KingdomDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: NavigablePoint) => void;
  onOpenLore?: (loreId: string) => void;
}) {
  return (
    <>
      {editMode && (
        <div className="detail-item">
          <span className="detail-label">Nom</span>
          <input
            className="detail-input"
            value={(editState as Partial<KingdomDetail> & { kind: 'kingdom' })?.name ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nom du royaume"
          />
        </div>
      )}
      <div className="detail-item">
        <span className="detail-label">Description</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={(editState as Partial<KingdomDetail> & { kind: 'kingdom' })?.description ?? ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Description du royaume"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.description)}</p>
        )}
      </div>
      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Population</span>
          {editMode ? (
            <input
              className="detail-input"
              type="number"
              value={((editState as KingdomDetail | null)?.population as number | undefined | null) ?? ''}
              onChange={(e) => onChange('population', e.target.value === '' ? null : Number(e.target.value))}
            />
          ) : (
            <span className="detail-value">
              {data?.population != null ? data.population.toLocaleString() : valueOrDash(data?.population)}
            </span>
          )}
        </div>
        <div className="detail-item">
          <span className="detail-label">Couleur (icônes villes)</span>
          {editMode ? (
            <div className="detail-input-group">
              <input
                className="detail-input"
                type="color"
                value={((editState as KingdomDetail | null)?.color as string) || '#1a73e8'}
                onChange={(e) => onChange('color', e.target.value)}
                style={{ width: 48, height: 32, padding: 2, cursor: 'pointer' }}
              />
              <input
                className="detail-input"
                type="text"
                value={((editState as KingdomDetail | null)?.color as string) ?? ''}
                onChange={(e) => onChange('color', e.target.value || null)}
                placeholder="#1a73e8"
                style={{ flex: 1, marginLeft: 8 }}
              />
            </div>
          ) : (
            <span className="detail-value">
              {data?.color ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 20,
                      height: 20,
                      backgroundColor: data.color,
                      borderRadius: 4,
                      border: '1px solid #ccc',
                    }}
                  />
                  {data.color}
                </span>
              ) : (
                valueOrDash(data?.color)
              )}
            </span>
          )}
        </div>
        {editMode && (
          <div className="detail-item">
            <span className="detail-label">Drapeau</span>
            <FlagSelect
              editMode={editMode}
              value={(editState as KingdomDetail | null)?.flag ?? data?.flag}
              onChange={(v) => onChange('flag', v)}
            />
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">Date (en jeu)</span>
          {editMode ? (
            <input
              className="detail-input"
              type="date"
              value={toDateInputValue((editState as KingdomDetail | null)?.dateInGame ?? data?.dateInGame)}
              onChange={(e) => onChange('dateInGame', e.target.value || null)}
            />
          ) : (
            <span className="detail-value">
              {data?.dateInGame ? formatSoleniaDate(data.dateInGame) : valueOrDash(data?.dateInGame)}
            </span>
          )}
        </div>
      </div>
      {data?.organisations && data.organisations.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Organisations :</h3>
          <ul className="detail-list">
            {data?.organisations.map((org) => (
              <li
                key={org.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => {
                  if (onNavigate) onNavigate(organisationRefToNavPoint(org));
                }}
              >
                {org.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data?.cities && data.cities.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Villes :</h3>
          <ul className="detail-list">
            {data.cities.map((c) => (
              <li
                key={c.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(c, 'city'))}
              >
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data?.places && data.places.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Lieux :</h3>
          <ul className="detail-list">
            {data?.places.map((p) => (
              <li
                key={p.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(p, 'place'))}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data?.persons && data.persons.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Personnages :</h3>
          <ul className="detail-list">
            {data?.persons.map((p) => (
              <li
                key={p.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(p, 'person'))}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <LoreSection lores={data?.lores} onOpenLore={onOpenLore} />
      <CommentsSection comments={data?.comments} />
    </>
  );
}
