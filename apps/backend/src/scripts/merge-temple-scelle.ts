import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fusion des deux « Temple Scellé » (doublon d'import lore jamais nettoyé).
 * On garde b15522c5 (ville, quartier, position sur la carte, description complète)
 * et on supprime c061f772, stub lore dont la seule information — « sous le Château
 * de Verre » — est déjà portée par le quartier du survivant. Idempotent.
 */
const SURVIVANT = 'b15522c5-a603-424e-aa13-55a7e5de4785';
const DOUBLON = 'c061f772-bfcb-41f4-be1d-01fa653cfb06';

async function main() {
  const survivant = await prisma.place.findUnique({ where: { id: SURVIVANT }, select: { id: true, name: true } });
  if (!survivant) throw new Error('Lieu survivant introuvable.');

  const doublon = await prisma.place.findUnique({ where: { id: DOUBLON }, select: { id: true, name: true } });
  if (!doublon) {
    console.log('✓ Fusion déjà faite : le doublon n’existe plus.');
  } else {
    // Report de tout ce qui pourrait pointer vers le doublon (vide ici, mais on ne suppose pas).
    const reports = {
      pnj: (await prisma.personOfInterest.updateMany({ where: { placeId: DOUBLON }, data: { placeId: SURVIVANT } })).count,
      pj: (await prisma.playerCharacter.updateMany({ where: { placeId: DOUBLON }, data: { placeId: SURVIVANT } })).count,
      commentaires: (await prisma.comment.updateMany({ where: { placeId: DOUBLON }, data: { placeId: SURVIVANT } })).count,
      orgs: 0,
      lore: 0,
    };

    // Tables de liaison : contrainte d'unicité → on ne reporte que ce qui n'existe pas déjà.
    for (const l of await prisma.organisationPlace.findMany({ where: { placeId: DOUBLON }, select: { id: true, organisationId: true } })) {
      const deja = await prisma.organisationPlace.findFirst({ where: { organisationId: l.organisationId, placeId: SURVIVANT } });
      if (deja) await prisma.organisationPlace.delete({ where: { id: l.id } });
      else { await prisma.organisationPlace.update({ where: { id: l.id }, data: { placeId: SURVIVANT } }); reports.orgs++; }
    }
    for (const l of await prisma.lorePlace.findMany({ where: { placeId: DOUBLON }, select: { id: true, loreId: true } })) {
      const deja = await prisma.lorePlace.findFirst({ where: { loreId: l.loreId, placeId: SURVIVANT } });
      if (deja) await prisma.lorePlace.delete({ where: { id: l.id } });
      else { await prisma.lorePlace.update({ where: { id: l.id }, data: { placeId: SURVIVANT } }); reports.lore++; }
    }
    console.log('Reports :', JSON.stringify(reports));

    // Position 1-1 : relation sans cascade, on supprime pour ne pas laisser d'orpheline.
    const pos = await prisma.position.deleteMany({ where: { placeId: DOUBLON } });
    if (pos.count) console.log(`  · ${pos.count} position supprimée`);

    await prisma.place.delete({ where: { id: DOUBLON } });
    console.log(`✓ Doublon « ${doublon.name} » supprimé.`);
  }

  // ── Contrôle ────────────────────────────────────────────────────────
  const restants = await prisma.place.findMany({
    where: { name: { contains: 'Temple Scell', mode: 'insensitive' } },
    include: {
      city: { select: { name: true } }, district: { select: { name: true } }, position: true,
      persons: { select: { name: true } }, organisations: { select: { id: true } }, lores: { select: { id: true } },
    },
  });
  console.log(`\nLieux « Temple Scellé » restants : ${restants.length}`);
  for (const r of restants) {
    console.log(`  ▸ ${r.name} [${r.id}]`);
    console.log(`     ville=${r.city?.name ?? '—'} quartier=${r.district?.name ?? '—'} position=${r.position ? 'oui' : 'non'} showOnMap=${r.showOnMap}`);
    console.log(`     PNJ=${r.persons.length} orgs=${r.organisations.length} lore=${r.lores.length}`);
    console.log(`     ${r.description}`);
  }

  const orphelines = await prisma.position.count({
    where: { kingdomId: null, cityId: null, placeId: null, personOfInterestId: null, playerCharacterId: null },
  });
  console.log(`\nPositions orphelines en base : ${orphelines} (inchangé par cette fusion)`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
