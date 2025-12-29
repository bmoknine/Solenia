import './App.css';
import 'leaflet/dist/leaflet.css';
import { MapView } from './components/MapView';
import { useMapPoints } from './hooks/useMapPoints';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { deleteTarget } from './api/map';
import type { MapPoint } from './api/map';
import { updatePosition } from './api/entities';
import { EditDrawer } from './components/EditDrawer';
import { ToastProvider, useToast } from './toast/ToastProvider';
import { ConfirmDialog } from './components/ConfirmDialog';
import { PointsList } from './components/PointsList';
import { LoginPanel } from './components/LoginPanel';
import DetailModal from './components/DetailModal';
import { Sidebar } from './components/Sidebar';
import { useEffect, useMemo, useState, useCallback } from 'react';

function Content() {
  const { user, token } = useAuth();
  const { points, loading, error, reload } = useMapPoints(token);
  const [actionError, setActionError] = useState<string | null>(null);
  const canEdit = !!user && user.type !== 'viewer';
  const [editing, setEditing] = useState<ReturnType<typeof useMapPoints>['points'][number] | null>(null);
  const [filters, setFilters] = useState<Set<'kingdom' | 'city' | 'place' | 'person' | 'unknown'>>(new Set(['kingdom', 'city', 'place', 'person', 'unknown']));
  const [search, setSearch] = useState('');
  const { push } = useToast();
  const [confirm, setConfirm] = useState<{ open: boolean; pointId?: string }>({ open: false });
  const [showSearch, setShowSearch] = useState(false);
  const [hideError, setHideError] = useState(false);
  const [hideActionError, setHideActionError] = useState(false);
  const [detailPoint, setDetailPoint] = useState<MapPoint | null>(null);
  const [creatingMode, setCreatingMode] = useState(false);
  const [createPosition, setCreatePosition] = useState<{ x: number; y: number } | null>(null);
  const [createKind, setCreateKind] = useState<'kingdom' | 'city' | 'place' | 'person'>('kingdom');
  useEffect(() => {
    if (error) push(error, 'error');
    setHideError(false);
  }, [error, push]);

  useEffect(() => {
    if (actionError) push(actionError, 'error');
    setHideActionError(false);
  }, [actionError, push]);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4b615a6a-3388-40b4-9df2-ee03a04a8c5a',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        sessionId:'debug-session',
        runId:'run1',
        hypothesisId:'H-render',
        location:'App.tsx:Content',
        message:'render state',
        data:{points:points.length, userType:user?.type ?? null},
        timestamp:Date.now()
      })
    }).catch(()=>{});
    // #endregion
  }, [points.length, user?.type]);

  const filteredPoints = useMemo(
    () =>
      points.filter(
        (p) =>
          filters.has(p.kind) &&
          (search.trim() === '' ||
            p.name.toLowerCase().includes(search.trim().toLowerCase())),
      ),
    [points, filters, search],
  );

  const toggleFilter = (k: 'kingdom' | 'city' | 'place' | 'person' | 'unknown') => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const handleMapClickForCreation = useCallback((x: number, y: number) => {
    console.log('onMapClick appelé avec:', { x, y });
    setCreatePosition({ x, y });
    setCreatingMode(false);
  }, []);

  return (
    <div className="app-shell">
      {!user ? (
        <div className="auth-screen">
          <div className="auth-card glass">
            <h2>Connexion</h2>
            <LoginPanel />
          </div>
        </div>
      ) : (
        <>
          <div className="map-container">
            {loading && <div className="glass badge">Chargement…</div>}
            {error && !hideError && (
              <div className="glass badge error">
                <span>{error}</span>
                <button className="ghost badge-close" onClick={() => setHideError(true)}>×</button>
              </div>
            )}
            {actionError && !hideActionError && (
              <div className="glass badge error">
                <span>{actionError}</span>
                <button className="ghost badge-close" onClick={() => setHideActionError(true)}>×</button>
              </div>
            )}

            <Sidebar
              search={search}
              setSearch={setSearch}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              filters={filters}
              toggleFilter={toggleFilter}
              creatingMode={creatingMode}
              setCreatingMode={setCreatingMode}
              createKind={createKind}
              setCreateKind={setCreateKind}
              onCancelCreate={() => setCreatePosition(null)}
              searchResults={filteredPoints}
              onSelectResult={(p) => {
                setDetailPoint(p);
              }}
            />

            <MapView
              points={filteredPoints}
              canEdit={canEdit}
              creatingMode={creatingMode}
              onMapClick={creatingMode ? handleMapClickForCreation : undefined}
              onMove={async (point, x, y) => {
                if (!token) throw new Error('Authentification requise');
                if (!point.targetId) throw new Error('Cible introuvable');
                const payload =
                  point.kind === 'kingdom'
                    ? { x, y, kingdomId: point.targetId }
                    : point.kind === 'city'
                    ? { x, y, cityId: point.targetId }
                    : point.kind === 'place'
                    ? { x, y, placeId: point.targetId }
                    : { x, y, personOfInterestId: point.targetId };
                await updatePosition(token, payload);
                await reload();
                push('Position mise à jour', 'success');
              }}
              onDetail={(p) => setDetailPoint(p)}
            />
          </div>
          <EditDrawer point={editing} onClose={() => setEditing(null)} onSaved={async () => { await reload(); push('Enregistré', 'success'); }} />
          {createPosition && (
            <DetailModal
              point={null}
              createMode={{
                kind: createKind,
                initialPosition: createPosition,
              }}
              token={token}
              onClose={() => {
                setCreatePosition(null);
                setCreateKind('kingdom'); // Reset to default
              }}
              onUpdated={async () => {
                await reload();
                setCreatePosition(null);
                setCreateKind('kingdom'); // Reset to default
              }}
            />
          )}
          <ConfirmDialog
            open={confirm.open}
            title="Confirmer la suppression"
            message="Cette action est définitive."
            onCancel={() => setConfirm({ open: false })}
            onConfirm={async () => {
              const point = filteredPoints.find((p) => p.id === confirm.pointId);
              if (!point || !token || !point.targetId) return;
              try {
                setActionError(null);
                await deleteTarget(point.kind, point.targetId, token);
                await reload();
                push('Supprimé', 'success');
                // Fermer le modal de détail si l'entité supprimée est celle affichée
                if (detailPoint && detailPoint.id === point.id) {
                  setDetailPoint(null);
                }
              } catch (err) {
                const msg = err instanceof Error ? err.message : 'Erreur';
                setActionError(msg);
                push(msg, 'error');
              } finally {
                setConfirm({ open: false });
              }
            }}
          />
          <DetailModal
            point={detailPoint}
            token={token}
            onClose={() => setDetailPoint(null)}
            onUpdated={reload}
            onDelete={canEdit && detailPoint ? (p) => {
              if (!p.targetId) return;
              setConfirm({ open: true, pointId: p.id });
            } : undefined}
            onNavigate={(p) => setDetailPoint(p)}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Content />
      </AuthProvider>
    </ToastProvider>
  );
}
