/**
 * Supprime toutes les données de la base sauf les utilisateurs (User).
 * À lancer avec: npm run wipe-data (depuis apps/backend) ou tsx scripts/wipe-all-except-users.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function wipe() {
  console.log('🗑️  Suppression de toutes les données (sauf User)...\n');

  const order = [
    () => prisma.comment.deleteMany({}).then((r) => ({ name: 'Comment', count: r.count })),
    () => prisma.position.deleteMany({}).then((r) => ({ name: 'Position', count: r.count })),
    () => prisma.loreKingdom.deleteMany({}).then((r) => ({ name: 'LoreKingdom', count: r.count })),
    () => prisma.loreCity.deleteMany({}).then((r) => ({ name: 'LoreCity', count: r.count })),
    () => prisma.lorePlace.deleteMany({}).then((r) => ({ name: 'LorePlace', count: r.count })),
    () => prisma.lorePerson.deleteMany({}).then((r) => ({ name: 'LorePerson', count: r.count })),
    () => prisma.loreOrganisation.deleteMany({}).then((r) => ({ name: 'LoreOrganisation', count: r.count })),
    () => prisma.lore.deleteMany({}).then((r) => ({ name: 'Lore', count: r.count })),
    () => prisma.organisationMember.deleteMany({}).then((r) => ({ name: 'OrganisationMember', count: r.count })),
    () => prisma.organisationCity.deleteMany({}).then((r) => ({ name: 'OrganisationCity', count: r.count })),
    () => prisma.organisationPlace.deleteMany({}).then((r) => ({ name: 'OrganisationPlace', count: r.count })),
    () => prisma.organisationKingdom.deleteMany({}).then((r) => ({ name: 'OrganisationKingdom', count: r.count })),
    () => prisma.organisation.deleteMany({}).then((r) => ({ name: 'Organisation', count: r.count })),
    () => prisma.district.deleteMany({}).then((r) => ({ name: 'District', count: r.count })),
    () => prisma.personOfInterest.deleteMany({}).then((r) => ({ name: 'PersonOfInterest', count: r.count })),
    () => prisma.place.deleteMany({}).then((r) => ({ name: 'Place', count: r.count })),
    () => prisma.city.deleteMany({}).then((r) => ({ name: 'City', count: r.count })),
    () => prisma.kingdom.deleteMany({}).then((r) => ({ name: 'Kingdom', count: r.count })),
  ];

  for (const fn of order) {
    const result = await fn();
    console.log(`  ✓ ${result.name}: ${result.count} supprimé(s)`);
  }

  const usersLeft = await prisma.user.count();
  console.log(`\n✅ Terminé. ${usersLeft} utilisateur(s) conservé(s).`);
}

wipe()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
