import type { FastifyInstance } from 'fastify';
import { questInputSchema, questUpdateSchema } from '@solenia/shared';
import { requireRole } from '../utils/rbac';
import { parseRouteUuid } from '../utils/routeParams';

const gmOnly = (app: FastifyInstance) => requireRole(app, ['admin', 'editor']);

export async function questRoutes(app: FastifyInstance) {
  app.get('/quests', { preHandler: gmOnly(app) }, async () => {
    return app.prisma.quest.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  });

  app.post('/quests', { preHandler: gmOnly(app) }, async (request) => {
    const data = questInputSchema.parse(request.body);
    return app.prisma.quest.create({ data });
  });

  app.put('/quests/:id', { preHandler: gmOnly(app) }, async (request) => {
    const id = parseRouteUuid(request);
    const data = questUpdateSchema.parse(request.body);
    return app.prisma.quest.update({ where: { id }, data });
  });

  app.delete('/quests/:id', { preHandler: gmOnly(app) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    await app.prisma.quest.delete({ where: { id } });
    return reply.code(204).send();
  });
}
