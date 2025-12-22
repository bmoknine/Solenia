import type { FastifyInstance } from 'fastify';
import { idSchema, placeInputSchema } from '@solenia/shared';
import { requireRole } from '../utils/rbac';

export async function placeRoutes(app: FastifyInstance) {
  app.get('/places', async () => {
    return app.prisma.place.findMany({
      include: { position: true },
      orderBy: { name: 'asc' },
    });
  });

  app.get('/places/:id', async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    const place = await app.prisma.place.findUnique({
      where: { id },
      include: { position: true },
    });
    if (!place) return reply.notFound();
    return place;
  });

  app.post('/places', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const data = placeInputSchema.parse(request.body);
    return app.prisma.place.create({ data });
  });

  app.put('/places/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const id = idSchema.parse((request.params as any).id);
    const data = placeInputSchema.partial().parse(request.body);
    return app.prisma.place.update({ where: { id }, data });
  });

  app.delete('/places/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    await app.prisma.place.delete({ where: { id } });
    reply.code(204);
  });
}

