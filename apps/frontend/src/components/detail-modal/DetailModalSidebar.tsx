import { useState } from 'react';
import type { EntityKind, NavigablePoint } from '../../api/map';
import type {
  CityDetail,
  DistrictDetail,
  KingdomDetail,
  OrganisationDetail,
  PersonDetail,
  PlaceDetail,
} from '../../api/entities';
import type { DetailModalProps, EntityData, ExtendedMapPoint } from './detailModalTypes';
import { iconForPlaceType } from './entityFormatters';
import type { PlaceType } from '../../api/entities';

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

type SidebarKind = 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation';

type SidebarEntity = { id: string; name: string; kind: SidebarKind; iconUrl?: string | null; placeType?: PlaceType | null };

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

  const kindLabels: Record<SidebarKind, string> = {
    kingdom: 'Royaume :',
    city: 'Ville :',
    district: 'Quartier :',
    place: 'Lieu :',
    person: 'Personne :',
    organisation: 'Organisation :',
  };

  const result: GroupedRow[] = [];
  const order: Array<'kingdom' | 'organisation' | 'city' | 'district' | 'place' | 'person'> = [
    'kingdom',
    'organisation',
    'city',
    'district',
    'place',
    'person',
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
  createMode?: DetailModalProps['createMode'];
};

export function DetailModalSidebar({ point, data, onNavigate, createMode }: Props) {
  if (!point && !createMode) return null;

  const handleNavigate = (kind: SidebarKind, id: string, name: string) => {
    if (onNavigate) {
      onNavigate({
        id,
        x: 0,
        y: 0,
        kind: kind as EntityKind,
        targetId: id,
        name,
        description: null,
      });
    }
  };

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
    const hasSidebar = hasKingdom || hasOrgs || hasDistricts || allPlaces.length > 0 || allPersons.length > 0;

    if (!hasSidebar) return null;

    // Vue par quartier (fixe, sans accordéon) — uniquement les quartiers qui ont des enfants
    const districtsWithChildren = districts.filter(
      (d) => (d.places?.length ?? 0) > 0 || (d.persons?.length ?? 0) > 0,
    );

    return (
      <div className="detail-sidebar glass">
        <div className="detail-sidebar-list">
          {/* Royaume */}
          {hasKingdom && cityData.kingdom && (
            <AccordionSection title="Royaume" count={1}>
              <button
                type="button"
                className="detail-sidebar-item ghost"
                onClick={() => handleNavigate('kingdom', cityData.kingdom!.id, cityData.kingdom!.name)}
              >
                <span className="detail-sidebar-icon">👑</span>
                <span className="detail-sidebar-name">{cityData.kingdom.name}</span>
              </button>
            </AccordionSection>
          )}

          {/* Organisations */}
          {hasOrgs && (
            <AccordionSection title="Organisations" count={cityData.organisations!.length}>
              {cityData.organisations!.map((org) => (
                <button
                  key={org.id}
                  type="button"
                  className="detail-sidebar-item ghost"
                  onClick={() => handleNavigate('organisation', org.id, org.name)}
                >
                  <span className="detail-sidebar-icon">🏛️</span>
                  <span className="detail-sidebar-name">{org.name}</span>
                </button>
              ))}
            </AccordionSection>
          )}

          {/* Quartiers — liste plate de tous les quartiers */}
          {hasDistricts && (
            <AccordionSection title="Quartiers" count={districts.length}>
              {districts.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className="detail-sidebar-item ghost"
                  onClick={() => handleNavigate('district', d.id, d.name)}
                >
                  <span className="detail-sidebar-icon">🏘️</span>
                  <span className="detail-sidebar-name">{d.name}</span>
                </button>
              ))}
            </AccordionSection>
          )}

          {/* Lieux — tous les lieux agrégés */}
          {allPlaces.length > 0 && (
            <AccordionSection title="Lieux" count={allPlaces.length}>
              {allPlaces.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="detail-sidebar-item ghost"
                  onClick={() => handleNavigate('place', p.id, p.name)}
                >
                  <span className="detail-sidebar-icon">
                    <img src={p.iconUrl ?? iconForPlaceType(p.placeType)} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', verticalAlign: 'middle' }} />
                  </span>
                  <span className="detail-sidebar-name">{p.name}</span>
                </button>
              ))}
            </AccordionSection>
          )}

          {/* Personnages — tous les personnages agrégés */}
          {allPersons.length > 0 && (
            <AccordionSection title="Personnages" count={allPersons.length}>
              {allPersons.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="detail-sidebar-item ghost"
                  onClick={() => handleNavigate('person', p.id, p.name)}
                >
                  <span className="detail-sidebar-icon">👤</span>
                  <span className="detail-sidebar-name">{p.name}</span>
                </button>
              ))}
            </AccordionSection>
          )}

          {/* Séparateur */}
          {districtsWithChildren.length > 0 && (
            <div className="detail-sidebar-district-separator" />
          )}

          {/* Vue par quartier — fixe, sans accordéon */}
          {districtsWithChildren.map((d) => (
            <div key={d.id} className="detail-sidebar-district-block">
              <button
                type="button"
                className="detail-sidebar-district-title ghost"
                onClick={() => handleNavigate('district', d.id, d.name)}
              >
                <span className="detail-sidebar-icon">🏘️</span>
                <span>{d.name}</span>
              </button>
              {(d.places ?? []).map((p) => (
                <button
                  key={`p-${p.id}`}
                  type="button"
                  className="detail-sidebar-item ghost detail-sidebar-nested"
                  onClick={() => handleNavigate('place', p.id, p.name)}
                >
                  <span className="detail-sidebar-icon">
                    <img src={p.iconUrl ?? iconForPlaceType(p.placeType)} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', verticalAlign: 'middle' }} />
                  </span>
                  <span className="detail-sidebar-name">{p.name}</span>
                </button>
              ))}
              {(d.persons ?? []).map((p) => (
                <button
                  key={`per-${p.id}`}
                  type="button"
                  className="detail-sidebar-item ghost detail-sidebar-nested"
                  onClick={() => handleNavigate('person', p.id, p.name)}
                >
                  <span className="detail-sidebar-icon">👤</span>
                  <span className="detail-sidebar-name">{p.name}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const groupedEntities = point && data ? getGroupedEntities(point, data) : [];
  if (groupedEntities.length === 0) {
    return null;
  }

  return (
    <div className="detail-sidebar glass">
      <div className="detail-sidebar-list">
        {groupedEntities.map((group) => (
          <AccordionSection key={group.kind} title={group.label} count={group.entities.length}>
            {group.entities.map((entity) => (
              <button
                key={entity.id}
                type="button"
                className="detail-sidebar-item ghost"
                onClick={() => handleNavigate(entity.kind, entity.id, entity.name)}
              >
                <span className="detail-sidebar-icon">
                  {entity.kind === 'kingdom' && '👑'}
                  {entity.kind === 'organisation' && '🏛️'}
                  {entity.kind === 'city' && '🏙️'}
                  {entity.kind === 'district' && '🏘️'}
                  {entity.kind === 'place' && (
                    <img src={entity.iconUrl ?? iconForPlaceType(entity.placeType)} alt="" style={{ width: '16px', height: '16px', objectFit: 'contain', verticalAlign: 'middle' }} />
                  )}
                  {entity.kind === 'person' && '👤'}
                </span>
                <span className="detail-sidebar-name">{entity.name}</span>
              </button>
            ))}
          </AccordionSection>
        ))}
      </div>
    </div>
  );
}
