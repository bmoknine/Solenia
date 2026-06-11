import type { MapPoint, NavigablePoint } from '../../api/map';
import type {
  KingdomDetail,
  CityDetail,
  DistrictDetail,
  PlaceDetail,
  PersonDetail,
  OrganisationDetail,
  LoreDetail,
  PlayerCharacterDetail,
} from '../../api/entities';
import type { LoreEditState } from './loreTypes';

/** Point carte / navigation (union avec variantes internes). */
export type ExtendedMapPoint = MapPoint | {
  id: string;
  x: number;
  y: number;
  kind: 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation' | 'playerCharacter' | 'unknown';
  targetId: string | null;
  name: string;
  description: string | null;
  iconUrl?: string | null;
};

export type DetailModalProps = {
  point: ExtendedMapPoint | null;
  onClose: () => void;
  /** Retour à la vue précédente dans la pile (si définie). */
  onBack?: () => void;
  /** Libellé du bouton retour (ex. nom de l'entité précédente, « Frise »). */
  backLabel?: string;
  token?: string | null;
  onUpdated?: () => void;
  onDelete?: (point: MapPoint) => void;
  onNavigate?: (point: NavigablePoint) => void;
  onCreateDistrict?: (cityId: string) => void;
  onOpenLore?: (loreId: string) => void;
  loreId?: string | null;
  createMode?: {
    kind: MapPoint['kind'] | 'district' | 'organisation' | 'lore' | 'playerCharacter';
    initialPosition?: { x: number; y: number };
    parentCityId?: string;
  };
};

export type EntityData =
  | KingdomDetail
  | CityDetail
  | DistrictDetail
  | PlaceDetail
  | PersonDetail
  | OrganisationDetail
  | LoreDetail
  | PlayerCharacterDetail
  | null;

export type PersonEditState = Partial<PersonDetail> & {
  kind: 'person';
  kingdomId?: string | null;
  cityId?: string | null;
  districtId?: string | null;
  placeId?: string | null;
  organisationIds?: string[];
};

export type DistrictEditState = Partial<DistrictDetail> & {
  kind: 'district';
  cityId: string;
};

export type OrganisationEditState = Partial<OrganisationDetail> & {
  kind: 'organisation';
  parentOrganisationId?: string | null;
  kingdomIds?: string[];
  cityIds?: string[];
  placeIds?: string[];
  personIds?: string[];
};

export type PlayerCharacterEditState = Partial<PlayerCharacterDetail> & {
  kind: 'playerCharacter';
  kingdomId?: string | null;
  cityId?: string | null;
  districtId?: string | null;
  placeId?: string | null;
};

export type EditState =
  | (Partial<KingdomDetail> & { kind: 'kingdom' })
  | (Partial<CityDetail> & { kind: 'city' })
  | DistrictEditState
  | (Partial<PlaceDetail> & { kind: 'place'; organisationIds?: string[]; playerCharacterIds?: string[] })
  | PersonEditState
  | OrganisationEditState
  | LoreEditState
  | PlayerCharacterEditState
  | null;

export type DetailComment = { id: string; description: string; dateInGame?: string | null };
