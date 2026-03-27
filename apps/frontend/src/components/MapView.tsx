import { useEffect, useMemo, useState, useRef } from 'react';
import { ImageOverlay, MapContainer } from 'react-leaflet';
import L from 'leaflet';
import type { MapPoint } from '../api/map';
import { buildMapIcon, zIndexOffsetForKind } from './mapView/buildMapIcon';
import { AnimatedMarker } from './mapView/AnimatedMarker';
import { ZoomHandler } from './mapView/ZoomHandler';
import { findNearbyPinsInPixels, separatedPositionsCircle } from './mapView/pinSeparation';
import './MapView.css';

type Props = {
  points: MapPoint[];
  backgroundUrl?: string;
  canEdit?: boolean;
  creatingMode?: boolean;
  onMapClick?: (x: number, y: number) => void;
  onMove?: (point: MapPoint, x: number, y: number) => Promise<void>;
  onDetail?: (point: MapPoint) => void;
};

export function MapView({
  points,
  backgroundUrl = '/map.jpg',
  canEdit = false,
  creatingMode = false,
  onMapClick,
  onMove,
  onDetail,
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
        cursor: creatingMode ? 'crosshair' : 'default',
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
    </div>
  );
}

export default MapView;
