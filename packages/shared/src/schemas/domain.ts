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
  kingdomId: idSchema.optional(),
});

export const placeInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
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

export const personInputSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    membership: z.string().optional(),
    languages: z.array(z.string()).default([]),
    kingdomId: idSchema.optional(),
    cityId: idSchema.optional(),
    placeId: idSchema.optional(),
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

