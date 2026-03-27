import './App.css';
import 'leaflet/dist/leaflet.css';
import { MapView } from './components/MapView';
import { useMapPoints } from './hooks/useMapPoints';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { deleteTarget } from './api/map';
import type { NavigablePoint } from './api/map';
import { updatePosition, listOrganisations, type Organisation } from './api/entities';
import { EditDrawer } from './components/EditDrawer';
import { ToastProvider, useToast } from './toast/ToastProvider';
import { ConfirmDialog } from './components/ConfirmDialog';
import { LoginPanel } from './components/LoginPanel';
import DetailModal from './components/DetailModal';
import { Sidebar } from './components/Sidebar';
import { LoreModal } from './components/LoreModal';
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';

function Content() {
  const { user, token } = useAuth();
  const { points, loading, error, reload } = useMapPoints(token);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const canEdit = !!user && user.type !== 'viewer';
  const [editing, setEditing] = useState<ReturnType<typeof useMapPoints>['points'][number] | null>(null);
  const [filters, setFilters] = useState<Set<'kingdom' | 'city' | 'district' | 'place' | 'person' | 'unknown' | 'organisation'>>(
    new Set(['kingdom', 'city', 'district', 'place', 'person', 'unknown', 'organisation']),
  );
  const [search, setSearch] = useState('');
  const { push } = useToast();
  const [confirm, setConfirm] = useState<{ open: boolean; pointId?: string; kind?: NavigablePoint['kind']; targetId?: string }>({ open: false });
  const [showSearch, setShowSearch] = useState(false);
  const [hideError, setHideError] = useState(false);
  const [hideActionError, setHideActionError] = useState(false);
  const [detailPoint, setDetailPoint] = useState<NavigablePoint | { id: string; x: number; y: number; kind: 'organisation'; targetId: string; name: string; description: string | null } | null>(null);
  const [creatingMode, setCreatingMode] = useState(false);
  const [createPosition, setCreatePosition] = useState<{ x: number; y: number } | null>(null);
  const [createKind, setCreateKind] = useState<'kingdom' | 'city' | 'place' | 'person' | 'organisation' | 'lore'>('kingdom');
  const [showLoreModal, setShowLoreModal] = useState(false);
  const [selectedLoreId, setSelectedLoreId] = useState<string | null>(null);
  const [creatingDistrictForCity, setCreatingDistrictForCity] = useState<string | null>(null);
  const previousCreatingDistrictRef = useRef<string | null>(null);
  const [dragLocked, setDragLocked] = useState(true); // par défaut verrouillé pour éviter les déplacements accidentels
  
  // Charger les organisations
  const reloadOrganisations = useCallback(async () => {
    try {
      const orgs = await listOrganisations();
      setOrganisations(orgs);
    } catch {
      setOrganisations([]);
    }
  }, []);

  useEffect(() => {
    reloadOrganisations();
  }, [reloadOrganisations]);
  
  useEffect(() => {
    if (error) push(error, 'error');
    setHideError(false);
  }, [error, push]);
  
  // Recharger les données de la ville si elle est ouverte après la création d'un district
  useEffect(() => {
    // Si creatingDistrictForCity passe de quelque chose à null, cela signifie qu'un district a été créé
    if (previousCreatingDistrictRef.current && !creatingDistrictForCity) {
      const cityId = previousCreatingDistrictRef.current;
      // Si la modal de détail est ouverte et affiche cette ville, forcer le rechargement
      if (detailPoint && detailPoint.kind === 'city' && detailPoint.targetId === cityId) {
        // Forcer le rechargement en changeant temporairement detailPoint
        const currentPoint = detailPoint;
        setDetailPoint(null);
        setTimeout(() => setDetailPoint(currentPoint), 0);
      }
    }
    previousCreatingDistrictRef.current = creatingDistrictForCity;
  }, [creatingDistrictForCity, detailPoint]);

  useEffect(() => {
    if (actionError) push(actionError, 'error');
    setHideActionError(false);
  }, [actionError, push]);


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

  // Ajouter les organisations aux résultats de recherche
  const searchResults = useMemo(() => {
    const mapPointResults = filteredPoints;
    const organisationResults = search.trim() === '' 
      ? [] 
      : organisations
          .filter((org) => org.name.toLowerCase().includes(search.trim().toLowerCase()))
          .map((org) => ({
            id: org.id,
            x: 0,
            y: 0,
            kind: 'organisation' as const,
            targetId: org.id,
            name: org.name,
            description: org.description ?? null,
          }));
    
    return [...mapPointResults, ...organisationResults];
  }, [filteredPoints, organisations, search]);

  const toggleFilter = (k: 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'unknown' | 'organisation') => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const handleMapClickForCreation = useCallback((x: number, y: number) => {
    setCreatePosition({ x, y });
    setCreatingMode(false);
  }, []);

  const handleCreateDistrict = useCallback((cityId: string) => {
    setCreatingDistrictForCity(cityId);
    setDetailPoint(null);
  }, []);

  // Ouvrir automatiquement la modal de création pour les organisations et Lore (pas besoin de clic sur la carte)
  useEffect(() => {
    if (creatingMode && (createKind === 'organisation' || createKind === 'lore')) {
      setCreatePosition({ x: 0, y: 0 }); // Position factice, non utilisée
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
              onCancelCreate={() => setCreatePosition(null)}
              searchResults={searchResults}
              onSelectResult={(p) => {
                setDetailPoint(p as any);
              }}
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
                    : { x, y, personOfInterestId: point.targetId };
                await updatePosition(token, payload);
                await reload();
                push('Position mise à jour', 'success');
              } : undefined}
              onDetail={(p) => setDetailPoint(p as NavigablePoint)}
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
                await reloadOrganisations();
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
              // Pour les districts et autres entités sans position, utiliser directement les infos de confirm
              if (confirm.kind && confirm.targetId && token) {
                try {
                  setActionError(null);
                  await deleteTarget(confirm.kind as any, confirm.targetId, token);
                  await reload();
                  await reloadOrganisations();
                  push('Supprimé', 'success');
                  // Fermer le modal de détail si l'entité supprimée est celle affichée
                  if (detailPoint && detailPoint.id === confirm.pointId) {
                    setDetailPoint(null);
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
                await reloadOrganisations();
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
          <LoreModal
            open={showLoreModal}
            onClose={() => setShowLoreModal(false)}
            onSelectLore={(id) => {
              setShowLoreModal(false);
              setSelectedLoreId(id);
            }}
            onCreateNew={() => {
              setShowLoreModal(false);
              setCreatingMode(true);
              setCreateKind('lore');
              setCreatePosition({ x: 0, y: 0 });
            }}
          />
          <DetailModal
            point={detailPoint}
            token={token}
            onClose={() => setDetailPoint(null)}
            onUpdated={async () => {
              await reload();
              await reloadOrganisations();
            }}
            onDelete={canEdit && detailPoint ? (p) => {
              if (!p.targetId) return;
              setConfirm({ 
                open: true, 
                pointId: p.id,
                kind: p.kind,
                targetId: p.targetId
              });
            } : undefined}
            onNavigate={(p) => setDetailPoint(p)}
            onCreateDistrict={canEdit ? handleCreateDistrict : undefined}
            onOpenLore={(loreId) => {
              setDetailPoint(null);
              setSelectedLoreId(loreId);
            }}
          />
          {selectedLoreId && (
            <DetailModal
              point={null}
              loreId={selectedLoreId}
              token={token}
              onClose={() => {
                setSelectedLoreId(null);
                setShowLoreModal(true);
              }}
              onUpdated={async () => {
                await reload();
                await reloadOrganisations();
              }}
            />
          )}
          {creatingDistrictForCity && (
            <DetailModal
              point={null}
              token={token}
              onClose={() => {
                setCreatingDistrictForCity(null);
              }}
              onUpdated={async () => {
                await reload();
                await reloadOrganisations();
                setCreatingDistrictForCity(null);
              }}
              createMode={{
                kind: 'district',
                parentCityId: creatingDistrictForCity,
              }}
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
