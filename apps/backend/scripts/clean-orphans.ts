import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanOrphans() {
  console.log('🧹 Nettoyage des occurrences fantômes...\n');

  // Trouver toutes les positions
  const allPositions = await prisma.position.findMany();
  let deletedCount = 0;

  for (const pos of allPositions) {
    let shouldDelete = false;

    if (pos.kingdomId) {
      const kingdom = await prisma.kingdom.findUnique({ where: { id: pos.kingdomId } });
      if (!kingdom) {
        console.log(`  ❌ Position ${pos.id} référence un royaume inexistant: ${pos.kingdomId}`);
        shouldDelete = true;
      }
    }
    if (pos.cityId) {
      const city = await prisma.city.findUnique({ where: { id: pos.cityId } });
      if (!city) {
        console.log(`  ❌ Position ${pos.id} référence une ville inexistante: ${pos.cityId}`);
        shouldDelete = true;
      }
    }
    if (pos.placeId) {
      const place = await prisma.place.findUnique({ where: { id: pos.placeId } });
      if (!place) {
        console.log(`  ❌ Position ${pos.id} référence un lieu inexistant: ${pos.placeId}`);
        shouldDelete = true;
      }
    }
    if (pos.personOfInterestId) {
      const person = await prisma.personOfInterest.findUnique({ where: { id: pos.personOfInterestId } });
      if (!person) {
        console.log(`  ❌ Position ${pos.id} référence un personnage inexistant: ${pos.personOfInterestId}`);
        shouldDelete = true;
      }
    }

    if (shouldDelete) {
      await prisma.position.delete({ where: { id: pos.id } });
      deletedCount++;
    }
  }

  console.log(`\n✅ ${deletedCount} position(s) orpheline(s) supprimée(s)`);
  await prisma.$disconnect();
}

cleanOrphans().catch(console.error);
