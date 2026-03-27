import { useEffect, useState } from 'react';
import type { NavigablePoint } from '../../../api/map';
import { listKingdoms, type CityDetail, type Kingdom } from '../../../api/entities';
import { LoreSection } from '../LoreSection';
import { CommentsSection } from '../CommentsSection';
import { FlagSelect } from '../FlagSelect';
import { SearchableSelect } from '../SearchableSelect';
import type { EditState } from '../detailModalTypes';
import { createMapPointFromRef, organisationRefToNavPoint } from '../createMapPointFromRef';

export function CityView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
  onCreateDistrict,
  cityId,
  onOpenLore,
}: {
  data: CityDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: NavigablePoint) => void;
  onCreateDistrict?: (cityId: string) => void;
  cityId?: string;
  onOpenLore?: (loreId: string) => void;
}) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  useEffect(() => {
    if (editMode) {
      const loadLists = async () => {
        setLoadingLists(true);
        try {
          const kingdomsData = await listKingdoms();
          setKingdoms(kingdomsData);
        } catch {
          setKingdoms([]);
        } finally {
          setLoadingLists(false);
        }
      };
      void loadLists();
    }
  }, [editMode]);

  return (
    <>
      {editMode && (
        <div className="detail-item">
          <span className="detail-label">Nom</span>
          <input
            className="detail-input"
            value={(editState as Partial<CityDetail> & { kind: 'city' })?.name ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nom de la ville"
          />
        </div>
      )}
      <div className="detail-item">
        <span className="detail-label">Description</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={(editState as Partial<CityDetail> & { kind: 'city' })?.description ?? ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Description de la ville"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.description)}</p>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Icône</span>
        {editMode ? (
          <select
            className="detail-input"
            value={((editState as CityDetail | null)?.iconUrl as string | undefined | null) ?? ''}
            onChange={(e) => onChange('iconUrl', e.target.value === '' ? null : e.target.value)}
          >
            <option value="">Aucune icône</option>
            <option value="/Icon/capital.png">Capital</option>
            <option value="/Icon/city.png">Cité</option>
            <option value="/Icon/village.png">Village</option>
            <option value="/Icon/fortified-city.png">Ville Fortifiée</option>
          </select>
        ) : (
          <span className="detail-value">
            {data?.iconUrl ? (
              <img src={data?.iconUrl} alt="Icône" style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginLeft: '8px' }} />
            ) : (
              valueOrDash(data?.iconUrl)
            )}
          </span>
        )}
      </div>
      {editMode && (
        <div className="detail-item">
          <span className="detail-label">Drapeau</span>
          <FlagSelect
            editMode={editMode}
            value={(editState as CityDetail | null)?.flag ?? data?.flag}
            onChange={(v) => onChange('flag', v)}
          />
        </div>
      )}
      <div className="detail-item">
        <span className="detail-label">Royaume</span>
        {editMode ? (
          loadingLists ? (
            <span className="detail-value">Chargement...</span>
          ) : (
            <SearchableSelect
              items={kingdoms}
              selectedId={
                (editState as CityDetail)?.kingdomId !== undefined ? (editState as CityDetail).kingdomId : data?.kingdom?.id
              }
              onSelect={(id) => onChange('kingdomId', id)}
              placeholder="Sélectionner un royaume"
            />
          )
        ) : data?.kingdom ? (
          <span
            className="detail-value"
            style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
            onClick={() => {
              if (onNavigate && data?.kingdom) {
                onNavigate(createMapPointFromRef(data.kingdom, 'kingdom'));
              }
            }}
          >
            {valueOrDash(data.kingdom?.name)}
          </span>
        ) : (
          <span className="detail-value">{valueOrDash((data?.kingdom as { name: string } | null | undefined)?.name)}</span>
        )}
      </div>
      {!editMode && onCreateDistrict && cityId && (
        <div className="detail-section">
          <button className="ghost" onClick={() => onCreateDistrict(cityId)} style={{ width: '100%', marginTop: '10px' }}>
            + Créer un quartier
          </button>
        </div>
      )}
      {data?.districts && data.districts.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Quartiers :</h3>
          <ul className="detail-list">
            {data?.districts.map((d) => (
              <li
                key={d.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(d, 'district'))}
              >
                {d.name}
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
      <LoreSection lores={data?.lores} onOpenLore={onOpenLore} />
      <CommentsSection comments={data?.comments} />
    </>
  );
}
