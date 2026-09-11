import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const families = ['Cilovard', 'Tovalis', 'Palhindile', 'Vanguard'];
  
  for (const fam of families) {
    const org = await prisma.organisation.findFirst({
      where: { name: { contains: fam, mode: 'insensitive' } },
      include: { members: { include: { person: true } } }
    });
    if (org) {
      console.log(`\n=== ${org.name} ===`);
      for (const m of org.members) {
        const p = m.person;
        console.log(`\n[${p.id}] ${p.name} | race: ${p.breed} | sex: ${p.sex}`);
        console.log(`DESC: ${p.description}`);
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
