import type { FastifyInstance, preHandlerHookHandler } from 'fastify';
import type { UserType } from '@solenia/shared';

export const requireRole = (app: FastifyInstance, roles: UserType[]): preHandlerHookHandler[] => [
  app.authenticate,
  async (request, reply) => {
    const type = request.user?.type as UserType | undefined;
    if (!type || !roles.includes(type)) {
      return reply.forbidden('Accès refusé.');
    }
  },
];

