import type { NavigablePoint, EntityKind } from '../../api/map';

export function createMapPointFromRef(ref: { id: string; name: string }, kind: EntityKind): NavigablePoint {
  return {
    id: ref.id,
    x: 0,
    y: 0,
    kind,
    targetId: ref.id,
    name: ref.name,
    description: null,
  };
}

/** Navigation vers une fiche organisation depuis une référence minimale. */
export function organisationRefToNavPoint(ref: { id: string; name: string }): NavigablePoint {
  return createMapPointFromRef(ref, 'organisation');
}
