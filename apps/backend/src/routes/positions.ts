import type { FastifyInstance } from 'fastify';
import type { Prisma } from '@prisma/client';
import { positionInputSchema } from '@solenia/shared';
import { parseRouteUuid } from '../utils/routeParams';
import { requireRole } from '../utils/rbac';

type TargetKey = 'kingdomId' | 'cityId' | 'placeId' | 'personOfInterestId';

const pickTarget = (data: { kingdomId?: string; cityId?: string; placeId?: string; personOfInterestId?: string }) => {
  const entries = (
    [
      ['kingdomId', data.kingdomId],
      ['cityId', data.cityId],
      ['placeId', data.placeId],
      ['personOfInterestId', data.personOfInterestId],
    ] as const
  ).filter((entry): entry is [TargetKey, string] => Boolean(entry[1]));

  if (entries.length !== 1) return null;
  return { key: entries[0][0], value: entries[0][1] };
};

function positionWhereUnique(key: TargetKey, value: string): Prisma.PositionWhereUniqueInput {
  switch (key) {
    case 'kingdomId':
      return { kingdomId: value };
    case 'cityId':
      return { cityId: value };
    case 'placeId':
      return { placeId: value };
    case 'personOfInterestId':
      return { personOfInterestId: value };
    default: {
      const _x: never = key;
      throw new Error(`Clé position inconnue: ${String(_x)}`);
    }
  }
}

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
      where: positionWhereUnique(target.key, target.value),
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

