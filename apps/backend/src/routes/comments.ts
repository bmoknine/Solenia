import type { FastifyInstance } from 'fastify';
import { commentInputSchema, idSchema } from '@solenia/shared';
import { requireRole } from '../utils/rbac';

export async function commentRoutes(app: FastifyInstance) {
  app.get('/comments', async () => {
    return app.prisma.comment.findMany({
      include: {
        author: { select: { id: true, username: true, email: true, type: true } },
      },
      orderBy: { dateInGame: 'desc' },
    });
  });

  app.get('/comments/:id', async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    const comment = await app.prisma.comment.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, email: true, type: true } },
      },
    });
    if (!comment) return reply.notFound();
    return comment;
  });

  app.post('/comments', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const data = commentInputSchema.parse(request.body);
    return app.prisma.comment.create({
      data: {
        ...data,
        dateInGame: data.dateInGame ? new Date(data.dateInGame) : undefined,
        authorId: request.user?.sub,
      },
    });
  });

  app.put('/comments/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    const data = commentInputSchema.partial().parse(request.body);
    return app.prisma.comment.update({
      where: { id },
      data: {
        ...data,
        dateInGame: data.dateInGame ? new Date(data.dateInGame) : undefined,
      },
    });
  });

  app.delete('/comments/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    await app.prisma.comment.delete({ where: { id } });
    reply.code(204);
  });
}

