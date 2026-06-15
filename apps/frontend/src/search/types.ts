import type { EntityKind } from '../api/map';

export type SearchableKind = EntityKind | 'lore';

export type GlobalSearchResult = {
  /** Clé unique pour React (`kind:targetId`) */
  id: string;
  kind: SearchableKind;
  targetId: string;
  name: string;
  description: string | null;
  /** Extrait de la description avec le terme recherché en contexte */
  snippet: string | null;
  x: number;
  y: number;
};
