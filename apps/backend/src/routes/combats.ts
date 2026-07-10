import type { FastifyInstance } from 'fastify';
import {
  combatInputSchema,
  combatUpdateSchema,
  combatantInputSchema,
  combatantUpdateSchema,
} from '@solenia/shared';
import { requireRole } from '../utils/rbac';
import { parseRouteUuid } from '../utils/routeParams';

const gmOnly = (app: FastifyInstance) => requireRole(app, ['admin', 'editor']);

export async function combatRoutes(app: FastifyInstance) {
  app.get('/combats', { preHandler: gmOnly(app) }, async () => {
    return app.prisma.combat.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { combatants: true } } },
    });
  });

  app.post('/combats', { preHandler: gmOnly(app) }, async (request) => {
    const data = combatInputSchema.parse(request.body);
    return app.prisma.combat.create({ data });
  });

  app.get('/combats/:id', { preHandler: gmOnly(app) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    const combat = await app.prisma.combat.findUnique({
      where: { id },
      include: {
        combatants: {
          orderBy: [{ initiativeRoll: 'desc' }, { createdAt: 'asc' }],
        },
      },
    });
    if (!combat) return reply.notFound('Combat introuvable.');
    return combat;
  });

  app.put('/combats/:id', { preHandler: gmOnly(app) }, async (request) => {
    const id = parseRouteUuid(request);
    const data = combatUpdateSchema.parse(request.body);
    return app.prisma.combat.update({ where: { id }, data });
  });

  app.delete('/combats/:id', { preHandler: gmOnly(app) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    await app.prisma.combat.delete({ where: { id } });
    return reply.code(204).send();
  });

  app.post('/combats/:id/combatants', { preHandler: gmOnly(app) }, async (request) => {
    const combatId = parseRouteUuid(request);
    const data = combatantInputSchema.parse(request.body);
    return app.prisma.combatant.create({ data: { ...data, combatId } });
  });

  app.put('/combatants/:id', { preHandler: gmOnly(app) }, async (request) => {
    const id = parseRouteUuid(request);
    const data = combatantUpdateSchema.parse(request.body);
    return app.prisma.combatant.update({ where: { id }, data });
  });

  app.delete('/combatants/:id', { preHandler: gmOnly(app) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    await app.prisma.combatant.delete({ where: { id } });
    return reply.code(204).send();
  });
}
