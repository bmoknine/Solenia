import type { FastifyInstance } from 'fastify';
import { idSchema, kingdomInputSchema } from '@solenia/shared';
import { requireRole } from '../utils/rbac';

export async function kingdomRoutes(app: FastifyInstance) {
  app.get('/kingdoms', async () => {
    return app.prisma.kingdom.findMany({
      include: { position: true },
      orderBy: { name: 'asc' },
    });
  });

  app.get('/kingdoms/:id', async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    const kingdom = await app.prisma.kingdom.findUnique({
      where: { id },
      include: {
        position: true,
        cities: { select: { id: true, name: true } },
        places: { select: { id: true, name: true } },
        persons: { select: { id: true, name: true } },
        comments: { select: { id: true, description: true, dateInGame: true } },
      },
    });
    if (!kingdom) return reply.notFound();
    return kingdom;
  });

  app.post('/kingdoms', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const data = kingdomInputSchema.parse(request.body);
    return app.prisma.kingdom.create({
      data: {
        ...data,
        dateInGame: data.dateInGame ? new Date(data.dateInGame) : undefined,
      },
    });
  });

  app.put('/kingdoms/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    const data = kingdomInputSchema.partial().parse(request.body);
    const kingdom = await app.prisma.kingdom.update({
      where: { id },
      data: {
        ...data,
        dateInGame: data.dateInGame ? new Date(data.dateInGame) : undefined,
      },
    });
    return kingdom;
  });

  app.delete('/kingdoms/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4b615a6a-3388-40b4-9df2-ee03a04a8c5a', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'kingdom-delete-pre-fix',
        hypothesisId: 'A',
        location: 'routes/kingdoms.ts:delete:entry',
        message: 'delete kingdom attempt',
        data: { id },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    const existing = await app.prisma.kingdom.findUnique({ where: { id } });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/4b615a6a-3388-40b4-9df2-ee03a04a8c5a', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'kingdom-delete-pre-fix',
        hypothesisId: 'B',
        location: 'routes/kingdoms.ts:delete:found',
        message: 'existing kingdom lookup',
        data: { id, found: Boolean(existing) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (!existing) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/4b615a6a-3388-40b4-9df2-ee03a04a8c5a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: 'kingdom-delete-pre-fix',
          hypothesisId: 'B',
          location: 'routes/kingdoms.ts:delete:notFound',
          message: 'kingdom not found, returning 404',
          data: { id },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return reply.notFound();
    }

    try {
      // Supprimer la position associée si elle existe
      await app.prisma.position.deleteMany({ where: { kingdomId: id } });
      await app.prisma.kingdom.delete({ where: { id } });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/4b615a6a-3388-40b4-9df2-ee03a04a8c5a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: 'kingdom-delete-pre-fix',
          hypothesisId: 'C',
          location: 'routes/kingdoms.ts:delete:success',
          message: 'kingdom deleted',
          data: { id },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return reply.code(204).send();
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/4b615a6a-3388-40b4-9df2-ee03a04a8c5a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: 'kingdom-delete-pre-fix',
          hypothesisId: 'C',
          location: 'routes/kingdoms.ts:delete:error',
          message: 'delete failed',
          data: { id, code: error?.code, message: error?.message },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return reply.internalServerError('Delete kingdom failed');
    }
  });
}

