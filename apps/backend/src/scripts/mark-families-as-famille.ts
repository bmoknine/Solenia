import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Organisations qui sont en réalité des familles (préfixe « Famille » / « Maison »). */
async function main() {
  const candidates = await prisma.organisation.findMany({
    where: {
      OR: [{ name: { startsWith: 'Famille' } }, { name: { startsWith: 'Maison' } }],
    },
    select: { id: true, name: true, organisationType: true },
    orderBy: { name: 'asc' },
  });

  console.log(`${candidates.length} organisation(s) identifiée(s) comme famille :`);
  for (const org of candidates) {
    if (org.organisationType === 'FAMILLE') {
      console.log(`  = ${org.name} (déjà FAMILLE)`);
      continue;
    }
    await prisma.organisation.update({ where: { id: org.id }, data: { organisationType: 'FAMILLE' } });
    console.log(`  ✓ ${org.name} : ${org.organisationType ?? '—'} → FAMILLE`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
