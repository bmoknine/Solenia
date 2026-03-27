import type { FastifyInstance } from 'fastify';
import { organisationInputSchema, idSchema } from '@solenia/shared';
import { requireRole } from '../utils/rbac';

export async function organisationRoutes(app: FastifyInstance) {
  app.get('/organisations', async () => {
    return app.prisma.organisation.findMany({
      orderBy: { name: 'asc' },
    });
  });

  app.get('/organisations/:id', async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
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
    console.log('Backend - POST /organisations - Données reçues:', rawData);
    const { kingdomIds, cityIds, placeIds, personIds, ...orgData } = rawData;
    console.log('Backend - IDs extraits:', { kingdomIds, cityIds, placeIds, personIds });
    
    const flag = orgData.flag === '' || orgData.flag == null ? null : orgData.flag;
    const organisation = await app.prisma.organisation.create({ data: { ...orgData, flag } });
    
    // Créer les liens avec les royaumes
    if (kingdomIds && kingdomIds.length > 0) {
      await Promise.all(
        kingdomIds.map((kingdomId) =>
          app.prisma.organisationKingdom.create({
            data: { organisationId: organisation.id, kingdomId },
          }).catch((err: any) => {
            // Ignorer uniquement les erreurs de doublons (P2002)
            if (err.code !== 'P2002') {
              console.error('Erreur lors de la création du lien organisation-kingdom:', err);
              throw err;
            }
          })
        )
      );
    }
    
    // Créer les liens avec les villes
    if (cityIds && cityIds.length > 0) {
      await Promise.all(
        cityIds.map((cityId) =>
          app.prisma.organisationCity.create({
            data: { organisationId: organisation.id, cityId },
          }).catch((err: any) => {
            if (err.code !== 'P2002') {
              console.error('Erreur lors de la création du lien organisation-city:', err);
              throw err;
            }
          })
        )
      );
    }
    
    // Créer les liens avec les lieux
    if (placeIds && placeIds.length > 0) {
      await Promise.all(
        placeIds.map((placeId) =>
          app.prisma.organisationPlace.create({
            data: { organisationId: organisation.id, placeId },
          }).catch((err: any) => {
            if (err.code !== 'P2002') {
              console.error('Erreur lors de la création du lien organisation-place:', err);
              throw err;
            }
          })
        )
      );
    }
    
    // Créer les liens avec les personnes
    if (personIds && personIds.length > 0) {
      await Promise.all(
        personIds.map((personId) =>
          app.prisma.organisationMember.create({
            data: { organisationId: organisation.id, personId },
          }).catch((err: any) => {
            if (err.code !== 'P2002') {
              console.error('Erreur lors de la création du lien organisation-member:', err);
              throw err;
            }
          })
        )
      );
    }
    
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
    const id = idSchema.parse((request.params as any).id);
    console.log('Backend - PUT /organisations/:id - Données brutes reçues:', { 
      id, 
      body: request.body,
      bodyKeys: Object.keys(request.body || {}),
      kingdomIds: (request.body as any)?.kingdomIds,
      cityIds: (request.body as any)?.cityIds,
    });
    
    // Utiliser passthrough() pour ne pas filtrer les champs supplémentaires
    const rawData = organisationInputSchema.partial().passthrough().parse(request.body);
    console.log('Backend - PUT /organisations/:id - Données parsées:', { id, rawData });
    const { kingdomIds, cityIds, placeIds, personIds, ...orgData } = rawData;
    console.log('Backend - IDs extraits:', { kingdomIds, cityIds, placeIds, personIds });
    
    const data: Record<string, unknown> = {};
    if ('name' in orgData) data.name = orgData.name;
    if ('description' in orgData) data.description = orgData.description ?? null;
    if ('organisationType' in orgData) data.organisationType = orgData.organisationType ?? null;
    if ('parentOrganisationId' in orgData) {
      data.parentOrganisationId = orgData.parentOrganisationId ?? null;
      // Empêcher une organisation d'être son propre parent
      if (orgData.parentOrganisationId === id) {
        throw new Error('Une organisation ne peut pas être son propre parent');
      }
    }
    if ('flag' in orgData) data.flag = orgData.flag === '' || orgData.flag == null ? null : orgData.flag;
    
    // Mettre à jour l'organisation
    await app.prisma.organisation.update({ where: { id }, data });
    
    // Mettre à jour les liens avec les royaumes
    if (kingdomIds !== undefined) {
      // Supprimer tous les liens existants
      await app.prisma.organisationKingdom.deleteMany({ where: { organisationId: id } });
      // Créer les nouveaux liens
      if (kingdomIds.length > 0) {
        await Promise.all(
          kingdomIds.map((kingdomId) =>
            app.prisma.organisationKingdom.create({
              data: { organisationId: id, kingdomId },
            }).catch((err: any) => {
              if (err.code !== 'P2002') {
                console.error('Erreur lors de la mise à jour du lien organisation-kingdom:', err);
                throw err;
              }
            })
          )
        );
      }
    }
    
    // Mettre à jour les liens avec les villes
    if (cityIds !== undefined) {
      await app.prisma.organisationCity.deleteMany({ where: { organisationId: id } });
      if (cityIds.length > 0) {
        await Promise.all(
          cityIds.map((cityId) =>
            app.prisma.organisationCity.create({
              data: { organisationId: id, cityId },
            }).catch((err: any) => {
              if (err.code !== 'P2002') {
                console.error('Erreur lors de la mise à jour du lien organisation-city:', err);
                throw err;
              }
            })
          )
        );
      }
    }
    
    // Mettre à jour les liens avec les lieux
    if (placeIds !== undefined) {
      await app.prisma.organisationPlace.deleteMany({ where: { organisationId: id } });
      if (placeIds.length > 0) {
        await Promise.all(
          placeIds.map((placeId) =>
            app.prisma.organisationPlace.create({
              data: { organisationId: id, placeId },
            }).catch((err: any) => {
              if (err.code !== 'P2002') {
                console.error('Erreur lors de la mise à jour du lien organisation-place:', err);
                throw err;
              }
            })
          )
        );
      }
    }
    
    // Mettre à jour les liens avec les personnes
    if (personIds !== undefined) {
      await app.prisma.organisationMember.deleteMany({ where: { organisationId: id } });
      if (personIds.length > 0) {
        await Promise.all(
          personIds.map((personId) =>
            app.prisma.organisationMember.create({
              data: { organisationId: id, personId },
            }).catch((err: any) => {
              if (err.code !== 'P2002') {
                console.error('Erreur lors de la mise à jour du lien organisation-member:', err);
                throw err;
              }
            })
          )
        );
      }
    }
    
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
      console.log('Backend - Organisation non trouvée après mise à jour');
      return { id };
    }
    
    const result = {
      ...updatedOrg,
      members: updatedOrg.members.map((m) => m.person),
      cities: updatedOrg.cities.map((c) => c.city),
      places: updatedOrg.places.map((p) => p.place),
      kingdoms: updatedOrg.kingdoms.map((k) => k.kingdom),
      subOrganisations: updatedOrg.subOrganisations,
    };
    
    console.log('Backend - Organisation retournée après mise à jour:', {
      id: result.id,
      name: result.name,
      kingdomsCount: result.kingdoms.length,
      citiesCount: result.cities.length,
      placesCount: result.places.length,
      membersCount: result.members.length,
    });
    
    return result;
  });

  app.delete('/organisations/:id', { preHandler: requireRole(app, ['admin']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    await app.prisma.organisation.delete({ where: { id } });
    reply.code(204);
  });

  // Routes pour gérer les membres
  app.post('/organisations/:id/members', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
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
    } catch (error: any) {
      if (error.code === 'P2002') {
        return reply.conflict('Cette personne est déjà membre de cette organisation');
      }
      throw error;
    }
  });

  app.delete('/organisations/:id/members/:personId', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    const personId = idSchema.parse((request.params as any).personId);
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
    const id = idSchema.parse((request.params as any).id);
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
    } catch (error: any) {
      if (error.code === 'P2002') {
        return reply.conflict('Cette ville est déjà associée à cette organisation');
      }
      throw error;
    }
  });

  app.delete('/organisations/:id/cities/:cityId', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    const cityId = idSchema.parse((request.params as any).cityId);
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
    const id = idSchema.parse((request.params as any).id);
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
    } catch (error: any) {
      if (error.code === 'P2002') {
        return reply.conflict('Ce lieu est déjà associé à cette organisation');
      }
      throw error;
    }
  });

  app.delete('/organisations/:id/places/:placeId', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    const placeId = idSchema.parse((request.params as any).placeId);
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
    const id = idSchema.parse((request.params as any).id);
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
    } catch (error: any) {
      if (error.code === 'P2002') {
        return reply.conflict('Ce royaume est déjà associé à cette organisation');
      }
      throw error;
    }
  });

  app.delete('/organisations/:id/kingdoms/:kingdomId', { preHandler: requireRole(app, ['admin', 'editor']) }, async (request, reply) => {
    const id = idSchema.parse((request.params as any).id);
    const kingdomId = idSchema.parse((request.params as any).kingdomId);
    await app.prisma.organisationKingdom.deleteMany({
      where: {
        organisationId: id,
        kingdomId,
      },
    });
    reply.code(204);
  });
}
