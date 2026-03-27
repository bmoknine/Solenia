import type { FastifyInstance } from 'fastify';

/** Extrait une description affichable depuis l’entité cible d’une position. */
function descriptionFromPositionTarget(target: {
  name: string;
  description?: string | null;
}): string | null {
  return target.description ?? null;
}

export async function mapRoutes(app: FastifyInstance) {
  app.get('/map/points', async () => {
    const positions = await app.prisma.position.findMany({
      include: {
        kingdom: true,
        city: { include: { kingdom: true } },
        place: { select: { id: true, name: true, iconUrl: true, description: true, cityId: true, districtId: true, showOnMap: true } },
        personOfInterest: { select: { id: true, name: true, description: true, showOnMap: true } },
      },
    });

    return positions
      .map((p) => {
        const target = p.kingdom ?? p.city ?? p.place ?? p.personOfInterest;

        if (!target) {
          return null;
        }

        if (p.placeId && p.place && (p.place.cityId || p.place.districtId)) {
          return null;
        }
        if (p.placeId && p.place && p.place.showOnMap === false) return null;
        if (p.personOfInterestId && p.personOfInterest && p.personOfInterest.showOnMap === false) return null;

        const kind =
          p.kingdomId ? 'kingdom' :
          p.cityId ? 'city' :
          p.placeId ? 'place' :
          p.personOfInterestId ? 'person' :
          'unknown';

        let iconUrl: string | null = null;
        let flag: string | null = null;
        let kingdomColor: string | null = null;
        if (p.kingdom) {
          kingdomColor = p.kingdom.color ?? null;
          flag = p.kingdom.flag ?? null;
        } else if (p.city) {
          iconUrl = p.city.iconUrl ?? null;
          flag = p.city.flag ?? null;
          kingdomColor = p.city.kingdom?.color ?? null;
        } else if (p.place) {
          iconUrl = p.place.iconUrl ?? null;
        }

        return {
          id: p.id,
          x: p.x,
          y: p.y,
          kind,
          targetId: p.kingdomId ?? p.cityId ?? p.placeId ?? p.personOfInterestId ?? null,
          name: target.name,
          description: descriptionFromPositionTarget(target),
          iconUrl,
          flag: flag || null,
          kingdomColor,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  });
}
