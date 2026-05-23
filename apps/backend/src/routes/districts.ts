import type { FastifyInstance } from 'fastify';
import { districtInputSchema } from '@solenia/shared';
import { requireRole } from '../utils/rbac';
import { parseRouteUuid } from '../utils/routeParams';

export async function districtRoutes(app: FastifyInstance) {
  app.get('/districts', async () => {
    return app.prisma.district.findMany({
      include: { 
        city: { select: { id: true, name: true } }
      },
      orderBy: { name: 'asc' },
    });
  });

  app.get('/districts/:id', async (request, reply) => {
    const id = parseRouteUuid(request);
    const district = await app.prisma.district.findUnique({
      where: { id },
      include: {
        city: { select: { id: true, name: true } },
        places: { select: { id: true, name: true, iconUrl: true, placeType: true } },
        persons: { select: { id: true, name: true } },
        comments: { select: { id: true, description: true, dateInGame: true } },
      },
    });
    if (!district) return reply.notFound();
    return district;
  });

  app.post('/districts', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const data = districtInputSchema.parse(request.body);
    return app.prisma.district.create({ data });
  });

  app.put('/districts/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const id = parseRouteUuid(request);
    const rawData = districtInputSchema.partial().parse(request.body);
    // Convertir undefined en null pour les champs optionnels qu'on veut mettre à null
    const data: Record<string, unknown> = {};
    if ('name' in rawData) data.name = rawData.name;
    if ('motto' in rawData) data.motto = rawData.motto ?? null;
    if ('ambiance' in rawData) data.ambiance = rawData.ambiance ?? null;
    if ('content' in rawData) data.content = rawData.content ?? null;
    if ('rumors' in rawData) data.rumors = rawData.rumors ?? null;
    if ('secret' in rawData) data.secret = rawData.secret ?? null;
    if ('cityId' in rawData) data.cityId = rawData.cityId;
    return app.prisma.district.update({ where: { id }, data });
  });

  app.delete('/districts/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    await app.prisma.district.delete({ where: { id } });
    reply.code(204);
  });
}
