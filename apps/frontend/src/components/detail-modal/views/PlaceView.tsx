import { useEffect, useState } from 'react';
import type { NavigablePoint } from '../../../api/map';
import type { City, District, Kingdom, Organisation, PlaceDetail, PlaceType } from '../../../api/entities';
import { listCities, listDistricts, listKingdoms, listOrganisations } from '../../../api/entities';
import { LoreSection } from '../LoreSection';
import { CommentsSection } from '../CommentsSection';
import { SearchableSelect } from '../SearchableSelect';
import { SearchableMultiSelect } from '../SearchableMultiSelect';
import type { EditState } from '../detailModalTypes';
import { createMapPointFromRef, organisationRefToNavPoint } from '../createMapPointFromRef';
import { PLACE_TYPE_OPTIONS } from '../entityOptions';
import { formatPlaceType } from '../entityFormatters';

export function PlaceView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
  onOpenLore,
}: {
  data: PlaceDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: NavigablePoint) => void;
  onOpenLore?: (loreId: string) => void;
}) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  const placeEdit = editState as PlaceDetail & { organisationIds?: string[] };
  const selectedCityId =
    placeEdit.cityId !== undefined && placeEdit.cityId !== null ? placeEdit.cityId : data?.city?.id ?? null;
  const districtsForCity = selectedCityId ? districts.filter((d) => d.cityId === selectedCityId) : [];

  useEffect(() => {
    if (editMode) {
      const loadLists = async () => {
        setLoadingLists(true);
        try {
          const [kingdomsData, citiesData, districtsData, orgsData] = await Promise.all([
            listKingdoms(),
            listCities(),
            listDistricts(),
            listOrganisations(),
          ]);
          setKingdoms(kingdomsData);
          setCities(citiesData);
          setDistricts(districtsData);
          setOrganisations(orgsData);
        } catch {
          setKingdoms([]);
          setCities([]);
          setDistricts([]);
          setOrganisations([]);
        } finally {
          setLoadingLists(false);
        }
      };
      void loadLists();
    }
  }, [editMode]);

  return (
    <>
      <div className="detail-item">
        <span className="detail-label">Nom</span>
        {editMode ? (
          <input
            className="detail-input"
            value={(editState as Partial<PlaceDetail> & { kind: 'place' })?.name ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nom du lieu"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.name)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Description</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={(editState as Partial<PlaceDetail> & { kind: 'place' })?.description ?? ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Description du lieu"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.description)}</p>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Type de lieu</span>
        {editMode ? (
          <select
            className="detail-input"
            value={(editState as Partial<PlaceDetail> & { kind: 'place' })?.placeType ?? 'AUTRE'}
            onChange={(e) => onChange('placeType', e.target.value as PlaceType)}
          >
            {PLACE_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {formatPlaceType(opt)}
              </option>
            ))}
          </select>
        ) : (
          <span className="detail-value">{formatPlaceType(data?.placeType)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Icône</span>
        <span className="detail-value">
          {data?.iconUrl ? (
            <img src={data.iconUrl} alt="Icône" style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginLeft: '8px' }} />
          ) : (
            valueOrDash(data?.iconUrl)
          )}
        </span>
      </div>
      <p className="detail-hint" style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#94a3b8' }}>
        Rattachement : royaume, ville, quartier et/ou organisations. Un lieu lié à une ville ou un quartier partage sa position sur la carte avec cette ville (pas de marqueur séparé).
      </p>
      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Royaume</span>
          {editMode ? (
            loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <SearchableSelect
                items={kingdoms}
                selectedId={placeEdit.kingdomId !== undefined ? placeEdit.kingdomId : data?.kingdom?.id}
                onSelect={(id) => {
                  onChange('kingdomId', id);
                  onChange('cityId', null);
                  onChange('districtId', null);
                }}
                placeholder="Sélectionner un royaume"
              />
            )
          ) : data?.kingdom ? (
            <span
              className="detail-value"
              style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
              onClick={() => {
                if (onNavigate && data.kingdom) {
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
        <div className="detail-item">
          <span className="detail-label">Ville</span>
          {editMode ? (
            loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <SearchableSelect
                items={cities}
                selectedId={placeEdit.cityId !== undefined ? placeEdit.cityId : data?.city?.id}
                onSelect={(id) => {
                  onChange('cityId', id);
                  onChange('districtId', null);
                  onChange('kingdomId', null);
                }}
                placeholder="Sélectionner une ville"
              />
            )
          ) : data?.city ? (
            <span
              className="detail-value"
              style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
              onClick={() => {
                if (onNavigate && data?.city) {
                  onNavigate(createMapPointFromRef(data.city, 'city'));
                }
              }}
            >
              {valueOrDash(data.city?.name)}
            </span>
          ) : (
            <span className="detail-value">{valueOrDash((data?.city as { name: string } | null | undefined)?.name)}</span>
          )}
        </div>
        <div className="detail-item">
          <span className="detail-label">Quartier</span>
          {editMode ? (
            loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <SearchableSelect
                items={districtsForCity}
                selectedId={placeEdit.districtId !== undefined ? placeEdit.districtId : data?.district?.id}
                onSelect={(id) => {
                  onChange('districtId', id);
                  if (id) {
                    const di = districts.find((x) => x.id === id);
                    if (di) {
                      onChange('cityId', di.cityId);
                      onChange('kingdomId', null);
                    }
                  }
                }}
                placeholder={selectedCityId ? 'Quartier (optionnel)' : 'Choisir une ville d’abord'}
              />
            )
          ) : data?.district ? (
            <span
              className="detail-value"
              style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
              onClick={() => {
                if (onNavigate && data.district) {
                  onNavigate(createMapPointFromRef(data.district, 'district'));
                }
              }}
            >
              {valueOrDash(data.district.name)}
            </span>
          ) : (
            <span className="detail-value">{valueOrDash(null)}</span>
          )}
        </div>
      </div>
      <div className="detail-item">
        <span className="detail-label">Organisations</span>
        {editMode ? (
          loadingLists ? (
            <span className="detail-value">Chargement...</span>
          ) : (
            <SearchableMultiSelect
              items={organisations}
              selectedIds={placeEdit.organisationIds ?? []}
              onChange={(ids) => onChange('organisationIds', ids)}
              placeholder="Ajouter une organisation..."
            />
          )
        ) : (data?.organisations?.length ?? 0) > 0 ? (
          <div className="tags">
            {(data?.organisations ?? []).map((org) => (
              <span
                key={org.id}
                className="tag"
                style={{ cursor: onNavigate ? 'pointer' : 'default' }}
                onClick={() => { if (onNavigate) onNavigate(organisationRefToNavPoint(org)); }}
              >
                {org.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="detail-value">{valueOrDash(null)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Afficher sur la carte</span>
        {editMode ? (
          <label className="detail-checkbox-label">
            <input type="checkbox" checked={placeEdit.showOnMap ?? true} onChange={(e) => onChange('showOnMap', e.target.checked)} />
            Oui
          </label>
        ) : (
          <span className="detail-value">{data?.showOnMap ?? true ? 'Oui' : 'Non'}</span>
        )}
      </div>
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
