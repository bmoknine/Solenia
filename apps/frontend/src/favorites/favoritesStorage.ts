import type { FavoriteEntity } from './types';
import { favoriteKey } from './types';

const STORAGE_KEY = 'solenia.entityFavorites';

export function loadFavorites(): FavoriteEntity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is FavoriteEntity =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as FavoriteEntity).kind === 'string' &&
        typeof (item as FavoriteEntity).targetId === 'string' &&
        typeof (item as FavoriteEntity).name === 'string',
    );
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: FavoriteEntity[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavoriteInList(
  favorites: FavoriteEntity[],
  kind: FavoriteEntity['kind'],
  targetId: string,
): boolean {
  const key = favoriteKey(kind, targetId);
  return favorites.some((f) => favoriteKey(f.kind, f.targetId) === key);
}
