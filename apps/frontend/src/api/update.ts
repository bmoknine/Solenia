import { withAuth } from './client';

export async function updateKingdom(token: string, id: string, data: Record<string, unknown>) {
  return withAuth(token).post(`/kingdoms/${id}`, data, { method: 'PUT' });
}

export async function updateCity(token: string, id: string, data: Record<string, unknown>) {
  return withAuth(token).post(`/cities/${id}`, data, { method: 'PUT' });
}

export async function updatePlace(token: string, id: string, data: Record<string, unknown>) {
  return withAuth(token).post(`/places/${id}`, data, { method: 'PUT' });
}

export async function updatePerson(token: string, id: string, data: Record<string, unknown>) {
  return withAuth(token).post(`/persons/${id}`, data, { method: 'PUT' });
}

