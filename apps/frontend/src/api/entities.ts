import { withAuth } from './client';

type Base = { name: string; description?: string };

export type Kingdom = { id: string; name: string };
export type City = { id: string; name: string; kingdomId?: string | null; iconUrl?: string | null };
export type Place = { id: string; name: string; cityId?: string | null; kingdomId?: string | null; iconUrl?: string | null };
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
};

// Types de base pour les références
type Ref = { id: string; name: string };
type CommentRef = { id: string; description: string; dateInGame?: string | null };

// Types détaillés avec relations
export type KingdomDetail = Kingdom & {
  description?: string | null;
  population?: number | null;
  dateInGame?: string | null;
  cities?: Ref[];
  places?: Ref[];
  persons?: Ref[];
  comments?: CommentRef[];
};

export type CityDetail = City & {
  description?: string | null;
  iconUrl?: string | null;
  kingdom?: Ref | null;
  places?: Ref[];
  persons?: Ref[];
  comments?: CommentRef[];
};

export type PlaceDetail = Place & {
  description?: string | null;
  iconUrl?: string | null;
  kingdom?: Ref | null;
  city?: Ref | null;
  persons?: Ref[];
  comments?: CommentRef[];
};

export type PersonDetail = Person & {
  imageUrl?: string | null;
  kingdom?: Ref | null;
  city?: Ref | null;
  place?: Ref | null;
  comments?: CommentRef[];
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

export async function listPlaces() {
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + '/places');
  if (!res.ok) throw new Error('Chargement lieux échoué');
  const data = await res.json();
  return data as Place[];
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

export async function updatePlace(
  token: string,
  id: string,
  data: Partial<{ name: string; description: string | null; iconUrl?: string | null; kingdomId?: string | null; cityId?: string | null }>,
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
    placeId?: string | null;
  }>,
) {
  return withAuth(token).put(`/persons/${id}`, data);
}

export async function createKingdom(token: string, data: Base & { population?: number; dateInGame?: string }) {
  return withAuth(token).post('/kingdoms', data);
}

export async function createCity(token: string, data: Base & { kingdomId?: string }) {
  return withAuth(token).post('/cities', data);
}

export async function createPlace(token: string, data: Base & { iconUrl?: string; kingdomId?: string; cityId?: string }) {
  return withAuth(token).post('/places', data);
}

export async function createPerson(
  token: string,
  data: Base & {
    kingdomId?: string;
    cityId?: string;
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

