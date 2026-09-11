import type { FastifyInstance } from 'fastify';
import { familyMemberInputSchema } from '@solenia/shared';
import { parseRouteUuid } from '../utils/routeParams';
import { requireRole } from '../utils/rbac';

/** Champs renvoyés pour dessiner l'arbre (+ noms des entités liées pour la navigation). */
const treeSelect = {
  id: true,
  organisationId: true,
  name: true,
  title: true,
  personId: true,
  playerCharacterId: true,
  fatherId: true,
  motherId: true,
  spouseId: true,
  superiorId: true,
  sex: true,
  isFounder: true,
  generation: true,
  order: true,
  notes: true,
  isForDM: true,
  person: { select: { id: true, name: true } },
  playerCharacter: { select: { id: true, name: true } },
} as const;

/** Un membre ne peut être ni son propre parent, ni son propre conjoint, ni son propre supérieur. */
function rejectSelfLinks(id: string, data: Record<string, unknown>) {
  const labels: Record<string, string> = {
    fatherId: 'père',
    motherId: 'mère',
    spouseId: 'conjoint',
    superiorId: 'supérieur',
  };
  for (const [key, label] of Object.entries(labels)) {
    if (data[key] === id) {
      throw new Error(`Un membre ne peut pas être son propre ${label}.`);
    }
  }
}

export async function familyMemberRoutes(app: FastifyInstance) {
  // Arbre complet d'une famille (lecture publique, comme GET /organisations)
  app.get('/organisations/:id/family-tree', async (request, reply) => {
    const organisationId = parseRouteUuid(request);
    const organisation = await app.prisma.organisation.findUnique({
      where: { id: organisationId },
      select: {
        id: true,
        name: true,
        organisationType: true,
        // Les sous-organisations alimentent les nœuds « organisation » de l'organigramme :
        // elles sont dérivées de la hiérarchie réelle, jamais dupliquées en base.
        subOrganisations: {
          select: { id: true, name: true, organisationType: true },
          orderBy: { name: 'asc' },
        },
      },
    });
    if (!organisation) return reply.notFound();

    const members = await app.prisma.familyMember.findMany({
      where: { organisationId },
      orderBy: [{ generation: 'asc' }, { order: 'asc' }, { name: 'asc' }],
      select: treeSelect,
    });
    const { subOrganisations, ...org } = organisation;
    return { organisation: org, subOrganisations, members };
  });

  app.post(
    '/organisations/:id/family-members',
    { preHandler: requireRole(app, ['admin', 'editor']) },
    async (request, reply) => {
      const organisationId = parseRouteUuid(request);
      const organisation = await app.prisma.organisation.findUnique({ where: { id: organisationId } });
      if (!organisation) return reply.notFound();

      const data = familyMemberInputSchema.parse(request.body);
      return app.prisma.familyMember.create({
        data: { ...data, organisationId },
        select: treeSelect,
      });
    },
  );

  app.put(
    '/family-members/:id',
    { preHandler: requireRole(app, ['admin', 'editor']) },
    async (request, reply) => {
      const id = parseRouteUuid(request);
      const existing = await app.prisma.familyMember.findUnique({ where: { id } });
      if (!existing) return reply.notFound();

      const data = familyMemberInputSchema.partial().parse(request.body);
      try {
        rejectSelfLinks(id, data as Record<string, unknown>);
      } catch (err) {
        return reply.badRequest(err instanceof Error ? err.message : 'Lien invalide');
      }

      return app.prisma.familyMember.update({ where: { id }, data, select: treeSelect });
    },
  );

  app.delete(
    '/family-members/:id',
    { preHandler: requireRole(app, ['admin', 'editor']) },
    async (request, reply) => {
      const id = parseRouteUuid(request);
      const existing = await app.prisma.familyMember.findUnique({ where: { id } });
      if (!existing) return reply.notFound();

      // Les liens entrants (enfants, conjoint) passent à NULL via onDelete: SetNull.
      await app.prisma.familyMember.delete({ where: { id } });
      return reply.code(204).send();
    },
  );
}
