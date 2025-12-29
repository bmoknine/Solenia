import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('🔍 Vérification des données en base de données...\n');

  // Compter les entités
  const kingdoms = await prisma.kingdom.count();
  const cities = await prisma.city.count();
  const places = await prisma.place.count();
  const persons = await prisma.personOfInterest.count();
  const positions = await prisma.position.count();
  const comments = await prisma.comment.count();

  console.log('📊 Statistiques de la base de données:');
  console.log(`   - ${kingdoms} royaumes`);
  console.log(`   - ${cities} villes`);
  console.log(`   - ${places} lieux`);
  console.log(`   - ${persons} personnages`);
  console.log(`   - ${positions} positions`);
  console.log(`   - ${comments} commentaires\n`);

  // Vérifier les positions avec leurs relations
  console.log('📍 Positions avec leurs relations:');
  const positionsWithRelations = await prisma.position.findMany({
    include: {
      kingdom: { select: { id: true, name: true } },
      city: { select: { id: true, name: true } },
      place: { select: { id: true, name: true } },
      personOfInterest: { select: { id: true, name: true } },
    },
  });

  positionsWithRelations.forEach((pos) => {
    const entity = pos.kingdom || pos.city || pos.place || pos.personOfInterest;
    const type = pos.kingdomId ? 'Royaume' : pos.cityId ? 'Ville' : pos.placeId ? 'Lieu' : 'Personnage';
    console.log(`   ${type}: ${entity?.name || 'Sans nom'} (x: ${pos.x}, y: ${pos.y})`);
  });

  console.log('\n✅ Les données viennent bien de la base de données PostgreSQL via Prisma!');
  console.log('   La route /map/points utilise app.prisma.position.findMany() pour récupérer les données.');
}

verify()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

