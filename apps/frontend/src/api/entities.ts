import { withAuth } from './client';

type Base = { name: string; description?: string };

export type Kingdom = { id: string; name: string; color?: string | null; flag?: string | null; isForDM?: boolean };
export type City = { id: string; name: string; kingdomId?: string | null; iconUrl?: string | null; map?: string | null; flag?: string | null; isForDM?: boolean };
export type District = { 
  id: string; 
  name: string; 
  cityId: string;
  motto?: string | null;
  ambiance?: string | null;
  content?: string | null;
  rumors?: string | null;
  secret?: string | null;
};
export type Place = { id: string; name: string; cityId?: string | null; districtId?: string | null; kingdomId?: string | null; iconUrl?: string | null; map?: string | null; showOnMap?: boolean; isForDM?: boolean };
export type OrganisationType = 'CELLULE' | 'PRINCIPAL';
export type Organisation = { id: string; name: string; description?: string | null; organisationType?: OrganisationType | null; parentOrganisationId?: string | null; flag?: string | null; isForDM?: boolean };
export type Breed = 'ELFE' | 'HALFELIN' | 'HUMAIN' | 'NAIN' | 'DEMI_ELFE' | 'DEMI_ORC' | 'DRAKEIDE' | 'GNOME' | 'TIEFFELIN' | 'AASIMAR' | 'GENASIAIR' | 'GENASITERRE' | 'GENASIFEUR' | 'GENASIEAU' | 'GOLIATH' | 'OTHER';
export type Sex = 'MAN' | 'WOMAN' | 'OTHER';
export type Membership = 'POLITIC' | 'RELIGEUX' | 'MARCHAND' | 'CCCH' | 'CRIMINALITE' | 'OTHER';
export type Language = 'COMMUN' | 'NAIN' | 'ELFIQUE' | 'GNOME' | 'HALFELIN' | 'ORC' | 'GOBELIN' | 'GEANT' | 'DRACONIQUE' | 'SYLVESTRE' | 'INFERNAL' | 'ABYSSAL' | 'CELESTE' | 'PRIMORDIAL' | 'AQUAN' | 'AURAN' | 'IGNAN' | 'TERRAN' | 'PROFOND' | 'SLAADI' | 'TELEPATHIQUE' | 'ARGOT_VOLEUR';

export type Person = {
  id: string;
  name: string;
  description?: string | null;
  breed?: Breed | null;
  sex?: Sex | null;
  membership?: Membership | null;
  languages: Language[];
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
  pv?: number | null;
  ca?: number | null;
  showOnMap?: boolean;
  isForDM?: boolean;
};

// Types de base pour les références
type Ref = { id: string; name: string };
type CommentRef = { id: string; description: string; dateInGame?: string | null };

// Lore
export type LoreRef = { id: string; title: string; tags?: string[]; dateInGame?: number | null; isForDM?: boolean };
export type Lore = LoreRef & { content?: string; summary?: string | null };
export type LoreDetail = LoreRef & { content: string; summary?: string | null } & {
  kingdoms?: Ref[];
  cities?: Ref[];
  places?: Ref[];
  persons?: Ref[];
  organisations?: Ref[];
};

// Types détaillés avec relations
export type KingdomDetail = Kingdom & {
  description?: string | null;
  population?: number | null;
  dateInGame?: string | null;
  color?: string | null;
  flag?: string | null;
  isForDM?: boolean;
  cities?: Ref[];
  places?: Ref[];
  persons?: Ref[];
  organisations?: Ref[];
  lores?: LoreRef[];
  comments?: CommentRef[];
};

export type CityDetail = City & {
  description?: string | null;
  iconUrl?: string | null;
  map?: string | null;
  flag?: string | null;
  isForDM?: boolean;
  kingdom?: Ref | null;
  /** Quartiers avec lieux / personnages rattachés (GET ville enrichi) */
  districts?: Array<Ref & { places?: Ref[]; persons?: Ref[] }>;
  /** Lieux directement rattachés à la ville (sans quartier) */
  places?: Ref[];
  persons?: Ref[];
  comments?: CommentRef[];
  organisations?: Ref[];
  lores?: LoreRef[];
};

export type DistrictDetail = District & {
  city?: Ref | null;
  places?: Ref[];
  persons?: Ref[];
  lores?: LoreRef[];
  comments?: CommentRef[];
};

export type PlaceDetail = Place & {
  description?: string | null;
  iconUrl?: string | null;
  map?: string | null;
  isForDM?: boolean;
  kingdom?: Ref | null;
  city?: Ref | null;
  district?: Ref | null;
  persons?: Ref[];
  comments?: CommentRef[];
  organisations?: Ref[];
  lores?: LoreRef[];
};

export type PersonDetail = Person & {
  imageUrl?: string | null;
  isForDM?: boolean;
  kingdom?: Ref | null;
  city?: Ref | null;
  district?: Ref | null;
  place?: Ref | null;
  comments?: CommentRef[];
  organisations?: Ref[];
  lores?: LoreRef[];
};

export type OrganisationDetail = Organisation & {
  flag?: string | null;
  isForDM?: boolean;
  members?: Ref[];
  cities?: Ref[];
  places?: Ref[];
  kingdoms?: Ref[];
  parentOrganisation?: Ref | null;
  subOrganisations?: Ref[];
  lores?: LoreRef[];
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

/** GET JSON public (sans auth) ; une seule responsabilité : fetch + erreur métier. */
async function getPublicJson<T>(path: string, errorMessage: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(errorMessage);
  return (await res.json()) as T;
}

export async function getFlags(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/flags`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data?.flags) ? data.flags : [];
}

export async function getMaps(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/maps`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data?.maps) ? data.maps : [];
}

export async function listKingdoms() {
  return getPublicJson<Kingdom[]>('/kingdoms', 'Chargement royaumes échoué');
}

export async function listCities() {
  return getPublicJson<City[]>('/cities', 'Chargement villes échoué');
}

export async function listDistricts() {
  return getPublicJson<District[]>('/districts', 'Chargement quartiers échoué');
}

export async function listPlaces() {
  return getPublicJson<Place[]>('/places', 'Chargement lieux échoué');
}

export async function listPersons() {
  return getPublicJson<Person[]>('/persons', 'Chargement personnages échoué');
}

export async function getKingdom(id: string) {
  return getPublicJson<KingdomDetail>(`/kingdoms/${id}`, 'Chargement royaume échoué');
}

export async function getCity(id: string) {
  return getPublicJson<CityDetail>(`/cities/${id}`, 'Chargement ville échoué');
}

export async function getDistrict(id: string) {
  return getPublicJson<DistrictDetail>(`/districts/${id}`, 'Chargement quartier échoué');
}

export async function getPlace(id: string) {
  return getPublicJson<PlaceDetail>(`/places/${id}`, 'Chargement lieu échoué');
}

export async function getPerson(id: string) {
  return getPublicJson<PersonDetail>(`/persons/${id}`, 'Chargement personnage échoué');
}

export async function updateKingdom(
  token: string,
  id: string,
  data: Partial<{
    name: string;
    description: string | null;
    population: number | null;
    dateInGame: string | null;
    color: string | null;
    flag: string | null;
  }>,
) {
  return withAuth(token).put(`/kingdoms/${id}`, data);
}

export async function updateCity(
  token: string,
  id: string,
  data: Partial<{ name: string; description: string | null; iconUrl?: string | null; map?: string | null; flag?: string | null; kingdomId?: string | null }>,
) {
  return withAuth(token).put(`/cities/${id}`, data);
}

export async function updateDistrict(
  token: string,
  id: string,
  data: Partial<{
    name: string;
    motto: string | null;
    ambiance: string | null;
    content: string | null;
    rumors: string | null;
    secret: string | null;
    cityId: string;
  }>,
) {
  return withAuth(token).put(`/districts/${id}`, data);
}

export async function updatePlace(
  token: string,
  id: string,
  data: Partial<{
    name: string;
    description: string | null;
    iconUrl?: string | null;
    map?: string | null;
    kingdomId?: string | null;
    cityId?: string | null;
    districtId?: string | null;
    organisationIds?: string[];
    showOnMap?: boolean;
  }>,
) {
  return withAuth(token).put(`/places/${id}`, data);
}

export async function updatePerson(
  token: string,
  id: string,
  data: Partial<{
    name: string;
    description: string | null;
    breed?: Breed | null;
    sex?: Sex | null;
    membership?: Membership | null;
    languages?: Language[];
    pv?: number | null;
    ca?: number | null;
    showOnMap?: boolean;
    STR?: number;
    DEX?: number;
    CON?: number;
    INT?: number;
    WIS?: number;
    CHA?: number;
    kingdomId?: string | null;
    cityId?: string | null;
    districtId?: string | null;
    placeId?: string | null;
  }>,
) {
  return withAuth(token).put(`/persons/${id}`, data);
}

export async function createKingdom(token: string, data: Base & { population?: number; dateInGame?: string; color?: string | null; flag?: string | null }) {
  return withAuth(token).post<{ id: string }>('/kingdoms', data);
}

export async function createCity(token: string, data: Base & { kingdomId?: string; iconUrl?: string | null; map?: string | null; flag?: string | null }) {
  return withAuth(token).post<{ id: string }>('/cities', data);
}

export async function createDistrict(
  token: string,
  data: Base & {
    cityId: string;
    motto?: string;
    ambiance?: string;
    content?: string;
    rumors?: string;
    secret?: string;
  },
) {
  return withAuth(token).post<{ id: string }>('/districts', data);
}

export async function createPlace(
  token: string,
  data: Base & {
    iconUrl?: string;
    map?: string | null;
    kingdomId?: string;
    cityId?: string;
    districtId?: string;
    organisationIds?: string[];
    showOnMap?: boolean;
  },
) {
  return withAuth(token).post<{ id: string }>('/places', data);
}

export async function createPerson(
  token: string,
  data: Base & {
    breed?: Breed | null;
    sex?: Sex | null;
    kingdomId?: string;
    cityId?: string;
    districtId?: string;
    placeId?: string;
    membership?: string;
    languages?: string[];
    pv?: number | null;
    ca?: number | null;
    showOnMap?: boolean;
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
  },
) {
  return withAuth(token).post<{ id: string }>('/persons', data);
}

export async function updatePosition(
  token: string,
  data:
    | { kingdomId: string; cityId?: never; placeId?: never; personOfInterestId?: never; x: number; y: number }
    | { kingdomId?: never; cityId: string; placeId?: never; personOfInterestId?: never; x: number; y: number }
    | { kingdomId?: never; cityId?: never; placeId: string; personOfInterestId?: never; x: number; y: number }
    | { kingdomId?: never; cityId?: never; placeId?: never; personOfInterestId: string; x: number; y: number },
) {
  return withAuth(token).post('/positions', data);
}

// Organisation API functions
export async function listOrganisations() {
  return getPublicJson<Organisation[]>('/organisations', 'Chargement organisations échoué');
}

export async function getOrganisation(id: string) {
  return getPublicJson<OrganisationDetail>(`/organisations/${id}`, 'Chargement organisation échoué');
}

export async function createOrganisation(
  token: string,
  data: Base & {
    organisationType?: OrganisationType | null;
    parentOrganisationId?: string;
    flag?: string | null;
    kingdomIds?: string[];
    cityIds?: string[];
    placeIds?: string[];
    personIds?: string[];
  },
) {
  return withAuth(token).post<{ id: string }>('/organisations', data);
}

export async function updateOrganisation(
  token: string,
  id: string,
  data: Partial<{ 
    name: string; 
    description: string | null; 
    organisationType: OrganisationType | null;
    parentOrganisationId: string | null;
    flag: string | null;
    kingdomIds?: string[];
    cityIds?: string[];
    placeIds?: string[];
    personIds?: string[];
  }>,
) {
  return withAuth(token).put(`/organisations/${id}`, data);
}

export async function deleteOrganisation(token: string, id: string) {
  return withAuth(token).delete(`/organisations/${id}`);
}

export async function addOrganisationMember(token: string, organisationId: string, personId: string) {
  return withAuth(token).post(`/organisations/${organisationId}/members`, { personId });
}

export async function removeOrganisationMember(token: string, organisationId: string, personId: string) {
  return withAuth(token).delete(`/organisations/${organisationId}/members/${personId}`);
}

export async function addOrganisationCity(token: string, organisationId: string, cityId: string) {
  return withAuth(token).post(`/organisations/${organisationId}/cities`, { cityId });
}

export async function removeOrganisationCity(token: string, organisationId: string, cityId: string) {
  return withAuth(token).delete(`/organisations/${organisationId}/cities/${cityId}`);
}

export async function addOrganisationPlace(token: string, organisationId: string, placeId: string) {
  return withAuth(token).post(`/organisations/${organisationId}/places`, { placeId });
}

export async function removeOrganisationPlace(token: string, organisationId: string, placeId: string) {
  return withAuth(token).delete(`/organisations/${organisationId}/places/${placeId}`);
}

// Lore API
export async function listLores(): Promise<Lore[]> {
  return getPublicJson<Lore[]>('/lores', 'Chargement lore échoué');
}

export async function getLore(id: string): Promise<LoreDetail> {
  return getPublicJson<LoreDetail>(`/lores/${id}`, 'Chargement lore échoué');
}

export type LoreInput = {
  title: string;
  content: string;
  tags?: string[];
  dateInGame?: number | null;
  summary?: string | null;
  isForDM?: boolean;
  kingdomIds?: string[];
  cityIds?: string[];
  placeIds?: string[];
  personIds?: string[];
  organisationIds?: string[];
};

export async function createLore(token: string, data: LoreInput) {
  return withAuth(token).post<{ id: string }>('/lores', data);
}

export async function updateLore(token: string, id: string, data: Partial<LoreInput>) {
  return withAuth(token).put(`/lores/${id}`, data);
}

export async function deleteLore(token: string, id: string) {
  return withAuth(token).delete(`/lores/${id}`);
}
