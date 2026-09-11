import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const city = await prisma.city.findUnique({ where: { id: 'f64aae8f-c25e-446d-b281-cc1c0fff707e' } });
  console.log('CITY:', JSON.stringify(city, null, 2));

  const persons = await prisma.personOfInterest.findMany({
    where: { cityId: 'f64aae8f-c25e-446d-b281-cc1c0fff707e' },
    select: { id: true, name: true, cityId: true, placeId: true }
  });
  console.log('PERSONS with this cityId:', JSON.stringify(persons, null, 2));

  // check cityId for the 6 known Beor Khan units regardless of current cityId
  const ids = ['84d45a45-0b27-44e8-bbae-7746c82fd96e','53ab6d68-6d6d-4d29-af36-0982564af74d','608b70c9-bf82-4fcb-8d6a-b64cf7b78683','efa72d8b-f525-4adf-9f29-497eb2301563','cd665704-3386-4cca-b611-7c7d76a65876','7b2ec74b-dd52-4532-b35a-ce8a967f84aa'];
  const known = await prisma.personOfInterest.findMany({ where: { id: { in: ids } }, select: { id: true, name: true, cityId: true } });
  console.log('KNOWN Beor Khan units cityId:', JSON.stringify(known, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
