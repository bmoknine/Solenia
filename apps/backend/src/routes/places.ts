import type { FastifyInstance } from 'fastify';
import type { Prisma, PlaceType } from '@prisma/client';
import { placeInputSchema } from '@solenia/shared';
import { ignoreUniqueViolation } from '../utils/prisma';
import { requireRole } from '../utils/rbac';
import { parseRouteUuid } from '../utils/routeParams';

const PLACE_TYPE_ICONS: Record<PlaceType, string> = {
  MAGASIN: '/Icon/place-shop.svg',
  TAVERNE_AUBERGE: '/Icon/place-tavern.svg',
  MAGASIN_MAGIE: '/Icon/place-magic.svg',
  HERBORISTE_APOTHICAIRE: '/Icon/place-herb.svg',
  AUTRE: '/Icon/place.png',
};

function defaultIconForPlaceType(placeType: PlaceType | null | undefined): string {
  if (!placeType) return '/Icon/place.png';
  return PLACE_TYPE_ICONS[placeType] ?? '/Icon/place.png';
}

async function syncPlaceOrganisations(
  app: FastifyInstance,
  placeId: string,
  organisationIds: string[] | undefined,
) {
  if (organisationIds === undefined) return;
  await app.prisma.organisationPlace.deleteMany({ where: { placeId } });
  for (const organisationId of organisationIds) {
    await ignoreUniqueViolation(
      app.prisma.organisationPlace.create({
        data: { placeId, organisationId },
      }),
    );
  }
}

/**
 * Lieu lié à une ville/quartier avec showOnMap = true : supprime la position carte.
 * Les lieux avec showOnMap = false (ex. importés) conservent leur position.
 */
async function syncEmbeddedPlacePosition(
  app: FastifyInstance,
  placeId: string,
  cityId: string | null,
  districtId: string | null,
  showOnMap: boolean,
) {
  if (showOnMap && (cityId || districtId)) {
    await app.prisma.position.deleteMany({ where: { placeId } });
  }
}

type PlaceCreateFields = {
  name: string;
  description?: string | null;
  iconUrl?: string | null;
  map?: string | null;
  placeType?: string;
  kingdomId?: string | null;
  cityId?: string | null;
  districtId?: string | null;
  showOnMap?: boolean;
  isForDM?: boolean;
};

async function normalizePlaceGeo(
  app: FastifyInstance,
  fields: PlaceCreateFields,
): Promise<PlaceCreateFields> {
  const out = { ...fields };
  if (out.districtId) {
    const d = await app.prisma.district.findUnique({ where: { id: out.districtId } });
    if (d) {
      out.cityId = d.cityId;
      out.kingdomId = null;
    }
  } else if (out.cityId) {
    out.districtId = null;
    out.kingdomId = null;
  } else if (out.kingdomId) {
    out.cityId = null;
    out.districtId = null;
  }
  return out;
}

export async function placeRoutes(app: FastifyInstance) {
  app.get('/places', async () => {
    return app.prisma.place.findMany({
      include: { position: true },
      orderBy: { name: 'asc' },
    });
  });

  app.get('/places/:id', async (request, reply) => {
    const id = parseRouteUuid(request);
    const place = await app.prisma.place.findUnique({
      where: { id },
      include: {
        position: true,
        kingdom: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        district: { select: { id: true, name: true } },
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
    if (!place) return reply.notFound();
    return {
      ...place,
      organisations: place.organisations.map((op) => op.organisation),
      lores: place.lores.map((lp) => lp.lore),
    };
  });

  app.post('/places', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const rawData = placeInputSchema.parse(request.body);
    const { organisationIds, ...rest } = rawData;
    const resolvedPlaceType = (rest.placeType as PlaceType | undefined) ?? 'AUTRE';
    const normalized = await normalizePlaceGeo(app, {
      name: rest.name,
      description: rest.description ?? null,
      iconUrl: rest.iconUrl ?? defaultIconForPlaceType(resolvedPlaceType),
      map: rest.map === '' || rest.map == null ? null : rest.map,
      kingdomId: rest.kingdomId ?? null,
      cityId: rest.cityId ?? null,
      districtId: rest.districtId ?? null,
      showOnMap: rest.showOnMap,
      isForDM: rest.isForDM,
    });
    const place = await app.prisma.place.create({
      data: {
        name: normalized.name,
        description: normalized.description ?? undefined,
        iconUrl: normalized.iconUrl ?? defaultIconForPlaceType(resolvedPlaceType),
        map: normalized.map,
        placeType: resolvedPlaceType,
        kingdomId: normalized.kingdomId,
        cityId: normalized.cityId,
        districtId: normalized.districtId,
        showOnMap: normalized.showOnMap ?? true,
        isForDM: normalized.isForDM ?? false,
      },
    });
    await syncPlaceOrganisations(app, place.id, organisationIds);
    await syncEmbeddedPlacePosition(app, place.id, place.cityId, place.districtId, normalized.showOnMap ?? true);
    return place;
  });

  app.put('/places/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    const rawData = placeInputSchema.partial().parse(request.body);
    const { organisationIds, ...rawRest } = rawData;

    const existing = await app.prisma.place.findUnique({ where: { id } });
    if (!existing) return reply.notFound();

    let nextKingdomId = existing.kingdomId;
    let nextCityId = existing.cityId;
    let nextDistrictId = existing.districtId;

    if ('kingdomId' in rawRest) nextKingdomId = rawRest.kingdomId ?? null;
    if ('cityId' in rawRest) nextCityId = rawRest.cityId ?? null;
    if ('districtId' in rawRest) nextDistrictId = rawRest.districtId ?? null;

    const merged = await normalizePlaceGeo(app, {
      name: existing.name,
      description: existing.description,
      iconUrl: existing.iconUrl,
      map: existing.map,
      kingdomId: nextKingdomId,
      cityId: nextCityId,
      districtId: nextDistrictId,
    });

    const data: Record<string, unknown> = {};
    if ('name' in rawRest) data.name = rawRest.name;
    if ('description' in rawRest) data.description = rawRest.description ?? null;
    if ('map' in rawRest) data.map = rawRest.map ?? null;
    if ('placeType' in rawRest) {
      const newType = (rawRest.placeType as PlaceType | undefined) ?? 'AUTRE';
      data.placeType = newType;
      // Auto-mettre à jour l'icône si elle correspond encore à une icône de type par défaut
      const currentIcon = existing.iconUrl ?? '';
      const isDefaultIcon = Object.values(PLACE_TYPE_ICONS).includes(currentIcon) || currentIcon === '/Icon/place.png';
      if (!('iconUrl' in rawRest) && isDefaultIcon) {
        data.iconUrl = defaultIconForPlaceType(newType);
      }
    }
    if ('iconUrl' in rawRest) data.iconUrl = rawRest.iconUrl ?? defaultIconForPlaceType((data.placeType as PlaceType | undefined) ?? existing.placeType ?? 'AUTRE');
    if ('isForDM' in rawRest) data.isForDM = rawRest.isForDM;
    if ('showOnMap' in rawRest) data.showOnMap = rawRest.showOnMap ?? true;
    data.kingdomId = merged.kingdomId;
    data.cityId = merged.cityId;
    data.districtId = merged.districtId;

    const updated = await app.prisma.place.update({ where: { id }, data: data as Prisma.PlaceUpdateInput });
    await syncPlaceOrganisations(app, id, organisationIds);
    await syncEmbeddedPlacePosition(app, id, updated.cityId, updated.districtId, updated.showOnMap);
    return updated;
  });

  app.delete('/places/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    await app.prisma.position.deleteMany({ where: { placeId: id } });
    await app.prisma.place.delete({ where: { id } });
    reply.code(204);
  });
}
