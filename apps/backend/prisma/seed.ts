import 'dotenv/config';
import { PrismaClient, UserType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@solenia.dev' },
    update: {
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$6NZD0gcOjK5celcxbbDYQg$o6m7F8xJCB1D8dV9vpiFQEo+OerqIPagdfC4Mq1FJ/c',
      type: UserType.admin,
    },
    create: {
      username: 'admin',
      email: 'admin@solenia.dev',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$6NZD0gcOjK5celcxbbDYQg$o6m7F8xJCB1D8dV9vpiFQEo+OerqIPagdfC4Mq1FJ/c',
      type: UserType.admin,
    },
  });

  // Kingdom
  const kingdom = await prisma.kingdom.create({
    data: {
      name: 'Solenia Prime',
      population: 1200000,
      description: 'Royaume central.',
      dateInGame: new Date('1000-01-01'),
    },
  });

  // City
  const city = await prisma.city.create({
    data: {
      name: 'Aster',
      description: 'Capitale marchande.',
      kingdomId: kingdom.id,
    },
  });

  // Place
  const place = await prisma.place.create({
    data: {
      name: 'Port d’Aster',
      description: 'Grand port de commerce.',
      kingdomId: kingdom.id,
      cityId: city.id,
    },
  });

  // Person
  const person = await prisma.personOfInterest.create({
    data: {
      name: 'Maelis',
      description: 'Émissaire royal.',
      imageUrl: null,
      membership: 'Couronne',
      languages: ['Common', 'Elvish'],
      STR: 10,
      DEX: 12,
      CON: 11,
      INT: 15,
      WIS: 13,
      CHA: 16,
      kingdomId: kingdom.id,
      cityId: city.id,
    },
  });

  // Positions (coords normalisées 0..1 sur l’image)
  await prisma.position.createMany({
    data: [
      { kingdomId: kingdom.id, x: 0.45, y: 0.55 },
      { cityId: city.id, x: 0.48, y: 0.58 },
      { placeId: place.id, x: 0.50, y: 0.60 },
      { personOfInterestId: person.id, x: 0.49, y: 0.57 },
    ],
  });

  // Comment
  await prisma.comment.create({
    data: {
      description: 'Premier contact établi.',
      dateInGame: new Date('1000-01-02'),
      kingdomId: kingdom.id,
      authorId: admin.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

