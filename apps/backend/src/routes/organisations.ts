import type { FastifyInstance } from 'fastify';
import type { Prisma } from '@prisma/client';
import { idSchema, organisationInputSchema, PERSON_MEMBERSHIP_VALUES } from '@solenia/shared';
import { createOrganisationLinks, replaceOrganisationLinks } from '../utils/organisationLinks';
import { isPrismaUniqueViolation } from '../utils/prisma';
import { parseRouteUuid } from '../utils/routeParams';
import { requireRole } from '../utils/rbac';

const includesMembership = (v: string): v is (typeof PERSON_MEMBERSHIP_VALUES)[number] =>
  (PERSON_MEMBERSHIP_VALUES as readonly string[]).includes(v);

export async function organisationRoutes(app: FastifyInstance) {
  app.get('/organisations', async () => {
    return app.prisma.organisation.findMany({
      orderBy: { name: 'asc' },
    });
  });

  app.get('/organisations/:id', async (request, reply) => {
    const id = parseRouteUuid(request);
    const organisation = await app.prisma.organisation.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            person: { select: { id: true, name: true } },
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
        kingdoms: {
          include: {
            kingdom: { select: { id: true, name: true } },
          },
        },
        lores: {
          include: {
            lore: { select: { id: true, title: true, tags: true, dateInGame: true } },
          },
        },
        parentOrganisation: { select: { id: true, name: true } },
        subOrganisations: { select: { id: true, name: true } },
      },
    });
    if (!organisation) return reply.notFound();
    // Transformer les données pour un format plus simple
    return {
      ...organisation,
      members: organisation.members.map((m) => m.person),
      cities: organisation.cities.map((c) => c.city),
      places: organisation.places.map((p) => p.place),
      kingdoms: organisation.kingdoms.map((k) => k.kingdom),
      lores: organisation.lores.map((lo) => lo.lore),
      subOrganisations: organisation.subOrganisations,
    };
  });

  app.post('/organisations', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const rawData = organisationInputSchema.parse(request.body);
    const { kingdomIds, cityIds, placeIds, personIds, ...orgData } = rawData;

    const flag = orgData.flag === '' || orgData.flag == null ? null : orgData.flag;
    const membership =
      orgData.membership === null || orgData.membership === undefined
        ? null
        : includesMembership(orgData.membership)
          ? orgData.membership
          : null;
    const createData: Prisma.OrganisationUncheckedCreateInput = {
      name: orgData.name,
      description: orgData.description ?? null,
      organisationType: orgData.organisationType ?? null,
      membership,
      parentOrganisationId: orgData.parentOrganisationId ?? null,
      flag,
      isForDM: orgData.isForDM ?? false,
    };
    const organisation = await app.prisma.organisation.create({ data: createData });

    await createOrganisationLinks(app, organisation.id, { kingdomIds, cityIds, placeIds, personIds });

    // Retourner l'organisation avec ses relations
    return app.prisma.organisation.findUnique({
      where: { id: organisation.id },
      include: {
        members: {
          include: {
            person: { select: { id: true, name: true } },
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
        kingdoms: {
          include: {
            kingdom: { select: { id: true, name: true } },
          },
        },
        parentOrganisation: { select: { id: true, name: true } },
        subOrganisations: { select: { id: true, name: true } },
      },
    }).then((org) => {
      if (!org) return organisation;
      return {
        ...org,
        members: org.members.map((m) => m.person),
        cities: org.cities.map((c) => c.city),
        places: org.places.map((p) => p.place),
        kingdoms: org.kingdoms.map((k) => k.kingdom),
        subOrganisations: org.subOrganisations,
      };
    });
  });

  app.put('/organisations/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const id = parseRouteUuid(request);
    const rawData = organisationInputSchema.partial().passthrough().parse(request.body);
    const { kingdomIds, cityIds, placeIds, personIds, ...orgData } = rawData;

    /** UncheckedUpdateInput : obligatoire dès qu’on met `parentOrganisationId` (sinon Prisma résout mal le XOR avec `Record<string, unknown>` et rejette les enums). */
    const data: Prisma.OrganisationUncheckedUpdateInput = {};
    if ('name' in orgData) data.name = orgData.name;
    if ('description' in orgData) data.description = orgData.description ?? null;
    if ('organisationType' in orgData) data.organisationType = orgData.organisationType ?? null;
    if ('membership' in orgData) {
      const m = orgData.membership;
      data.membership =
        m === null || m === undefined
          ? null
          : typeof m === 'string' && includesMembership(m)
            ? m
            : null;
    }
    if ('parentOrganisationId' in orgData) {
      data.parentOrganisationId = orgData.parentOrganisationId ?? null;
      if (orgData.parentOrganisationId === id) {
        throw new Error('Une organisation ne peut pas être son propre parent');
      }
    }
    if ('flag' in orgData) data.flag = orgData.flag === '' || orgData.flag == null ? null : orgData.flag;
    if ('isForDM' in orgData && typeof orgData.isForDM === 'boolean') data.isForDM = orgData.isForDM;

    await app.prisma.organisation.update({ where: { id }, data });

    await replaceOrganisationLinks(app, id, { kingdomIds, cityIds, placeIds, personIds });

    // Retourner l'organisation avec ses relations
    const updatedOrg = await app.prisma.organisation.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            person: { select: { id: true, name: true } },
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
        kingdoms: {
          include: {
            kingdom: { select: { id: true, name: true } },
          },
        },
        parentOrganisation: { select: { id: true, name: true } },
        subOrganisations: { select: { id: true, name: true } },
      },
    });
    
    if (!updatedOrg) {
      return { id };
    }

    return {
      ...updatedOrg,
      members: updatedOrg.members.map((m) => m.person),
      cities: updatedOrg.cities.map((c) => c.city),
      places: updatedOrg.places.map((p) => p.place),
      kingdoms: updatedOrg.kingdoms.map((k) => k.kingdom),
      subOrganisations: updatedOrg.subOrganisations,
    };
  });

  app.delete('/organisations/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    await app.prisma.organisation.delete({ where: { id } });
    reply.code(204);
  });

  // Routes pour gérer les membres
  app.post('/organisations/:id/members', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    const { personId } = request.body as { personId: string };
    if (!personId || !idSchema.safeParse(personId).success) {
      return reply.badRequest('personId is required and must be a valid UUID');
    }
    try {
      return await app.prisma.organisationMember.create({
        data: {
          organisationId: id,
          personId,
        },
        include: {
          person: { select: { id: true, name: true } },
        },
      });
    } catch (error: unknown) {
      if (isPrismaUniqueViolation(error)) {
        return reply.conflict('Cette personne est déjà membre de cette organisation');
      }
      throw error;
    }
  });

  app.delete('/organisations/:id/members/:personId', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    const personId = parseRouteUuid(request, 'personId');
    await app.prisma.organisationMember.deleteMany({
      where: {
        organisationId: id,
        personId,
      },
    });
    reply.code(204);
  });

  // Routes pour gérer les villes
  app.post('/organisations/:id/cities', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    const { cityId } = request.body as { cityId: string };
    if (!cityId || !idSchema.safeParse(cityId).success) {
      return reply.badRequest('cityId is required and must be a valid UUID');
    }
    try {
      return await app.prisma.organisationCity.create({
        data: {
          organisationId: id,
          cityId,
        },
        include: {
          city: { select: { id: true, name: true } },
        },
      });
    } catch (error: unknown) {
      if (isPrismaUniqueViolation(error)) {
        return reply.conflict('Cette ville est déjà associée à cette organisation');
      }
      throw error;
    }
  });

  app.delete('/organisations/:id/cities/:cityId', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    const cityId = parseRouteUuid(request, 'cityId');
    await app.prisma.organisationCity.deleteMany({
      where: {
        organisationId: id,
        cityId,
      },
    });
    reply.code(204);
  });

  // Routes pour gérer les lieux
  app.post('/organisations/:id/places', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    const { placeId } = request.body as { placeId: string };
    if (!placeId || !idSchema.safeParse(placeId).success) {
      return reply.badRequest('placeId is required and must be a valid UUID');
    }
    try {
      return await app.prisma.organisationPlace.create({
        data: {
          organisationId: id,
          placeId,
        },
        include: {
          place: { select: { id: true, name: true } },
        },
      });
    } catch (error: unknown) {
      if (isPrismaUniqueViolation(error)) {
        return reply.conflict('Ce lieu est déjà associé à cette organisation');
      }
      throw error;
    }
  });

  app.delete('/organisations/:id/places/:placeId', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    const placeId = parseRouteUuid(request, 'placeId');
    await app.prisma.organisationPlace.deleteMany({
      where: {
        organisationId: id,
        placeId,
      },
    });
    reply.code(204);
  });

  // Routes pour gérer les royaumes
  app.post('/organisations/:id/kingdoms', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    const { kingdomId } = request.body as { kingdomId: string };
    if (!kingdomId || !idSchema.safeParse(kingdomId).success) {
      return reply.badRequest('kingdomId is required and must be a valid UUID');
    }
    try {
      return await app.prisma.organisationKingdom.create({
        data: {
          organisationId: id,
          kingdomId,
        },
        include: {
          kingdom: { select: { id: true, name: true } },
        },
      });
    } catch (error: unknown) {
      if (isPrismaUniqueViolation(error)) {
        return reply.conflict('Ce royaume est déjà associé à cette organisation');
      }
      throw error;
    }
  });

  app.delete('/organisations/:id/kingdoms/:kingdomId', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    const kingdomId = parseRouteUuid(request, 'kingdomId');
    await app.prisma.organisationKingdom.deleteMany({
      where: {
        organisationId: id,
        kingdomId,
      },
    });
    reply.code(204);
  });
}
