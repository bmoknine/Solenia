import type { FastifyInstance } from 'fastify';
import { ignoreUniqueViolation } from './prisma';

type LinkIds = {
  kingdomIds?: string[];
  cityIds?: string[];
  placeIds?: string[];
  personIds?: string[];
};

/** Crée les liaisons après création d’organisation (ignore les doublons P2002). */
export async function createOrganisationLinks(
  app: FastifyInstance,
  organisationId: string,
  { kingdomIds, cityIds, placeIds, personIds }: LinkIds,
): Promise<void> {
  if (kingdomIds?.length) {
    await Promise.all(
      kingdomIds.map((kingdomId) =>
        ignoreUniqueViolation(
          app.prisma.organisationKingdom.create({
            data: { organisationId, kingdomId },
          }),
        ),
      ),
    );
  }
  if (cityIds?.length) {
    await Promise.all(
      cityIds.map((cityId) =>
        ignoreUniqueViolation(
          app.prisma.organisationCity.create({
            data: { organisationId, cityId },
          }),
        ),
      ),
    );
  }
  if (placeIds?.length) {
    await Promise.all(
      placeIds.map((placeId) =>
        ignoreUniqueViolation(
          app.prisma.organisationPlace.create({
            data: { organisationId, placeId },
          }),
        ),
      ),
    );
  }
  if (personIds?.length) {
    await Promise.all(
      personIds.map((personId) =>
        ignoreUniqueViolation(
          app.prisma.organisationMember.create({
            data: { organisationId, personId },
          }),
        ),
      ),
    );
  }
}

/** Remplace les liaisons dont les IDs sont fournis dans le patch (undefined = inchangé). */
export async function replaceOrganisationLinks(
  app: FastifyInstance,
  organisationId: string,
  patch: {
    kingdomIds?: string[] | undefined;
    cityIds?: string[] | undefined;
    placeIds?: string[] | undefined;
    personIds?: string[] | undefined;
  },
): Promise<void> {
  if (patch.kingdomIds !== undefined) {
    await app.prisma.organisationKingdom.deleteMany({ where: { organisationId } });
    if (patch.kingdomIds.length > 0) {
      await Promise.all(
        patch.kingdomIds.map((kingdomId) =>
          ignoreUniqueViolation(
            app.prisma.organisationKingdom.create({
              data: { organisationId, kingdomId },
            }),
          ),
        ),
      );
    }
  }
  if (patch.cityIds !== undefined) {
    await app.prisma.organisationCity.deleteMany({ where: { organisationId } });
    if (patch.cityIds.length > 0) {
      await Promise.all(
        patch.cityIds.map((cityId) =>
          ignoreUniqueViolation(
            app.prisma.organisationCity.create({
              data: { organisationId, cityId },
            }),
          ),
        ),
      );
    }
  }
  if (patch.placeIds !== undefined) {
    await app.prisma.organisationPlace.deleteMany({ where: { organisationId } });
    if (patch.placeIds.length > 0) {
      await Promise.all(
        patch.placeIds.map((placeId) =>
          ignoreUniqueViolation(
            app.prisma.organisationPlace.create({
              data: { organisationId, placeId },
            }),
          ),
        ),
      );
    }
  }
  if (patch.personIds !== undefined) {
    await app.prisma.organisationMember.deleteMany({ where: { organisationId } });
    if (patch.personIds.length > 0) {
      await Promise.all(
        patch.personIds.map((personId) =>
          ignoreUniqueViolation(
            app.prisma.organisationMember.create({
              data: { organisationId, personId },
            }),
          ),
        ),
      );
    }
  }
}
