import type { FastifyInstance } from 'fastify';
import { kingdomInputSchema, parseSoleniaDate } from '@solenia/shared';
import { requireRole } from '../utils/rbac';
import { parseRouteUuid } from '../utils/routeParams';

export async function kingdomRoutes(app: FastifyInstance) {
  app.get('/kingdoms', async () => {
    return app.prisma.kingdom.findMany({
      include: { position: true },
      orderBy: { name: 'asc' },
    });
  });

  app.get('/kingdoms/:id', async (request, reply) => {
    try {
      const id = parseRouteUuid(request);
      const kingdom = await app.prisma.kingdom.findUnique({
        where: { id },
        include: {
          position: true,
          cities: { select: { id: true, name: true } },
          places: { select: { id: true, name: true, iconUrl: true, placeType: true } },
          persons: { select: { id: true, name: true } },
          comments: { select: { id: true, description: true, dateInGame: true } },
          organisations: {
            include: {
              organisation: { select: { id: true, name: true } },
            },
          },
          lores: {
            include: {
              lore: { select: { id: true, title: true, tags: true, dateInGame: true } },
            },
          },
        },
      });
      if (!kingdom) return reply.notFound();
      // Sérialisation explicite : Date -> ISO string pour éviter 500 (JSON)
      const dateInGame =
        kingdom.dateInGame instanceof Date
          ? kingdom.dateInGame.toISOString()
          : (kingdom.dateInGame as string | null) ?? null;
      const comments = (kingdom.comments as Array<{ id: string; description: string; dateInGame?: Date | string | null }>).map(
        (c) => ({
          ...c,
          dateInGame: c.dateInGame instanceof Date ? c.dateInGame.toISOString() : c.dateInGame,
        })
      );
      return {
        ...kingdom,
        dateInGame,
        comments,
        organisations: kingdom.organisations.map((ok) => ok.organisation),
        lores: kingdom.lores.map((lk) => lk.lore),
      };
    } catch (err) {
      app.log.error(err, 'GET /kingdoms/:id');
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  });

  app.post('/kingdoms', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const data = kingdomInputSchema.parse(request.body);
    const flag = data.flag === '' || data.flag == null ? null : data.flag;
    return app.prisma.kingdom.create({
      data: {
        ...data,
        flag,
        dateInGame: parseSoleniaDate(data.dateInGame) ?? undefined,
      },
    });
  });

  app.put('/kingdoms/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    const data = kingdomInputSchema.partial().parse(request.body);
    const body = request.body as Record<string, unknown>;
    const colorFromBody = body && 'color' in body ? (body.color ?? null) : undefined;
    const flagFromBody = body && 'flag' in body ? (body.flag === '' || body.flag === undefined || body.flag === null ? null : (body.flag as string)) : undefined;
    const rawDate = (data as { dateInGame?: string | number })?.dateInGame;
    const kingdom = await app.prisma.kingdom.update({
      where: { id },
      data: {
        ...(data as Record<string, unknown>),
        ...(rawDate !== undefined && { dateInGame: parseSoleniaDate(rawDate) ?? null }),
        ...(colorFromBody !== undefined && { color: colorFromBody }),
        ...(flagFromBody !== undefined && { flag: flagFromBody }),
      } as Parameters<typeof app.prisma.kingdom.update>[0]['data'],
    });
    return kingdom;
  });

  app.delete('/kingdoms/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    const existing = await app.prisma.kingdom.findUnique({ where: { id } });
    if (!existing) return reply.notFound();

    try {
      await app.prisma.position.deleteMany({ where: { kingdomId: id } });
      await app.prisma.kingdom.delete({ where: { id } });
      return reply.code(204).send();
    } catch (err) {
      app.log.error(err, 'DELETE /kingdoms/:id');
      return reply.internalServerError('Delete kingdom failed');
    }
  });
}

