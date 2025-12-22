import type { FastifyInstance } from 'fastify';

export async function mapRoutes(app: FastifyInstance) {
  app.get('/map/points', async () => {
    const positions = await app.prisma.position.findMany({
      include: {
        kingdom: true,
        city: true,
        place: true,
        personOfInterest: true,
      },
    });

    return positions.map((p) => {
      const target =
        p.kingdom ??
        p.city ??
        p.place ??
        p.personOfInterest;

      const kind =
        p.kingdomId ? 'kingdom' :
        p.cityId ? 'city' :
        p.placeId ? 'place' :
        p.personOfInterestId ? 'person' :
        'unknown';

      return {
        id: p.id,
        x: p.x,
        y: p.y,
        kind,
        targetId: p.kingdomId ?? p.cityId ?? p.placeId ?? p.personOfInterestId ?? null,
        name: target?.name ?? 'Sans nom',
        description: target && 'description' in target ? (target as any).description ?? null : null,
      };
    });
  });
}

