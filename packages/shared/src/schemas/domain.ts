import { z } from 'zod';
import { soleniaDateInGameSchema } from '../solenia-calendar';

export const idSchema = z.string().uuid();

export const kingdomInputSchema = z.object({
  name: z.string().min(1),
  population: z.number().int().nonnegative().optional(),
  description: z.string().optional(),
  dateInGame: soleniaDateInGameSchema,
  isForDM: z.boolean().optional(),
  color: z.preprocess(
    (val) => (val === '' ? null : val),
    z.union([
      z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
      z.null(),
    ]).optional(),
  ),
});

export const cityInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  iconUrl: z.string().nullable().optional(),
  kingdomId: idSchema.optional(),
  isForDM: z.boolean().optional(),
});

export const districtInputSchema = z.object({
  name: z.string().min(1),
  motto: z.string().optional().nullable(),
  ambiance: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  rumors: z.string().optional().nullable(),
  secret: z.string().optional().nullable(),
  cityId: idSchema,
});

export const organisationTypeSchema = z.enum(['CELLULE', 'PRINCIPAL']);
export type OrganisationType = z.infer<typeof organisationTypeSchema>;

export const organisationInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  organisationType: organisationTypeSchema.optional().nullable(),
  parentOrganisationId: idSchema.optional().nullable(),
  isForDM: z.boolean().optional(),
  kingdomIds: z.array(idSchema).optional(),
  cityIds: z.array(idSchema).optional(),
  placeIds: z.array(idSchema).optional(),
  personIds: z.array(idSchema).optional(),
});

export const placeInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  iconUrl: z.string().nullable().optional(),
  kingdomId: idSchema.optional(),
  cityId: idSchema.optional(),
  districtId: idSchema.optional(),
  isForDM: z.boolean().optional(),
});

export const statsSchema = z.object({
  STR: z.number().int(),
  DEX: z.number().int(),
  CON: z.number().int(),
  INT: z.number().int(),
  WIS: z.number().int(),
  CHA: z.number().int(),
});

const breedEnum = z.enum([
  'ELFE',
  'HALFELIN',
  'HUMAIN',
  'NAIN',
  'DEMI_ELFE',
  'DEMI_ORC',
  'DRAKEIDE',
  'GNOME',
  'TIEFFELIN',
  'AASIMAR',
  'GENASIAIR',
  'GENASITERRE',
  'GENASIFEUR',
  'GENASIEAU',
  'GOLIATH',
  'OTHER',
]);

const sexEnum = z.enum(['MAN', 'WOMAN', 'OTHER']);

const membershipEnum = z.enum(['POLITIC', 'RELIGEUX', 'MARCHAND', 'CCCH', 'CRIMINALITE', 'OTHER']);

const languageEnum = z.enum([
  'COMMUN',
  'NAIN',
  'ELFIQUE',
  'GNOME',
  'HALFELIN',
  'ORC',
  'GOBELIN',
  'GEANT',
  'DRACONIQUE',
  'SYLVESTRE',
  'INFERNAL',
  'ABYSSAL',
  'CELESTE',
  'PRIMORDIAL',
  'AQUAN',
  'AURAN',
  'IGNAN',
  'TERRAN',
  'PROFOND',
  'SLAADI',
  'TELEPATHIQUE',
  'ARGOT_VOLEUR',
]);

export const personInputSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    breed: breedEnum.nullish(),
    sex: sexEnum.nullish(),
    membership: membershipEnum.nullish(),
    languages: z.array(languageEnum).default([]),
    isForDM: z.boolean().optional(),
    kingdomId: idSchema.nullish(),
    cityId: idSchema.nullish(),
    districtId: idSchema.nullish(),
    placeId: idSchema.nullish(),
  })
  .merge(statsSchema);

const commentInputBase = z.object({
  description: z.string().min(1),
  dateInGame: soleniaDateInGameSchema,
  kingdomId: idSchema.optional(),
  cityId: idSchema.optional(),
  districtId: idSchema.optional(),
  placeId: idSchema.optional(),
  personOfInterestId: idSchema.optional(),
});

export const commentInputSchema = commentInputBase.refine(
  (data) => Boolean(data.kingdomId || data.cityId || data.districtId || data.placeId || data.personOfInterestId),
  { message: 'Un commentaire doit cibler un élément.' },
);

/** Schéma pour la mise à jour partielle d’un commentaire (tous les champs optionnels). */
export const commentUpdateSchema = commentInputBase.partial();

export const positionInputSchema = z
  .object({
    x: z.number(),
    y: z.number(),
    kingdomId: idSchema.optional(),
    cityId: idSchema.optional(),
    placeId: idSchema.optional(),
    personOfInterestId: idSchema.optional(),
  })
  .refine((data) => {
    const count =
      Number(Boolean(data.kingdomId)) +
      Number(Boolean(data.cityId)) +
      Number(Boolean(data.placeId)) +
      Number(Boolean(data.personOfInterestId));
    return count === 1;
  }, { message: 'Une position doit cibler exactement un élément.' });

export const loreInputSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  tag: z.string().optional().nullable(),
  dateInGame: z.number().optional().nullable(),
  summary: z.string().optional().nullable(),
  isForDM: z.boolean().optional(),
  kingdomIds: z.array(idSchema).optional(),
  cityIds: z.array(idSchema).optional(),
  placeIds: z.array(idSchema).optional(),
  personIds: z.array(idSchema).optional(),
  organisationIds: z.array(idSchema).optional(),
});

export type KingdomInput = z.infer<typeof kingdomInputSchema>;
export type CityInput = z.infer<typeof cityInputSchema>;
export type DistrictInput = z.infer<typeof districtInputSchema>;
export type OrganisationInput = z.infer<typeof organisationInputSchema>;
export type PlaceInput = z.infer<typeof placeInputSchema>;
export type PersonInput = z.infer<typeof personInputSchema>;
export type CommentInput = z.infer<typeof commentInputSchema>;
export type CommentUpdate = z.infer<typeof commentUpdateSchema>;
export type PositionInput = z.infer<typeof positionInputSchema>;
export type LoreInput = z.infer<typeof loreInputSchema>;

