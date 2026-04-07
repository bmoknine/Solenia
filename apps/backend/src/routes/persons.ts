import type { FastifyInstance } from 'fastify';
import type { Prisma } from '@prisma/client';
import {
  idSchema,
  personInputSchema,
  PERSON_BREED_VALUES,
  PERSON_LANGUAGE_VALUES,
  PERSON_MEMBERSHIP_VALUES,
  PERSON_SEX_VALUES,
} from '@solenia/shared';
import { ignoreUniqueViolation } from '../utils/prisma';
import { requireRole } from '../utils/rbac';
import { parseRouteUuid } from '../utils/routeParams';

async function syncPersonOrganisations(
  app: FastifyInstance,
  personId: string,
  organisationIds: string[] | undefined,
) {
  if (organisationIds === undefined) return;
  await app.prisma.organisationMember.deleteMany({ where: { personId } });
  for (const organisationId of organisationIds) {
    await ignoreUniqueViolation(
      app.prisma.organisationMember.create({
        data: { personId, organisationId },
      }),
    );
  }
}

export async function personRoutes(app: FastifyInstance) {
  app.get('/persons', async () => {
    return app.prisma.personOfInterest.findMany({
      include: { position: true },
      orderBy: { name: 'asc' },
    });
  });

  app.get('/persons/:id', async (request, reply) => {
    const id = parseRouteUuid(request);
    const person = await app.prisma.personOfInterest.findUnique({
      where: { id },
      include: {
        position: true,
        kingdom: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        place: { select: { id: true, name: true } },
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
    if (!person) return reply.notFound();
    // Transformer les données pour un format plus simple
    return {
      ...person,
      organisations: person.organisations.map((om) => om.organisation),
      lores: person.lores.map((lp) => lp.lore),
    };
  });

  app.post('/persons', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const parsed = personInputSchema.parse(request.body);
    const { organisationIds, ...createFields } = parsed;
    const person = await app.prisma.personOfInterest.create({
      data: createFields as Prisma.PersonOfInterestCreateInput,
    });
    await syncPersonOrganisations(app, person.id, organisationIds ?? []);
    return app.prisma.personOfInterest.findUnique({
      where: { id: person.id },
      include: { position: true },
    });
  });

  app.put('/persons/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const id = parseRouteUuid(request);

    // Gérer explicitement les champs enum pour éviter qu'ils soient filtrés par Zod
    const rawBody = request.body as Record<string, unknown>;
    
    // Construire l'objet de données en excluant les champs enum et les IDs du parse Zod
    const organisationIdsInBody = 'organisationIds' in rawBody ? rawBody.organisationIds : undefined;

    const bodyWithoutEnums = { ...rawBody };
    delete bodyWithoutEnums.breed;
    delete bodyWithoutEnums.sex;
    delete bodyWithoutEnums.membership;
    delete bodyWithoutEnums.languages;
    delete bodyWithoutEnums.kingdomId;
    delete bodyWithoutEnums.cityId;
    delete bodyWithoutEnums.placeId;
    delete bodyWithoutEnums.organisationIds;
    
    // Parser le reste avec Zod
    const parsedData = personInputSchema.partial().parse(bodyWithoutEnums);
    
    // Ajouter les champs enum manuellement avec validation
    const includes = <T extends readonly string[]>(allowed: T, v: string): v is T[number] =>
      (allowed as readonly string[]).includes(v);

    if ('breed' in rawBody) {
      const b = rawBody.breed;
      parsedData.breed =
        b === '' || b === null ? null : typeof b === 'string' && includes(PERSON_BREED_VALUES, b) ? b : null;
    }
    if ('sex' in rawBody) {
      const s = rawBody.sex;
      parsedData.sex =
        s === '' || s === null ? null : typeof s === 'string' && includes(PERSON_SEX_VALUES, s) ? s : null;
    }
    if ('membership' in rawBody) {
      const m = rawBody.membership;
      parsedData.membership =
        m === '' || m === null ? null : typeof m === 'string' && includes(PERSON_MEMBERSHIP_VALUES, m) ? m : null;
    }
    if ('languages' in rawBody && Array.isArray(rawBody.languages)) {
      parsedData.languages = rawBody.languages.filter(
        (lang): lang is (typeof PERSON_LANGUAGE_VALUES)[number] =>
          typeof lang === 'string' && includes(PERSON_LANGUAGE_VALUES, lang),
      );
    }

    if ('kingdomId' in rawBody) {
      const v = rawBody.kingdomId;
      parsedData.kingdomId = v === '' || v === null ? null : typeof v === 'string' ? v : undefined;
    }
    if ('cityId' in rawBody) {
      const v = rawBody.cityId;
      parsedData.cityId = v === '' || v === null ? null : typeof v === 'string' ? v : undefined;
    }
    if ('placeId' in rawBody) {
      const v = rawBody.placeId;
      parsedData.placeId = v === '' || v === null ? null : typeof v === 'string' ? v : undefined;
    }

    const updated = await app.prisma.personOfInterest.update({
      where: { id },
      data: parsedData as Prisma.PersonOfInterestUpdateInput,
    });

    if ('organisationIds' in rawBody) {
      const ids = Array.isArray(organisationIdsInBody)
        ? organisationIdsInBody.filter((x): x is string => typeof x === 'string' && idSchema.safeParse(x).success)
        : [];
      await syncPersonOrganisations(app, id, ids);
    }

    return updated;
  });

  app.delete('/persons/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = parseRouteUuid(request);
    // Supprimer la position associée si elle existe
    await app.prisma.position.deleteMany({ where: { personOfInterestId: id } });
    await app.prisma.personOfInterest.delete({ where: { id } });
    reply.code(204);
  });
}

