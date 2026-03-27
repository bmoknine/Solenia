import type { FastifyInstance } from 'fastify';
import { idSchema, loreInputSchema } from '@solenia/shared';
import { ignoreUniqueViolation } from '../utils/prisma';
import { requireRole } from '../utils/rbac';

export async function loreRoutes(app: FastifyInstance) {
  const normalizeTagsFromBody = (body: unknown): string[] | undefined => {
    if (!body || typeof body !== 'object' || !('tags' in body)) return undefined;
    const value = (body as { tags?: unknown }).tags;
    if (!Array.isArray(value)) return [];
    return Array.from(
      new Set(
        value
          .filter((item): item is string => typeof item === 'string')
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    );
  };

  app.get('/lores', async () => {
    return app.prisma.lore.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        tags: true,
        dateInGame: true,
        summary: true,
        isForDM: true,
      },
    });
  });

  app.get('/lores/:id', async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    const lore = await app.prisma.lore.findUnique({
      where: { id },
      include: {
        kingdoms: {
          include: {
            kingdom: { select: { id: true, name: true } },
          },
        },
        cities: {
          include: {
            city: { select: { id: true, name: true } },
          },
        },
        places: {
          include: {
            place: { select: { id: true, name: true } },
          },
        },
        persons: {
          include: {
            person: { select: { id: true, name: true } },
          },
        },
        organisations: {
          include: {
            organisation: { select: { id: true, name: true } },
          },
        },
      },
    });
    if (!lore) return reply.notFound();

    return {
      ...lore,
      kingdoms: lore.kingdoms.map((lk) => lk.kingdom),
      cities: lore.cities.map((lc) => lc.city),
      places: lore.places.map((lp) => lp.place),
      persons: lore.persons.map((lp) => lp.person),
      organisations: lore.organisations.map((lo) => lo.organisation),
    };
  });

  app.post('/lores', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const rawData = loreInputSchema.parse(request.body);
    const { kingdomIds, cityIds, placeIds, personIds, organisationIds, ...loreData } = rawData;
    const bodyTags = normalizeTagsFromBody(request.body);
    if (bodyTags !== undefined) {
      (loreData as { tags?: string[] }).tags = bodyTags;
    }

    const lore = await app.prisma.lore.create({ data: loreData });

    if (kingdomIds && kingdomIds.length > 0) {
      await Promise.all(
        kingdomIds.map((kingdomId: string) =>
          ignoreUniqueViolation(
            app.prisma.loreKingdom.create({
              data: { loreId: lore.id, kingdomId },
            }),
          ),
        ),
      );
    }

    if (cityIds && cityIds.length > 0) {
      await Promise.all(
        cityIds.map((cityId: string) =>
          ignoreUniqueViolation(
            app.prisma.loreCity.create({
              data: { loreId: lore.id, cityId },
            }),
          ),
        ),
      );
    }

    if (placeIds && placeIds.length > 0) {
      await Promise.all(
        placeIds.map((placeId: string) =>
          ignoreUniqueViolation(
            app.prisma.lorePlace.create({
              data: { loreId: lore.id, placeId },
            }),
          ),
        ),
      );
    }

    if (personIds && personIds.length > 0) {
      await Promise.all(
        personIds.map((personId: string) =>
          ignoreUniqueViolation(
            app.prisma.lorePerson.create({
              data: { loreId: lore.id, personId },
            }),
          ),
        ),
      );
    }

    if (organisationIds && organisationIds.length > 0) {
      await Promise.all(
        organisationIds.map((organisationId: string) =>
          ignoreUniqueViolation(
            app.prisma.loreOrganisation.create({
              data: { loreId: lore.id, organisationId },
            }),
          ),
        ),
      );
    }

    return lore;
  });

  app.put('/lores/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const id = idSchema.parse((request.params as any).id);
    const rawData = loreInputSchema.partial().parse(request.body);
    const { kingdomIds, cityIds, placeIds, personIds, organisationIds, ...loreData } = rawData;
    const bodyTags = normalizeTagsFromBody(request.body);
    if (bodyTags !== undefined) {
      (loreData as { tags?: string[] }).tags = bodyTags;
    }

    await app.prisma.lore.update({ where: { id }, data: loreData });

    if (kingdomIds !== undefined) {
      await app.prisma.loreKingdom.deleteMany({ where: { loreId: id } });
      if (kingdomIds.length > 0) {
        await Promise.all(
          kingdomIds.map((kingdomId: string) =>
            ignoreUniqueViolation(
              app.prisma.loreKingdom.create({
                data: { loreId: id, kingdomId },
              }),
            ),
          ),
        );
      }
    }

    if (cityIds !== undefined) {
      await app.prisma.loreCity.deleteMany({ where: { loreId: id } });
      if (cityIds.length > 0) {
        await Promise.all(
          cityIds.map((cityId: string) =>
            ignoreUniqueViolation(
              app.prisma.loreCity.create({
                data: { loreId: id, cityId },
              }),
            ),
          ),
        );
      }
    }

    if (placeIds !== undefined) {
      await app.prisma.lorePlace.deleteMany({ where: { loreId: id } });
      if (placeIds.length > 0) {
        await Promise.all(
          placeIds.map((placeId: string) =>
            ignoreUniqueViolation(
              app.prisma.lorePlace.create({
                data: { loreId: id, placeId },
              }),
            ),
          ),
        );
      }
    }

    if (personIds !== undefined) {
      await app.prisma.lorePerson.deleteMany({ where: { loreId: id } });
      if (personIds.length > 0) {
        await Promise.all(
          personIds.map((personId: string) =>
            ignoreUniqueViolation(
              app.prisma.lorePerson.create({
                data: { loreId: id, personId },
              }),
            ),
          ),
        );
      }
    }

    if (organisationIds !== undefined) {
      await app.prisma.loreOrganisation.deleteMany({ where: { loreId: id } });
      if (organisationIds.length > 0) {
        await Promise.all(
          organisationIds.map((organisationId: string) =>
            ignoreUniqueViolation(
              app.prisma.loreOrganisation.create({
                data: { loreId: id, organisationId },
              }),
            ),
          ),
        );
      }
    }

    return app.prisma.lore.findUnique({ where: { id } });
  });

  app.delete('/lores/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    await app.prisma.lore.delete({ where: { id } });
    reply.code(204);
  });
}

