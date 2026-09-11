import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * « Radius Ignis Mirdobas » et « Mirdobas Filan » sont la même personne :
 * Radius Ignis est son grade au Soleil Pourpre, Mirdobas Filan son nom.
 * Le doublon vient de l'import de la Partie 5 (fiche maigre, stats par défaut).
 *
 * On garde « Mirdobas Filan » (FP 9, PV 135, Citadelle Rouge) et on y rapatrie
 * tout ce qui pend du doublon avant de le supprimer. Idempotent.
 */
const SURVIVANT = 'Mirdobas Filan';
const DOUBLON = 'Radius Ignis Mirdobas';

const PARAGRAPHE_LIAISON =
  "Officier de liaison entre l'Œil Pourpre et le Soleil Pourpre. Réunion secrète chez Regalio Regani (9 juin 887) : " +
  "préparatifs de la Crypte Rubis, cadence des écailles, canalistes d'aplanissement émotionnel, surveillance des quais Arrezo. " +
  'Ses interlocuteurs le nomment le plus souvent « Radius Ignis Mirdobas ».';

/** Titres fusionnés dans les organigrammes (les deux rôles n'en font qu'un). */
const TITRES: Record<string, string> = {
  'Le Soleil Pourpre': 'Radius Ignis — officier psychique, liaison Œil Pourpre',
  "L'Œil Pourpre": 'Radius Ignis — officier psychique et liaison',
};

async function main() {
  const survivant = await prisma.personOfInterest.findFirst({ where: { name: SURVIVANT } });
  if (!survivant) throw new Error(`PNJ introuvable : ${SURVIVANT}`);

  const doublon = await prisma.personOfInterest.findFirst({ where: { name: DOUBLON } });
  if (!doublon) {
    console.log('✓ Fusion déjà faite : le doublon n’existe plus.');
  } else {
    // 1. Description : on insère le rôle de liaison avant le bloc de capacités.
    const desc = survivant.description ?? '';
    if (!desc.includes('Officier de liaison entre')) {
      const marqueur = '\n\nCapacités notables';
      const nouvelle = desc.includes(marqueur)
        ? desc.replace(marqueur, `\n\n${PARAGRAPHE_LIAISON}${marqueur}`)
        : `${desc}\n\n${PARAGRAPHE_LIAISON}`;
      await prisma.personOfInterest.update({ where: { id: survivant.id }, data: { description: nouvelle } });
      console.log('✓ Description enrichie du rôle de liaison.');
    } else {
      console.log('· Description déjà enrichie.');
    }

    // 2. Entrées de lore : on les rattache au survivant (sauf s'il y est déjà lié).
    const liens = await prisma.lorePerson.findMany({ where: { personId: doublon.id }, select: { id: true, loreId: true } });
    for (const lien of liens) {
      const dejaLie = await prisma.lorePerson.findFirst({ where: { loreId: lien.loreId, personId: survivant.id } });
      if (dejaLie) await prisma.lorePerson.delete({ where: { id: lien.id } });
      else await prisma.lorePerson.update({ where: { id: lien.id }, data: { personId: survivant.id } });
    }
    console.log(`✓ ${liens.length} lien(s) de lore rattaché(s) à ${SURVIVANT}.`);

    // 3. Commentaires et combattants éventuels.
    const c1 = await prisma.comment.updateMany({ where: { personOfInterestId: doublon.id }, data: { personOfInterestId: survivant.id } });
    const c2 = await prisma.combatant.updateMany({ where: { personId: doublon.id }, data: { personId: survivant.id } });
    if (c1.count || c2.count) console.log(`✓ ${c1.count} commentaire(s), ${c2.count} combattant(s) reportés.`);

    // 4. Organisations : le survivant est déjà membre des deux, on jette les doublons.
    const appartenances = await prisma.organisationMember.findMany({ where: { personId: doublon.id }, select: { id: true, organisationId: true } });
    for (const a of appartenances) {
      const deja = await prisma.organisationMember.findFirst({ where: { organisationId: a.organisationId, personId: survivant.id } });
      if (deja) await prisma.organisationMember.delete({ where: { id: a.id } });
      else await prisma.organisationMember.update({ where: { id: a.id }, data: { personId: survivant.id } });
    }

    // 5. Nœuds d'organigramme : un seul nœud par organisation.
    const noeudsDoublon = await prisma.familyMember.findMany({
      where: { personId: doublon.id },
      select: { id: true, organisationId: true, superiorId: true, order: true, organisation: { select: { name: true } } },
    });
    for (const nd of noeudsDoublon) {
      const garde = await prisma.familyMember.findFirst({
        where: { organisationId: nd.organisationId, personId: survivant.id },
        select: { id: true, superiorId: true },
      });
      if (garde) {
        // Les subordonnés du nœud supprimé passent sous le nœud conservé.
        await prisma.familyMember.updateMany({ where: { superiorId: nd.id }, data: { superiorId: garde.id } });
        await prisma.familyMember.update({
          where: { id: garde.id },
          data: {
            name: SURVIVANT,
            title: TITRES[nd.organisation.name] ?? undefined,
            superiorId: garde.superiorId ?? nd.superiorId,
          },
        });
        await prisma.familyMember.delete({ where: { id: nd.id } });
        console.log(`✓ ${nd.organisation.name} : nœuds fusionnés.`);
      } else {
        await prisma.familyMember.update({
          where: { id: nd.id },
          data: { personId: survivant.id, name: SURVIVANT, title: TITRES[nd.organisation.name] ?? undefined },
        });
      }
    }

    // 6. Position (relation 1-1 sans cascade : sinon on laisserait une ligne orpheline).
    await prisma.position.deleteMany({ where: { personOfInterestId: doublon.id } });

    // 7. Le doublon lui-même.
    await prisma.personOfInterest.delete({ where: { id: doublon.id } });
    console.log(`✓ Doublon « ${DOUBLON} » supprimé.`);
  }

  // 8. L'entrée de lore garde le grade mais porte désormais le nom complet.
  const lore = await prisma.lore.findFirst({ where: { title: 'Réunion Radius Ignis Mirdobas – Regalio Regani' } });
  if (lore) {
    await prisma.lore.update({
      where: { id: lore.id },
      data: {
        title: 'Réunion Radius Ignis Mirdobas Filan – Regalio Regani',
        content: lore.content.replace('Radius (OP)', "Mirdobas Filan, Radius Ignis (Œil Pourpre),"),
      },
    });
    console.log('✓ Entrée de lore renommée avec le nom complet.');
  }

  // Contrôle final
  const restant = await prisma.personOfInterest.findMany({
    where: { name: { in: [SURVIVANT, DOUBLON] } },
    select: {
      name: true, fp: true, pv: true,
      familyMembers: { select: { title: true, organisation: { select: { name: true } } } },
      organisations: { select: { organisation: { select: { name: true } } } },
      lores: { select: { lore: { select: { title: true } } } },
    },
  });
  console.log('\n── Résultat ──');
  for (const p of restant) {
    console.log(`${p.name} — FP ${p.fp}, PV ${p.pv}`);
    console.log(`  organisations : ${p.organisations.map((o) => o.organisation.name).join(', ')}`);
    console.log(`  nœuds : ${p.familyMembers.map((f) => `${f.organisation.name} → ${f.title}`).join(' | ')}`);
    console.log(`  lore : ${p.lores.map((l) => l.lore.title).join(', ') || '—'}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
