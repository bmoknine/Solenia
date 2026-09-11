import { PrismaClient, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

const FAMILY_NAME = 'Famille Solanmir';

type Seed = {
  key: string;
  name: string;
  title?: string;
  sex?: Sex;
  generation: number;
  order: number;
  isFounder?: boolean;
  father?: string;
  mother?: string;
  spouse?: string;
  /** Lier ce nœud au PJ portant ce nom. */
  playerCharacterName?: string;
};

// Structure reprise de l'arbre de référence : 32 membres, 8 générations.
const SEEDS: Seed[] = [
  // Gén. 0 — fondateurs
  { key: 'valdris', name: 'Valdris', title: "Dragon d'or", sex: 'MAN', generation: 0, order: 0, isFounder: true, spouse: 'miralyn' },
  { key: 'miralyn', name: 'Miralyn', title: 'Fondatrice', sex: 'WOMAN', generation: 0, order: 1, isFounder: true },

  // Gén. 1
  { key: 'aemrys', name: 'Aemrys', title: 'Ancêtre (~300 ans)', sex: 'MAN', generation: 1, order: 0, father: 'valdris', mother: 'miralyn' },

  // Gén. 2
  { key: 'fenwick', name: 'Fenwick', title: 'Aïeul', sex: 'MAN', generation: 2, order: 0, father: 'aemrys', spouse: 'lyara' },
  { key: 'lyara', name: 'Lyara', title: 'Aïeule', sex: 'WOMAN', generation: 2, order: 1 },

  // Gén. 3
  { key: 'aerendil', name: 'Aerendil', title: 'Arr.-gd-père', sex: 'MAN', generation: 3, order: 0, father: 'fenwick', mother: 'lyara', spouse: 'ysolde' },
  { key: 'ysolde', name: 'Ysolde', title: 'Arr.-gd-mère', sex: 'WOMAN', generation: 3, order: 1 },

  // Gén. 4 — les deux couples de grands-parents
  { key: 'thalindor', name: 'Thalindor', title: 'Grand-père', sex: 'MAN', generation: 4, order: 0, father: 'aerendil', mother: 'ysolde', spouse: 'nyneth' },
  { key: 'nyneth', name: 'Nyneth', title: 'Grand-mère', sex: 'WOMAN', generation: 4, order: 1 },
  { key: 'vaelorin', name: 'Vaelorin', title: 'Grand-père', sex: 'MAN', generation: 4, order: 2, spouse: 'elyndra' },
  { key: 'elyndra', name: 'Elyndra', title: 'Grand-mère', sex: 'WOMAN', generation: 4, order: 3 },

  // Gén. 5 — parents, oncles et tantes
  { key: 'corwin', name: 'Corwin', title: 'Oncle', sex: 'MAN', generation: 5, order: 0, father: 'thalindor', mother: 'nyneth', spouse: 'alenya' },
  { key: 'alenya', name: 'Alenya', title: 'Épouse', sex: 'WOMAN', generation: 5, order: 1 },
  { key: 'elowen', name: 'Elowen', title: 'Tante', sex: 'WOMAN', generation: 5, order: 2, father: 'thalindor', mother: 'nyneth', spouse: 'garrick' },
  { key: 'garrick', name: 'Garrick', title: 'Époux', sex: 'MAN', generation: 5, order: 3 },
  { key: 'ithendor', name: 'Ithendor', title: 'Père', sex: 'MAN', generation: 5, order: 4, father: 'thalindor', mother: 'nyneth', spouse: 'faelynn' },
  { key: 'faelynn', name: 'Faelynn', title: 'Mère', sex: 'WOMAN', generation: 5, order: 5, father: 'vaelorin', mother: 'elyndra' },
  { key: 'miriel', name: 'Miriel', title: 'Tante', sex: 'WOMAN', generation: 5, order: 6, father: 'vaelorin', mother: 'elyndra', spouse: 'baelric' },
  { key: 'baelric', name: 'Baelric', title: 'Époux', sex: 'MAN', generation: 5, order: 7 },
  { key: 'aldric', name: 'Aldric', title: 'Oncle', sex: 'MAN', generation: 5, order: 8, father: 'vaelorin', mother: 'elyndra', spouse: 'saelwen' },
  { key: 'saelwen', name: 'Saelwen', title: 'Épouse', sex: 'WOMAN', generation: 5, order: 9 },

  // Gén. 6 — fratrie et cousins
  { key: 'vaelyra', name: 'Vaelyra', title: 'Cousine', sex: 'WOMAN', generation: 6, order: 0, father: 'corwin', mother: 'alenya', spouse: 'joren' },
  { key: 'joren', name: 'Joren', title: 'Époux', sex: 'MAN', generation: 6, order: 1 },
  { key: 'aerin', name: 'Aerin', title: 'Cousin', sex: 'MAN', generation: 6, order: 2, father: 'corwin', mother: 'alenya' },
  { key: 'nimwen', name: 'Nimwen', title: 'Cousine', sex: 'WOMAN', generation: 6, order: 3, father: 'garrick', mother: 'elowen' },
  { key: 'sylwen', name: 'Sylwen', title: 'Sœur aînée', sex: 'WOMAN', generation: 6, order: 4, father: 'ithendor', mother: 'faelynn' },
  { key: 'ithaniel', name: 'Ithaniel', title: 'Frère', sex: 'MAN', generation: 6, order: 5, father: 'ithendor', mother: 'faelynn' },
  { key: 'eleryna', name: 'Elerÿna', title: '★ Notre PJ', sex: 'WOMAN', generation: 6, order: 6, father: 'ithendor', mother: 'faelynn', playerCharacterName: 'Elerÿna' },
  { key: 'rowan', name: 'Rowan', title: 'Cousin', sex: 'MAN', generation: 6, order: 7, father: 'baelric', mother: 'miriel' },
  { key: 'aelwyn', name: 'Aelwyn', title: 'Cousine', sex: 'WOMAN', generation: 6, order: 8, father: 'baelric', mother: 'miriel' },
  { key: 'faeldrin', name: 'Faeldrin', title: 'Cousin', sex: 'MAN', generation: 6, order: 9, father: 'aldric', mother: 'saelwen' },

  // Gén. 7
  { key: 'ysendra', name: 'Ysendra', title: 'Petite-cousine', sex: 'WOMAN', generation: 7, order: 0, father: 'joren', mother: 'vaelyra' },
];

async function main() {
  // 1) La famille (Organisation de type FAMILLE)
  let family = await prisma.organisation.findFirst({ where: { name: FAMILY_NAME } });
  if (!family) {
    family = await prisma.organisation.create({
      data: {
        name: FAMILY_NAME,
        organisationType: 'FAMILLE',
        description: "Lignée elfique d'Elerÿna, remontant à Valdris le Dragon d'or et à Miralyn.",
      },
    });
    console.log(`Organisation créée : ${family.name} (${family.id})`);
  } else {
    await prisma.organisation.update({ where: { id: family.id }, data: { organisationType: 'FAMILLE' } });
    console.log(`Organisation déjà présente : ${family.name} (${family.id})`);
  }

  const pcByName = new Map(
    (await prisma.playerCharacter.findMany({ select: { id: true, name: true } })).map((p) => [p.name, p.id]),
  );

  // 2) Créer / mettre à jour les membres (sans les liens)
  const idByKey = new Map<string, string>();
  for (const s of SEEDS) {
    const data = {
      name: s.name,
      title: s.title ?? null,
      sex: s.sex ?? null,
      generation: s.generation,
      order: s.order,
      isFounder: s.isFounder ?? false,
      playerCharacterId: s.playerCharacterName ? pcByName.get(s.playerCharacterName) ?? null : null,
    };
    const existing = await prisma.familyMember.findFirst({
      where: { organisationId: family.id, name: s.name },
      select: { id: true },
    });
    if (existing) {
      await prisma.familyMember.update({ where: { id: existing.id }, data });
      idByKey.set(s.key, existing.id);
    } else {
      const created = await prisma.familyMember.create({
        data: { ...data, organisationId: family.id },
        select: { id: true },
      });
      idByKey.set(s.key, created.id);
    }
  }

  // 3) Deuxième passe : les liens de filiation
  for (const s of SEEDS) {
    const id = idByKey.get(s.key)!;
    await prisma.familyMember.update({
      where: { id },
      data: {
        fatherId: s.father ? idByKey.get(s.father) ?? null : null,
        motherId: s.mother ? idByKey.get(s.mother) ?? null : null,
        spouseId: s.spouse ? idByKey.get(s.spouse) ?? null : null,
      },
    });
  }

  // 4) Réciprocité des conjoints (l'arbre lit les deux sens)
  for (const s of SEEDS) {
    if (!s.spouse) continue;
    const partnerId = idByKey.get(s.spouse)!;
    await prisma.familyMember.update({ where: { id: partnerId }, data: { spouseId: idByKey.get(s.key)! } });
  }

  const total = await prisma.familyMember.count({ where: { organisationId: family.id } });
  const linkedPc = await prisma.familyMember.findFirst({
    where: { organisationId: family.id, playerCharacterId: { not: null } },
    select: { name: true, playerCharacter: { select: { name: true } } },
  });
  console.log(`\n${total} membres dans « ${FAMILY_NAME} ».`);
  console.log(`Nœud lié au PJ : ${linkedPc?.name ?? '—'} → ${linkedPc?.playerCharacter?.name ?? '—'}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
