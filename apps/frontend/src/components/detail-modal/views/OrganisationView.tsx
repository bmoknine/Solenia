import { useEffect, useState } from 'react';
import type { NavigablePoint } from '../../../api/map';
import type { City, Kingdom, Membership, Organisation, OrganisationDetail, Person, Place } from '../../../api/entities';
import { listCities, listKingdoms, listOrganisations, listPersons, listPlaces } from '../../../api/entities';
import { RichTextContent } from '../../rich-text/RichTextContent';
import { RichTextField } from '../../rich-text/RichTextField';
import { LoreSection } from '../LoreSection';
import { FlagSelect } from '../FlagSelect';
import { SearchableSelect } from '../SearchableSelect';
import { SearchableMultiSelect } from '../SearchableMultiSelect';
import { MEMBERSHIP_OPTIONS } from '../entityOptions';
import { formatMembership } from '../entityFormatters';
import type { EditState, OrganisationEditState } from '../detailModalTypes';
import { createMapPointFromRef, organisationRefToNavPoint } from '../createMapPointFromRef';
import { fetchFamilyTree, type FamilyMember, type SubOrganisation } from '../../../api/family';
import { FamilyTree } from '../../family/FamilyTree';

export function OrganisationView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
  onOpenLore,
  onOpenFamilyTree,
}: {
  data: OrganisationDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: NavigablePoint) => void;
  onOpenLore?: (loreId: string) => void;
  onOpenFamilyTree?: (family: { id: string; name: string }) => void;
}) {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [subOrgs, setSubOrgs] = useState<SubOrganisation[]>([]);

  // Aperçu dans la fiche : arbre généalogique pour les familles, organigramme sinon.
  const isFamily = (data as OrganisationDetail | null)?.organisationType === 'FAMILLE';
  const familyId = data?.id;
  useEffect(() => {
    if (!familyId) {
      setFamilyMembers([]);
      setSubOrgs([]);
      return;
    }
    let cancelled = false;
    const load = () => {
      fetchFamilyTree(familyId)
        .then((tree) => {
          if (cancelled) return;
          setFamilyMembers(tree.members);
          setSubOrgs(tree.subOrganisations ?? []);
        })
        .catch(() => { if (!cancelled) { setFamilyMembers([]); setSubOrgs([]); } });
    };
    load();

    // L'éditeur plein écran signale ses modifications : on garde l'aperçu à jour.
    const onUpdated = (e: Event) => {
      const detail = (e as CustomEvent<{ organisationId: string }>).detail;
      if (detail?.organisationId === familyId) load();
    };
    window.addEventListener('family-tree-updated', onUpdated);
    return () => {
      cancelled = true;
      window.removeEventListener('family-tree-updated', onUpdated);
    };
  }, [familyId]);

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
          <RichTextField
            value={((editState as OrganisationDetail)?.description as string) ?? ''}
            onChange={(html) => onChange('description', html)}
            placeholder="Description de l'organisation"
          />
        ) : (
          <RichTextContent value={data?.description} emptyLabel={String(valueOrDash(null))} />
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
            <option value="FAMILLE">Famille</option>
          </select>
        ) : (
          <span className="detail-value">
            {(data as OrganisationDetail)?.organisationType === 'PRINCIPAL'
              ? 'Principal'
              : (data as OrganisationDetail)?.organisationType === 'CELLULE'
                ? 'Cellule'
                : (data as OrganisationDetail)?.organisationType === 'FAMILLE'
                  ? 'Famille'
                  : valueOrDash(null)}
          </span>
        )}
      </div>
      {onOpenFamilyTree && data?.id && !editMode && (
        <div className="detail-item">
          <span className="detail-label">{isFamily ? 'Généalogie' : 'Organigramme'}</span>
          {(familyMembers.length > 0 || (!isFamily && subOrgs.length > 0)) && (
            <FamilyTree
              members={familyMembers}
              mode={isFamily ? 'genealogy' : 'orgchart'}
              organisation={{ id: data.id, name: data.name }}
              subOrganisations={isFamily ? [] : subOrgs}
              variant="preview"
              onOpenFull={() => onOpenFamilyTree({ id: data.id, name: data.name })}
            />
          )}
          <button
            type="button"
            className="border-edit-btn"
            style={{ marginTop: familyMembers.length > 0 ? 8 : 0 }}
            onClick={() => onOpenFamilyTree({ id: data.id, name: data.name })}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="2" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="19" r="2" />
              <path d="M12 7v5M6 17v-2h12v2" />
            </svg>
            {familyMembers.length > 0
              ? (isFamily ? 'Ouvrir / modifier l’arbre' : 'Ouvrir / modifier l’organigramme')
              : (isFamily ? 'Créer l’arbre généalogique' : 'Créer l’organigramme')}
          </button>
        </div>
      )}
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
                onClick={() => { if (onNavigate) onNavigate(organisationRefToNavPoint(subOrg)); }}
              >
                {subOrg.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="detail-grid">
        <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
          <span className="detail-label">Royaumes</span>
          {editMode ? (
            loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <SearchableMultiSelect
                items={kingdoms}
                selectedIds={(editState as OrganisationEditState)?.kingdomIds ?? data?.kingdoms?.map((k) => k.id) ?? []}
                onChange={(ids) => onChange('kingdomIds', ids)}
                placeholder="Ajouter un royaume..."
              />
            )
          ) : (data?.kingdoms?.length ?? 0) > 0 ? (
            <div className="tags">
              {(data?.kingdoms ?? []).map((k) => (
                <span key={k.id} className="tag" style={{ cursor: onNavigate ? 'pointer' : 'default' }}
                  onClick={() => onNavigate && onNavigate(createMapPointFromRef(k, 'kingdom'))}>
                  {k.name}
                </span>
              ))}
            </div>
          ) : (
            <span className="detail-value">—</span>
          )}
        </div>
        <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
          <span className="detail-label">Villes</span>
          {editMode ? (
            loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <SearchableMultiSelect
                items={cities}
                selectedIds={(editState as OrganisationEditState)?.cityIds ?? data?.cities?.map((c) => c.id) ?? []}
                onChange={(ids) => onChange('cityIds', ids)}
                placeholder="Ajouter une ville..."
              />
            )
          ) : (data?.cities?.length ?? 0) > 0 ? (
            <div className="tags">
              {(data?.cities ?? []).map((c) => (
                <span key={c.id} className="tag" style={{ cursor: onNavigate ? 'pointer' : 'default' }}
                  onClick={() => onNavigate && onNavigate(createMapPointFromRef(c, 'city'))}>
                  {c.name}
                </span>
              ))}
            </div>
          ) : (
            <span className="detail-value">—</span>
          )}
        </div>
        <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
          <span className="detail-label">Lieux</span>
          {editMode ? (
            loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <SearchableMultiSelect
                items={places}
                selectedIds={(editState as OrganisationEditState)?.placeIds ?? data?.places?.map((p) => p.id) ?? []}
                onChange={(ids) => onChange('placeIds', ids)}
                placeholder="Ajouter un lieu..."
              />
            )
          ) : (data?.places?.length ?? 0) > 0 ? (
            <div className="tags">
              {(data?.places ?? []).map((p) => (
                <span key={p.id} className="tag" style={{ cursor: onNavigate ? 'pointer' : 'default' }}
                  onClick={() => onNavigate && onNavigate(createMapPointFromRef(p, 'place'))}>
                  {p.name}
                </span>
              ))}
            </div>
          ) : (
            <span className="detail-value">—</span>
          )}
        </div>
        <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
          <span className="detail-label">Membres</span>
          {editMode ? (
            loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <SearchableMultiSelect
                items={persons}
                selectedIds={(editState as OrganisationEditState)?.personIds ?? data?.members?.map((m) => m.id) ?? []}
                onChange={(ids) => onChange('personIds', ids)}
                placeholder="Ajouter un personnage..."
              />
            )
          ) : (data?.members?.length ?? 0) > 0 ? (
            <div className="tags">
              {(data?.members ?? []).map((m) => (
                <span key={m.id} className="tag" style={{ cursor: onNavigate ? 'pointer' : 'default' }}
                  onClick={() => onNavigate && onNavigate(createMapPointFromRef(m, 'person'))}>
                  {m.name}
                </span>
              ))}
            </div>
          ) : (
            <span className="detail-value">—</span>
          )}
        </div>
      </div>
      <LoreSection lores={data?.lores} onOpenLore={onOpenLore} />
    </>
  );
}
