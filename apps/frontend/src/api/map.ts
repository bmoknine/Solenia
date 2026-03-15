import { apiGet, withAuth } from './client';

// Type pour les entités navigables (inclut district même s'il n'est pas sur la map)
export type EntityKind = 'kingdom' | 'city' | 'district' | 'place' | 'person';

export type MapPoint = {
  id: string;
  x: number;
  y: number;
  kind: 'kingdom' | 'city' | 'place' | 'person' | 'unknown';
  targetId: string | null;
  name: string;
  description: string | null;
  iconUrl?: string | null;
  /** Couleur du royaume (point par défaut) ou des villes (appliquée à l'icône) */
  kingdomColor?: string | null;
};

// Type étendu pour la navigation interne (inclut district)
export type NavigablePoint = MapPoint & {
  kind: EntityKind | 'unknown';
};

export async function fetchMapPoints() {
  return apiGet<MapPoint[]>('/map/points');
}

export async function fetchMapPointsAuth(token?: string | null) {
  return withAuth(token).get<MapPoint[]>('/map/points');
}

export async function deleteTarget(kind: MapPoint['kind'] | EntityKind | 'organisation', targetId: string, token: string) {
  const client = withAuth(token);
  switch (kind) {
    case 'kingdom':
      return client.delete(`/kingdoms/${targetId}`);
    case 'city':
      return client.delete(`/cities/${targetId}`);
    case 'district':
      return client.delete(`/districts/${targetId}`);
    case 'place':
      return client.delete(`/places/${targetId}`);
    case 'person':
      return client.delete(`/persons/${targetId}`);
    case 'organisation':
      return client.delete(`/organisations/${targetId}`);
    default:
      throw new Error('Type non supporté pour suppression');
  }
}

