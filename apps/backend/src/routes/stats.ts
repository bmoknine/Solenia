import type { FastifyInstance } from 'fastify';

export async function statsRoutes(app: FastifyInstance) {
  app.get('/stats', async () => {
    const [
      kingdoms,
      cities,
      districts,
      places,
      persons,
      organisations,
      playerCharacters,
      lores,
      organisationMembers,
      comments,
    ] = await Promise.all([
      app.prisma.kingdom.count(),
      app.prisma.city.count(),
      app.prisma.district.count(),
      app.prisma.place.count(),
      app.prisma.personOfInterest.count(),
      app.prisma.organisation.count(),
      app.prisma.playerCharacter.count(),
      app.prisma.lore.count(),
      app.prisma.organisationMember.count(),
      app.prisma.comment.count(),
    ]);

    return {
      kingdoms,
      cities,
      districts,
      places,
      persons,
      organisations,
      playerCharacters,
      lores,
      organisationMembers,
      comments,
    };
  });
}
