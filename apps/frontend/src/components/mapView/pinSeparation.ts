import L from 'leaflet';
import type { MapPoint } from '../../api/map';

/** Pins dont le rendu à l’écran est à moins de `thresholdPx` pixels du point cliqué (hors le pin lui-même). */
export function findNearbyPinsInPixels(
  map: L.Map,
  clickPoint: MapPoint,
  allPoints: MapPoint[],
  toLatLng: (p: MapPoint) => [number, number],
  thresholdPx = 25,
): MapPoint[] {
  return allPoints.filter((otherPoint) => {
    const pos1 = toLatLng(clickPoint);
    const pos2 = toLatLng(otherPoint);
    const containerPoint1 = map.latLngToContainerPoint(pos1);
    const containerPoint2 = map.latLngToContainerPoint(pos2);
    const distance = Math.sqrt(
      (containerPoint1.x - containerPoint2.x) ** 2 + (containerPoint1.y - containerPoint2.y) ** 2,
    );
    return distance < thresholdPx && otherPoint.id !== clickPoint.id;
  });
}

/** Positions en cercle autour du pin central pour décaler visuellement les pins superposés. */
export function separatedPositionsCircle(
  map: L.Map,
  center: MapPoint,
  nearbyPins: MapPoint[],
  toLatLng: (p: MapPoint) => [number, number],
  radiusPx = 50,
): Map<string, [number, number]> {
  const centerLatLng = toLatLng(center);
  const centerContainer = map.latLngToContainerPoint(centerLatLng);
  const positions = new Map<string, [number, number]>();
  const allPins = [center, ...nearbyPins];

  allPins.forEach((pin, index) => {
    if (index === 0) {
      positions.set(pin.id, toLatLng(pin));
    } else {
      const angle = ((index - 1) * 2 * Math.PI) / nearbyPins.length;
      const offsetX = Math.cos(angle) * radiusPx;
      const offsetY = Math.sin(angle) * radiusPx;
      const newContainerPoint = L.point(centerContainer.x + offsetX, centerContainer.y + offsetY);
      const newLatLng = map.containerPointToLatLng(newContainerPoint);
      positions.set(pin.id, [newLatLng.lat, newLatLng.lng]);
    }
  });

  return positions;
}
