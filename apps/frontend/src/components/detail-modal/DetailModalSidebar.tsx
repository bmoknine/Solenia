import { useState } from 'react';
import type { EntityKind, NavigablePoint } from '../../api/map';
import type {
  CityDetail,
  DistrictDetail,
  KingdomDetail,
  OrganisationDetail,
  PersonDetail,
  PlaceDetail,
  PlayerCharacterDetail,
} from '../../api/entities';
import type { DetailModalProps, EntityData, ExtendedMapPoint } from './detailModalTypes';
import { iconForPlaceType } from './entityFormatters';
import type { PlaceType } from '../../api/entities';
import { DetailModalSidebarItem } from './DetailModalSidebarItem';
import { useFavorites } from '../../favorites/useFavorites';
import type { SearchableKind } from '../../search/types';

function AccordionSection({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: '12px' }}>
      <button
        type="button"
        className="detail-sidebar-accordion-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>
          {title}
          {count !== undefined && (
            <span style={{ marginLeft: '5px', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>
              ({count})
            </span>
          )}
        </span>
        <span className={`detail-sidebar-accordion-chevron${open ? ' open' : ''}`}>▼</span>
      </button>
      <div className={`detail-sidebar-accordion-body${open ? '' : ' collapsed'}`}>
        {children}
      </div>
    </div>
  );
}

type SidebarKind = SearchableKind;

type SidebarEntity = { id: string; name: string; kind: SidebarKind; iconUrl?: string | null; placeType?: PlaceType | null };

function sidebarEntityIcon(kind: SidebarKind, entity?: { iconUrl?: string | null; placeType?: PlaceType | null }) {
  if (kind === 'kingdom') return '👑';
  if (kind === 'organisation') return '🏛️';
  if (kind === 'city') return '🏙️';
  if (kind === 'district') return '🏘️';
  if (kind === 'person') return '👤';
  if (kind === 'playerCharacter') return '🎮';
  if (kind === 'place') {
    return (
      <img
        src={entity?.iconUrl ?? iconForPlaceType(entity?.placeType)}
        alt=""
        style={{ width: '16px', height: '16px', objectFit: 'contain', verticalAlign: 'middle' }}
      />
    );
  }
  if (kind === 'lore') return '📜';
  return '•';
}

type GroupedRow = { kind: SidebarKind; label: string; entities: SidebarEntity[] };

function getGroupedEntities(point: ExtendedMapPoint, data: EntityData): GroupedRow[] {
  if (!data) return [];
  if (point.kind === 'city') return [];

  const groups = new Map<SidebarKind, SidebarEntity[]>();

  if (point.kind === 'kingdom') {
    const kingdomData = data as KingdomDetail;
    if (kingdomData.cities?.length) {
      groups.set('city', kingdomData.cities.map((c) => ({ id: c.id, name: c.name, kind: 'city' as const })));
    }
    if (kingdomData.places?.length) {
      groups.set('place', kingdomData.places.map((p) => ({ id: p.id, name: p.name, kind: 'place' as const, iconUrl: p.iconUrl, placeType: p.placeType })));
    }
    if (kingdomData.persons?.length) {
      groups.set('person', kingdomData.persons.map((p) => ({ id: p.id, name: p.name, kind: 'person' as const })));
    }
    if (kingdomData.organisations?.length) {
      groups.set(
        'organisation',
        kingdomData.organisations.map((o) => ({ id: o.id, name: o.name, kind: 'organisation' as const })),
      );
    }
  } else if (point.kind === 'district') {
    const districtData = data as DistrictDetail;
    if (districtData.city) {
      groups.set('city', [{ id: districtData.city.id, name: districtData.city.name, kind: 'city' as const }]);
    }
    if (districtData.places?.length) {
      groups.set('place', districtData.places.map((p) => ({ id: p.id, name: p.name, kind: 'place' as const, iconUrl: p.iconUrl, placeType: p.placeType })));
    }
    if (districtData.persons?.length) {
      groups.set('person', districtData.persons.map((p) => ({ id: p.id, name: p.name, kind: 'person' as const })));
    }
  } else if (point.kind === 'place') {
    const placeData = data as PlaceDetail;
    if (placeData.kingdom) {
      groups.set('kingdom', [{ id: placeData.kingdom.id, name: placeData.kingdom.name, kind: 'kingdom' as const }]);
    }
    if (placeData.city) {
      groups.set('city', [{ id: placeData.city.id, name: placeData.city.name, kind: 'city' as const }]);
    }
    if (placeData.district) {
      groups.set('district', [{ id: placeData.district.id, name: placeData.district.name, kind: 'district' as const }]);
    }
    if (placeData.persons?.length) {
      groups.set('person', placeData.persons.map((p) => ({ id: p.id, name: p.name, kind: 'person' as const })));
    }
    if (placeData.organisations?.length) {
      groups.set(
        'organisation',
        placeData.organisations.map((o) => ({ id: o.id, name: o.name, kind: 'organisation' as const })),
      );
    }
  } else if (point.kind === 'person') {
    const personData = data as PersonDetail;
    if (personData.kingdom) {
      groups.set('kingdom', [{ id: personData.kingdom.id, name: personData.kingdom.name, kind: 'kingdom' as const }]);
    }
    if (personData.city) {
      groups.set('city', [{ id: personData.city.id, name: personData.city.name, kind: 'city' as const }]);
    }
    if (personData.district) {
      groups.set('district', [{ id: personData.district.id, name: personData.district.name, kind: 'district' as const }]);
    }
    if (personData.place) {
      groups.set('place', [{ id: personData.place.id, name: personData.place.name, kind: 'place' as const }]);
    }
    if (personData.organisations?.length) {
      groups.set(
        'organisation',
        personData.organisations.map((o) => ({ id: o.id, name: o.name, kind: 'organisation' as const })),
      );
    }
  } else if (point.kind === 'organisation') {
    const organisationData = data as OrganisationDetail;
    const orgItems: Array<{ id: string; name: string; kind: 'organisation' }> = [];
    if (organisationData.parentOrganisation) {
      orgItems.push({
        id: organisationData.parentOrganisation.id,
        name: organisationData.parentOrganisation.name,
        kind: 'organisation' as const,
      });
    }
    if (organisationData.subOrganisations?.length) {
      orgItems.push(
        ...organisationData.subOrganisations.map((subOrg) => ({
          id: subOrg.id,
          name: subOrg.name,
          kind: 'organisation' as const,
        })),
      );
    }
    if (orgItems.length > 0) {
      groups.set('organisation', orgItems);
    }
    if (organisationData.kingdoms?.length) {
      groups.set('kingdom', organisationData.kingdoms.map((k) => ({ id: k.id, name: k.name, kind: 'kingdom' as const })));
    }
    if (organisationData.members?.length) {
      groups.set('person', organisationData.members.map((m) => ({ id: m.id, name: m.name, kind: 'person' as const })));
    }
    if (organisationData.cities?.length) {
      groups.set('city', organisationData.cities.map((c) => ({ id: c.id, name: c.name, kind: 'city' as const })));
    }
    if (organisationData.places?.length) {
      groups.set('place', organisationData.places.map((p) => ({ id: p.id, name: p.name, kind: 'place' as const })));
    }
  }

  if (point.kind === 'playerCharacter') {
    const pcData = data as PlayerCharacterDetail;
    if (pcData.kingdom) {
      groups.set('kingdom', [{ id: pcData.kingdom.id, name: pcData.kingdom.name, kind: 'kingdom' as const }]);
    }
    if (pcData.city) {
      groups.set('city', [{ id: pcData.city.id, name: pcData.city.name, kind: 'city' as const }]);
    }
    if (pcData.district) {
      groups.set('district', [{ id: pcData.district.id, name: pcData.district.name, kind: 'district' as const }]);
    }
    if (pcData.place) {
      groups.set('place', [{ id: pcData.place.id, name: pcData.place.name, kind: 'place' as const }]);
    }
  }

  const kindLabels: Record<SidebarKind, string> = {
    kingdom: 'Royaume :',
    city: 'Ville :',
    district: 'Quartier :',
    place: 'Lieu :',
    person: 'Personne :',
    organisation: 'Organisation :',
    playerCharacter: 'Personnage joueur :',
    lore: 'Lore :',
  };

  const result: GroupedRow[] = [];
  const order: Array<'kingdom' | 'organisation' | 'city' | 'district' | 'place' | 'person' | 'playerCharacter'> = [
    'kingdom',
    'organisation',
    'city',
    'district',
    'place',
    'person',
    'playerCharacter',
  ];
  for (const kind of order) {
    const entities = groups.get(kind);
    if (entities?.length) {
      result.push({ kind, label: kindLabels[kind], entities });
    }
  }

  return result;
}

type Props = {
  point: ExtendedMapPoint | null;
  data: EntityData;
  onNavigate?: (point: NavigablePoint) => void;
  onOpenLore?: (loreId: string) => void;
  createMode?: DetailModalProps['createMode'];
};

export function DetailModalSidebar({ point, data, onNavigate, onOpenLore, createMode }: Props) {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  if (!point && !createMode) return null;

  const handleNavigate = (kind: SidebarKind, id: string, name: string) => {
    if (kind === 'lore') {
      onOpenLore?.(id);
      return;
    }
    onNavigate?.({
      id,
      x: 0,
      y: 0,
      kind: kind as EntityKind,
      targetId: id,
      name,
      description: null,
    });
  };

  const renderEntity = (
    kind: SidebarKind,
    entity: { id: string; name: string; iconUrl?: string | null; placeType?: PlaceType | null },
    nested?: boolean,
  ) => (
    <DetailModalSidebarItem
      key={entity.id}
      kind={kind}
      entityId={entity.id}
      name={entity.name}
      icon={sidebarEntityIcon(kind, entity)}
      isFavorite={isFavorite(kind, entity.id)}
      onToggleFavorite={() => toggleFavorite({ kind, targetId: entity.id, name: entity.name })}
      onNavigate={() => handleNavigate(kind, entity.id, entity.name)}
      nested={nested}
    />
  );

  const favoritesSection =
    favorites.length > 0 ? (
      <AccordionSection title="Favoris" count={favorites.length} defaultOpen>
        {favorites.map((f) => (
          <DetailModalSidebarItem
            key={`${f.kind}:${f.targetId}`}
            kind={f.kind}
            entityId={f.targetId}
            name={f.name}
            icon={sidebarEntityIcon(f.kind)}
            isFavorite
            onToggleFavorite={() => toggleFavorite(f)}
            onNavigate={() => handleNavigate(f.kind, f.targetId, f.name)}
          />
        ))}
      </AccordionSection>
    ) : null;

  if (point?.kind === 'city' && data) {
    const cityData = data as CityDetail;

    type DistrictRow = {
      id: string;
      name: string;
      places?: { id: string; name: string; iconUrl?: string | null; placeType?: PlaceType | null }[];
      persons?: { id: string; name: string }[];
    };
    const districts = (cityData.districts ?? []) as DistrictRow[];

    // Agréger TOUS les lieux : ceux des quartiers + ceux directement rattachés à la ville
    const allPlaces = [
      ...districts.flatMap((d) => d.places ?? []),
      ...(cityData.places ?? []),
    ];
    // Agréger TOUS les personnages
    const allPersons = [
      ...districts.flatMap((d) => d.persons ?? []),
      ...(cityData.persons ?? []),
    ];

    const hasKingdom = Boolean(cityData.kingdom);
    const hasOrgs = (cityData.organisations?.length ?? 0) > 0;
    const hasDistricts = districts.length > 0;
    const hasSidebar =
      favorites.length > 0 ||
      hasKingdom ||
      hasOrgs ||
      hasDistricts ||
      allPlaces.length > 0 ||
      allPersons.length > 0;

    if (!hasSidebar) return null;

    // Vue par quartier (fixe, sans accordéon) — uniquement les quartiers qui ont des enfants
    const districtsWithChildren = districts.filter(
      (d) => (d.places?.length ?? 0) > 0 || (d.persons?.length ?? 0) > 0,
    );

    return (
      <div className="detail-sidebar glass">
        <div className="detail-sidebar-list">
          {favoritesSection}

          {hasKingdom && cityData.kingdom && (
            <AccordionSection title="Royaume" count={1}>
              {renderEntity('kingdom', cityData.kingdom)}
            </AccordionSection>
          )}

          {hasOrgs && (
            <AccordionSection title="Organisations" count={cityData.organisations!.length}>
              {cityData.organisations!.map((org) => renderEntity('organisation', org))}
            </AccordionSection>
          )}

          {hasDistricts && (
            <AccordionSection title="Quartiers" count={districts.length}>
              {districts.map((d) => renderEntity('district', d))}
            </AccordionSection>
          )}

          {allPlaces.length > 0 && (
            <AccordionSection title="Lieux" count={allPlaces.length}>
              {allPlaces.map((p) => renderEntity('place', p))}
            </AccordionSection>
          )}

          {allPersons.length > 0 && (
            <AccordionSection title="Personnages" count={allPersons.length}>
              {allPersons.map((p) => renderEntity('person', p))}
            </AccordionSection>
          )}

          {/* Séparateur */}
          {districtsWithChildren.length > 0 && (
            <div className="detail-sidebar-district-separator" />
          )}

          {/* Vue par quartier — fixe, sans accordéon */}
          {districtsWithChildren.map((d) => (
            <div key={d.id} className="detail-sidebar-district-block">
              <div className="detail-sidebar-item-row">
                <button
                  type="button"
                  className="detail-sidebar-district-title ghost"
                  onClick={() => handleNavigate('district', d.id, d.name)}
                >
                  <span className="detail-sidebar-icon">🏘️</span>
                  <span>{d.name}</span>
                </button>
                <button
                  type="button"
                  className={`detail-sidebar-fav-btn ghost${isFavorite('district', d.id) ? ' active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite({ kind: 'district', targetId: d.id, name: d.name });
                  }}
                  aria-label={isFavorite('district', d.id) ? `Retirer ${d.name} des favoris` : `Ajouter ${d.name} aux favoris`}
                >
                  {isFavorite('district', d.id) ? '★' : '☆'}
                </button>
              </div>
              {(d.places ?? []).map((p) => renderEntity('place', p, true))}
              {(d.persons ?? []).map((p) => renderEntity('person', p, true))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const groupedEntities = point && data ? getGroupedEntities(point, data) : [];
  if (groupedEntities.length === 0 && favorites.length === 0) {
    return null;
  }

  return (
    <div className="detail-sidebar glass">
      <div className="detail-sidebar-list">
        {favoritesSection}
        {groupedEntities.map((group) => (
          <AccordionSection key={group.kind} title={group.label} count={group.entities.length}>
            {group.entities.map((entity) => renderEntity(entity.kind, entity))}
          </AccordionSection>
        ))}
      </div>
    </div>
  );
}
