import type { DetailModalProps, ExtendedMapPoint } from './detailModalTypes';

/** Entrée dans la pile de navigation des modales de détail. */
export type DetailStackEntry =
  | { type: 'entity'; point: ExtendedMapPoint }
  | { type: 'lore'; loreId: string }
  | { type: 'create'; createMode: NonNullable<DetailModalProps['createMode']> }
  /** Marqueur virtuel : retour à la frise Lore (LoreModal). */
  | { type: 'lore-frise' };

const CREATE_KIND_LABELS: Record<string, string> = {
  kingdom: 'Royaume',
  city: 'Ville',
  district: 'Quartier',
  place: 'Lieu',
  person: 'Personnage',
  playerCharacter: 'Personnage joueur',
  organisation: 'Organisation',
  lore: 'Lore',
};

/** Libellé du bouton retour selon l'entrée précédente dans la pile. */
export function getBackLabel(entry: DetailStackEntry): string {
  switch (entry.type) {
    case 'lore-frise':
      return 'Frise';
    case 'lore':
      return 'Lore';
    case 'entity':
      return entry.point.name?.trim() || 'Retour';
    case 'create': {
      const kind = entry.createMode.kind ?? 'entité';
      return CREATE_KIND_LABELS[kind] ?? 'Création';
    }
  }
}

/** Convertit l'entrée courante en props DetailModal. */
export function stackEntryToModalProps(entry: DetailStackEntry): Pick<
  DetailModalProps,
  'point' | 'loreId' | 'createMode'
> {
  switch (entry.type) {
    case 'entity':
      return { point: entry.point, loreId: null, createMode: undefined };
    case 'lore':
      return { point: null, loreId: entry.loreId, createMode: undefined };
    case 'create':
      return { point: null, loreId: null, createMode: entry.createMode };
    case 'lore-frise':
      return { point: null, loreId: null, createMode: undefined };
  }
}

export function isModalOpen(stack: DetailStackEntry[]): boolean {
  const top = stack[stack.length - 1];
  return !!top && top.type !== 'lore-frise';
}
