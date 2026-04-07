import { useEffect, useState } from 'react';
import type { NavigablePoint } from '../../../api/map';
import type { City, Kingdom, Membership, Organisation, OrganisationDetail, Person, Place } from '../../../api/entities';
import { listCities, listKingdoms, listOrganisations, listPersons, listPlaces } from '../../../api/entities';
import { LoreSection } from '../LoreSection';
import { FlagSelect } from '../FlagSelect';
import { SearchableSelect } from '../SearchableSelect';
import { MEMBERSHIP_OPTIONS } from '../entityOptions';
import { formatMembership } from '../entityFormatters';
import type { EditState, OrganisationEditState } from '../detailModalTypes';
import { createMapPointFromRef, organisationRefToNavPoint } from '../createMapPointFromRef';

export function OrganisationView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
  onOpenLore,
}: {
  data: OrganisationDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: NavigablePoint) => void;
  onOpenLore?: (loreId: string) => void;
}) {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  useEffect(() => {
    if (editMode || !data?.id) {
      const loadLists = async () => {
        setLoadingLists(true);
        try {
          const [organisationsData, kingdomsData, citiesData, placesData, personsData] = await Promise.all([
            listOrganisations(),
            listKingdoms(),
            listCities(),
            listPlaces(),
            listPersons(),
          ]);
          const filteredOrgs = data?.id ? organisationsData.filter((org) => org.id !== data.id) : organisationsData;
          setOrganisations(filteredOrgs);
          setKingdoms(kingdomsData);
          setCities(citiesData);
          setPlaces(placesData);
          setPersons(personsData);
        } catch {
          setOrganisations([]);
          setKingdoms([]);
          setCities([]);
          setPlaces([]);
          setPersons([]);
        } finally {
          setLoadingLists(false);
        }
      };
      void loadLists();
    }
  }, [editMode, data?.id]);

  return (
    <>
      {editMode && (
        <div className="detail-item">
          <span className="detail-label">Nom</span>
          <input
            className="detail-input"
            value={(editState as OrganisationEditState)?.name ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nom de l'organisation"
          />
        </div>
      )}
      <div className="detail-item">
        <span className="detail-label">Description</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={((editState as OrganisationDetail)?.description as string) ?? ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Description de l'organisation"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.description)}</p>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Type</span>
        {editMode ? (
          <select
            className="detail-input"
            value={((editState as OrganisationDetail)?.organisationType as string) ?? ''}
            onChange={(e) => onChange('organisationType', e.target.value === '' ? null : e.target.value)}
          >
            <option value="">— (Non défini)</option>
            <option value="PRINCIPAL">Principal</option>
            <option value="CELLULE">Cellule</option>
          </select>
        ) : (
          <span className="detail-value">
            {(data as OrganisationDetail)?.organisationType === 'PRINCIPAL'
              ? 'Principal'
              : (data as OrganisationDetail)?.organisationType === 'CELLULE'
                ? 'Cellule'
                : valueOrDash(null)}
          </span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Affiliation</span>
        {editMode ? (
          <select
            className="detail-input"
            value={((editState as OrganisationDetail)?.membership as string) ?? ''}
            onChange={(e) =>
              onChange('membership', e.target.value === '' ? null : (e.target.value as Membership))
            }
          >
            <option value="">Aucune affiliation</option>
            {MEMBERSHIP_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {formatMembership(opt)}
              </option>
            ))}
          </select>
        ) : (
          <span className="detail-value">{valueOrDash(formatMembership(data?.membership))}</span>
        )}
      </div>
      {editMode && (
        <div className="detail-item">
          <span className="detail-label">Drapeau</span>
          <FlagSelect
            editMode={editMode}
            value={(editState as OrganisationDetail | null)?.flag ?? data?.flag}
            onChange={(v) => onChange('flag', v)}
          />
        </div>
      )}
      <div className="detail-item">
        <span className="detail-label">Organisation parente</span>
        {editMode ? (
          loadingLists ? (
            <span className="detail-value">Chargement...</span>
          ) : (
            <SearchableSelect
              items={organisations}
              selectedId={
                (editState as OrganisationDetail)?.parentOrganisationId !== undefined
                  ? (editState as OrganisationDetail).parentOrganisationId
                  : data?.parentOrganisation?.id
              }
              onSelect={(id) => onChange('parentOrganisationId', id)}
              placeholder="Sélectionner une organisation parente (optionnel)"
            />
          )
        ) : data?.parentOrganisation ? (
          <span
            className="detail-value"
            style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
            onClick={() => {
              if (onNavigate && data?.parentOrganisation) {
                onNavigate(organisationRefToNavPoint(data.parentOrganisation));
              }
            }}
          >
            {valueOrDash(data.parentOrganisation?.name)}
          </span>
        ) : (
          <span className="detail-value">{valueOrDash(null)}</span>
        )}
      </div>
      {data?.subOrganisations && data.subOrganisations.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Sous-organisations :</h3>
          <ul className="detail-list">
            {data?.subOrganisations.map((subOrg) => (
              <li
                key={subOrg.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => {
                  if (onNavigate) onNavigate(organisationRefToNavPoint(subOrg));
                }}
              >
                {subOrg.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data?.members && data.members.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Membres :</h3>
          <ul className="detail-list">
            {data?.members.map((m) => (
              <li
                key={m.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(m, 'person'))}
              >
                {m.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data?.cities && data.cities.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Villes :</h3>
          <ul className="detail-list">
            {data?.cities.map((c) => (
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
      {data?.kingdoms && data.kingdoms.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Royaumes :</h3>
          <ul className="detail-list">
            {data?.kingdoms.map((k) => (
              <li
                key={k.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(k, 'kingdom'))}
              >
                {k.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {editMode && (
        <>
          <div className="detail-item">
            <span className="detail-label">Royaumes</span>
            {loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                {kingdoms.map((kingdom) => {
                  const orgState = editState as OrganisationEditState;
                  const selectedIds = orgState?.kingdomIds || data?.kingdoms?.map((k) => k.id) || [];
                  const isSelected = selectedIds.includes(kingdom.id);
                  return (
                    <label key={kingdom.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const currentIds = orgState?.kingdomIds || data?.kingdoms?.map((k) => k.id) || [];
                          const newIds = e.target.checked
                            ? [...currentIds, kingdom.id]
                            : currentIds.filter((id) => id !== kingdom.id);
                          onChange('kingdomIds', newIds);
                        }}
                      />
                      <span>{kingdom.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          <div className="detail-item">
            <span className="detail-label">Villes</span>
            {loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                {cities.map((city) => {
                  const orgState = editState as OrganisationEditState;
                  const selectedIds = orgState?.cityIds || data?.cities?.map((c) => c.id) || [];
                  const isSelected = selectedIds.includes(city.id);
                  return (
                    <label key={city.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const currentIds = orgState?.cityIds || data?.cities?.map((c) => c.id) || [];
                          const newIds = e.target.checked
                            ? [...currentIds, city.id]
                            : currentIds.filter((id) => id !== city.id);
                          onChange('cityIds', newIds);
                        }}
                      />
                      <span>{city.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          <div className="detail-item">
            <span className="detail-label">Lieux</span>
            {loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                {places.map((place) => {
                  const orgState = editState as OrganisationEditState;
                  const selectedIds = orgState?.placeIds || data?.places?.map((p) => p.id) || [];
                  const isSelected = selectedIds.includes(place.id);
                  return (
                    <label key={place.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const currentIds = orgState?.placeIds || data?.places?.map((p) => p.id) || [];
                          const newIds = e.target.checked
                            ? [...currentIds, place.id]
                            : currentIds.filter((id) => id !== place.id);
                          onChange('placeIds', newIds);
                        }}
                      />
                      <span>{place.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          <div className="detail-item">
            <span className="detail-label">Personnes</span>
            {loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                {persons.map((person) => {
                  const orgState = editState as OrganisationEditState;
                  const selectedIds = orgState?.personIds || data?.members?.map((m) => m.id) || [];
                  const isSelected = selectedIds.includes(person.id);
                  return (
                    <label key={person.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const currentIds = orgState?.personIds || data?.members?.map((m) => m.id) || [];
                          const newIds = e.target.checked
                            ? [...currentIds, person.id]
                            : currentIds.filter((id) => id !== person.id);
                          onChange('personIds', newIds);
                        }}
                      />
                      <span>{person.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
      <LoreSection lores={data?.lores} onOpenLore={onOpenLore} />
    </>
  );
}
