import { PrismaClient } from '@prisma/client';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const prisma = new PrismaClient();

/**
 * Supprime les lignes Position qui ne pointent plus vers aucune entité.
 * Origine : Position.<fk> est en SetNull (pas Cascade) ; quand un script supprime
 * directement une entité, la ligne survit avec toutes ses clés à null. Les routes de
 * l'app, elles, suppriment la position à la main — elles n'en produisent pas.
 *
 * Sauvegarde JSON écrite avant suppression : l'opération est réversible.
 */
const ORPHELINE = {
  kingdomId: null, cityId: null, placeId: null, personOfInterestId: null, playerCharacterId: null,
} as const;

async function main() {
  const orphelines = await prisma.position.findMany({ where: ORPHELINE, orderBy: { id: 'asc' } });
  console.log(`Positions orphelines trouvées : ${orphelines.length}`);
  if (orphelines.length === 0) {
    console.log('✓ Rien à nettoyer.');
    return;
  }

  // ── Sauvegarde ──────────────────────────────────────────────────────
  const dir = join(process.cwd(), 'backups');
  mkdirSync(dir, { recursive: true });
  const horodatage = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '');
  const fichier = join(dir, `positions-orphelines-${horodatage}.json`);
  writeFileSync(fichier, JSON.stringify(orphelines, null, 2), 'utf8');
  console.log(`✓ Sauvegarde : ${fichier}`);

  // ── Suppression (double garde : on repasse la condition complète) ────
  const suppr = await prisma.position.deleteMany({ where: ORPHELINE });
  console.log(`✓ ${suppr.count} ligne(s) supprimée(s)`);

  // ── Contrôle ────────────────────────────────────────────────────────
  const restantes = await prisma.position.count({ where: ORPHELINE });
  const total = await prisma.position.count();
  const parType = {
    royaumes: await prisma.position.count({ where: { kingdomId: { not: null } } }),
    villes: await prisma.position.count({ where: { cityId: { not: null } } }),
    lieux: await prisma.position.count({ where: { placeId: { not: null } } }),
    pnj: await prisma.position.count({ where: { personOfInterestId: { not: null } } }),
    pj: await prisma.position.count({ where: { playerCharacterId: { not: null } } }),
  };
  const somme = Object.values(parType).reduce((a, b) => a + b, 0);

  console.log('\n── Contrôle ──');
  console.log(`  orphelines restantes : ${restantes}`);
  console.log(`  positions totales    : ${total}`);
  console.log(`  dont royaumes ${parType.royaumes} · villes ${parType.villes} · lieux ${parType.lieux} · PNJ ${parType.pnj} · PJ ${parType.pj}`);
  console.log(`  somme des rattachées : ${somme} ${somme === total ? '= total ✓' : '≠ total ⚠'}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
