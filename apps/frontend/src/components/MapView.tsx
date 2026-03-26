import { useEffect, useMemo, useState, useRef } from 'react';
import { ImageOverlay, MapContainer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { MapPoint } from '../api/map';
import './MapView.css';

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/** Type de ville déduit de l’URL d’icône : capital > city > fortified > village (taille décroissante). */
function getCityIconTier(iconUrl: string | null | undefined): 'capital' | 'city' | 'fortified' | 'village' {
  if (!iconUrl) return 'city';
  const u = iconUrl.toLowerCase();
  if (u.includes('capital')) return 'capital';
  if (u.includes('village')) return 'village';
  if (u.includes('fortified')) return 'fortified';
  return 'city';
}

// Composant pour gérer le zoom de la carte
function ZoomHandler({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      const initialZ = map.getZoom();
      console.log('🔍 Zoom initial dans ZoomHandler:', initialZ);
      onZoomChange(initialZ);
    }
  }, [map, onZoomChange]);
  
  useMapEvents({
    zoomend: () => {
      const newZoom = map.getZoom();
      console.log('🔍 Zoom changé dans useMapEvents:', newZoom);
      onZoomChange(newZoom);
    },
  });
  
  return null;
}

// Composant wrapper pour animer les changements de position
function AnimatedMarker({
  position,
  icon,
  zIndexOffset,
  draggable,
  eventHandlers,
  interactive,
}: {
  position: [number, number];
  icon: L.DivIcon;
  zIndexOffset?: number;
  draggable: boolean;
  eventHandlers: L.LeafletEventHandlerFnMap;
  interactive: boolean;
}) {
  const markerRef = useRef<L.Marker | null>(null);
  const previousPositionRef = useRef<[number, number] | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!markerRef.current) return;
    
    const newPos = L.latLng(position[0], position[1]);
    
    // Vérifie si la position a changé par rapport à la précédente
    if (
      previousPositionRef.current &&
      (Math.abs(previousPositionRef.current[0] - position[0]) > 0.0001 || 
       Math.abs(previousPositionRef.current[1] - position[1]) > 0.0001)
    ) {
      // Annule l'animation précédente si elle existe
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Animation manuelle avec interpolation
      const startPos = markerRef.current.getLatLng();
      const endPos = newPos;
      const duration = 400; // ms
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Fonction d'easing (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentLat = startPos.lat + (endPos.lat - startPos.lat) * easeOut;
        const currentLng = startPos.lng + (endPos.lng - startPos.lng) * easeOut;
        
        markerRef.current?.setLatLng([currentLat, currentLng], { animate: false });
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          animationFrameRef.current = null;
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    } else if (!previousPositionRef.current) {
      // Première position, pas d'animation
      markerRef.current.setLatLng(newPos, { animate: false });
    }
    
    previousPositionRef.current = position;
    
    // Nettoyage
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [position]);

  // Mise à jour de l'icône quand elle change
  useEffect(() => {
    if (markerRef.current) {
      console.log('🔄 AnimatedMarker - Mise à jour de l\'icône');
      markerRef.current.setIcon(icon);
    }
  }, [icon]);

  return (
    <Marker
      ref={(ref) => {
        if (ref) {
          markerRef.current = ref;
        }
      }}
      position={position}
      icon={icon}
      zIndexOffset={zIndexOffset}
      draggable={draggable}
      eventHandlers={eventHandlers}
      interactive={interactive}
    />
  );
}

type Props = {
  points: MapPoint[];
  backgroundUrl?: string;
  canEdit?: boolean;
  creatingMode?: boolean;
  onMapClick?: (x: number, y: number) => void;
  onMove?: (point: MapPoint, x: number, y: number) => Promise<void>;
  onDetail?: (point: MapPoint) => void;
};

const kindColor: Record<MapPoint['kind'], string> = {
  kingdom: '#f4b400',
  city: '#1a73e8',
  district: '#8b4513', // Marron pour les quartiers
  place: '#34a853',
  person: '#d93025',
  unknown: '#9aa0a6',
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
  const [currentZoom, setCurrentZoom] = useState(-2); // Nouveau state pour le zoom actuel
  const [separatedPins, setSeparatedPins] = useState<Map<string, [number, number]>>(new Map());
  const separationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const creatingModeRef = useRef(creatingMode);
  const onMapClickRef = useRef(onMapClick);

  // Synchronise mapRef avec mapRefRef pour accès dans les closures
  useEffect(() => {
    mapRefRef.current = mapRef;
  }, [mapRef]);

  // Synchronise les refs pour creatingMode et onMapClick
  useEffect(() => {
    creatingModeRef.current = creatingMode;
    onMapClickRef.current = onMapClick;
    console.log('Refs mises à jour, creatingMode:', creatingMode, 'onMapClick:', !!onMapClick);
  }, [creatingMode, onMapClick]);

  // Mémorise les eventHandlers pour l'ImageOverlay
  const imageOverlayHandlers = useMemo(() => ({
    load: (e: L.LeafletEvent) => {
      const imgEl = e.target as HTMLImageElement;
      if (imgEl?.naturalWidth && imgEl?.naturalHeight) {
        setImgSize({ width: imgEl.naturalWidth, height: imgEl.naturalHeight });
      }
    },
    click: (e: L.LeafletMouseEvent) => {
      // Si on est en mode création, gérer le clic directement sur l'ImageOverlay
      // Utiliser les refs pour avoir les valeurs les plus récentes
      const currentCreatingMode = creatingModeRef.current;
      const currentOnMapClick = onMapClickRef.current;
      
      // Obtenir la carte depuis l'événement ou la ref
      const currentMapRef = (e.target as any)?._map || mapRefRef.current;
      
      console.log('Clic sur ImageOverlay détecté, creatingMode:', currentCreatingMode, 'onMapClick:', !!currentOnMapClick, 'mapRef:', !!currentMapRef);
      if (currentCreatingMode && currentOnMapClick && currentMapRef) {
        console.log('Clic sur ImageOverlay en mode création - traitement');
        const latlng = e.latlng;
        const bounds = currentMapRef.getBounds();
        
        // Convertir les coordonnées lat/lng en coordonnées relatives (0-1)
        const x = (latlng.lng - bounds.getWest()) / (bounds.getEast() - bounds.getWest());
        const y = 1 - (latlng.lat - bounds.getSouth()) / (bounds.getNorth() - bounds.getSouth());
        
        console.log('Coordonnées calculées depuis ImageOverlay:', { x, y, latlng: { lat: latlng.lat, lng: latlng.lng } });
        currentOnMapClick(x, y);
        e.originalEvent.stopPropagation();
        e.originalEvent.preventDefault();
      } else {
        console.log('Conditions non remplies pour traitement:', {
          creatingMode: currentCreatingMode,
          hasOnMapClick: !!currentOnMapClick,
          hasMapRef: !!currentMapRef,
          eventTarget: e.target,
          eventTargetMap: (e.target as any)?._map
        });
      }
    },
  }), []); // Dépendances vides car on utilise les refs

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
    return [y, x] as [number, number]; // [lat, lng]
  };

  const getIcon = (kind: MapPoint['kind'], zoom: number, iconUrl?: string | null, kingdomColor?: string | null, name?: string, flag?: string | null) => {
    // Calcul du facteur d'échelle basé sur le zoom
    const minZoom = -2;
    const maxZoom = 4;
    const scaleFactor = Math.min(Math.max((zoom - minZoom) / (maxZoom - minZoom), 0.15), 1);

    // Ville : utiliser uniquement l'icône de ville (pas le drapeau)
    const cityImageUrl = (kind === 'city' && iconUrl) ? iconUrl : null;
    if (kind === 'city' && cityImageUrl) {
      const tier = getCityIconTier(iconUrl);
      const tierSizes: Record<typeof tier, { base: number; max: number }> = {
        capital: { base: 20, max: 220 },
        city: { base: 15, max: 180 },
        fortified: { base: 7, max: 115 },
        village: { base: 9, max: 100 },
      };
      const { base: baseSize, max: maxSize } = tierSizes[tier];
      const size = Math.round(baseSize + (maxSize - baseSize) * scaleFactor);
      const displaySize = size;
      const fontSize = Math.max(8, Math.round(size * 0.2));
      const overlay = kingdomColor
        ? `<div style="position:absolute;inset:0;background:${kingdomColor};opacity:0.5;pointer-events:none;mask-image:url(&quot;${cityImageUrl}&quot;);mask-size:contain;mask-repeat:no-repeat;mask-position:center;-webkit-mask-image:url(&quot;${cityImageUrl}&quot;);-webkit-mask-size:contain;-webkit-mask-repeat:no-repeat;-webkit-mask-position:center;"></div>`
        : '';
      const labelMaxW = Math.round(displaySize * 2.2);
      const label = name
        ? `<span class="map-city-label" style="font-size:${fontSize}px;max-width:${labelMaxW}px;">${escapeHtml(name)}</span>`
        : '';
      const labelGap = 1;
      const labelZoneH = fontSize * 2.8;
      const totalH = displaySize + (label ? labelZoneH + labelGap : 0);
      return L.divIcon({
        className: 'map-pin-icon map-pin-city',
        html: `<div class="map-pin-city-wrap" style="width:${Math.max(Math.round(displaySize * 1.5), labelMaxW)}px;">
          <div class="map-pin-icon-box" style="width:${displaySize}px;margin:0 auto;">
            <img src="${cityImageUrl}" alt="" style="width:100%;height:100%;object-fit:contain;object-position:center;display:block;transition:all 0.3s ease;" />
            ${overlay}
          </div>
          ${label}
        </div>`,
        iconSize: [Math.max(Math.round(displaySize * 1.5), labelMaxW), totalH],
        iconAnchor: [Math.max(Math.round(displaySize * 1.5), labelMaxW) / 2, displaySize / 2],
      });
    }
    // Ville sans icône personnalisée : pin par défaut + label si nom
    if (kind === 'city' && name) {
      const baseSize = 6;
      const maxSize = 90;
      const size = Math.round(baseSize + (maxSize - baseSize) * scaleFactor);
      const fontSize = Math.max(7, Math.round(size * 0.5));
      const dotColor = kingdomColor ?? kindColor.city;
      const totalW = Math.max(size, 140);
      const labelGap = 1;
      const labelZoneH = fontSize * 2.8;
      const totalH = size + labelZoneH + labelGap;
      const label = `<span class="map-city-label" style="font-size:${fontSize}px;max-width:${totalW}px;">${escapeHtml(name)}</span>`;
      return L.divIcon({
        className: 'map-pin-icon map-pin-city',
        html: `<div class="map-pin-city-wrap" style="width:${totalW}px;">
          <span class="map-pin-dot" style="background:${dotColor};width:${size}px;display:block;margin:0 auto;transition:all 0.3s ease;"></span>
          ${label}
        </div>`,
        iconSize: [totalW, totalH],
        iconAnchor: [totalW / 2, size / 2],
      });
    }
    // Si c'est un quartier et qu'une icône est fournie
    if (kind === 'district' && iconUrl) {
      const baseSize = 16; // Taille minimale
      const maxSize = 180; // Taille maximale
      const size = Math.round(baseSize + (maxSize - baseSize) * scaleFactor);
      return L.divIcon({
        className: 'map-pin-icon',
        html: `<img src="${iconUrl}" alt="District icon" style="width: ${size}px; height: ${size}px; object-fit: contain; transition: all 0.3s ease;" />`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    }
    // Si c'est un lieu et qu'une icône est fournie
    if (kind === 'place' && iconUrl) {
      const baseSize = 12; // Taille minimale (taille de départ conservée)
      const maxSize = 150; // Taille maximale (3x plus grand : 50 × 3)
      const size = Math.round(baseSize + (maxSize - baseSize) * scaleFactor);
      return L.divIcon({
        className: 'map-pin-icon',
        html: `<img src="${iconUrl}" alt="Place icon" style="width: ${size}px; height: ${size}px; object-fit: contain; transition: all 0.3s ease;" />`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    }
    // Royaume : drapeau ou point + nom en entier (police manuscrite)
    if (kind === 'kingdom') {
      const baseSize = 6;
      const maxSize = 90;
      const size = Math.round(baseSize + (maxSize - baseSize) * scaleFactor);
      const iconSize = flag ? size * 4 : size;
      const fontSize = Math.max(12, Math.round(size * 0.55));
      const dotColor = kingdomColor ?? kindColor.kingdom;
      const totalW = Math.max(iconSize, 280);
      const labelGap = 2;
      const labelZoneH = fontSize * 3;
      const totalH = iconSize + (name ? labelZoneH + labelGap : 0);
      const label = name
        ? `<span class="map-kingdom-label" style="font-size:${fontSize}px;">${escapeHtml(name)}</span>`
        : '';
      const anchorY = totalH - iconSize / 2;
      const iconPart = flag
        ? `<img src="${escapeHtml(flag)}" alt="" style="width:${iconSize}px;height:${iconSize}px;object-fit:contain;object-position:center;display:block;margin:0 auto;" />`
        : `<span class="map-pin-dot" style="background:${dotColor};width:${size}px;height:${size}px;display:block;margin:0 auto;transition:all 0.3s ease;"></span>`;
      return L.divIcon({
        className: 'map-pin-icon map-pin-kingdom',
        html: `<div class="map-pin-kingdom-wrap" style="width:${totalW}px;">
          ${label}
          ${iconPart}
        </div>`,
        iconSize: [totalW, totalH],
        iconAnchor: [totalW / 2, anchorY],
      });
    }
    // Si c'est un personnage
    if (kind === 'person') {
      const baseSize = 8; // Taille minimale (taille de départ conservée)
      const maxSize = 120; // Taille maximale (3x plus grand : 40 × 3)
      const size = Math.round(baseSize + (maxSize - baseSize) * scaleFactor);
      return L.divIcon({
        className: 'map-pin-icon',
        html: `<img src="/Icon/person.png" alt="Person icon" style="width: ${size}px; height: ${size}px; object-fit: contain; transition: all 0.3s ease;" />`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    }
    // Sinon, utiliser le pin par défaut (cities sans icône ni nom, etc.)
    const baseSize = 6; // Taille minimale (taille de départ conservée)
    const maxSize = 90; // Taille maximale (3x plus grand : 30 × 3)
    const size = Math.round(baseSize + (maxSize - baseSize) * scaleFactor);
    const dotColor = (kind === 'city' && kingdomColor) ? kingdomColor : kindColor[kind];
    return L.divIcon({
      className: 'map-pin-icon',
      html: `<span class="map-pin-dot" style="background:${dotColor}; width: ${size}px; height: ${size}px; transition: all 0.3s ease;"></span>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const getZIndexOffset = (kind: MapPoint['kind']): number => {
    // Ordre : Kingdom > City > Place > Person
    switch (kind) {
      case 'kingdom':
        return 400;
      case 'city':
        return 300;
      case 'place':
        return 200;
      case 'person':
        return 100;
      default:
        return 0;
    }
  };

  // Les fonctions findNearbyPins et calculateCirclePositions sont maintenant définies
  // directement dans le handler de clic pour avoir accès à la map depuis le marker

  // Remet les pins en place quand on clique sur la carte (mais pas sur un marker)
  useEffect(() => {
    if (!mapRef) {
      console.log('useEffect handleMapClick: mapRef non disponible');
      return;
    }

    console.log('useEffect handleMapClick: création du handler, creatingMode:', creatingMode, 'onMapClick:', !!onMapClick);

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      console.log('handleMapClick appelé, creatingMode:', creatingMode, 'onMapClick:', !!onMapClick);
      const target = e.originalEvent.target as HTMLElement;
      
      // Si on est en mode création et qu'on clique sur la carte (pas sur un marker)
      if (creatingMode && onMapClick) {
        // Vérifier qu'on ne clique pas sur un marker ou un popup
        const isMarker = target.closest('.leaflet-marker-icon') || target.closest('.leaflet-popup');
        if (!isMarker) {
          console.log('Mode création actif, clic sur la carte détecté');
          const latlng = e.latlng;
          const bounds = mapRef.getBounds();
          
          // Convertir les coordonnées lat/lng en coordonnées relatives (0-1)
          const x = (latlng.lng - bounds.getWest()) / (bounds.getEast() - bounds.getWest());
          const y = 1 - (latlng.lat - bounds.getSouth()) / (bounds.getNorth() - bounds.getSouth());
          
          console.log('Coordonnées calculées:', { x, y, latlng: { lat: latlng.lat, lng: latlng.lng } });
          onMapClick(x, y);
          return;
        } else {
          console.log('Clic sur marker/popup, ignoré');
        }
      }
      
      // Ne réinitialise que si le clic est directement sur la carte, pas sur un marker
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

  // Précharge l'image pour récupérer la taille naturelle
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

  // Note: Le listener pour le zoom est maintenant ajouté directement dans whenCreated

  // Calcule un zoom initial en fonction des bounds
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
            const map = mapInstance;
            setMapRef(map);
            mapRefRef.current = map;
            console.log('Map créée via ref, mapRef défini:', !!map);
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
          // Utilise la position séparée si disponible, sinon la position originale
          const position = separatedPins.has(p.id) ? separatedPins.get(p.id)! : toLatLng(p);
          const isSeparated = separatedPins.has(p.id);
          
          // Log pour vérifier que les markers sont créés
          if (points.indexOf(p) === 0) {
            console.log(`🗺️ Création de ${points.length} markers, premier: ${p.name}, currentZoom: ${currentZoom}`);
          }

          const handlers: L.LeafletEventHandlerFnMap = {
            click: (e) => {
              // Obtient la référence de la map depuis le marker
              const marker = e.target as L.Marker;
              const currentMapRef = marker._map || mapRefRef.current;
              console.log(`Handler de clic appelé pour pin: ${p.name}, isSeparated: ${isSeparated}, mapRef: ${!!currentMapRef}`);
              // Empêche la propagation vers la carte
              e.originalEvent.stopPropagation();
              
              if (isSeparated) {
                console.log(`Pin séparé détecté, ouverture directe des détails`);
                // Si le pin est séparé, on ouvre directement les détails
                if (onDetail) {
                  setSeparatedPins(new Map());
                  if (separationTimeoutRef.current) {
                    clearTimeout(separationTimeoutRef.current);
                  }
                  onDetail(p);
                }
              } else {
                console.log(`Pin non séparé, vérification des pins proches...`);
                // Sinon, on vérifie s'il y a des pins proches à séparer
                if (!currentMapRef) {
                  console.log(`mapRef non disponible, ouverture directe`);
                  // Si pas de mapRef, on ouvre directement
                  if (onDetail) onDetail(p);
                  return;
                }
                
                // Fonction temporaire pour trouver les pins proches avec la map actuelle
                const findNearbyPinsNow = (clickPoint: MapPoint, threshold: number = 25): MapPoint[] => {
                  return points.filter((otherPoint) => {
                    const pos1 = toLatLng(clickPoint);
                    const pos2 = toLatLng(otherPoint);
                    const containerPoint1 = currentMapRef.latLngToContainerPoint(pos1);
                    const containerPoint2 = currentMapRef.latLngToContainerPoint(pos2);
                    const distance = Math.sqrt(
                      Math.pow(containerPoint1.x - containerPoint2.x, 2) + Math.pow(containerPoint1.y - containerPoint2.y, 2)
                    );
                    return distance < threshold && otherPoint.id !== clickPoint.id;
                  });
                };
                
                // Fonction temporaire pour calculer les positions en cercle
                const calculateCirclePositionsNow = (
                  center: MapPoint,
                  nearbyPins: MapPoint[],
                  radius: number = 50
                ): Map<string, [number, number]> => {
                  const centerLatLng = toLatLng(center);
                  const centerContainer = currentMapRef.latLngToContainerPoint(centerLatLng);
                  const positions = new Map<string, [number, number]>();
                  const allPins = [center, ...nearbyPins];

                  allPins.forEach((pin, index) => {
                    if (index === 0) {
                      positions.set(pin.id, toLatLng(pin));
                    } else {
                      const angle = ((index - 1) * 2 * Math.PI) / nearbyPins.length;
                      const offsetX = Math.cos(angle) * radius;
                      const offsetY = Math.sin(angle) * radius;
                      const newContainerPoint = L.point(
                        centerContainer.x + offsetX,
                        centerContainer.y + offsetY
                      );
                      const newLatLng = currentMapRef.containerPointToLatLng(newContainerPoint);
                      positions.set(pin.id, [newLatLng.lat, newLatLng.lng]);
                    }
                  });

                  return positions;
                };
                
                console.log(`Clic sur pin: ${p.name}, vérification des pins proches...`);
                const nearbyPins = findNearbyPinsNow(p, 25);
                console.log(`Résultat: ${nearbyPins.length} pins proches trouvés`);
                
                if (nearbyPins.length > 0) {
                  // Il y a des pins proches, on les sépare
                  console.log(`Séparation de ${nearbyPins.length + 1} pins (${p.name} + ${nearbyPins.map(n => n.name).join(', ')})`);
                  const separatedPositions = calculateCirclePositionsNow(p, nearbyPins);
                  setSeparatedPins(separatedPositions);
                  
                  // Remet les pins en place après 5 secondes
                  if (separationTimeoutRef.current) {
                    clearTimeout(separationTimeoutRef.current);
                  }
                  separationTimeoutRef.current = setTimeout(() => {
                    setSeparatedPins(new Map());
                  }, 5000);
                } else {
                  // Pas de pins proches, on ouvre directement les détails
                  if (onDetail) {
                    setSeparatedPins(new Map());
                    if (separationTimeoutRef.current) {
                      clearTimeout(separationTimeoutRef.current);
                    }
                    onDetail(p);
                  }
                }
              }
            },
          };
          if (canEdit && onMove) {
            handlers.dragend = async (e) => {
              const { lat, lng } = e.target.getLatLng();
              const x = lng / imgSize.width;
              const y = lat / imgSize.height;
              try {
                await onMove(p, x, y);
                // Remet les pins en place après déplacement
                setSeparatedPins(new Map());
              } catch (err) {
                // Erreur silencieuse, l'utilisateur sera notifié via les toasts
                console.error('Erreur lors du déplacement:', err);
              }
            };
          }
          return (
            <AnimatedMarker
              key={`${p.id}-${p.iconUrl || 'default'}-${p.flag || 'no-flag'}-${p.kingdomColor || 'no-color'}-${p.name || ''}-${currentZoom}`}
              position={position}
              icon={getIcon(p.kind, currentZoom, p.iconUrl, p.kingdomColor, p.name, p.flag)}
              zIndexOffset={getZIndexOffset(p.kind)}
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
