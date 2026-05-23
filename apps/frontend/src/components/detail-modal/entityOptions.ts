import {
  PERSON_BREED_VALUES,
  PERSON_FP_FRACTION_VALUES,
  PERSON_FP_INTEGER_VALUES,
  PERSON_LANGUAGE_VALUES,
  PERSON_MEMBERSHIP_VALUES,
  PERSON_SEX_VALUES,
  PLACE_TYPE_VALUES,
} from '@solenia/shared';
import type { Breed, Sex, Membership, Language, PlaceType } from '../../api/entities';

export const BREED_OPTIONS = PERSON_BREED_VALUES as readonly Breed[];
export const SEX_OPTIONS = PERSON_SEX_VALUES as readonly Sex[];
export const MEMBERSHIP_OPTIONS = PERSON_MEMBERSHIP_VALUES as readonly Membership[];
export const LANGUAGE_OPTIONS = PERSON_LANGUAGE_VALUES as readonly Language[];
export const PLACE_TYPE_OPTIONS = PLACE_TYPE_VALUES as readonly PlaceType[];
export const FP_FRACTION_OPTIONS = PERSON_FP_FRACTION_VALUES;
export const FP_INTEGER_OPTIONS = PERSON_FP_INTEGER_VALUES;
