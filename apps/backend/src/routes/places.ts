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
      include: {
        position: true,
        kingdom: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        persons: { select: { id: true, name: true } },
        comments: { select: { id: true, description: true, dateInGame: true } },
      },
    });
    if (!place) return reply.notFound();
    return place;
  });

  app.post('/places', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const rawData = placeInputSchema.parse(request.body);
    // Définir l'icône par défaut si elle n'est pas fournie
    const data = {
      ...rawData,
      iconUrl: rawData.iconUrl ?? '/Icon/place.png',
    };
    return app.prisma.place.create({ data });
  });

  app.put('/places/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const id = idSchema.parse((request.params as any).id);
    const rawData = placeInputSchema.partial().parse(request.body);
    // Convertir undefined en null pour les champs optionnels qu'on veut mettre à null
    const data: Record<string, unknown> = {};
    if ('name' in rawData) data.name = rawData.name;
    if ('description' in rawData) data.description = rawData.description ?? null;
    // Pour iconUrl, on ne permet pas la modification - il reste toujours à la valeur par défaut
    // On ne traite pas iconUrl dans les mises à jour
    if ('kingdomId' in rawData) data.kingdomId = rawData.kingdomId ?? null;
    if ('cityId' in rawData) data.cityId = rawData.cityId ?? null;
    return app.prisma.place.update({ where: { id }, data });
  });

  app.delete('/places/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    // Supprimer la position associée si elle existe
    await app.prisma.position.deleteMany({ where: { placeId: id } });
    await app.prisma.place.delete({ where: { id } });
    reply.code(204);
  });
}

