import { apiGet, withAuth } from './client';

export type MapPoint = {
  id: string;
  x: number;
  y: number;
  kind: 'kingdom' | 'city' | 'place' | 'person' | 'unknown';
  targetId: string | null;
  name: string;
  description: string | null;
  iconUrl?: string | null;
};

export async function fetchMapPoints() {
  return apiGet<MapPoint[]>('/map/points');
}

export async function fetchMapPointsAuth(token?: string | null) {
  return withAuth(token).get<MapPoint[]>('/map/points');
}

export async function deleteTarget(kind: MapPoint['kind'], targetId: string, token: string) {
  const client = withAuth(token);
  switch (kind) {
    case 'kingdom':
      return client.delete(`/kingdoms/${targetId}`);
    case 'city':
      return client.delete(`/cities/${targetId}`);
    case 'place':
      return client.delete(`/places/${targetId}`);
    case 'person':
      return client.delete(`/persons/${targetId}`);
    default:
      throw new Error('Type non supporté pour suppression');
  }
}

