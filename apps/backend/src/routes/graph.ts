import type { FastifyInstance } from 'fastify';

export async function graphRoutes(app: FastifyInstance) {
  app.get('/graph', async () => {
    const [persons, organisations, members, subOrgs] = await Promise.all([
      app.prisma.personOfInterest.findMany({
        select: { id: true, name: true, breed: true, cityId: true, imageUrl: true },
      }),
      app.prisma.organisation.findMany({
        select: { id: true, name: true, membership: true, parentOrganisationId: true },
      }),
      app.prisma.organisationMember.findMany({
        select: { personId: true, organisationId: true },
      }),
      app.prisma.organisation.findMany({
        where: { parentOrganisationId: { not: null } },
        select: { id: true, parentOrganisationId: true },
      }),
    ]);

    const nodes = [
      ...persons.map((p) => ({
        id: `person:${p.id}`,
        targetId: p.id,
        label: p.name,
        type: 'person' as const,
        breed: p.breed,
        cityId: p.cityId,
      })),
      ...organisations.map((o) => ({
        id: `org:${o.id}`,
        targetId: o.id,
        label: o.name,
        type: 'organisation' as const,
        membership: o.membership,
      })),
    ];

    const links = [
      ...members.map((m) => ({
        source: `person:${m.personId}`,
        target: `org:${m.organisationId}`,
        type: 'member' as const,
      })),
      ...subOrgs
        .filter((o) => o.parentOrganisationId)
        .map((o) => ({
          source: `org:${o.id}`,
          target: `org:${o.parentOrganisationId}`,
          type: 'hierarchy' as const,
        })),
    ];

    return { nodes, links };
  });
}
