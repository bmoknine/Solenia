import { useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

type Props = { onZoomChange: (zoom: number) => void };

/** Synchronise le zoom Leaflet avec un state React (pour l’échelle des icônes). */
export function ZoomHandler({ onZoomChange }: Props) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      onZoomChange(map.getZoom());
    }
  }, [map, onZoomChange]);

  useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });

  return null;
}
