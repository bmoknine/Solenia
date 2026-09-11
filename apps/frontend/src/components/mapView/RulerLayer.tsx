import { CircleMarker, Polyline, Tooltip, useMapEvents } from 'react-leaflet';
import type { LatLng } from 'leaflet';

type Props = {
  active: boolean;
  points: LatLng[];
  onAddPoint: (latlng: LatLng) => void;
  label: string | null;
};

const RULER_COLOR = '#ffd166';

/**
 * Couche de mesure de distance (mode chemin). Rendue à l'intérieur du MapContainer.
 * En mode actif, chaque clic ajoute un point ; la ligne relie tous les points dans l'ordre
 * et l'étiquette (distance totale) est ancrée au dernier point.
 * La distance étant calculée dans l'espace CRS.Simple (pixels image), elle est indépendante
 * du zoom écran ; la polyligne se reprojette seule.
 */
export function RulerLayer({ active, points, onAddPoint, label }: Props) {
  useMapEvents({
    click: (e) => {
      if (active) onAddPoint(e.latlng);
    },
  });

  return (
    <>
      {points.length >= 2 && (
        <Polyline positions={points} pathOptions={{ color: RULER_COLOR, weight: 2, dashArray: '6 6' }} />
      )}
      {points.map((p, i) => {
        const isLast = i === points.length - 1;
        return (
          <CircleMarker
            key={i}
            center={p}
            radius={5}
            pathOptions={{ color: RULER_COLOR, fillColor: RULER_COLOR, fillOpacity: 1, weight: 2 }}
          >
            {isLast && label && points.length >= 2 && (
              <Tooltip permanent direction="top" offset={[0, -6]} className="ruler-tooltip">
                {label}
              </Tooltip>
            )}
          </CircleMarker>
        );
      })}
    </>
  );
}
