import type { FastifyInstance } from 'fastify';
import { idSchema, personInputSchema } from '@solenia/shared';
import { requireRole } from '../utils/rbac';

export async function personRoutes(app: FastifyInstance) {
  app.get('/persons', async () => {
    return app.prisma.personOfInterest.findMany({
      include: { position: true },
      orderBy: { name: 'asc' },
    });
  });

  app.get('/persons/:id', async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
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
    const data = personInputSchema.parse(request.body);
    return app.prisma.personOfInterest.create({ data });
  });

  app.put('/persons/:id', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request) => {
    const id = idSchema.parse((request.params as any).id);
    console.log('Backend PUT /persons/:id - request.body:', JSON.stringify(request.body, null, 2));
    
    // Gérer explicitement les champs enum pour éviter qu'ils soient filtrés par Zod
    const rawBody = request.body as any;
    const validBreedValues = ['ELFE', 'HALFELIN', 'HUMAIN', 'NAIN', 'DEMI_ELFE', 'DEMI_ORC', 'DRAKEIDE', 'GNOME', 'TIEFFELIN', 'AASIMAR', 'GENASIAIR', 'GENASITERRE', 'GENASIFEUR', 'GENASIEAU', 'GOLIATH', 'OTHER'];
    const validSexValues = ['MAN', 'WOMAN', 'OTHER'];
    const validMembershipValues = ['POLITIC', 'RELIGEUX', 'MARCHAND', 'CCCH', 'CRIMINALITE', 'OTHER'];
    const validLanguageValues = ['COMMUN', 'NAIN', 'ELFIQUE', 'GNOME', 'HALFELIN', 'ORC', 'GOBELIN', 'GEANT', 'DRACONIQUE', 'SYLVESTRE', 'INFERNAL', 'ABYSSAL', 'CELESTE', 'PRIMORDIAL', 'AQUAN', 'AURAN', 'IGNAN', 'TERRAN', 'PROFOND', 'SLAADI', 'TELEPATHIQUE', 'ARGOT_VOLEUR'];
    
    // Construire l'objet de données en excluant les champs enum et les IDs du parse Zod
    const bodyWithoutEnums = { ...rawBody };
    delete bodyWithoutEnums.breed;
    delete bodyWithoutEnums.sex;
    delete bodyWithoutEnums.membership;
    delete bodyWithoutEnums.languages;
    delete bodyWithoutEnums.kingdomId;
    delete bodyWithoutEnums.cityId;
    delete bodyWithoutEnums.placeId;
    
    // Parser le reste avec Zod
    const parsedData = personInputSchema.partial().parse(bodyWithoutEnums);
    
    // Ajouter les champs enum manuellement avec validation
    if ('breed' in rawBody) {
      parsedData.breed = rawBody.breed === '' || rawBody.breed === null ? null : 
        (validBreedValues.includes(rawBody.breed) ? rawBody.breed : null);
    }
    if ('sex' in rawBody) {
      parsedData.sex = rawBody.sex === '' || rawBody.sex === null ? null : 
        (validSexValues.includes(rawBody.sex) ? rawBody.sex : null);
    }
    if ('membership' in rawBody) {
      parsedData.membership = rawBody.membership === '' || rawBody.membership === null ? null : 
        (validMembershipValues.includes(rawBody.membership) ? rawBody.membership : null);
    }
    if ('languages' in rawBody && Array.isArray(rawBody.languages)) {
      // Filtrer uniquement les langues valides selon l'enum
      parsedData.languages = rawBody.languages.filter((lang: string) => validLanguageValues.includes(lang));
    }
    
    // Ajouter les IDs manuellement avec validation (accepter null)
    if ('kingdomId' in rawBody) {
      parsedData.kingdomId = rawBody.kingdomId === '' || rawBody.kingdomId === null ? null : rawBody.kingdomId;
    }
    if ('cityId' in rawBody) {
      parsedData.cityId = rawBody.cityId === '' || rawBody.cityId === null ? null : rawBody.cityId;
    }
    if ('placeId' in rawBody) {
      parsedData.placeId = rawBody.placeId === '' || rawBody.placeId === null ? null : rawBody.placeId;
    }
    
    console.log('Backend PUT /persons/:id - data après parse et correction:', JSON.stringify(parsedData, null, 2));
    const result = await app.prisma.personOfInterest.update({ where: { id }, data: parsedData });
    console.log('Backend PUT /persons/:id - result:', JSON.stringify(result, null, 2));
    return result;
  });

  app.delete('/persons/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    // Supprimer la position associée si elle existe
    await app.prisma.position.deleteMany({ where: { personOfInterestId: id } });
    await app.prisma.personOfInterest.delete({ where: { id } });
    reply.code(204);
  });
}

