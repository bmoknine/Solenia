import type { FastifyInstance } from 'fastify';
import { gameSessionInputSchema, gameSessionUpdateSchema } from '@solenia/shared';
import { requireRole } from '../utils/rbac';
import { parseRouteUuid } from '../utils/routeParams';

const gmOnly = (app: FastifyInstance) => requireRole(app, ['admin', 'editor']);

export async function gameSessionRoutes(app: FastifyInstance) {
  app.get('/game-sessions', { preHandler: gmOnly(app) }, async () => {
    return app.prisma.gameSession.findMany({ orderBy: { date: 'desc' } });
  });

  app.post('/game-sessions', { preHandler: gmOnly(app) }, async (request) => {
    const { date, ...rest } = gameSessionInputSchema.parse(request.body);
    return app.prisma.gameSession.create({ data: { ...rest, date: new Date(date) } });
  });

  app.put('/game-sessions/:id', { preHandler: gmOnly(app) }, async (request) => {
    const id = parseRouteUuid(request);
    const { date, ...rest } = gameSessionUpdateSchema.parse(request.body);
    return app.prisma.gameSession.update({
      where: { id },
      data: { ...rest, ...(date !== undefined ? { date: new Date(date) } : {}) },
    });
  });

  app.delete('/game-sessions/:id', { preHandler: gmOnly(app) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    await app.prisma.gameSession.delete({ where: { id } });
    return reply.code(204).send();
  });
}
