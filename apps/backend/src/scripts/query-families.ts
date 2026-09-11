import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const families = ['Cilovard', 'Tovalis', 'Palhindile', 'Vanguard'];
  
  // Find Alagir city
  const alagir = await prisma.city.findFirst({ where: { name: { contains: 'Alagir', mode: 'insensitive' } } });
  console.log('Alagir:', JSON.stringify(alagir, null, 2));

  for (const fam of families) {
    const org = await prisma.organisation.findFirst({
      where: { name: { contains: fam, mode: 'insensitive' } },
      include: {
        members: {
          include: {
            person: true
          }
        }
      }
    });
    if (org) {
      console.log(`\n=== ${org.name} (${org.id}) ===`);
      console.log(`Members (${org.members.length}):`);
      for (const m of org.members) {
        const p = m.person;
        console.log(`  - ${p.name} | desc: ${p.description?.substring(0, 100) || 'NONE'} | cityId: ${p.cityId}`);
      }
    } else {
      console.log(`\n=== FAMILLE NON TROUVÉE: ${fam} ===`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
