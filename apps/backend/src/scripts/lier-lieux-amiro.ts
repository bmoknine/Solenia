import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * L'« Atelier Amiro Léovine » et le « Laboratoire abandonné d'Amiro Léovine » ne sont
 * PAS un doublon : l'atelier (Alagir, La Cinquième Roue) donne accès au laboratoire
 * (souterrain, en montagne, salles I–VI). On explicite le lien dans les deux sens
 * au lieu de fusionner. Idempotent (marqueur « Accès : »).
 */
const ATELIER = '19e566a4-91ad-46a3-998d-eadaacf6a719';
const LABO = 'db659a2c-6014-494e-864e-1e1b09b29e13';
const AMIRO = 'fe11f5e3-b52a-446f-b6bd-18cf660a6eb9';

const ATELIER_DESC = `
<p>Atelier de cristomancie d'<strong>Amiro Léovine</strong>, dans le quartier de <strong>La Cinquième Roue</strong>. La clé est détenue par <strong>Laguna Temper</strong>.</p>
<p><strong>Accès :</strong> c'est d'ici que l'on rejoint le <strong>Laboratoire abandonné d'Amiro Léovine</strong>, le complexe souterrain en montagne. L'atelier est l'entrée ; le laboratoire est la destination.</p>
`.trim();

const LABO_DESC = `
<p>Ancien laboratoire d'alchimie et de cristaux, en montagne — <strong>salles I à VI</strong>. <strong>Virion Omalee</strong> / <strong>Amiro Léovine</strong>, clones cristallins, Valdris. <strong>Environnement inflammable.</strong></p>
<p><strong>Accès :</strong> on n'y entre que par l'<strong>Atelier Amiro Léovine</strong>, dans La Cinquième Roue à Alagir — dont <strong>Laguna Temper</strong> détient la clé.</p>
`.trim();

const AMIRO_ANCIEN = "<p><strong>Rôle :</strong> cristomancien, anciennement <strong>Virion Omalee</strong> (V.O.). Précepteur d'Elerÿna ; clones cristallins et expériences Valdris.</p>";
const AMIRO_NOUVEAU = "<p><strong>Rôle :</strong> cristomancien, anciennement <strong>Virion Omalee</strong> (V.O.). Précepteur d'Elerÿna ; clones cristallins et expériences Valdris.</p>\n<p><strong>Où le trouver :</strong> dans son <strong>laboratoire abandonné</strong>, en montagne (salles I–VI), que l'on ne rejoint que par son <strong>atelier</strong> de La Cinquième Roue — dont <strong>Laguna Temper</strong> détient la clé.</p>";

async function main() {
  for (const [id, desc, label] of [[ATELIER, ATELIER_DESC, 'Atelier'], [LABO, LABO_DESC, 'Laboratoire']] as const) {
    const lieu = await prisma.place.findUnique({ where: { id }, select: { name: true, description: true } });
    if (!lieu) { console.log(`⚠ introuvable : ${label}`); continue; }
    if ((lieu.description ?? '').includes('<strong>Accès :</strong>')) { console.log(`· ${lieu.name} : déjà relié`); continue; }
    await prisma.place.update({ where: { id }, data: { description: desc } });
    console.log(`✓ ${lieu.name} : lien explicité`);
  }

  const amiro = await prisma.personOfInterest.findUnique({ where: { id: AMIRO }, select: { name: true, description: true } });
  if (amiro) {
    const d = amiro.description ?? '';
    if (d.includes('Où le trouver')) console.log('· Amiro Léovine : déjà pourvu du renvoi');
    else if (!d.includes(AMIRO_ANCIEN)) console.log('⚠ Amiro Léovine : paragraphe Rôle introuvable, fiche inchangée');
    else {
      await prisma.personOfInterest.update({ where: { id: AMIRO }, data: { description: d.replace(AMIRO_ANCIEN, AMIRO_NOUVEAU) } });
      console.log('✓ Amiro Léovine : renvoi vers les deux lieux ajouté');
    }
  }

  // ── Contrôle ────────────────────────────────────────────────────────
  const lieux = await prisma.place.findMany({
    where: { name: { contains: 'Amiro' } },
    select: { name: true, description: true, district: { select: { name: true } }, persons: { select: { name: true } } },
    orderBy: { name: 'asc' },
  });
  console.log('\n── Contrôle ──');
  for (const l of lieux) {
    const cite = /Atelier Amiro|Laboratoire abandonné/.test(l.description ?? '');
    console.log(`  ▸ ${l.name}`);
    console.log(`     quartier=${l.district?.name ?? '—'} · PNJ=${l.persons.map((p) => p.name).join(', ') || '—'} · cite l'autre lieu : ${cite ? 'oui ✓' : 'NON ⚠'}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
