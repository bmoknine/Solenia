import type { CityDetail, DistrictDetail, OrganisationDetail, PersonDetail, PlaceDetail } from '../../api/entities';
import type { DetailModalProps, EditState, EntityData, OrganisationEditState, PersonEditState } from './detailModalTypes';

type MapEntityKind = 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation';

/** État formulaire par défaut au démarrage d’une création. */
export function defaultEditStateForCreate(createMode: NonNullable<DetailModalProps['createMode']>): EditState {
  if (createMode.kind === 'kingdom') {
    return { kind: 'kingdom', name: '', description: null, population: null, dateInGame: null, color: null, flag: null };
  }
  if (createMode.kind === 'city') {
    return { kind: 'city', name: '', description: null, iconUrl: null, map: null, flag: null, kingdomId: null };
  }
  if (createMode.kind === 'district') {
    return {
      kind: 'district',
      name: '',
      motto: null,
      ambiance: null,
      content: null,
      rumors: null,
      secret: null,
      cityId: createMode.parentCityId || '',
    };
  }
  if (createMode.kind === 'place') {
    return {
      kind: 'place',
      name: '',
      description: null,
      map: null,
      kingdomId: null,
      cityId: null,
      districtId: null,
      organisationIds: [] as string[],
      showOnMap: true,
    };
  }
  if (createMode.kind === 'organisation') {
    return {
      kind: 'organisation',
      name: '',
      description: null,
      organisationType: null,
      membership: null,
      parentOrganisationId: null,
      flag: null,
      kingdomIds: [],
      cityIds: [],
      placeIds: [],
      personIds: [],
    };
  }
  if (createMode.kind === 'lore') {
    return {
      kind: 'lore',
      title: '',
      content: '',
      tags: [],
      dateInGame: null,
      summary: null,
      kingdomIds: [],
      cityIds: [],
      placeIds: [],
      personIds: [],
      organisationIds: [],
    };
  }
  return {
    kind: 'person',
    name: '',
    description: null,
    breed: null,
    sex: null,
    languages: [],
    kingdomId: null,
    cityId: null,
    districtId: null,
    placeId: null,
    organisationIds: [],
    pv: null,
    ca: null,
    showOnMap: true,
    STR: 10,
    DEX: 10,
    CON: 10,
    INT: 10,
    WIS: 10,
    CHA: 10,
  };
}

/** Construit l’état d’édition après chargement d’une entité depuis la carte. */
export function buildEditStateFromFetchedEntity(kind: MapEntityKind, result: EntityData): EditState | null {
  if (!result) return null;
  if (kind === 'person') {
    const pr = result as PersonDetail;
    return {
      kind: 'person' as const,
      ...result,
      kingdomId: pr.kingdom?.id ?? null,
      cityId: pr.city?.id ?? null,
      placeId: pr.place?.id ?? null,
      organisationIds: pr.organisations?.map((o) => o.id) ?? [],
    } as PersonEditState;
  }
  if (kind === 'organisation') {
    return {
      kind: 'organisation' as const,
      ...result,
      organisationType: (result as OrganisationDetail).organisationType ?? null,
      parentOrganisationId: (result as OrganisationDetail).parentOrganisation?.id ?? null,
      kingdomIds: (result as OrganisationDetail).kingdoms?.map((k) => k.id) || [],
      cityIds: (result as OrganisationDetail).cities?.map((c) => c.id) || [],
      placeIds: (result as OrganisationDetail).places?.map((p) => p.id) || [],
      personIds: (result as OrganisationDetail).members?.map((m) => m.id) || [],
    } as OrganisationEditState;
  }
  if (kind === 'kingdom') {
    return { kind: 'kingdom' as const, ...result } as EditState;
  }
  if (kind === 'city') {
    return {
      kind: 'city' as const,
      ...result,
      kingdomId: (result as CityDetail).kingdom?.id ?? null,
    } as EditState;
  }
  if (kind === 'district') {
    return {
      kind: 'district' as const,
      ...result,
      cityId: (result as DistrictDetail).cityId,
    } as EditState;
  }
  if (kind === 'place') {
    return {
      kind: 'place' as const,
      ...result,
      kingdomId: (result as PlaceDetail).kingdom?.id ?? null,
      cityId: (result as PlaceDetail).city?.id ?? null,
      districtId: (result as PlaceDetail).district?.id ?? null,
      organisationIds: (result as PlaceDetail).organisations?.map((o) => o.id) ?? [],
    } as EditState;
  }
  const _exhaustive: never = kind;
  throw new Error(`buildEditStateFromFetchedEntity: kind inattendu ${String(_exhaustive)}`);
}

/** Reconstruit l’état d’édition après une sauvegarde et un re-fetch. */
export function buildEditStateAfterSaveRefetch(kind: MapEntityKind, refreshed: EntityData): EditState {
  if (kind === 'person') {
    const pr = refreshed as PersonDetail;
    return {
      kind: 'person' as const,
      ...refreshed,
      kingdomId: pr.kingdom?.id ?? null,
      cityId: pr.city?.id ?? null,
      placeId: pr.place?.id ?? null,
      organisationIds: pr.organisations?.map((o) => o.id) ?? [],
    } as PersonEditState;
  }
  if (kind === 'organisation') {
    return {
      kind: 'organisation' as const,
      ...refreshed,
      organisationType: (refreshed as OrganisationDetail).organisationType ?? null,
      parentOrganisationId: (refreshed as OrganisationDetail).parentOrganisation?.id ?? null,
      kingdomIds: (refreshed as OrganisationDetail).kingdoms?.map((k) => k.id) || [],
      cityIds: (refreshed as OrganisationDetail).cities?.map((c) => c.id) || [],
      placeIds: (refreshed as OrganisationDetail).places?.map((p) => p.id) || [],
      personIds: (refreshed as OrganisationDetail).members?.map((m) => m.id) || [],
    } as OrganisationEditState;
  }
  if (kind === 'place') {
    const pr = refreshed as PlaceDetail;
    return {
      kind: 'place' as const,
      ...pr,
      kingdomId: pr.kingdom?.id ?? null,
      cityId: pr.city?.id ?? null,
      districtId: pr.district?.id ?? null,
      organisationIds: pr.organisations?.map((o) => o.id) ?? [],
    } as EditState;
  }
  return { kind, ...refreshed } as EditState;
}
