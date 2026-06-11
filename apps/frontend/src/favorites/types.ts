import type { SearchableKind } from '../search/types';

export type FavoriteEntity = {
  kind: SearchableKind;
  targetId: string;
  name: string;
};

export function favoriteKey(kind: SearchableKind, targetId: string): string {
  return `${kind}:${targetId}`;
}
