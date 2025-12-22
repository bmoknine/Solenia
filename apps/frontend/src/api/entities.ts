import { withAuth } from './client';

type Base = { name: string; description?: string };

export type Kingdom = { id: string; name: string };
export type City = { id: string; name: string; kingdomId?: string | null };
export type Place = { id: string; name: string; cityId?: string | null; kingdomId?: string | null };
export type Person = {
  id: string;
  name: string;
  description?: string | null;
  membership?: string | null;
  languages: string[];
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
};
export type KingdomDetail = Kingdom & { description?: string | null; population?: number | null; dateInGame?: string | null };

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

export async function getPerson(id: string) {
  const res = await fetch((import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + `/persons/${id}`);
  if (!res.ok) throw new Error('Chargement personnage échoué');
  return (await res.json()) as Person;
}

export async function createKingdom(token: string, data: Base & { population?: number; dateInGame?: string }) {
  return withAuth(token).post('/kingdoms', data);
}

export async function createCity(token: string, data: Base & { kingdomId?: string }) {
  return withAuth(token).post('/cities', data);
}

export async function createPlace(token: string, data: Base & { kingdomId?: string; cityId?: string }) {
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

