import { apiGet, withAuth } from './client';

// Type pour les entités navigables (inclut district même s'il n'est pas sur la map)
export type EntityKind = 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation' | 'playerCharacter';

export type MapPoint = {
  id: string;
  x: number;
  y: number;
  kind: 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'unknown' | 'organisation' | 'playerCharacter';
  targetId: string | null;
  name: string;
  description: string | null;
  iconUrl?: string | null;
  /** URL du drapeau (remplace l’icône sur la carte si défini) */
  flag?: string | null;
  /** Couleur du royaume (point par défaut) ou des villes (appliquée à l'icône) */
  kingdomColor?: string | null;
};

// Type étendu pour la navigation interne (inclut district)
export type NavigablePoint = MapPoint & {
  kind: EntityKind | 'unknown';
};

/** Un anneau = une bulle fermée (sommets [x, y] en ratio 0..1). */
export type BorderRing = [number, number][];
/** Frontière = un ou plusieurs anneaux (archipels / enclaves). */
export type BorderRings = BorderRing[];

/** Frontière d'un royaume à dessiner sur la carte : plusieurs anneaux possibles. */
export type KingdomBorder = {
  id: string;
  name: string;
  color: string | null;
  rings: BorderRings;
};

/**
 * Normalise une valeur `borderPoints` brute (venue de la BDD) en tableau d'anneaux.
 * Accepte le format legacy (anneau simple `[x,y][]`) et le format multi-anneaux (`[x,y][][]`).
 * Renvoie `[]` si vide/invalide.
 */
export function toBorderRings(raw: unknown): BorderRings {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  const first = raw[0];
  // Anneau simple : premier élément = paire de nombres [x, y].
  if (Array.isArray(first) && typeof first[0] === 'number') {
    return [raw as BorderRing];
  }
  // Multi-anneaux : premier élément = un anneau (tableau de paires).
  return raw as BorderRings;
}

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
    case 'playerCharacter':
      return client.delete(`/player-characters/${targetId}`);
    default:
      throw new Error('Type non supporté pour suppression');
  }
}

