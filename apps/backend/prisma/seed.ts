import 'dotenv/config';
import { PrismaClient, UserType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Nettoyer la base de données
  await prisma.comment.deleteMany();
  await prisma.position.deleteMany();
  await prisma.personOfInterest.deleteMany();
  await prisma.place.deleteMany();
  await prisma.city.deleteMany();
  await prisma.kingdom.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@solenia.dev',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$6NZD0gcOjK5celcxbbDYQg$o6m7F8xJCB1D8dV9vpiFQEo+OerqIPagdfC4Mq1FJ/c',
      type: UserType.admin,
    },
  });

  const editor = await prisma.user.create({
    data: {
      username: 'editor',
      email: 'editor@solenia.dev',
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$6NZD0gcOjK5celcxbbDYQg$o6m7F8xJCB1D8dV9vpiFQEo+OerqIPagdfC4Mq1FJ/c',
      type: UserType.editor,
    },
  });

  // ===== ROYAUME 1: Solenia Prime =====
  const kingdom1 = await prisma.kingdom.create({
    data: {
      name: 'Solenia Prime',
      population: 1200000,
      description: 'Royaume central prospère, cœur économique et politique du continent.',
      dateInGame: new Date('1000-01-01'),
    },
  });

  const city1_1 = await prisma.city.create({
    data: {
      name: 'Aster',
      description: 'Capitale marchande florissante, centre du commerce continental.',
      kingdomId: kingdom1.id,
    },
  });

  const city1_2 = await prisma.city.create({
    data: {
      name: 'Valdris',
      description: 'Ville fortifiée au nord, gardienne des frontières.',
      kingdomId: kingdom1.id,
    },
  });

  const place1_1 = await prisma.place.create({
    data: {
      name: "Port d'Aster",
      description: "Grand port de commerce, point d'entrée des marchandises étrangères.",
      kingdomId: kingdom1.id,
      cityId: city1_1.id,
    },
  });

  const place1_2 = await prisma.place.create({
    data: {
      name: 'Forteresse de Valdris',
      description: 'Citadelle imprenable protégeant les terres du nord.',
      kingdomId: kingdom1.id,
      cityId: city1_2.id,
    },
  });

  const place1_3 = await prisma.place.create({
    data: {
      name: 'Bibliothèque Royale',
      description: 'Vaste collection de savoirs anciens et modernes.',
      kingdomId: kingdom1.id,
      cityId: city1_1.id,
    },
  });

  const person1_1 = await prisma.personOfInterest.create({
    data: {
      name: 'Maelis',
      description: 'Émissaire royal chargé des relations diplomatiques.',
      membership: 'Couronne',
      languages: ['Common', 'Elvish', 'Dwarvish'],
      STR: 10,
      DEX: 12,
      CON: 11,
      INT: 15,
      WIS: 13,
      CHA: 16,
      kingdomId: kingdom1.id,
      cityId: city1_1.id,
    },
  });

  const person1_2 = await prisma.personOfInterest.create({
    data: {
      name: 'Thorin Gardefer',
      description: 'Capitaine de la garde de Valdris, vétéran de nombreuses batailles.',
      membership: 'Garde Royale',
      languages: ['Common', 'Dwarvish'],
      STR: 16,
      DEX: 14,
      CON: 15,
      INT: 12,
      WIS: 13,
      CHA: 10,
      kingdomId: kingdom1.id,
      cityId: city1_2.id,
      placeId: place1_2.id,
    },
  });

  const person1_3 = await prisma.personOfInterest.create({
    data: {
      name: 'Lyra Sagefeather',
      description: 'Grande bibliothécaire, gardienne des connaissances anciennes.',
      membership: 'Ordre des Scribes',
      languages: ['Common', 'Elvish', 'Ancient'],
      STR: 8,
      DEX: 10,
      CON: 9,
      INT: 18,
      WIS: 16,
      CHA: 14,
      kingdomId: kingdom1.id,
      cityId: city1_1.id,
      placeId: place1_3.id,
    },
  });

  // ===== ROYAUME 2: Nordgard =====
  const kingdom2 = await prisma.kingdom.create({
    data: {
      name: 'Nordgard',
      population: 450000,
      description: 'Royaume du nord, terre de guerriers et de traditions ancestrales.',
      dateInGame: new Date('985-03-15'),
    },
  });

  const city2_1 = await prisma.city.create({
    data: {
      name: 'Frostholm',
      description: "Capitale glaciale, construite autour d'une source chaude naturelle.",
      kingdomId: kingdom2.id,
    },
  });

  const place2_1 = await prisma.place.create({
    data: {
      name: 'Hall des Ancêtres',
      description: 'Temple dédié aux héros du passé, lieu de pèlerinage.',
      kingdomId: kingdom2.id,
      cityId: city2_1.id,
    },
  });

  const person2_1 = await prisma.personOfInterest.create({
    data: {
      name: 'Bjorn Ironside',
      description: 'Jarl de Frostholm, chef de guerre respecté.',
      membership: 'Clan des Ours',
      languages: ['Common', 'Nordic'],
      STR: 18,
      DEX: 13,
      CON: 17,
      INT: 11,
      WIS: 14,
      CHA: 15,
      kingdomId: kingdom2.id,
      cityId: city2_1.id,
    },
  });

  // ===== ROYAUME 3: Veridia =====
  const kingdom3 = await prisma.kingdom.create({
    data: {
      name: 'Veridia',
      population: 800000,
      description: 'Royaume forestier, domaine des elfes et de la nature.',
      dateInGame: new Date('1020-06-01'),
    },
  });

  const city3_1 = await prisma.city.create({
    data: {
      name: 'Lysanthir',
      description: 'Cité dans les arbres, merveille architecturale elfique.',
      kingdomId: kingdom3.id,
    },
  });

  const place3_1 = await prisma.place.create({
    data: {
      name: 'Cercle de Sages',
      description: 'Sanctuaire où les anciens elfes se réunissent pour conseiller le royaume.',
      kingdomId: kingdom3.id,
      cityId: city3_1.id,
    },
  });

  const person3_1 = await prisma.personOfInterest.create({
    data: {
      name: 'Aeliana Étoile',
      description: "Archidruide, gardienne de l'équilibre naturel.",
      membership: 'Cercle des Druides',
      languages: ['Elvish', 'Common', 'Sylvan', 'Druidic'],
      STR: 9,
      DEX: 16,
      CON: 12,
      INT: 17,
      WIS: 19,
      CHA: 15,
      kingdomId: kingdom3.id,
      cityId: city3_1.id,
      placeId: place3_1.id,
    },
  });

  // ===== LIEUX SANS VILLE (directement dans un royaume) =====
  const place_standalone = await prisma.place.create({
    data: {
      name: 'Ruines de Karthas',
      description: 'Ancienne citadelle abandonnée, hantée par des légendes.',
      kingdomId: kingdom1.id,
    },
  });

  // ===== PERSONNAGES SANS LIEU SPÉCIFIQUE =====
  const person_standalone = await prisma.personOfInterest.create({
    data: {
      name: 'Marcus le Voyageur',
      description: 'Marchand itinérant, connaît tous les chemins du continent.',
      membership: 'Guilde des Marchands',
      languages: ['Common', 'Elvish', 'Dwarvish', 'Nordic'],
      STR: 11,
      DEX: 14,
      CON: 12,
      INT: 13,
      WIS: 15,
      CHA: 17,
      kingdomId: kingdom1.id,
    },
  });

  // ===== POSITIONS (coords normalisées 0..1 sur l'image) =====
  await prisma.position.createMany({
    data: [
      // Royaume 1
      { kingdomId: kingdom1.id, x: 0.45, y: 0.55 },
      { cityId: city1_1.id, x: 0.48, y: 0.58 },
      { cityId: city1_2.id, x: 0.42, y: 0.50 },
      { placeId: place1_1.id, x: 0.50, y: 0.60 },
      { placeId: place1_2.id, x: 0.43, y: 0.51 },
      { placeId: place1_3.id, x: 0.47, y: 0.57 },
      { placeId: place_standalone.id, x: 0.40, y: 0.45 },
      { personOfInterestId: person1_1.id, x: 0.49, y: 0.57 },
      { personOfInterestId: person1_2.id, x: 0.44, y: 0.52 },
      { personOfInterestId: person1_3.id, x: 0.47, y: 0.57 },
      { personOfInterestId: person_standalone.id, x: 0.46, y: 0.56 },
      // Royaume 2
      { kingdomId: kingdom2.id, x: 0.30, y: 0.30 },
      { cityId: city2_1.id, x: 0.32, y: 0.32 },
      { placeId: place2_1.id, x: 0.33, y: 0.33 },
      { personOfInterestId: person2_1.id, x: 0.32, y: 0.32 },
      // Royaume 3
      { kingdomId: kingdom3.id, x: 0.65, y: 0.40 },
      { cityId: city3_1.id, x: 0.67, y: 0.42 },
      { placeId: place3_1.id, x: 0.68, y: 0.43 },
      { personOfInterestId: person3_1.id, x: 0.67, y: 0.42 },
    ],
  });

  // ===== COMMENTAIRES =====
  await prisma.comment.createMany({
    data: [
      {
        description: 'Premier contact établi avec Solenia Prime. Relations diplomatiques prometteuses.',
        dateInGame: new Date('1000-01-02'),
        kingdomId: kingdom1.id,
        authorId: admin.id,
      },
      {
        description: 'Maelis a négocié un traité commercial avec Nordgard.',
        dateInGame: new Date('1000-02-15'),
        personOfInterestId: person1_1.id,
        authorId: editor.id,
      },
      {
        description: 'La bibliothèque a acquis un manuscrit rare des anciens royaumes.',
        dateInGame: new Date('1000-03-20'),
        placeId: place1_3.id,
        authorId: admin.id,
      },
      {
        description: 'Thorin a repoussé une attaque de pillards aux frontières.',
        dateInGame: new Date('1000-04-10'),
        personOfInterestId: person1_2.id,
        authorId: editor.id,
      },
      {
        description: 'Alliance proposée avec Veridia pour protéger les forêts.',
        dateInGame: new Date('1020-06-15'),
        kingdomId: kingdom3.id,
        authorId: admin.id,
      },
      {
        description: 'Aeliana a guéri une maladie qui affectait les récoltes.',
        dateInGame: new Date('1020-07-01'),
        personOfInterestId: person3_1.id,
        authorId: editor.id,
      },
      {
        description: 'Bjorn a organisé un grand tournoi de combat.',
        dateInGame: new Date('985-04-01'),
        personOfInterestId: person2_1.id,
        authorId: admin.id,
      },
      {
        description: 'Les ruines de Karthas semblent abriter quelque chose d\'ancien.',
        dateInGame: new Date('1000-05-05'),
        placeId: place_standalone.id,
        authorId: editor.id,
      },
    ],
  });

  console.log('✅ Jeu de données créé avec succès !');
  console.log(`   - ${await prisma.kingdom.count()} royaumes`);
  console.log(`   - ${await prisma.city.count()} villes`);
  console.log(`   - ${await prisma.place.count()} lieux`);
  console.log(`   - ${await prisma.personOfInterest.count()} personnages`);
  console.log(`   - ${await prisma.comment.count()} commentaires`);
  console.log(`   - ${await prisma.position.count()} positions`);
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

