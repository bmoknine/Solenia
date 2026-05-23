import type { FastifyInstance } from 'fastify';
import type { Prisma } from '@prisma/client';
import {
  idSchema,
  personInputSchema,
  PERSON_BREED_VALUES,
  PERSON_LANGUAGE_VALUES,
  PERSON_MEMBERSHIP_VALUES,
  PERSON_SEX_VALUES,
  isValidPersonFp,
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

const includes = <T extends readonly string[]>(allowed: T, v: string): v is T[number] =>
  (allowed as readonly string[]).includes(v);

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
    return {
      ...person,
      organisations: person.organisations.map((om) => om.organisation),
      lores: person.lores.map((lp) => lp.lore),
    };
  });

  app.post('/persons', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const parsed = personInputSchema.parse(request.body);
    const { organisationIds, ...fields } = parsed;

    const createData: Prisma.PersonOfInterestUncheckedCreateInput = {
      name: fields.name,
      description: fields.description ?? null,
      imageUrl: fields.imageUrl ?? null,
      breed: fields.breed ?? null,
      sex: fields.sex ?? null,
      membership: fields.membership ?? null,
      languages: fields.languages ?? [],
      STR: fields.STR,
      DEX: fields.DEX,
      CON: fields.CON,
      INT: fields.INT,
      WIS: fields.WIS,
      CHA: fields.CHA,
      pv: fields.pv ?? null,
      ca: fields.ca ?? null,
      fp: fields.fp ?? null,
      showOnMap: fields.showOnMap ?? true,
      isForDM: fields.isForDM ?? false,
      kingdomId: fields.kingdomId ?? null,
      cityId: fields.cityId ?? null,
      districtId: fields.districtId ?? null,
      placeId: fields.placeId ?? null,
    };

    const person = await app.prisma.personOfInterest.create({ data: createData });
    await syncPersonOrganisations(app, person.id, organisationIds ?? []);
    return app.prisma.personOfInterest.findUnique({
      where: { id: person.id },
      include: { position: true },
    });
  });

  app.put('/persons/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const id = parseRouteUuid(request);
    const rawBody = request.body as Record<string, unknown>;
    const organisationIdsInBody = 'organisationIds' in rawBody ? rawBody.organisationIds : undefined;

    const bodyWithoutEnums = { ...rawBody };
    delete bodyWithoutEnums.breed;
    delete bodyWithoutEnums.sex;
    delete bodyWithoutEnums.membership;
    delete bodyWithoutEnums.languages;
    delete bodyWithoutEnums.kingdomId;
    delete bodyWithoutEnums.cityId;
    delete bodyWithoutEnums.districtId;
    delete bodyWithoutEnums.placeId;
    delete bodyWithoutEnums.organisationIds;

    const parsed = personInputSchema.partial().parse(bodyWithoutEnums);

    /** UncheckedUpdateInput : champs scalaires + FK (kingdomId, districtId, fp, …). */
    const data: Prisma.PersonOfInterestUncheckedUpdateInput = {};

    if ('name' in rawBody && parsed.name !== undefined) data.name = parsed.name;
    if ('description' in rawBody) data.description = parsed.description ?? null;
    if ('imageUrl' in rawBody) data.imageUrl = parsed.imageUrl ?? null;
    if ('pv' in rawBody) data.pv = parsed.pv ?? null;
    if ('ca' in rawBody) data.ca = parsed.ca ?? null;
    if ('showOnMap' in rawBody && typeof parsed.showOnMap === 'boolean') data.showOnMap = parsed.showOnMap;
    if ('isForDM' in rawBody && typeof parsed.isForDM === 'boolean') data.isForDM = parsed.isForDM;
    if ('STR' in rawBody && parsed.STR !== undefined) data.STR = parsed.STR;
    if ('DEX' in rawBody && parsed.DEX !== undefined) data.DEX = parsed.DEX;
    if ('CON' in rawBody && parsed.CON !== undefined) data.CON = parsed.CON;
    if ('INT' in rawBody && parsed.INT !== undefined) data.INT = parsed.INT;
    if ('WIS' in rawBody && parsed.WIS !== undefined) data.WIS = parsed.WIS;
    if ('CHA' in rawBody && parsed.CHA !== undefined) data.CHA = parsed.CHA;

    if ('breed' in rawBody) {
      const b = rawBody.breed;
      data.breed =
        b === '' || b === null ? null : typeof b === 'string' && includes(PERSON_BREED_VALUES, b) ? b : null;
    }
    if ('sex' in rawBody) {
      const s = rawBody.sex;
      data.sex =
        s === '' || s === null ? null : typeof s === 'string' && includes(PERSON_SEX_VALUES, s) ? s : null;
    }
    if ('membership' in rawBody) {
      const m = rawBody.membership;
      data.membership =
        m === '' || m === null ? null : typeof m === 'string' && includes(PERSON_MEMBERSHIP_VALUES, m) ? m : null;
    }
    if ('languages' in rawBody && Array.isArray(rawBody.languages)) {
      data.languages = rawBody.languages.filter(
        (lang): lang is (typeof PERSON_LANGUAGE_VALUES)[number] =>
          typeof lang === 'string' && includes(PERSON_LANGUAGE_VALUES, lang),
      );
    }
    if ('kingdomId' in rawBody) {
      const v = rawBody.kingdomId;
      data.kingdomId = v === '' || v === null ? null : typeof v === 'string' ? v : null;
    }
    if ('cityId' in rawBody) {
      const v = rawBody.cityId;
      data.cityId = v === '' || v === null ? null : typeof v === 'string' ? v : null;
    }
    if ('districtId' in rawBody) {
      const v = rawBody.districtId;
      data.districtId = v === '' || v === null ? null : typeof v === 'string' ? v : null;
    }
    if ('placeId' in rawBody) {
      const v = rawBody.placeId;
      data.placeId = v === '' || v === null ? null : typeof v === 'string' ? v : null;
    }
    if ('fp' in rawBody) {
      const f = rawBody.fp;
      data.fp =
        f === '' || f === null || f === undefined
          ? null
          : typeof f === 'string' && isValidPersonFp(f)
            ? f
            : null;
    }

    const updated = await app.prisma.personOfInterest.update({ where: { id }, data });

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
    await app.prisma.position.deleteMany({ where: { personOfInterestId: id } });
    await app.prisma.personOfInterest.delete({ where: { id } });
    reply.code(204);
  });
}
