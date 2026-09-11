import type { FastifyInstance } from 'fastify';
import {
  questInputSchema,
  questUpdateSchema,
  questStepInputSchema,
  questStepUpdateSchema,
} from '@solenia/shared';
import { requireRole } from '../utils/rbac';
import { parseRouteUuid } from '../utils/routeParams';

const gmOnly = (app: FastifyInstance) => requireRole(app, ['admin', 'editor']);

// Note : le champ `optional` (péripétie facultative) transite via questStep(Input|Update)Schema
// — pas de transformation particulière côté route.

export async function questRoutes(app: FastifyInstance) {
  app.get('/quests', { preHandler: gmOnly(app) }, async () => {
    return app.prisma.quest.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      include: {
        steps: {
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
          include: {
            combats: {
              select: { id: true, name: true, status: true, round: true },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });
  });

  app.post('/quests', { preHandler: gmOnly(app) }, async (request) => {
    const data = questInputSchema.parse(request.body);
    return app.prisma.quest.create({
      data,
      include: {
        steps: {
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
          include: {
            combats: {
              select: { id: true, name: true, status: true, round: true },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });
  });

  app.put('/quests/:id', { preHandler: gmOnly(app) }, async (request) => {
    const id = parseRouteUuid(request);
    const data = questUpdateSchema.parse(request.body);
    return app.prisma.quest.update({
      where: { id },
      data,
      include: {
        steps: {
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
          include: {
            combats: {
              select: { id: true, name: true, status: true, round: true },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });
  });

  app.delete('/quests/:id', { preHandler: gmOnly(app) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    await app.prisma.quest.delete({ where: { id } });
    return reply.code(204).send();
  });

  // ─── Péripéties (QuestStep) ───────────────────────────────────────────────
  app.post('/quests/:id/steps', { preHandler: gmOnly(app) }, async (request) => {
    const questId = parseRouteUuid(request);
    const data = questStepInputSchema.parse(request.body);
    return app.prisma.questStep.create({ data: { ...data, questId } });
  });

  app.put('/quest-steps/:id', { preHandler: gmOnly(app) }, async (request) => {
    const id = parseRouteUuid(request);
    const data = questStepUpdateSchema.parse(request.body);
    return app.prisma.questStep.update({ where: { id }, data });
  });

  app.delete('/quest-steps/:id', { preHandler: gmOnly(app) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    await app.prisma.questStep.delete({ where: { id } });
    return reply.code(204).send();
  });
}
