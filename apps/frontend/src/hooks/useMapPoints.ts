import { useCallback, useEffect, useState } from 'react';
import { fetchMapPointsAuth, type MapPoint } from '../api/map';

export function useMapPoints(token?: string | null) {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4b615a6a-3388-40b4-9df2-ee03a04a8c5a',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'run1',
        hypothesisId:'H-fetch',
        location:'hooks/useMapPoints.ts:load',
        message:'load start',
        data:{hasToken:!!token},
        timestamp:Date.now()
      })
    }).catch(()=>{});
    // #endregion
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMapPointsAuth(token);
      setPoints(data);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/4b615a6a-3388-40b4-9df2-ee03a04a8c5a',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          sessionId:'debug-session',
          runId:'run1',
          hypothesisId:'H-fetch',
          location:'hooks/useMapPoints.ts:load',
          message:'load success',
          data:{count:data.length},
          timestamp:Date.now()
        })
      }).catch(()=>{});
      // #endregion
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(message);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/4b615a6a-3388-40b4-9df2-ee03a04a8c5a',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          sessionId:'debug-session',
          runId:'run1',
          hypothesisId:'H-fetch',
          location:'hooks/useMapPoints.ts:load',
          message:'load error',
          data:{message},
          timestamp:Date.now()
        })
      }).catch(()=>{});
      // #endregion
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  return { points, loading, error, reload: load };
}

