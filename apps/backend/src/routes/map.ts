import type { FastifyInstance } from 'fastify';

export async function mapRoutes(app: FastifyInstance) {
  app.get('/map/points', async () => {
    const positions = await app.prisma.position.findMany({
      include: {
        kingdom: true,
        city: { include: { kingdom: true } },
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

        // Récupérer iconUrl, flag et couleur selon le type d'entité
        let iconUrl: string | null = null;
        let flag: string | null = null;
        let kingdomColor: string | null = null;
        if (p.kingdom) {
          kingdomColor = (p.kingdom as any).color ?? null;
          flag = (p.kingdom as any).flag ?? null;
        } else if (p.city) {
          iconUrl = (p.city as any).iconUrl ?? null;
          flag = (p.city as any).flag ?? null;
          kingdomColor = (p.city as any).kingdom?.color ?? null;
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
          flag: flag || null,
          kingdomColor,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  });
}

