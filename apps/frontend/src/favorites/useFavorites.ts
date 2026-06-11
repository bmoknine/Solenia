import { useCallback, useEffect, useState } from 'react';
import type { SearchableKind } from '../search/types';
import { isFavoriteInList, loadFavorites, saveFavorites } from './favoritesStorage';
import type { FavoriteEntity } from './types';
import { favoriteKey } from './types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteEntity[]>(() => loadFavorites());

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const isFavorite = useCallback(
    (kind: SearchableKind, targetId: string) => isFavoriteInList(favorites, kind, targetId),
    [favorites],
  );

  const toggleFavorite = useCallback((entry: FavoriteEntity) => {
    const key = favoriteKey(entry.kind, entry.targetId);
    setFavorites((prev) => {
      const exists = prev.some((f) => favoriteKey(f.kind, f.targetId) === key);
      if (exists) return prev.filter((f) => favoriteKey(f.kind, f.targetId) !== key);
      return [...prev, entry];
    });
  }, []);

  const renameFavorite = useCallback((kind: SearchableKind, targetId: string, name: string) => {
    const key = favoriteKey(kind, targetId);
    setFavorites((prev) =>
      prev.map((f) => (favoriteKey(f.kind, f.targetId) === key ? { ...f, name } : f)),
    );
  }, []);

  return { favorites, isFavorite, toggleFavorite, renameFavorite };
}
