import type { FastifyInstance } from 'fastify';
import { cityInputSchema, idSchema } from '@solenia/shared';
import { requireRole } from '../utils/rbac';

export async function cityRoutes(app: FastifyInstance) {
  app.get('/cities', async () => {
    return app.prisma.city.findMany({
      include: { position: true },
      orderBy: { name: 'asc' },
    });
  });

  app.get('/cities/:id', async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    const city = await app.prisma.city.findUnique({
      where: { id },
      include: { position: true },
    });
    if (!city) return reply.notFound();
    return city;
  });

  app.post('/cities', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const data = cityInputSchema.parse(request.body);
    return app.prisma.city.create({ data });
  });

  app.put('/cities/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const id = idSchema.parse((request.params as any).id);
    const data = cityInputSchema.partial().parse(request.body);
    return app.prisma.city.update({ where: { id }, data });
  });

  app.delete('/cities/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    await app.prisma.city.delete({ where: { id } });
    reply.code(204);
  });
}

