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
      include: {
        position: true,
        kingdom: { select: { id: true, name: true } },
        districts: { select: { id: true, name: true } },
        places: { select: { id: true, name: true } },
        persons: { select: { id: true, name: true } },
        comments: { select: { id: true, description: true, dateInGame: true } },
        organisations: {
          include: {
            organisation: { select: { id: true, name: true } },
          },
        },
        lores: {
          include: {
            lore: { select: { id: true, title: true, tag: true, dateInGame: true } },
          },
        },
      },
    });
    if (!city) return reply.notFound();
    // Transformer les données pour un format plus simple
    return {
      ...city,
      organisations: city.organisations.map((oc) => oc.organisation),
      lores: city.lores.map((lc) => lc.lore),
    };
  });

  app.post('/cities', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const data = cityInputSchema.parse(request.body);
    return app.prisma.city.create({ data });
  });

  app.put('/cities/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const id = idSchema.parse((request.params as any).id);
    console.log('Backend - request.body:', request.body);
    const rawData = cityInputSchema.partial().parse(request.body);
    console.log('Backend - rawData après parse:', rawData);
    // Convertir undefined en null pour les champs optionnels qu'on veut mettre à null
    const data: Record<string, unknown> = {};
    if ('name' in rawData) data.name = rawData.name;
    if ('description' in rawData) data.description = rawData.description ?? null;
    // Pour iconUrl, on utilise directement le body original car Zod peut supprimer le champ
    const body = request.body as Record<string, unknown>;
    if ('iconUrl' in body) {
      const iconUrlValue = body.iconUrl;
      // Convertir chaîne vide en null, sinon garder la valeur (string ou null)
      if (iconUrlValue === '' || iconUrlValue === undefined) {
        data.iconUrl = null;
      } else if (iconUrlValue === null) {
        data.iconUrl = null;
      } else {
        // C'est une string, on la garde telle quelle
        data.iconUrl = iconUrlValue;
      }
    }
    if ('kingdomId' in rawData) data.kingdomId = rawData.kingdomId ?? null;
    console.log('Backend - data final:', data);
    return app.prisma.city.update({ where: { id }, data });
  });

  app.delete('/cities/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    // Supprimer la position associée si elle existe
    await app.prisma.position.deleteMany({ where: { cityId: id } });
    await app.prisma.city.delete({ where: { id } });
    reply.code(204);
  });
}

