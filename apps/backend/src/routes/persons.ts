import type { FastifyInstance } from 'fastify';
import { idSchema, personInputSchema } from '@solenia/shared';
import { requireRole } from '../utils/rbac';

export async function personRoutes(app: FastifyInstance) {
  app.get('/persons', async () => {
    return app.prisma.personOfInterest.findMany({
      include: { position: true },
      orderBy: { name: 'asc' },
    });
  });

  app.get('/persons/:id', async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    const person = await app.prisma.personOfInterest.findUnique({
      where: { id },
      include: { position: true },
    });
    if (!person) return reply.notFound();
    return person;
  });

  app.post('/persons', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const data = personInputSchema.parse(request.body);
    return app.prisma.personOfInterest.create({ data });
  });

  app.put('/persons/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const id = idSchema.parse((request.params as any).id);
    const data = personInputSchema.partial().parse(request.body);
    return app.prisma.personOfInterest.update({ where: { id }, data });
  });

  app.delete('/persons/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    await app.prisma.personOfInterest.delete({ where: { id } });
    reply.code(204);
  });
}

