import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkOrphans() {
  console.log('🔍 Vérification des occurrences fantômes...\n');

  // Vérifier les positions orphelines (positions qui référencent des entités supprimées)
  const orphanPositions = {
    kingdom: await prisma.position.findMany({
      where: {
        kingdomId: { not: null },
        kingdom: null,
      },
    }),
    city: await prisma.position.findMany({
      where: {
        cityId: { not: null },
        city: null,
      },
    }),
    place: await prisma.position.findMany({
      where: {
        placeId: { not: null },
        place: null,
      },
    }),
    person: await prisma.position.findMany({
      where: {
        personOfInterestId: { not: null },
        personOfInterest: null,
      },
    }),
  };

  console.log('📌 Positions orphelines:');
  console.log(`  - Royaumes: ${orphanPositions.kingdom.length}`);
  if (orphanPositions.kingdom.length > 0) {
    console.log('    IDs:', orphanPositions.kingdom.map(p => p.id));
  }
  console.log(`  - Villes: ${orphanPositions.city.length}`);
  if (orphanPositions.city.length > 0) {
    console.log('    IDs:', orphanPositions.city.map(p => p.id));
  }
  console.log(`  - Lieux: ${orphanPositions.place.length}`);
  if (orphanPositions.place.length > 0) {
    console.log('    IDs:', orphanPositions.place.map(p => p.id));
  }
  console.log(`  - Personnages: ${orphanPositions.person.length}`);
  if (orphanPositions.person.length > 0) {
    console.log('    IDs:', orphanPositions.person.map(p => p.id));
  }

  // Vérifier les entités sans position mais qui devraient en avoir une
  const entitiesWithoutPosition = {
    kingdoms: await prisma.kingdom.findMany({
      where: { position: null },
    }),
    cities: await prisma.city.findMany({
      where: { position: null },
    }),
    places: await prisma.place.findMany({
      where: { position: null },
    }),
    persons: await prisma.personOfInterest.findMany({
      where: { position: null },
    }),
  };

  console.log('\n🏷️  Entités sans position:');
  console.log(`  - Royaumes: ${entitiesWithoutPosition.kingdoms.length}`);
  if (entitiesWithoutPosition.kingdoms.length > 0) {
    console.log('    Noms:', entitiesWithoutPosition.kingdoms.map(k => k.name));
  }
  console.log(`  - Villes: ${entitiesWithoutPosition.cities.length}`);
  if (entitiesWithoutPosition.cities.length > 0) {
    console.log('    Noms:', entitiesWithoutPosition.cities.map(c => c.name));
  }
  console.log(`  - Lieux: ${entitiesWithoutPosition.places.length}`);
  if (entitiesWithoutPosition.places.length > 0) {
    console.log('    Noms:', entitiesWithoutPosition.places.map(p => p.name));
  }
  console.log(`  - Personnages: ${entitiesWithoutPosition.persons.length}`);
  if (entitiesWithoutPosition.persons.length > 0) {
    console.log('    Noms:', entitiesWithoutPosition.persons.map(p => p.name));
  }

  // Vérifier les positions qui référencent des IDs inexistants
  const allPositions = await prisma.position.findMany();
  const orphanPositionsByRef = {
    kingdom: [] as string[],
    city: [] as string[],
    place: [] as string[],
    person: [] as string[],
  };

  for (const pos of allPositions) {
    if (pos.kingdomId) {
      const kingdom = await prisma.kingdom.findUnique({ where: { id: pos.kingdomId } });
      if (!kingdom) {
        orphanPositionsByRef.kingdom.push(pos.id);
      }
    }
    if (pos.cityId) {
      const city = await prisma.city.findUnique({ where: { id: pos.cityId } });
      if (!city) {
        orphanPositionsByRef.city.push(pos.id);
      }
    }
    if (pos.placeId) {
      const place = await prisma.place.findUnique({ where: { id: pos.placeId } });
      if (!place) {
        orphanPositionsByRef.place.push(pos.id);
      }
    }
    if (pos.personOfInterestId) {
      const person = await prisma.personOfInterest.findUnique({ where: { id: pos.personOfInterestId } });
      if (!person) {
        orphanPositionsByRef.person.push(pos.id);
      }
    }
  }

  console.log('\n👻 Positions avec références invalides:');
  console.log(`  - Royaumes: ${orphanPositionsByRef.kingdom.length}`);
  if (orphanPositionsByRef.kingdom.length > 0) {
    console.log('    Position IDs:', orphanPositionsByRef.kingdom);
  }
  console.log(`  - Villes: ${orphanPositionsByRef.city.length}`);
  if (orphanPositionsByRef.city.length > 0) {
    console.log('    Position IDs:', orphanPositionsByRef.city);
  }
  console.log(`  - Lieux: ${orphanPositionsByRef.place.length}`);
  if (orphanPositionsByRef.place.length > 0) {
    console.log('    Position IDs:', orphanPositionsByRef.place);
  }
  console.log(`  - Personnages: ${orphanPositionsByRef.person.length}`);
  if (orphanPositionsByRef.person.length > 0) {
    console.log('    Position IDs:', orphanPositionsByRef.person);
  }

  const totalOrphans = 
    orphanPositions.kingdom.length +
    orphanPositions.city.length +
    orphanPositions.place.length +
    orphanPositions.person.length +
    orphanPositionsByRef.kingdom.length +
    orphanPositionsByRef.city.length +
    orphanPositionsByRef.place.length +
    orphanPositionsByRef.person.length;

  if (totalOrphans > 0) {
    console.log(`\n⚠️  Total d'occurrences fantômes trouvées: ${totalOrphans}`);
    console.log('\n💡 Pour nettoyer ces occurrences, exécutez: npm run clean-orphans');
  } else {
    console.log('\n✅ Aucune occurrence fantôme trouvée!');
  }

  await prisma.$disconnect();
}

checkOrphans().catch(console.error);
