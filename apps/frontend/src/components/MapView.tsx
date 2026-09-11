import { useEffect, useMemo, useState, useRef } from 'react';
import { ImageOverlay, MapContainer } from 'react-leaflet';
import L from 'leaflet';
import type { MapPoint, KingdomBorder, BorderRings } from '../api/map';
import { buildMapIcon, zIndexOffsetForKind } from './mapView/buildMapIcon';
import { AnimatedMarker } from './mapView/AnimatedMarker';
import { ZoomHandler } from './mapView/ZoomHandler';
import { RulerLayer } from './mapView/RulerLayer';
import { KingdomBorderLayer } from './mapView/KingdomBorderLayer';
import { BorderEditLayer } from './mapView/BorderEditLayer';
import { findNearbyPinsInPixels, separatedPositionsCircle } from './mapView/pinSeparation';
import './MapView.css';

/** Frontière en cours d'édition : royaume ciblé + anneaux initiaux (ratio 0..1). */
export type BorderEditState = {
  kingdomId: string;
  name: string;
  color: string;
  rings: BorderRings;
};

const RULER_STORAGE_KEY = 'solenia.ruler.scale';
type RulerScale = { pxPerUnit: number | null };

function loadRulerScale(): RulerScale {
  try {
    const raw = localStorage.getItem(RULER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<RulerScale>;
      return {
        pxPerUnit: typeof parsed.pxPerUnit === 'number' && parsed.pxPerUnit > 0 ? parsed.pxPerUnit : null,
      };
    }
  } catch {
    /* ignore */
  }
  return { pxPerUnit: null };
}

type Props = {
  points: MapPoint[];
  backgroundUrl?: string;
  canEdit?: boolean;
  creatingMode?: boolean;
  rulerMode?: boolean;
  /** Frontières de royaumes à afficher (polygones). */
  kingdomBorders?: KingdomBorder[];
  /** Afficher ou masquer les frontières. */
  showBorders?: boolean;
  /** Édition d'une frontière en cours (null = pas d'édition). */
  borderEdit?: BorderEditState | null;
  onMapClick?: (x: number, y: number) => void;
  onMove?: (point: MapPoint, x: number, y: number) => Promise<void>;
  onDetail?: (point: MapPoint) => void;
  /** Enregistrer la frontière éditée (anneaux en ratio 0..1, ou null pour effacer). */
  onBorderSave?: (rings: BorderRings | null) => void;
  /** Annuler l'édition de frontière sans enregistrer. */
  onBorderCancel?: () => void;
};

export function MapView({
  points,
  backgroundUrl = '/map.jpg',
  canEdit = false,
  creatingMode = false,
  rulerMode = false,
  kingdomBorders = [],
  showBorders = true,
  borderEdit = null,
  onMapClick,
  onMove,
  onDetail,
  onBorderSave,
  onBorderCancel,
}: Props) {
  const [imgSize, setImgSize] = useState<{ width: number; height: number }>({
    width: 2000,
    height: 1200,
  });
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const mapRefRef = useRef<L.Map | null>(null);
  const [initialZoom, setInitialZoom] = useState(-2);
  const [currentZoom, setCurrentZoom] = useState(-2);
  const [separatedPins, setSeparatedPins] = useState<Map<string, [number, number]>>(new Map());
  const separationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const creatingModeRef = useRef(creatingMode);
  const onMapClickRef = useRef(onMapClick);

  // ── Règle de mesure ────────────────────────────────────────────────
  const [rulerPoints, setRulerPoints] = useState<L.LatLng[]>([]);
  const [rulerScale, setRulerScale] = useState<RulerScale>(() => loadRulerScale());

  useEffect(() => {
    if (!rulerMode) setRulerPoints([]);
  }, [rulerMode]);

  const addRulerPoint = (latlng: L.LatLng) => {
    setRulerPoints((prev) => [...prev, latlng]);
  };

  const undoRulerPoint = () => setRulerPoints((prev) => prev.slice(0, -1));

  const updateRulerScale = (patch: Partial<RulerScale>) => {
    setRulerScale((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(RULER_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  // Distance totale du chemin dans l'espace CRS.Simple = pixels image (stable au zoom).
  const rulerDistancePx = (() => {
    if (!mapRef || rulerPoints.length < 2) return null;
    let sum = 0;
    for (let i = 1; i < rulerPoints.length; i++) {
      sum += mapRef.distance(rulerPoints[i - 1], rulerPoints[i]);
    }
    return sum;
  })();
  const rulerLabel =
    rulerDistancePx == null
      ? null
      : rulerScale.pxPerUnit && rulerScale.pxPerUnit > 0
        ? `${(rulerDistancePx / rulerScale.pxPerUnit).toFixed(1)} km`
        : `${Math.round(rulerDistancePx)} km`;

  // ── Édition de frontière de royaume ─────────────────────────────────
  // Le brouillon est stocké en ratio 0..1 (insensible au zoom et à la taille de l'image).
  // C'est un tableau d'anneaux : un royaume peut avoir plusieurs bulles (archipels).
  // Le dernier anneau est « l'anneau actif » : les nouveaux points s'y ajoutent.
  const [borderDraft, setBorderDraft] = useState<BorderRings>([]);
  const borderEditKingdomRef = useRef<string | null>(null);

  const ratioToLatLng = (x: number, y: number) => L.latLng(y * imgSize.height, x * imgSize.width);
  const latLngToRatio = (latlng: L.LatLng): [number, number] => [
    latlng.lng / imgSize.width,
    latlng.lat / imgSize.height,
  ];

  // (Ré)initialise le brouillon en entrant en édition (ou en changeant de royaume).
  useEffect(() => {
    const currentId = borderEdit?.kingdomId ?? null;
    if (currentId !== borderEditKingdomRef.current) {
      borderEditKingdomRef.current = currentId;
      setBorderDraft(borderEdit ? borderEdit.rings.map((ring) => ring.map(([x, y]) => [x, y] as [number, number])) : []);
    }
  }, [borderEdit]);

  const borderDraftLatLng = useMemo(
    () => borderDraft.map((ring) => ring.map(([x, y]) => ratioToLatLng(x, y))),
    // ratioToLatLng dépend de imgSize ; recomposer si l'un change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [borderDraft, imgSize.width, imgSize.height],
  );

  // Ajoute un sommet à la fin de l'anneau actif (le dernier ; en crée un si le brouillon est vide).
  const addBorderPoint = (latlng: L.LatLng) =>
    setBorderDraft((prev) => {
      const rings = prev.length ? prev.map((r) => [...r]) : [[] as [number, number][]];
      rings[rings.length - 1] = [...rings[rings.length - 1], latLngToRatio(latlng)];
      return rings;
    });
  const moveBorderPoint = (ringIndex: number, pointIndex: number, latlng: L.LatLng) =>
    setBorderDraft((prev) =>
      prev.map((ring, i) =>
        i === ringIndex ? ring.map((pt, j) => (j === pointIndex ? latLngToRatio(latlng) : pt)) : ring,
      ),
    );
  const removeBorderPoint = (ringIndex: number, pointIndex: number) =>
    setBorderDraft((prev) =>
      prev
        .map((ring, i) => (i === ringIndex ? ring.filter((_, j) => j !== pointIndex) : ring))
        .filter((ring) => ring.length > 0),
    );

  // Clôt l'anneau courant et en démarre un nouveau (nouvel îlot) — seulement si l'actif a ≥ 3 sommets.
  const startNewRing = () =>
    setBorderDraft((prev) => {
      if (!prev.length) return prev;
      if (prev[prev.length - 1].length < 3) return prev;
      return [...prev, []];
    });

  const borderTotalPoints = borderDraft.reduce((sum, ring) => sum + ring.length, 0);
  const borderValidRings = borderDraft.filter((ring) => ring.length >= 3);
  const borderActiveRingSize = borderDraft.length ? borderDraft[borderDraft.length - 1].length : 0;
  // Enregistrable si vide (efface) ou si au moins un anneau est valide et aucun anneau n'est incomplet.
  const borderHasIncompleteRing = borderDraft.some((ring) => ring.length > 0 && ring.length < 3);
  const borderCanSave = borderTotalPoints === 0 || (borderValidRings.length > 0 && !borderHasIncompleteRing);

  const handleBorderSave = () => {
    if (!onBorderSave) return;
    if (borderValidRings.length === 0) onBorderSave(null);
    else onBorderSave(borderValidRings);
  };

  useEffect(() => {
    mapRefRef.current = mapRef;
  }, [mapRef]);

  useEffect(() => {
    creatingModeRef.current = creatingMode;
    onMapClickRef.current = onMapClick;
  }, [creatingMode, onMapClick]);

  const imageOverlayHandlers = useMemo(
    () => ({
      load: (e: L.LeafletEvent) => {
        const imgEl = e.target as HTMLImageElement;
        if (imgEl?.naturalWidth && imgEl?.naturalHeight) {
          setImgSize({ width: imgEl.naturalWidth, height: imgEl.naturalHeight });
        }
      },
      click: (e: L.LeafletMouseEvent) => {
        const currentCreatingMode = creatingModeRef.current;
        const currentOnMapClick = onMapClickRef.current;
        const currentMapRef = (e.target as { _map?: L.Map })?._map ?? mapRefRef.current;

        if (currentCreatingMode && currentOnMapClick && currentMapRef) {
          const latlng = e.latlng;
          const bounds = currentMapRef.getBounds();
          const x = (latlng.lng - bounds.getWest()) / (bounds.getEast() - bounds.getWest());
          const y = 1 - (latlng.lat - bounds.getSouth()) / (bounds.getNorth() - bounds.getSouth());
          currentOnMapClick(x, y);
          e.originalEvent.stopPropagation();
          e.originalEvent.preventDefault();
        }
      },
    }),
    [],
  );

  const bounds: [[number, number], [number, number]] = useMemo(
    () => [
      [0, 0],
      [imgSize.height, imgSize.width],
    ],
    [imgSize.height, imgSize.width],
  );

  const center = useMemo(
    () => [imgSize.height / 2, imgSize.width / 2] as [number, number],
    [imgSize.height, imgSize.width],
  );

  const toLatLng = (p: MapPoint) => {
    const isRatio = p.x <= 1 && p.y <= 1;
    const x = isRatio ? p.x * imgSize.width : p.x;
    const y = isRatio ? p.y * imgSize.height : p.y;
    return [y, x] as [number, number];
  };

  useEffect(() => {
    if (!mapRef) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const target = e.originalEvent.target as HTMLElement;

      if (creatingMode && onMapClick) {
        const isMarker = target.closest('.leaflet-marker-icon') || target.closest('.leaflet-popup');
        if (!isMarker) {
          const latlng = e.latlng;
          const b = mapRef.getBounds();
          const x = (latlng.lng - b.getWest()) / (b.getEast() - b.getWest());
          const y = 1 - (latlng.lat - b.getSouth()) / (b.getNorth() - b.getSouth());
          onMapClick(x, y);
          return;
        }
      }

      if (target && !target.closest('.leaflet-marker-icon') && !target.closest('.leaflet-popup')) {
        setSeparatedPins(new Map());
        if (separationTimeoutRef.current) {
          clearTimeout(separationTimeoutRef.current);
        }
      }
    };

    mapRef.on('click', handleMapClick);
    return () => {
      mapRef.off('click', handleMapClick);
    };
  }, [mapRef, creatingMode, onMapClick]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImgSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = backgroundUrl;
  }, [backgroundUrl]);

  useEffect(() => {
    if (!mapRef) return;
    const handler = () => {
      void mapRef.getCenter();
      void mapRef.getZoom();
      void mapRef.getSize();
    };
    mapRef.on('moveend', handler);
    return () => {
      mapRef.off('moveend', handler);
    };
  }, [mapRef]);

  useEffect(() => {
    if (!mapRef) return;
    const latLngBounds = L.latLngBounds(bounds);
    const targetZoom = mapRef.getBoundsZoom(latLngBounds, true) - 3;
    setTimeout(() => {
      setInitialZoom(targetZoom);
    }, 0);
  }, [mapRef, bounds, imgSize.width, imgSize.height]);

  return (
    <div
      className="map-shell"
      style={{
        cursor: creatingMode || rulerMode || borderEdit ? 'crosshair' : 'default',
        minHeight: '100vh',
      }}
    >
      <MapContainer
        className="leaflet-map"
        crs={L.CRS.Simple}
        bounds={bounds}
        center={center}
        zoom={initialZoom}
        minZoom={Math.min(initialZoom - 2, -6)}
        maxZoom={8}
        style={{ width: '100%', height: `max(100vh, ${imgSize.height}px)` }}
        scrollWheelZoom
        zoomControl={false}
        doubleClickZoom={false}
        attributionControl={false}
        ref={(mapInstance) => {
          if (mapInstance) {
            setMapRef(mapInstance);
            mapRefRef.current = mapInstance;
          }
        }}
      >
        <ZoomHandler onZoomChange={setCurrentZoom} />
        <RulerLayer active={rulerMode} points={rulerPoints} onAddPoint={addRulerPoint} label={rulerLabel} />
        {showBorders && (
          <KingdomBorderLayer
            borders={kingdomBorders}
            imgSize={imgSize}
            hiddenKingdomId={borderEdit?.kingdomId ?? null}
            onSelect={
              borderEdit || !onDetail
                ? undefined
                : (kingdomId) => {
                    const pin = points.find((pt) => pt.kind === 'kingdom' && pt.targetId === kingdomId);
                    if (pin) onDetail(pin);
                  }
            }
          />
        )}
        {borderEdit && (
          <BorderEditLayer
            active={!!borderEdit}
            rings={borderDraftLatLng}
            color={borderEdit.color}
            onAddPoint={addBorderPoint}
            onMovePoint={moveBorderPoint}
            onRemovePoint={removeBorderPoint}
          />
        )}
        <ImageOverlay
          url={backgroundUrl}
          bounds={bounds}
          interactive={true}
          eventHandlers={imageOverlayHandlers}
        />

        {points.map((p) => {
          const position = separatedPins.has(p.id) ? separatedPins.get(p.id)! : toLatLng(p);
          const isSeparated = separatedPins.has(p.id);

          const handlers: L.LeafletEventHandlerFnMap = {
            click: (e: L.LeafletMouseEvent) => {
              // En édition de frontière : un clic sur un pin ajoute un sommet calé sur le pin.
              if (borderEdit) {
                e.originalEvent.stopPropagation();
                addBorderPoint(L.latLng(position[0], position[1]));
                return;
              }
              // En mode règle : un clic sur un pin ajoute un point de mesure calé sur le pin.
              if (rulerMode) {
                e.originalEvent.stopPropagation();
                addRulerPoint(L.latLng(position[0], position[1]));
                return;
              }
              const layer = e.target as L.Layer;
              const currentMapRef =
                (layer as unknown as { getMap?: () => L.Map }).getMap?.() ?? mapRefRef.current;
              e.originalEvent.stopPropagation();

              if (isSeparated) {
                if (onDetail) {
                  setSeparatedPins(new Map());
                  if (separationTimeoutRef.current) {
                    clearTimeout(separationTimeoutRef.current);
                  }
                  onDetail(p);
                }
              } else if (!currentMapRef) {
                if (onDetail) onDetail(p);
              } else {
                const nearbyPins = findNearbyPinsInPixels(currentMapRef, p, points, toLatLng, 25);

                if (nearbyPins.length > 0) {
                  const separatedPositions = separatedPositionsCircle(currentMapRef, p, nearbyPins, toLatLng, 50);
                  setSeparatedPins(separatedPositions);
                  if (separationTimeoutRef.current) {
                    clearTimeout(separationTimeoutRef.current);
                  }
                  separationTimeoutRef.current = setTimeout(() => {
                    setSeparatedPins(new Map());
                  }, 5000);
                } else if (onDetail) {
                  setSeparatedPins(new Map());
                  if (separationTimeoutRef.current) {
                    clearTimeout(separationTimeoutRef.current);
                  }
                  onDetail(p);
                }
              }
            },
          };
          if (canEdit && onMove) {
            handlers.dragend = async (e: L.DragEndEvent) => {
              const { lat, lng } = e.target.getLatLng();
              const x = lng / imgSize.width;
              const y = lat / imgSize.height;
              try {
                await onMove(p, x, y);
                setSeparatedPins(new Map());
              } catch (err) {
                console.error('Erreur lors du déplacement:', err);
              }
            };
          }
          return (
            <AnimatedMarker
              key={`${p.id}-${p.iconUrl || 'default'}-${p.flag || 'no-flag'}-${p.kingdomColor || 'no-color'}-${p.name || ''}-${currentZoom}`}
              position={position}
              icon={buildMapIcon(p.kind, currentZoom, p.iconUrl, p.kingdomColor, p.name, p.flag)}
              zIndexOffset={zIndexOffsetForKind(p.kind)}
              draggable={canEdit && Boolean(onMove)}
              eventHandlers={handlers}
              interactive={true}
            />
          );
        })}
      </MapContainer>

      {rulerMode && (
        <div className="ruler-panel glass">
          <div className="ruler-readout">
            {rulerPoints.length < 2
              ? rulerPoints.length === 0
                ? 'Cliquez pour tracer un chemin…'
                : 'Ajoutez un autre point…'
              : rulerLabel}
          </div>
          <div className="ruler-scale">
            <span>Échelle&nbsp;:</span>
            <input
              type="number"
              min={0}
              step="any"
              className="ruler-scale-input"
              placeholder="px"
              value={rulerScale.pxPerUnit ?? ''}
              onChange={(e) =>
                updateRulerScale({ pxPerUnit: e.target.value === '' ? null : Number(e.target.value) })
              }
            />
            <span>px = 1 km</span>
          </div>
          <button className="ghost" onClick={undoRulerPoint} disabled={rulerPoints.length === 0}>
            Annuler
          </button>
          <button className="ghost" onClick={() => setRulerPoints([])} disabled={rulerPoints.length === 0}>
            Effacer
          </button>
        </div>
      )}

      {borderEdit && (
        <div className="border-panel glass">
          <div className="border-panel-title">
            <span className="border-swatch" style={{ backgroundColor: borderEdit.color }} />
            Frontière — {borderEdit.name}
          </div>
          <div className="border-panel-count">
            {borderValidRings.length > 1 && <>{borderValidRings.length} îlots · </>}
            {borderTotalPoints} sommet{borderTotalPoints > 1 ? 's' : ''}
            {borderActiveRingSize > 0 && borderActiveRingSize < 3 && (
              <span className="border-panel-warn"> · îlot en cours : minimum 3 sommets</span>
            )}
          </div>
          <div className="border-panel-hint">
            Cliquez la carte pour ajouter un point (ou une ville pour vous y caler) · glissez une poignée
            pour la déplacer · clic droit pour la supprimer. « Nouvel îlot » pour une bulle séparée
            (archipel, enclave…).
          </div>
          <div className="border-panel-actions">
            <button
              className="primary"
              onClick={handleBorderSave}
              disabled={!borderCanSave}
              title={borderTotalPoints === 0 ? 'Enregistrer (supprime la frontière)' : 'Enregistrer la frontière'}
            >
              Enregistrer
            </button>
            <button className="ghost" onClick={startNewRing} disabled={borderActiveRingSize < 3}>
              Nouvel îlot
            </button>
            <button className="ghost" onClick={() => setBorderDraft([])} disabled={borderTotalPoints === 0}>
              Effacer
            </button>
            <button className="ghost" onClick={() => onBorderCancel?.()}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView;
