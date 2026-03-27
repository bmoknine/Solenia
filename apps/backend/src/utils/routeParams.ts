import type { FastifyRequest } from 'fastify';
import { idSchema } from '@solenia/shared';

/**
 * Extrait et valide un UUID depuis les paramètres de route (`:id`, `:personId`, etc.).
 * Évite la répétition de `idSchema.parse((request.params as any).…)` dans chaque handler.
 */
export function parseRouteUuid(request: FastifyRequest, paramName = 'id'): string {
  const raw = (request.params as Record<string, unknown>)[paramName];
  return idSchema.parse(raw);
}
