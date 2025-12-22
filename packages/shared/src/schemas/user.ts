import { z } from 'zod';

export const userTypeSchema = z.enum(['admin', 'editor', 'viewer']);
export type UserType = z.infer<typeof userTypeSchema>;

