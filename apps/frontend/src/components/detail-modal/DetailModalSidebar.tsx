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

type SidebarKind = 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation';

type SidebarEntity = { id: string; name: string; kind: SidebarKind };

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
      groups.set('place', kingdomData.places.map((p) => ({ id: p.id, name: p.name, kind: 'place' as const })));
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
      groups.set('place', districtData.places.map((p) => ({ id: p.id, name: p.name, kind: 'place' as const })));
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
    const districts = (cityData.districts ?? []) as Array<{
      id: string;
      name: string;
      places?: { id: string; name: string }[];
      persons?: { id: string; name: string }[];
    }>;
    const districtsWithChildren = districts.filter(
      (d) => (d.places?.length ?? 0) > 0 || (d.persons?.length ?? 0) > 0,
    );
    const districtsEmpty = districts.filter((d) => (d.places?.length ?? 0) === 0 && (d.persons?.length ?? 0) === 0);

    const hasKingdom = Boolean(cityData.kingdom);
    const hasOrgs = (cityData.organisations?.length ?? 0) > 0;
    const hasCityPlaces = (cityData.places?.length ?? 0) > 0;
    const hasCityPersons = (cityData.persons?.length ?? 0) > 0;
    const hasSidebar =
      hasKingdom ||
      hasOrgs ||
      districtsWithChildren.length > 0 ||
      districtsEmpty.length > 0 ||
      hasCityPlaces ||
      hasCityPersons;

    if (!hasSidebar) return null;

    return (
      <div className="detail-sidebar glass">
        <div className="detail-sidebar-list">
          {hasKingdom && cityData.kingdom && (
            <div style={{ marginBottom: '16px' }}>
              <h3 className="section-title detail-sidebar-section-title">Royaume :</h3>
              <button
                type="button"
                className="detail-sidebar-item ghost"
                onClick={() => handleNavigate('kingdom', cityData.kingdom!.id, cityData.kingdom!.name)}
              >
                <span className="detail-sidebar-icon">👑</span>
                <span className="detail-sidebar-name">{cityData.kingdom.name}</span>
              </button>
            </div>
          )}
          {hasOrgs && (
            <div style={{ marginBottom: '16px' }}>
              <h3 className="section-title detail-sidebar-section-title">Organisations :</h3>
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
            </div>
          )}
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
                  <span className="detail-sidebar-icon">📍</span>
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
          {districtsEmpty.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h3 className="section-title detail-sidebar-section-title">Quartiers :</h3>
              {districtsEmpty.map((d) => (
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
            </div>
          )}
          {hasCityPlaces && (
            <div style={{ marginBottom: '16px' }}>
              <h3 className="section-title detail-sidebar-section-title">Lieux (ville) :</h3>
              {cityData.places!.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="detail-sidebar-item ghost"
                  onClick={() => handleNavigate('place', p.id, p.name)}
                >
                  <span className="detail-sidebar-icon">📍</span>
                  <span className="detail-sidebar-name">{p.name}</span>
                </button>
              ))}
            </div>
          )}
          {hasCityPersons && (
            <div style={{ marginBottom: '16px' }}>
              <h3 className="section-title detail-sidebar-section-title">Personnages (ville) :</h3>
              {cityData.persons!.map((p) => (
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
            </div>
          )}
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
          <div key={group.kind} style={{ marginBottom: '16px' }}>
            <h3 className="section-title detail-sidebar-section-title">{group.label}</h3>
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
                  {entity.kind === 'place' && '📍'}
                  {entity.kind === 'person' && '👤'}
                </span>
                <span className="detail-sidebar-name">{entity.name}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
