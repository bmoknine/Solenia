import { Fragment } from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import type { KingdomBorder } from '../../api/map';

type Props = {
  borders: KingdomBorder[];
  imgSize: { width: number; height: number };
  /** Id du royaume en cours d'édition : sa frontière statique est masquée (l'éditeur la reprend). */
  hiddenKingdomId?: string | null;
  onSelect?: (kingdomId: string) => void;
};

const DEFAULT_COLOR = '#8a8f98';

/**
 * Couche des frontières de royaumes : un polygone rempli par anneau ayant au moins 3 sommets.
 * Un royaume peut avoir plusieurs anneaux (archipels / enclaves). Les sommets sont stockés en
 * ratio 0..1 puis convertis en coordonnées carte (pixels image), donc les polygones se
 * reprojettent seuls au zoom (espace CRS.Simple).
 */
export function KingdomBorderLayer({ borders, imgSize, hiddenKingdomId, onSelect }: Props) {
  return (
    <>
      {borders.map((b) => {
        if (b.id === hiddenKingdomId) return null;
        const color = b.color || DEFAULT_COLOR;
        const rings = b.rings.filter((ring) => ring.length >= 3);
        if (rings.length === 0) return null;
        return (
          <Fragment key={b.id}>
            {rings.map((ring, ri) => {
              const positions: LatLngExpression[] = ring.map(
                ([x, y]) => [y * imgSize.height, x * imgSize.width] as [number, number],
              );
              return (
                <Polygon
                  key={ri}
                  positions={positions}
                  pathOptions={{ color, weight: 2, fillColor: color, fillOpacity: 0.15 }}
                  eventHandlers={
                    onSelect
                      ? {
                          click: (e) => {
                            e.originalEvent.stopPropagation();
                            onSelect(b.id);
                          },
                        }
                      : undefined
                  }
                >
                  <Tooltip sticky direction="top" className="kingdom-border-tooltip">
                    {b.name}
                  </Tooltip>
                </Polygon>
              );
            })}
          </Fragment>
        );
      })}
    </>
  );
}
