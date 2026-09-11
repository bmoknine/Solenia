import { z } from 'zod';
import { idSchema } from './domain';

export const COMBAT_STATUS_VALUES = ['ACTIVE', 'FINISHED'] as const;
export const QUEST_STATUS_VALUES = ['A_FAIRE', 'EN_COURS', 'TERMINEE', 'ECHOUEE'] as const;
export const QUEST_STEP_STATUS_VALUES = ['A_FAIRE', 'EN_COURS', 'FAITE'] as const;

export const combatStatusSchema = z.enum(COMBAT_STATUS_VALUES);
export const questStatusSchema = z.enum(QUEST_STATUS_VALUES);
export const questStepStatusSchema = z.enum(QUEST_STEP_STATUS_VALUES);

export const combatInputSchema = z.object({
  name: z.string().min(1),
  questStepId: idSchema.nullish(),
});

export const combatUpdateSchema = z
  .object({
    name: z.string().min(1),
    round: z.number().int().min(1),
    activeTurnIndex: z.number().int().min(0),
    status: combatStatusSchema,
    questStepId: idSchema.nullable(),
  })
  .partial();

export const combatantInputSchema = z.object({
  name: z.string().min(1),
  playerCharacterId: idSchema.nullish(),
  personId: idSchema.nullish(),
  initiativeRoll: z.number().int().default(0),
  currentHp: z.number().int(),
  maxHp: z.number().int().min(1),
  ca: z.number().int().nullish(),
  conditions: z.array(z.string()).default([]),
});

export const combatantUpdateSchema = combatantInputSchema.partial();

export const campaignInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullish(),
  color: z.string().nullish(),
  order: z.number().int().default(0),
  playerCharacterIds: idSchema.array().optional(), // joueurs de la campagne (set complet)
});

export const campaignUpdateSchema = campaignInputSchema.partial();

export const questInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullish(),
  status: questStatusSchema.default('A_FAIRE'),
  notes: z.string().nullish(),
  order: z.number().int().default(0),
  campaignId: idSchema.nullish(),
});

export const questUpdateSchema = questInputSchema.partial();

export const questStepInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullish(),
  status: questStepStatusSchema.default('A_FAIRE'),
  optional: z.boolean().optional(),
  order: z.number().int().default(0),
});

export const questStepUpdateSchema = questStepInputSchema.partial();

export const gameSessionInputSchema = z.object({
  date: z.string().min(1), // ISO string, convertie en Date côté route
  title: z.string().nullish(),
  summary: z.string().nullish(),
  campaignId: idSchema.nullish(),
});

export const gameSessionUpdateSchema = gameSessionInputSchema.partial();
