import { z } from 'zod';

export const idSchema = z.string().uuid();

export const kingdomInputSchema = z.object({
  name: z.string().min(1),
  population: z.number().int().nonnegative().optional(),
  description: z.string().optional(),
  dateInGame: z.string().datetime().optional(),
});

export const cityInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  iconUrl: z.string().nullable().optional(),
  kingdomId: idSchema.optional(),
});

export const placeInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  iconUrl: z.string().nullable().optional(),
  kingdomId: idSchema.optional(),
  cityId: idSchema.optional(),
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
    kingdomId: idSchema.nullish(),
    cityId: idSchema.nullish(),
    placeId: idSchema.nullish(),
  })
  .merge(statsSchema);

export const commentInputSchema = z
  .object({
    description: z.string().min(1),
    dateInGame: z.string().datetime().optional(),
    kingdomId: idSchema.optional(),
    cityId: idSchema.optional(),
    placeId: idSchema.optional(),
    personOfInterestId: idSchema.optional(),
  })
  .refine(
    (data) => Boolean(data.kingdomId || data.cityId || data.placeId || data.personOfInterestId),
    { message: 'Un commentaire doit cibler un élément.' },
  );

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

export type KingdomInput = z.infer<typeof kingdomInputSchema>;
export type CityInput = z.infer<typeof cityInputSchema>;
export type PlaceInput = z.infer<typeof placeInputSchema>;
export type PersonInput = z.infer<typeof personInputSchema>;
export type CommentInput = z.infer<typeof commentInputSchema>;
export type PositionInput = z.infer<typeof positionInputSchema>;

