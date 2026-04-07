import 'dotenv/config';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const persons = await prisma.personOfInterest.findMany({
    select: {
      id: true,
      name: true,
      membership: true,
      organisations: { select: { organisationId: true } },
    },
    orderBy: { name: 'asc' },
  });
  const payload = {
    exportedAt: new Date().toISOString(),
    note: 'Sauvegarde membership + liens OrganisationMember avant changements UI personnages.',
    persons: persons.map((p) => ({
      id: p.id,
      name: p.name,
      membership: p.membership,
      organisationIds: p.organisations.map((o) => o.organisationId),
    })),
  };
  const dir = join(process.cwd(), 'backups');
  await mkdir(dir, { recursive: true });
  const file = join(dir, `person-affiliations-${Date.now()}.json`);
  await writeFile(file, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`Écrit : ${file} (${payload.persons.length} personnages)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
