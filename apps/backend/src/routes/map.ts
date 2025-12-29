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

    return positions
      .map((p) => {
        const target =
          p.kingdom ??
          p.city ??
          p.place ??
          p.personOfInterest;

        // Filtrer les positions sans entité associée (positions orphelines)
        if (!target) {
          return null;
        }

        const kind =
          p.kingdomId ? 'kingdom' :
          p.cityId ? 'city' :
          p.placeId ? 'place' :
          p.personOfInterestId ? 'person' :
          'unknown';

        // Récupérer iconUrl selon le type d'entité
        let iconUrl: string | null = null;
        if (p.city) {
          iconUrl = (p.city as any).iconUrl ?? null;
        } else if (p.place) {
          const placeIconUrl = (p.place as any).iconUrl;
          iconUrl = placeIconUrl ?? null;
        }

        return {
          id: p.id,
          x: p.x,
          y: p.y,
          kind,
          targetId: p.kingdomId ?? p.cityId ?? p.placeId ?? p.personOfInterestId ?? null,
          name: target.name,
          description: 'description' in target ? (target as any).description ?? null : null,
          iconUrl,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  });
}

