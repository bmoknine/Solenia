import { withAuth } from './client';

type Base = { name: string; description?: string };

export type Kingdom = { id: string; name: string; color?: string | null; isForDM?: boolean };
export type City = { id: string; name: string; kingdomId?: string | null; iconUrl?: string | null; isForDM?: boolean };
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
export type Place = { id: string; name: string; cityId?: string | null; districtId?: string | null; kingdomId?: string | null; iconUrl?: string | null; isForDM?: boolean };
export type OrganisationType = 'CELLULE' | 'PRINCIPAL';
export type Organisation = { id: string; name: string; description?: string | null; organisationType?: OrganisationType | null; parentOrganisationId?: string | null; isForDM?: boolean };
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
  isForDM?: boolean;
};

// Types de base pour les références
type Ref = { id: string; name: string };
type CommentRef = { id: string; description: string; dateInGame?: string | null };

// Lore
export type LoreRef = { id: string; title: string; tag?: string | null; dateInGame?: number | null; isForDM?: boolean };
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
  isForDM?: boolean;
  kingdom?: Ref | null;
  districts?: Ref[];
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
  comments?: CommentRef[];
};

export type PlaceDetail = Place & {
  description?: string | null;
  iconUrl?: string | null;
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
  isForDM?: boolean;
  members?: Ref[];
  cities?: Ref[];
  places?: Ref[];
  kingdoms?: Ref[];
  parentOrganisation?: Ref | null;
  subOrganisations?: Ref[];
  lores?: LoreRef[];
};

export async function listKingdoms() {
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + '/kingdoms');
  if (!res.ok) throw new Error('Chargement royaumes échoué');
  const data = await res.json();
  return data as Kingdom[];
}

export async function listCities() {
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + '/cities');
  if (!res.ok) throw new Error('Chargement villes échoué');
  const data = await res.json();
  return data as City[];
}

export async function listDistricts() {
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + '/districts');
  if (!res.ok) throw new Error('Chargement quartiers échoué');
  const data = await res.json();
  return data as District[];
}

export async function listPlaces() {
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + '/places');
  if (!res.ok) throw new Error('Chargement lieux échoué');
  const data = await res.json();
  return data as Place[];
}

export async function listPersons() {
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + '/persons');
  if (!res.ok) throw new Error('Chargement personnages échoué');
  const data = await res.json();
  return data as Person[];
}

export async function getKingdom(id: string) {
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + `/kingdoms/${id}`);
  if (!res.ok) throw new Error('Chargement royaume échoué');
  return (await res.json()) as KingdomDetail;
}

export async function getCity(id: string) {
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + `/cities/${id}`);
  if (!res.ok) throw new Error('Chargement ville échoué');
  return (await res.json()) as CityDetail;
}

export async function getDistrict(id: string) {
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + `/districts/${id}`);
  if (!res.ok) throw new Error('Chargement quartier échoué');
  return (await res.json()) as DistrictDetail;
}

export async function getPlace(id: string) {
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + `/places/${id}`);
  if (!res.ok) throw new Error('Chargement lieu échoué');
  return (await res.json()) as PlaceDetail;
}

export async function getPerson(id: string) {
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + `/persons/${id}`);
  if (!res.ok) throw new Error('Chargement personnage échoué');
  return (await res.json()) as PersonDetail;
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
  }>,
) {
  return withAuth(token).put(`/kingdoms/${id}`, data);
}

export async function updateCity(
  token: string,
  id: string,
  data: Partial<{ name: string; description: string | null; iconUrl?: string | null; kingdomId?: string | null }>,
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
  data: Partial<{ name: string; description: string | null; iconUrl?: string | null; kingdomId?: string | null; cityId?: string | null; districtId?: string | null }>,
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

export async function createKingdom(token: string, data: Base & { population?: number; dateInGame?: string; color?: string | null }) {
  return withAuth(token).post('/kingdoms', data);
}

export async function createCity(token: string, data: Base & { kingdomId?: string }) {
  return withAuth(token).post('/cities', data);
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
  return withAuth(token).post('/districts', data);
}

export async function createPlace(token: string, data: Base & { iconUrl?: string; kingdomId?: string; cityId?: string; districtId?: string }) {
  return withAuth(token).post('/places', data);
}

export async function createPerson(
  token: string,
  data: Base & {
    kingdomId?: string;
    cityId?: string;
    districtId?: string;
    placeId?: string;
    membership?: string;
    languages?: string[];
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
  },
) {
  return withAuth(token).post('/persons', data);
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
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + '/organisations');
  if (!res.ok) throw new Error('Chargement organisations échoué');
  const data = await res.json();
  return data as Organisation[];
}export async function getOrganisation(id: string) {
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + `/organisations/${id}`);
  if (!res.ok) throw new Error('Chargement organisation échoué');
  return (await res.json()) as OrganisationDetail;
}

export async function createOrganisation(
  token: string,
  data: Base & {
    organisationType?: OrganisationType | null;
    parentOrganisationId?: string;
    kingdomIds?: string[];
    cityIds?: string[];
    placeIds?: string[];
    personIds?: string[];
  }
) {
  return withAuth(token).post('/organisations', data);
}

export async function updateOrganisation(
  token: string,
  id: string,
  data: Partial<{ 
    name: string; 
    description: string | null; 
    organisationType: OrganisationType | null;
    parentOrganisationId: string | null;
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
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + '/lores');
  if (!res.ok) throw new Error('Chargement lore échoué');
  const data = await res.json();
  return data as Lore[];
}

export async function getLore(id: string): Promise<LoreDetail> {
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + `/lores/${id}`);
  if (!res.ok) throw new Error('Chargement lore échoué');
  return (await res.json()) as LoreDetail;
}

export type LoreInput = {
  title: string;
  content: string;
  tag?: string | null;
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
  return withAuth(token).post('/lores', data);
}

export async function updateLore(token: string, id: string, data: Partial<LoreInput>) {
  return withAuth(token).put(`/lores/${id}`, data);
}

export async function deleteLore(token: string, id: string) {
  return withAuth(token).delete(`/lores/${id}`);
}
