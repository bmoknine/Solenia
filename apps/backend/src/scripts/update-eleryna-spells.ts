import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Meilleure lecture de la photo (fiche v5.5, niveau 9). prepared = true (tout ce qui est sur la fiche).
const SPELLS: { name: string; level: number }[] = [
  // Sorts mineurs (cantrips)
  { name: 'Contrôle des flammes', level: 0 },
  { name: 'Frappe foudroyante', level: 0 },
  { name: 'Main du mage', level: 0 },
  { name: 'Message', level: 0 },
  { name: 'Trait de feu', level: 0 },
  // Niveau 1
  { name: 'Bouclier', level: 1 },
  { name: 'Projectile magique', level: 1 },
  { name: 'Injonction', level: 1 },
  { name: 'Grande foulée', level: 1 },
  // Niveau 2
  { name: 'Rayon ardent', level: 2 },
  { name: 'Sphère de feu', level: 2 },
  { name: 'Souffle du dragon', level: 2 },
  { name: 'Passage sans trace', level: 2 },
  // Niveau 3
  { name: 'Boule de feu', level: 3 },
  { name: 'Contresort', level: 3 },
  { name: 'Peur', level: 3 },
  // Niveau 4
  { name: 'Mur de feu', level: 4 },
  { name: 'Charme-monstre', level: 4 },
  { name: 'Bouclier de feu', level: 4 },
  // Niveau 5
  { name: 'Télékinésie', level: 5 },
  { name: 'Convocation de dragon', level: 5 },
];

async function main() {
  const pc = await prisma.playerCharacter.findFirst({ where: { name: 'Elerÿna' }, select: { id: true } });
  if (!pc) throw new Error('Elerÿna introuvable.');

  // PV Max = 46 (confirmé par le MJ)
  await prisma.playerCharacter.update({ where: { id: pc.id }, data: { pv: 46, pvMax: 46 } });

  // Remplacer la liste de sorts par celle de la photo
  await prisma.playerCharacterSpell.deleteMany({ where: { playerCharacterId: pc.id } });
  for (const s of SPELLS) {
    await prisma.playerCharacterSpell.create({
      data: { playerCharacterId: pc.id, name: s.name, level: s.level, prepared: true },
    });
  }

  const spells = await prisma.playerCharacterSpell.findMany({
    where: { playerCharacterId: pc.id },
    orderBy: [{ level: 'asc' }, { name: 'asc' }],
    select: { name: true, level: true },
  });
  console.log('PV Max = 46 ✓');
  console.log(`\nSorts (${spells.length}) :`);
  let cur = -1;
  for (const s of spells) {
    if (s.level !== cur) { cur = s.level; console.log(`  — Niv ${cur} —`); }
    console.log(`     ${s.name}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
