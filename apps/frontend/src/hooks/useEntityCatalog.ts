import { useCallback, useEffect, useState } from 'react';
import { type EntityCatalog, fetchEntityCatalog } from '../search/entityCatalog';

export function useEntityCatalog(enabled: boolean) {
  const [catalog, setCatalog] = useState<EntityCatalog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      setCatalog(await fetchEntityCatalog());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chargement du catalogue échoué');
      setCatalog(null);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { catalog, loading, error, reload };
}
