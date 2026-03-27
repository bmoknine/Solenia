import type { FastifyInstance } from 'fastify';
import { positionInputSchema } from '@solenia/shared';
import { parseRouteUuid } from '../utils/routeParams';
import { requireRole } from '../utils/rbac';

const pickTarget = (data: { kingdomId?: string; cityId?: string; placeId?: string; personOfInterestId?: string }) => {
  const entries = [
    ['kingdomId', data.kingdomId],
    ['cityId', data.cityId],
    ['placeId', data.placeId],
    ['personOfInterestId', data.personOfInterestId],
  ].filter(([, v]) => Boolean(v)) as [string, string][];

  if (entries.length !== 1) return null;
  const [key, value] = entries[0];
  return { key, value };
};

export async function positionRoutes(app: FastifyInstance) {
  app.get('/positions', async () => {
    return app.prisma.position.findMany();
  });

  app.get('/positions/:id', async (request, reply) => {
    const id = parseRouteUuid(request);
    const position = await app.prisma.position.findUnique({ where: { id } });
    if (!position) return reply.notFound();
    return position;
  });

  app.post('/positions', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const data = positionInputSchema.parse(request.body);
    const target = pickTarget(data);
    if (!target) return reply.badRequest('Une position doit cibler exactement un élément.');

    const payload = { x: data.x, y: data.y, [target.key]: target.value };

    const position = await app.prisma.position.upsert({
      where: { [target.key]: target.value } as any,
      create: payload,
      update: payload,
    });
    return position;
  });

  app.delete('/positions/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    await app.prisma.position.delete({ where: { id } });
    reply.code(204);
  });
}

