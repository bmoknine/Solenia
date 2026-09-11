import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Suite de la purge Aesir : le champ « Secret » de quatre quartiers.
 * Les renvois pointent désormais vers « Le Temple Scellé » (place renommée)
 * et vers la Crypte Rubis pour ce qui relève du Roi.
 */
const CIBLES: { id: string; label: string; de: string; vers: string }[] = [
  {
    id: 'de27c25a-119c-4435-a163-59bdc7240279', label: 'Les Jardins des Âmes',
    de: 'puits vers catacombes du Temple de Tal Aesir',
    vers: 'puits vers les catacombes du Temple Scellé',
  },
  {
    id: 'cd218e67-1630-4948-a3e2-585a884aee96', label: 'Le Chant de Tal Taris',
    de: 'sanctuaire Tal Taris relié au Temple d\'Aesir.',
    vers: 'sanctuaire de Tal Taris relié au Temple Scellé.',
  },
  {
    id: 'a3bd30af-d091-4c93-846e-14e869ce69e5', label: 'Le Château de Verre (quartier)',
    de: 'Caves : Temple de Tal Aesir.',
    vers: 'Caves : le Temple Scellé, et les percements de la Crypte Rubis.',
  },
  {
    id: '78422bae-0fb6-4f20-935f-7c0536f9fcef', label: 'Les Comptes de Zitris',
    de: 'autel Zitris/Aesir — nœud chance/désolation',
    vers: 'autel de Zitris — nœud de chance et de ruine',
  },
];

async function main() {
  for (const c of CIBLES) {
    const d = await prisma.district.findUnique({ where: { id: c.id }, select: { name: true, secret: true } });
    if (!d) { console.log(`⚠ introuvable : ${c.label}`); continue; }
    const secret = d.secret ?? '';
    if (!secret.includes(c.de)) {
      console.log(`· ${d.name.padEnd(32)} déjà traité ou motif introuvable`);
      continue;
    }
    await prisma.district.update({ where: { id: c.id }, data: { secret: secret.replace(c.de, c.vers) } });
    console.log(`✓ ${d.name.padEnd(32)} secret réécrit`);
  }

  // ── Contrôle global, tous types confondus ───────────────────────────
  const like = { contains: 'Aesir', mode: 'insensitive' as const };
  const lignes: [string, number][] = [
    ['organisations', await prisma.organisation.count({ where: { OR: [{ name: like }, { description: like }] } })],
    ['lieux', await prisma.place.count({ where: { OR: [{ name: like }, { description: like }] } })],
    ['villes', await prisma.city.count({ where: { OR: [{ name: like }, { description: like }] } })],
    ['quartiers', await prisma.district.count({ where: { OR: [{ name: like }, { motto: like }, { ambiance: like }, { content: like }, { rumors: like }, { secret: like }] } })],
    ['royaumes', await prisma.kingdom.count({ where: { OR: [{ name: like }, { description: like }] } })],
    ['PNJ', await prisma.personOfInterest.count({ where: { OR: [{ name: like }, { description: like }] } })],
    ['PJ', await prisma.playerCharacter.count({ where: { OR: [{ name: like }, { description: like }] } })],
    ['lore', await prisma.lore.count({ where: { OR: [{ title: like }, { content: like }, { summary: like }] } })],
    ['quêtes', await prisma.quest.count({ where: { OR: [{ title: like }, { description: like }, { notes: like }] } })],
    ['péripéties', await prisma.questStep.count({ where: { OR: [{ title: like }, { description: like }] } })],
    ['sessions', await prisma.gameSession.count({ where: { OR: [{ title: like }, { summary: like }] } })],
    ['commentaires', await prisma.comment.count({ where: { description: like } })],
  ];
  console.log('\n── Contrôle global « Aesir » sur toute la base ──');
  let total = 0;
  for (const [label, n] of lignes) { total += n; console.log(`  ${label.padEnd(14)} ${n}`); }
  console.log(total === 0 ? '\n✓ Plus aucune occurrence dans la base.' : `\n⚠ ${total} occurrence(s) restantes.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
