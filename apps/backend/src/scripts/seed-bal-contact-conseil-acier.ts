import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TITLE = '[Contact] Lysanne Orfe (Conseil d’Acier)';
// Texte brut : les descriptions de péripéties ne rendent pas le HTML.
const DESC = `Courtière en obligations — façade mondaine du Conseil d'Acier. Elle circule de groupe en groupe et rappelle, avec des mots trop polis pour être une menace, que les échéances approchent.

Ce qu'elle laisse filtrer si on la met en confiance :
— Tovalis doit le plus : des avances contractées sur l'exploitation des carrières.
— Cilovard a emprunté pour couvrir un revers maritime — une dette moyenne, mais fraîche.
— Chez les Palhindile, la somme est petite mais honteuse : un proche de la Chancelière a emprunté en secret.

Bien menée (Persuasion ou Tromperie), elle lâche quel folio du Grand Registre pèse sur quelle Maison — une monnaie d'échange redoutable dans la soirée. Brusquée, elle sourit, note, et passe à un autre groupe : on ne bouscule pas le Conseil d'Acier dans un salon.

MJ : elle constitue en parallèle son propre dossier sur Rany Mullimax, le chef de la cellule d'Alagir.`;

async function main() {
  const bal = await prisma.quest.findFirst({
    where: { title: { contains: 'Bal Tovalis', mode: 'insensitive' } },
    select: { id: true, title: true },
  });
  if (!bal) throw new Error('Quête « Bal Tovalis » introuvable.');

  const existing = await prisma.questStep.findFirst({ where: { questId: bal.id, title: TITLE }, select: { id: true } });
  if (existing) {
    await prisma.questStep.update({ where: { id: existing.id }, data: { description: DESC, optional: true } });
    console.log(`Péripétie mise à jour : « ${TITLE} »`);
  } else {
    const max = await prisma.questStep.aggregate({ where: { questId: bal.id }, _max: { order: true } });
    await prisma.questStep.create({
      data: { questId: bal.id, title: TITLE, description: DESC, optional: true, order: (max._max.order ?? 0) + 1 },
    });
    console.log(`Péripétie créée : « ${TITLE} »`);
  }

  const steps = await prisma.questStep.count({ where: { questId: bal.id } });
  console.log(`${bal.title} → ${steps} péripéties.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
