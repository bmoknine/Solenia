import './App.css';
import { MapView } from './components/MapView';
import { useMapPoints } from './hooks/useMapPoints';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { ChangePasswordPanel } from './components/ChangePasswordPanel';
import { deleteTarget } from './api/map';
import { CreatePanel } from './components/CreatePanel';
import { updatePosition } from './api/entities';
import { EditDrawer } from './components/EditDrawer';
import { FilterPanel } from './components/FilterPanel';
import { ToastProvider, useToast } from './toast/ToastProvider';
import { SearchBox } from './components/SearchBox';
import { ConfirmDialog } from './components/ConfirmDialog';
import { PointsList } from './components/PointsList';
import { LoginPanel } from './components/LoginPanel';
import { useEffect, useMemo, useState } from 'react';

function Content() {
  const { user, token, logout } = useAuth();
  const { points, loading, error, reload } = useMapPoints(token);
  const [actionError, setActionError] = useState<string | null>(null);
  const canEdit = !!user && user.type !== 'viewer';
  const [editing, setEditing] = useState<ReturnType<typeof useMapPoints>['points'][number] | null>(null);
  const [filters, setFilters] = useState(new Set(['kingdom', 'city', 'place', 'person', 'unknown']));
  const [search, setSearch] = useState('');
  const { push } = useToast();
  const [confirm, setConfirm] = useState<{ open: boolean; pointId?: string }>({ open: false });
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [hideError, setHideError] = useState(false);
  const [hideActionError, setHideActionError] = useState(false);
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

            <div className="toggle-panel glass">
              <button className="ghost" onClick={() => setShowFilters((v) => !v)}>Filtres</button>
              <button className="ghost" onClick={() => setShowCreate((v) => !v)}>Créer</button>
              <button className="ghost" onClick={() => setShowActions((v) => !v)}>Actions</button>
            </div>

            {showSearch ? (
              <div className="search-panel glass">
                <SearchBox
                  value={search}
                  onChange={setSearch}
                  onSearch={setSearch}
                  onClose={() => setShowSearch(false)}
                />
              </div>
            ) : (
              <button className="ghost search-toggle" onClick={() => setShowSearch(true)}>Recherche</button>
            )}

            {showFilters && (
              <div className="filters-panel glass">
                <FilterPanel active={filters} onToggle={toggleFilter} />
              </div>
            )}

            {search.trim() !== '' && filteredPoints.length > 0 && (
              <div className="results-panel glass">
                <PointsList
                  points={filteredPoints}
                  onSelect={(p) => {
                    setEditing(p);
                  }}
                />
              </div>
            )}

            {showActions && (
              <div className="actions-panel glass">
                <ChangePasswordPanel />
                <button className="ghost" onClick={logout} disabled={!user}>Déconnexion</button>
              </div>
            )}

            {showCreate && (
              <div className="create-panel glass">
                <CreatePanel onCreated={reload} />
              </div>
            )}

            <MapView
              points={filteredPoints}
              canEdit={canEdit}
              onDelete={async (point) => {
                if (!token) throw new Error('Authentification requise');
                if (!point.targetId) throw new Error('Cible introuvable');
                setConfirm({ open: true, pointId: point.id });
              }}
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
              onEdit={(p) => setEditing(p)}
            />
          </div>
          <EditDrawer point={editing} onClose={() => setEditing(null)} onSaved={async () => { await reload(); push('Enregistré', 'success'); }} />
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
              } catch (err) {
                const msg = err instanceof Error ? err.message : 'Erreur';
                setActionError(msg);
              } finally {
                setConfirm({ open: false });
              }
            }}
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
