import { useEffect, useState } from 'react';
import type { NavigablePoint } from '../../../api/map';
import type { Breed, City, Kingdom, Organisation, PersonDetail, Place, Sex } from '../../../api/entities';
import { listCities, listKingdoms, listOrganisations, listPlaces } from '../../../api/entities';
import { LoreSection } from '../LoreSection';
import { CommentsSection } from '../CommentsSection';
import { SearchableSelect } from '../SearchableSelect';
import { LanguageDropdown } from '../LanguageDropdown';
import { BREED_OPTIONS, SEX_OPTIONS } from '../entityOptions';
import { formatBreed, formatLanguage, formatSex } from '../entityFormatters';
import type { EditState, PersonEditState } from '../detailModalTypes';
import { createMapPointFromRef, organisationRefToNavPoint } from '../createMapPointFromRef';

export function PersonView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
  onOpenLore,
}: {
  data: PersonDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: NavigablePoint) => void;
  onOpenLore?: (loreId: string) => void;
}) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  const personEdit = editState as PersonEditState;

  useEffect(() => {
    if (editMode) {
      const loadLists = async () => {
        setLoadingLists(true);
        try {
          const [kingdomsData, citiesData, placesData, orgsData] = await Promise.all([
            listKingdoms(),
            listCities(),
            listPlaces(),
            listOrganisations(),
          ]);
          setKingdoms(kingdomsData);
          setCities(citiesData);
          setPlaces(placesData);
          setOrganisations(orgsData);
        } catch {
          setKingdoms([]);
          setCities([]);
          setPlaces([]);
          setOrganisations([]);
        } finally {
          setLoadingLists(false);
        }
      };
      void loadLists();
    }
  }, [editMode]);

  const stats = [
    { label: 'FOR', key: 'STR', value: (editState as PersonDetail | null)?.STR },
    { label: 'DEX', key: 'DEX', value: (editState as PersonDetail | null)?.DEX },
    { label: 'CON', key: 'CON', value: (editState as PersonDetail | null)?.CON },
    { label: 'INT', key: 'INT', value: (editState as PersonDetail | null)?.INT },
    { label: 'SAG', key: 'WIS', value: (editState as PersonDetail | null)?.WIS },
    { label: 'CHA', key: 'CHA', value: (editState as PersonDetail | null)?.CHA },
  ];

  return (
    <>
      <div className="detail-item">
        <span className="detail-label">Nom</span>
        {editMode ? (
          <input
            className="detail-input"
            value={personEdit?.name ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nom du personnage"
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
            value={personEdit?.description ?? ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Description du personnage"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.description)}</p>
        )}
      </div>

      <div className="detail-section">
        <h3>Organisations</h3>
        {editMode ? (
          loadingLists ? (
            <span className="detail-value">Chargement...</span>
          ) : (
            <div className="detail-checkbox-list">
              {organisations.map((org) => {
                const ids = personEdit.organisationIds ?? [];
                const checked = ids.includes(org.id);
                return (
                  <label key={org.id} className="detail-checkbox-label">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = checked ? ids.filter((i) => i !== org.id) : [...ids, org.id];
                        onChange('organisationIds', next);
                      }}
                    />
                    {org.name}
                  </label>
                );
              })}
            </div>
          )
        ) : (data?.organisations?.length ?? 0) > 0 ? (
          <ul className="detail-list">
            {(data?.organisations ?? []).map((org) => (
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
        ) : (
          <span className="detail-value">{valueOrDash(null)}</span>
        )}
      </div>

      <div className="detail-section">
        <h3>Statistiques</h3>
        <div className="stats-grid" style={{ marginBottom: '12px', gap: '12px' }}>
          <div className="stat-item">
            <span className="stat-label">PV</span>
            {editMode ? (
              <input
                className="detail-input stat-input"
                type="number"
                min={0}
                value={(editState as PersonDetail | null)?.pv ?? ''}
                onChange={(e) => onChange('pv', e.target.value === '' ? null : Number(e.target.value))}
                placeholder="—"
              />
            ) : (
              <span className="stat-value">{valueOrDash((data as PersonDetail)?.pv)}</span>
            )}
          </div>
          <div className="stat-item">
            <span className="stat-label">CA</span>
            {editMode ? (
              <input
                className="detail-input stat-input"
                type="number"
                min={0}
                value={(editState as PersonDetail | null)?.ca ?? ''}
                onChange={(e) => onChange('ca', e.target.value === '' ? null : Number(e.target.value))}
                placeholder="—"
              />
            ) : (
              <span className="stat-value">{valueOrDash((data as PersonDetail)?.ca)}</span>
            )}
          </div>
        </div>
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-label">{s.label}</span>
              {editMode ? (
                <input
                  className="detail-input stat-input"
                  type="number"
                  value={s.value ?? ''}
                  onChange={(e) => onChange(s.key, e.target.value === '' ? undefined : Number(e.target.value))}
                />
              ) : (
                <span className="stat-value">{valueOrDash(s.value)}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="detail-item">
        <span className="detail-label">Afficher sur la carte</span>
        {editMode ? (
          <label className="detail-checkbox-label">
            <input
              type="checkbox"
              checked={(editState as PersonDetail | null)?.showOnMap ?? true}
              onChange={(e) => onChange('showOnMap', e.target.checked)}
            />
            Oui
          </label>
        ) : (
          <span className="detail-value">{(data as PersonDetail)?.showOnMap ?? true ? 'Oui' : 'Non'}</span>
        )}
      </div>

      <div className="detail-section">
        <h3>Langues</h3>
        {editMode ? (
          <LanguageDropdown
            selectedLanguages={(editState as PersonDetail | null)?.languages ?? []}
            onLanguagesChange={(languages) => onChange('languages', languages)}
          />
        ) : (
          <div className="tags">
            {(data?.languages ?? []).length === 0
              ? valueOrDash('')
              : (data?.languages ?? []).map((lang, i) => (
                  <span key={i} className="tag">
                    {formatLanguage(lang)}
                  </span>
                ))}
          </div>
        )}
      </div>

      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Race</span>
          {editMode ? (
            <select
              className="detail-input"
              value={(editState as PersonDetail | null)?.breed ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                onChange('breed', value === '' ? null : (value as Breed));
              }}
            >
              <option value="">Non spécifié</option>
              {BREED_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {formatBreed(opt)}
                </option>
              ))}
            </select>
          ) : (
            <span className="detail-value">{valueOrDash(formatBreed(data?.breed))}</span>
          )}
        </div>
        <div className="detail-item">
          <span className="detail-label">Sexe</span>
          {editMode ? (
            <select
              className="detail-input"
              value={(editState as PersonDetail | null)?.sex ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                onChange('sex', value === '' ? null : (value as Sex));
              }}
            >
              <option value="">Non spécifié</option>
              {SEX_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {formatSex(opt)}
                </option>
              ))}
            </select>
          ) : (
            <span className="detail-value">{valueOrDash(formatSex(data?.sex))}</span>
          )}
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Royaume</span>
          {editMode ? (
            loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <SearchableSelect
                items={kingdoms}
                selectedId={
                  personEdit?.kingdomId !== undefined ? personEdit.kingdomId : data?.kingdom?.id
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
              {valueOrDash(data?.kingdom?.name)}
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
                selectedId={
                  personEdit?.cityId !== undefined ? personEdit.cityId : data?.city?.id
                }
                onSelect={(id) => onChange('cityId', id)}
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
              {valueOrDash(data?.city?.name)}
            </span>
          ) : (
            <span className="detail-value">{valueOrDash((data?.city as { name: string } | null | undefined)?.name)}</span>
          )}
        </div>
        <div className="detail-item">
          <span className="detail-label">Lieu</span>
          {editMode ? (
            loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <SearchableSelect
                items={places}
                selectedId={
                  personEdit?.placeId !== undefined ? personEdit.placeId : data?.place?.id
                }
                onSelect={(id) => onChange('placeId', id)}
                placeholder="Sélectionner un lieu"
              />
            )
          ) : data?.place ? (
            <span
              className="detail-value"
              style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
              onClick={() => {
                if (onNavigate && data?.place) {
                  onNavigate(createMapPointFromRef(data.place, 'place'));
                }
              }}
            >
              {valueOrDash(data?.place?.name)}
            </span>
          ) : (
            <span className="detail-value">{valueOrDash((data?.place as { name: string } | null | undefined)?.name)}</span>
          )}
        </div>
      </div>

      <LoreSection lores={data?.lores} onOpenLore={onOpenLore} />
      <CommentsSection comments={data?.comments} />
    </>
  );
}
