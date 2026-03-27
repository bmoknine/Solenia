import type { FastifyInstance } from 'fastify';
import { commentInputSchema, commentUpdateSchema, parseSoleniaDate } from '@solenia/shared';
import { requireRole } from '../utils/rbac';
import { parseRouteUuid } from '../utils/routeParams';

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
    const id = parseRouteUuid(request);
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
        dateInGame: parseSoleniaDate(data.dateInGame) ?? undefined,
        authorId: request.user?.sub,
      },
    });
  });

  app.put('/comments/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    const data = commentUpdateSchema.parse(request.body);
    const { dateInGame: rawDate, ...rest } = data;
    return app.prisma.comment.update({
      where: { id },
      data: {
        ...rest,
        ...(rawDate !== undefined && { dateInGame: parseSoleniaDate(rawDate) ?? null }),
      },
    });
  });

  app.delete('/comments/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    await app.prisma.comment.delete({ where: { id } });
    reply.code(204);
  });
}

