import { useCallback, useEffect, useState } from 'react';
import { fetchMapPointsAuth, type MapPoint } from '../api/map';

export function useMapPoints(token?: string | null) {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMapPointsAuth(token);
      setPoints(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  return { points, loading, error, reload: load };
}

