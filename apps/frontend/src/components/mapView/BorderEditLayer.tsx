import { useMemo } from 'react';
import { Marker, Polygon, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { LatLng } from 'leaflet';

type Props = {
  active: boolean;
  /** Anneaux du brouillon (le dernier est l'anneau actif où s'ajoutent les nouveaux points). */
  rings: LatLng[][];
  color: string;
  onAddPoint: (latlng: LatLng) => void;
  onMovePoint: (ringIndex: number, pointIndex: number, latlng: LatLng) => void;
  onRemovePoint: (ringIndex: number, pointIndex: number) => void;
};

function makeHandleIcon(color: string, index: number, dim: boolean) {
  return L.divIcon({
    className: 'border-vertex-wrap',
    html: `<div class="border-vertex${dim ? ' is-dim' : ''}" style="--vtx-color:${color}">${index + 1}</div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

/**
 * Éditeur de frontière multi-anneaux : rendu dans le MapContainer.
 * - Clic sur la carte → ajoute un sommet à la fin de l'anneau actif (le dernier).
 * - Poignées déplaçables (glisser) ; clic droit sur une poignée → la supprime.
 * - Chaque anneau (≥ 3 sommets) est un polygone rempli distinct ; l'anneau actif en cours de
 *   tracé (< 3 sommets) s'affiche en polyligne.
 */
export function BorderEditLayer({ active, rings, color, onAddPoint, onMovePoint, onRemovePoint }: Props) {
  useMapEvents({
    click: (e) => {
      if (active) onAddPoint(e.latlng);
    },
  });

  const icons = useMemo(() => {
    const lastIndex = rings.length - 1;
    return rings.map((ring, ri) => ring.map((_, pi) => makeHandleIcon(color, pi, ri !== lastIndex)));
  }, [rings, color]);

  if (!active) return null;

  return (
    <>
      {rings.map((ring, ri) => {
        if (ring.length >= 3) {
          return (
            <Polygon
              key={`poly-${ri}`}
              positions={ring}
              pathOptions={{ color, weight: 2, fillColor: color, fillOpacity: 0.18, dashArray: '5 5' }}
              interactive={false}
            />
          );
        }
        if (ring.length === 2) {
          return (
            <Polyline
              key={`line-${ri}`}
              positions={ring}
              pathOptions={{ color, weight: 2, dashArray: '5 5' }}
              interactive={false}
            />
          );
        }
        return null;
      })}

      {rings.map((ring, ri) =>
        ring.map((p, pi) => (
          <Marker
            key={`${ri}-${pi}`}
            position={p}
            icon={icons[ri][pi]}
            draggable
            eventHandlers={{
              drag: (e) => onMovePoint(ri, pi, (e.target as L.Marker).getLatLng()),
              dragend: (e) => onMovePoint(ri, pi, (e.target as L.Marker).getLatLng()),
              contextmenu: (e) => {
                e.originalEvent.preventDefault();
                e.originalEvent.stopPropagation();
                onRemovePoint(ri, pi);
              },
              click: (e) => {
                e.originalEvent.stopPropagation();
              },
            }}
          />
        )),
      )}
    </>
  );
}
