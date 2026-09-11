import type { FastifyInstance } from 'fastify';
import { campaignInputSchema, campaignUpdateSchema } from '@solenia/shared';
import { requireRole } from '../utils/rbac';
import { parseRouteUuid } from '../utils/routeParams';

const gmOnly = (app: FastifyInstance) => requireRole(app, ['admin', 'editor']);

const playersInclude = {
  players: { select: { id: true, name: true }, orderBy: { name: 'asc' } },
} as const;

export async function campaignRoutes(app: FastifyInstance) {
  app.get('/campaigns', { preHandler: gmOnly(app) }, async () => {
    return app.prisma.campaign.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      include: { _count: { select: { quests: true } }, ...playersInclude },
    });
  });

  app.post('/campaigns', { preHandler: gmOnly(app) }, async (request) => {
    const { playerCharacterIds, ...data } = campaignInputSchema.parse(request.body);
    return app.prisma.campaign.create({
      data: {
        ...data,
        ...(playerCharacterIds ? { players: { connect: playerCharacterIds.map((id) => ({ id })) } } : {}),
      },
      include: { _count: { select: { quests: true } }, ...playersInclude },
    });
  });

  app.put('/campaigns/:id', { preHandler: gmOnly(app) }, async (request) => {
    const id = parseRouteUuid(request);
    const { playerCharacterIds, ...data } = campaignUpdateSchema.parse(request.body);
    return app.prisma.campaign.update({
      where: { id },
      data: {
        ...data,
        ...(playerCharacterIds ? { players: { set: playerCharacterIds.map((pid) => ({ id: pid })) } } : {}),
      },
      include: { _count: { select: { quests: true } }, ...playersInclude },
    });
  });

  app.delete('/campaigns/:id', { preHandler: gmOnly(app) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    // Les quêtes rattachées voient leur campaignId passer à null (onDelete: SetNull) → bucket « Non classé ».
    await app.prisma.campaign.delete({ where: { id } });
    return reply.code(204).send();
  });
}
