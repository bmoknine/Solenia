import type { FastifyInstance } from 'fastify';
import { cityInputSchema, idSchema } from '@solenia/shared';
import { requireRole } from '../utils/rbac';
import { parseRouteUuid } from '../utils/routeParams';

/** Normalise le corps PUT avant Zod (UUID royaume, types texte). */
function normalizeCityPutBody(body: unknown): Record<string, unknown> {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return {};
  }
  const o = { ...(body as Record<string, unknown>) };

  const asStr = (v: unknown): string | null | undefined => {
    if (v === undefined) return undefined;
    if (v === null) return null;
    if (typeof v === 'string') return v;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    return undefined;
  };

  if ('description' in o) {
    const s = asStr(o.description);
    if (s === undefined) delete o.description;
    else o.description = s;
  }
  if ('iconUrl' in o) {
    const s = asStr(o.iconUrl);
    if (s === undefined) delete o.iconUrl;
    else o.iconUrl = s;
  }
  if ('map' in o) {
    const s = asStr(o.map);
    if (s === undefined) delete o.map;
    else o.map = s;
  }
  if ('flag' in o) {
    const s = asStr(o.flag);
    if (s === undefined) delete o.flag;
    else o.flag = s;
  }

  if ('kingdomId' in o) {
    const k = o.kingdomId;
    if (k === '' || k === undefined || k === null) {
      o.kingdomId = null;
    } else if (typeof k === 'string') {
      o.kingdomId = idSchema.safeParse(k).success ? k : null;
    } else {
      o.kingdomId = null;
    }
  }

  if ('name' in o && typeof o.name === 'string') {
    o.name = o.name.trim();
  }

  if ('isForDM' in o && typeof o.isForDM !== 'boolean') {
    if (o.isForDM === 'true') o.isForDM = true;
    else if (o.isForDM === 'false') o.isForDM = false;
    else delete o.isForDM;
  }

  return o;
}

export async function cityRoutes(app: FastifyInstance) {
  app.get('/cities', async () => {
    return app.prisma.city.findMany({
      include: { position: true },
      orderBy: { name: 'asc' },
    });
  });

  app.get('/cities/:id', async (request, reply) => {
    const id = parseRouteUuid(request);
    const city = await app.prisma.city.findUnique({
      where: { id },
      include: {
        position: true,
        kingdom: { select: { id: true, name: true } },
        districts: {
          orderBy: { name: 'asc' },
          include: {
            places: { select: { id: true, name: true, iconUrl: true, placeType: true }, orderBy: { name: 'asc' } },
            persons: { select: { id: true, name: true }, orderBy: { name: 'asc' } },
          },
        },
        places: {
          where: { districtId: null },
          select: { id: true, name: true, iconUrl: true, placeType: true },
          orderBy: { name: 'asc' },
        },
        persons: {
          where: { districtId: null },
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        },
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
    const body = request.body as Record<string, unknown>;
    const flag = 'flag' in body ? (body.flag === '' || body.flag == null ? null : (body.flag as string)) : null;
    const map = 'map' in body ? (body.map === '' || body.map == null ? null : (body.map as string)) : null;
    return app.prisma.city.create({ data: { ...data, flag, map } });
  });

  app.put('/cities/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    const normalized = normalizeCityPutBody(request.body);
    const parsed = cityInputSchema.partial().safeParse(normalized);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Données invalides';
      return reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: msg,
        issues: parsed.error.issues,
      });
    }
    const rawData = parsed.data;
    // Convertir undefined en null pour les champs optionnels qu'on veut mettre à null
    const data: Record<string, unknown> = {};
    if ('name' in rawData) data.name = rawData.name;
    if ('description' in rawData) data.description = rawData.description ?? null;
    const body = normalized;
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
    if ('flag' in body) {
      const v = body.flag;
      data.flag = (v === '' || v === undefined || v === null) ? null : (v as string);
    }
    if ('map' in body) {
      const v = body.map;
      data.map = (v === '' || v === undefined || v === null) ? null : (v as string);
    }
    return app.prisma.city.update({ where: { id }, data });
  });

  app.delete('/cities/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    // Supprimer la position associée si elle existe
    await app.prisma.position.deleteMany({ where: { cityId: id } });
    await app.prisma.city.delete({ where: { id } });
    reply.code(204);
  });
}

