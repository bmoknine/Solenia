import type { LoreDetail } from '../../api/entities';

/** État d’édition d’une Lore dans la modale détail (IDs des liens + kind). */
export type LoreEditState = Partial<LoreDetail> & {
  kind: 'lore';
  kingdomIds?: string[];
  cityIds?: string[];
  placeIds?: string[];
  personIds?: string[];
  organisationIds?: string[];
};
