import './App.css';
import 'leaflet/dist/leaflet.css';
import { MapView } from './components/MapView';
import { useMapPoints } from './hooks/useMapPoints';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { deleteTarget } from './api/map';
import type { NavigablePoint } from './api/map';
import { updatePosition } from './api/entities';
import { useEntityCatalog } from './hooks/useEntityCatalog';
import { searchEntityCatalog } from './search/entityCatalog';
import type { GlobalSearchResult } from './search/types';
import { EditDrawer } from './components/EditDrawer';
import { ToastProvider, useToast } from './toast/ToastProvider';
import { ConfirmDialog } from './components/ConfirmDialog';
import { LoginPanel } from './components/LoginPanel';
import DetailModal from './components/DetailModal';
import { Sidebar } from './components/Sidebar';
import { LoreModal } from './components/LoreModal';
import {
  type DetailStackEntry,
  getBackLabel,
  isModalOpen,
  stackEntryToModalProps,
} from './components/detail-modal/detailNavigation';

function detailModalKey(stack: DetailStackEntry[]): string {
  const top = stack[stack.length - 1];
  if (!top) return 'empty';
  if (top.type === 'entity') return `${stack.length}-entity-${top.point.kind}-${top.point.targetId}`;
  if (top.type === 'lore') return `${stack.length}-lore-${top.loreId}`;
  if (top.type === 'create') {
    const cm = top.createMode;
    return `${stack.length}-create-${cm.kind}-${cm.parentCityId ?? ''}-${cm.initialPosition?.x ?? 0}-${cm.initialPosition?.y ?? 0}`;
  }
  return `${stack.length}-unknown`;
}
import type { ExtendedMapPoint } from './components/detail-modal/detailModalTypes';
import { useEffect, useMemo, useState, useCallback } from 'react';

function Content() {
  const { user, token } = useAuth();
  const { points, loading, error, reload } = useMapPoints(token);
  const { catalog, loading: catalogLoading, reload: reloadCatalog } = useEntityCatalog(!!user);
  const [actionError, setActionError] = useState<string | null>(null);
  const canEdit = !!user && user.type !== 'viewer';
  const [editing, setEditing] = useState<ReturnType<typeof useMapPoints>['points'][number] | null>(null);
  const [filters, setFilters] = useState<Set<'kingdom' | 'city' | 'district' | 'place' | 'person' | 'unknown' | 'organisation' | 'playerCharacter'>>(
    new Set(['kingdom', 'city', 'district', 'place', 'person', 'unknown', 'organisation', 'playerCharacter']),
  );
  const [search, setSearch] = useState('');
  const { push } = useToast();
  const [confirm, setConfirm] = useState<{ open: boolean; pointId?: string; kind?: NavigablePoint['kind']; targetId?: string }>({ open: false });
  const [showSearch, setShowSearch] = useState(false);
  const [hideError, setHideError] = useState(false);
  const [hideActionError, setHideActionError] = useState(false);
  const [detailStack, setDetailStack] = useState<DetailStackEntry[]>([]);
  const [creatingMode, setCreatingMode] = useState(false);
  const [createKind, setCreateKind] = useState<'kingdom' | 'city' | 'place' | 'person' | 'organisation' | 'lore' | 'playerCharacter'>('kingdom');
  const [showLoreModal, setShowLoreModal] = useState(false);
  const [dragLocked, setDragLocked] = useState(true); // par défaut verrouillé pour éviter les déplacements accidentels

  const detailStackTop = detailStack[detailStack.length - 1];
  const detailStackPrev = detailStack.length > 1 ? detailStack[detailStack.length - 2] : null;

  const openEntityDetail = useCallback((point: ExtendedMapPoint) => {
    setDetailStack([{ type: 'entity', point }]);
  }, []);

  const pushEntityDetail = useCallback((point: ExtendedMapPoint) => {
    setDetailStack((prev) => [...prev, { type: 'entity', point }]);
  }, []);

  const pushLoreDetail = useCallback((loreId: string) => {
    setDetailStack((prev) => [...prev, { type: 'lore', loreId }]);
  }, []);

  const closeDetailModal = useCallback(() => {
    setDetailStack([]);
  }, []);

  const goBackDetail = useCallback(() => {
    setDetailStack((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.slice(0, -1);
      const newTop = next[next.length - 1];
      if (newTop?.type === 'lore-frise') {
        setShowLoreModal(true);
        return [];
      }
      return next;
    });
  }, []);

  const popDetailAfterSave = useCallback(() => {
    setDetailStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : []));
  }, []);
  
  
  useEffect(() => {
    if (error) push(error, 'error');
    setHideError(false);
  }, [error, push]);
  

  useEffect(() => {
    if (actionError) push(actionError, 'error');
    setHideActionError(false);
  }, [actionError, push]);


  const filteredPoints = useMemo(
    () => points.filter((p) => filters.has(p.kind)),
    [points, filters],
  );

  const searchResults = useMemo(() => {
    if (search.trim() === '' || !catalog) return [];
    return searchEntityCatalog(catalog, points, search);
  }, [catalog, points, search]);

  const handleSelectSearchResult = useCallback(
    (result: GlobalSearchResult) => {
      if (result.kind === 'lore') {
        setDetailStack([{ type: 'lore', loreId: result.targetId }]);
        return;
      }
      openEntityDetail({
        id: result.id,
        x: result.x,
        y: result.y,
        kind: result.kind,
        targetId: result.targetId,
        name: result.name,
        description: result.description,
      });
    },
    [openEntityDetail],
  );

  const toggleFilter = (k: 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'unknown' | 'organisation' | 'playerCharacter') => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const handleMapClickForCreation = useCallback((x: number, y: number) => {
    setDetailStack([{ type: 'create', createMode: { kind: createKind, initialPosition: { x, y } } }]);
    setCreatingMode(false);
  }, [createKind]);

  const handleCreateDistrict = useCallback((cityId: string) => {
    setDetailStack((prev) => [
      ...prev,
      { type: 'create', createMode: { kind: 'district', parentCityId: cityId } },
    ]);
  }, []);

  const cancelPendingCreate = useCallback(() => {
    setDetailStack((prev) => {
      const top = prev[prev.length - 1];
      if (top?.type === 'create') return prev.slice(0, -1);
      return prev;
    });
  }, []);

  // Ouvrir directement la création org/lore (sans clic carte)
  useEffect(() => {
    if (creatingMode && (createKind === 'organisation' || createKind === 'lore')) {
      setDetailStack([{ type: 'create', createMode: { kind: createKind, initialPosition: { x: 0, y: 0 } } }]);
      setCreatingMode(false);
    }
  }, [creatingMode, createKind]);

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

            {canEdit && (
              <button
                type="button"
                className="map-drag-lock glass"
                onClick={() => setDragLocked((prev) => !prev)}
                title={dragLocked ? 'Déverrouiller le déplacement des icônes' : 'Verrouiller le déplacement des icônes'}
                aria-label={dragLocked ? 'Déverrouiller le glisser-déposer' : 'Verrouiller le glisser-déposer'}
              >
                {dragLocked ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                )}
              </button>
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
              onCancelCreate={cancelPendingCreate}
              searchResults={searchResults}
              searchLoading={catalogLoading}
              onSelectResult={handleSelectSearchResult}
              onOpenLoreModal={() => setShowLoreModal(true)}
            />

            <MapView
              points={filteredPoints}
              canEdit={canEdit}
              creatingMode={creatingMode}
              onMapClick={creatingMode ? handleMapClickForCreation : undefined}
              onMove={canEdit && !dragLocked ? async (point, x, y) => {
                if (!token) throw new Error('Authentification requise');
                if (!point.targetId) throw new Error('Cible introuvable');
                const payload =
                  point.kind === 'kingdom'
                    ? { x, y, kingdomId: point.targetId }
                    : point.kind === 'city'
                    ? { x, y, cityId: point.targetId }
                    : point.kind === 'place'
                    ? { x, y, placeId: point.targetId }
                    : point.kind === 'playerCharacter'
                    ? { x, y, playerCharacterId: point.targetId }
                    : { x, y, personOfInterestId: point.targetId };
                await updatePosition(token, payload);
                await reload();
                push('Position mise à jour', 'success');
              } : undefined}
              onDetail={(p) => openEntityDetail(p as ExtendedMapPoint)}
            />
          </div>
          <EditDrawer point={editing} onClose={() => setEditing(null)} onSaved={async () => { await reload(); push('Enregistré', 'success'); }} />
          <ConfirmDialog
            open={confirm.open}
            title="Confirmer la suppression"
            message="Cette action est définitive."
            onCancel={() => setConfirm({ open: false })}
            onConfirm={async () => {
              // Pour les districts et autres entités sans position, utiliser directement les infos de confirm
              if (confirm.kind && confirm.targetId && token) {
                try {
                  setActionError(null);
                  await deleteTarget(confirm.kind as any, confirm.targetId, token);
                  await reload();
                  await reloadCatalog();
                  push('Supprimé', 'success');
                  // Fermer le modal si l'entité supprimée est celle affichée
                  if (
                    detailStackTop?.type === 'entity' &&
                    detailStackTop.point.id === confirm.pointId
                  ) {
                    closeDetailModal();
                  }
                } catch (err) {
                  const msg = err instanceof Error ? err.message : 'Erreur';
                  setActionError(msg);
                  push(msg, 'error');
                } finally {
                  setConfirm({ open: false });
                }
                return;
              }

              // Pour les entités avec position, chercher dans filteredPoints
              const point = filteredPoints.find((p) => p.id === confirm.pointId);
              if (!point || !token || !point.targetId) return;
              try {
                setActionError(null);
                await deleteTarget(point.kind, point.targetId, token);
                await reload();
                await reloadCatalog();
                push('Supprimé', 'success');
                // Fermer le modal de détail si l'entité supprimée est celle affichée
                if (
                  detailStackTop?.type === 'entity' &&
                  detailStackTop.point.id === point.id
                ) {
                  closeDetailModal();
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
          <LoreModal
            open={showLoreModal}
            onClose={() => setShowLoreModal(false)}
            onSelectLore={(id) => {
              setShowLoreModal(false);
              setDetailStack([{ type: 'lore-frise' }, { type: 'lore', loreId: id }]);
            }}
            onCreateNew={() => {
              setShowLoreModal(false);
              setDetailStack([
                { type: 'lore-frise' },
                { type: 'create', createMode: { kind: 'lore', initialPosition: { x: 0, y: 0 } } },
              ]);
            }}
          />
          {isModalOpen(detailStack) && detailStackTop && detailStackTop.type !== 'lore-frise' && (
            <DetailModal
              key={detailModalKey(detailStack)}
              {...stackEntryToModalProps(detailStackTop)}
              token={token}
              onClose={closeDetailModal}
              onBack={detailStackPrev ? goBackDetail : undefined}
              backLabel={detailStackPrev ? getBackLabel(detailStackPrev) : undefined}
              onUpdated={async () => {
                await reload();
                await reloadCatalog();
                if (detailStackTop.type === 'create') {
                  popDetailAfterSave();
                  setCreateKind('kingdom');
                }
              }}
              onDelete={
                canEdit && detailStackTop.type === 'entity'
                  ? (p) => {
                      if (!p.targetId) return;
                      setConfirm({
                        open: true,
                        pointId: p.id,
                        kind: p.kind,
                        targetId: p.targetId,
                      });
                    }
                  : undefined
              }
              onNavigate={(p) => pushEntityDetail(p as ExtendedMapPoint)}
              onCreateDistrict={canEdit ? handleCreateDistrict : undefined}
              onOpenLore={pushLoreDetail}
            />
          )}
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
