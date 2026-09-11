import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const pc = await prisma.playerCharacter.findFirst({ where: { name: { in: ['Illévas', 'Illevas'] } } });
  if (!pc) {
    console.log('PJ introuvable.');
    return;
  }

  // 1) Nom → Illevas + visible sur la carte
  await prisma.playerCharacter.update({
    where: { id: pc.id },
    data: { name: 'Illevas', showOnMap: true },
  });

  // 2) Intimidation → non maîtrisée
  await prisma.playerCharacterSkill.updateMany({
    where: { playerCharacterId: pc.id, name: 'Intimidation' },
    data: { proficient: false },
  });

  // 3) Intuition (Sagesse) → maîtrisée (créée si absente)
  const intu = await prisma.playerCharacterSkill.findFirst({ where: { playerCharacterId: pc.id, name: 'Intuition' } });
  if (intu) {
    await prisma.playerCharacterSkill.update({ where: { id: intu.id }, data: { ability: 'WIS', proficient: true } });
  } else {
    await prisma.playerCharacterSkill.create({ data: { playerCharacterId: pc.id, name: 'Intuition', ability: 'WIS', proficient: true, expertise: false } });
  }

  // 4) Retirer la note « Intuition/Intimidation à vérifier » de la description (désormais réglé)
  const fresh = await prisma.playerCharacter.findUnique({ where: { id: pc.id } });
  if (fresh?.description) {
    const cleaned = fresh.description.replace(
      /\n\nÀ noter : Intuition[\s\S]*?expertise éventuelle\)\./,
      '',
    );
    if (cleaned !== fresh.description) {
      await prisma.playerCharacter.update({ where: { id: pc.id }, data: { description: cleaned } });
    }
  }

  // 5) Position = même point que Neuf Nuits
  const nn = await prisma.playerCharacter.findFirst({ where: { name: 'Neuf Nuits' }, select: { position: true } });
  if (nn?.position) {
    const existing = await prisma.position.findFirst({ where: { playerCharacterId: pc.id } });
    if (existing) {
      await prisma.position.update({ where: { id: existing.id }, data: { x: nn.position.x, y: nn.position.y } });
    } else {
      await prisma.position.create({ data: { x: nn.position.x, y: nn.position.y, playerCharacterId: pc.id } });
    }
    console.log(`Position placée au point de Neuf Nuits : x=${nn.position.x}, y=${nn.position.y}`);
  }

  const check = await prisma.playerCharacter.findUnique({
    where: { id: pc.id },
    include: { skills: { where: { name: { in: ['Intuition', 'Intimidation'] } } }, position: true },
  });
  console.log('OK →', check?.name, '| showOnMap', check?.showOnMap);
  console.log('  skills:', check?.skills.map((s) => `${s.name}:${s.proficient ? 'maîtrisée' : 'non'}`));
  console.log('  position:', check?.position ? `x=${check.position.x}, y=${check.position.y}` : 'aucune');
}

main().catch(console.error).finally(() => prisma.$disconnect());
