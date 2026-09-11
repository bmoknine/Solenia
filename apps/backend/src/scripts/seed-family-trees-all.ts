import { PrismaClient, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Arbres généalogiques des familles, construits à partir des PNJ existants.
 * Règles : on ne relie que les filiations ÉCRITES dans les fiches, et on ne retient
 * que les personnes portant le nom de la maison (+ conjoints déclarés) — les gardes,
 * contremaîtres et alliés ne font pas partie de la lignée.
 * Les liens non établis restent vides : le MJ les branche en deux clics dans l'UI.
 */
type Node = {
  person: string; // nom exact du PNJ
  title?: string;
  sex?: Sex;
  generation: number;
  order: number;
  father?: string;
  mother?: string;
  spouse?: string;
};

const TREES: { family: string; nodes: Node[] }[] = [
  {
    family: 'Famille Cilovard',
    nodes: [
      { person: 'Garran Cilovard', title: 'Patriarche', sex: 'MAN', generation: 0, order: 0, spouse: 'Lady Velena Cilovard' },
      { person: 'Lady Velena Cilovard', title: 'Épouse de Garran', sex: 'WOMAN', generation: 0, order: 1 },
      { person: 'Lorian Cilovard', title: 'Fils aîné', sex: 'MAN', generation: 1, order: 0, father: 'Garran Cilovard', mother: 'Lady Velena Cilovard' },
      { person: 'Ismara Cilovard', title: 'Fille cadette', sex: 'WOMAN', generation: 1, order: 1, father: 'Garran Cilovard', mother: 'Lady Velena Cilovard' },
    ],
  },
  {
    family: 'Famille Tovalis',
    nodes: [
      { person: 'Daren Tovalis', title: 'Patriarche', sex: 'MAN', generation: 0, order: 0 },
      { person: 'Ordan Tovalis', title: 'Porte-parole', sex: 'MAN', generation: 0, order: 1 },
      { person: 'Maerin Tovalis', title: 'Héritière', sex: 'WOMAN', generation: 1, order: 0, father: 'Daren Tovalis' },
      { person: 'Velric Tovalis', title: 'Fils cadet', sex: 'MAN', generation: 1, order: 1, father: 'Daren Tovalis' },
    ],
  },
  {
    family: 'Famille Palhindile',
    nodes: [
      { person: 'Lady Serenya Palhindile', title: 'Matriarche · Chancelière', sex: 'WOMAN', generation: 0, order: 0, spouse: 'Lord Calen Palhindile' },
      { person: 'Lord Calen Palhindile', title: 'Époux de Serenya', sex: 'MAN', generation: 0, order: 1 },
      { person: 'Selianne Palhindile', title: 'Héritière', sex: 'WOMAN', generation: 1, order: 0, father: 'Lord Calen Palhindile', mother: 'Lady Serenya Palhindile' },
      { person: 'Lior Palhindile', title: 'Mage archiviste', sex: 'MAN', generation: 1, order: 1, father: 'Lord Calen Palhindile', mother: 'Lady Serenya Palhindile' },
    ],
  },
  {
    family: 'Maison Vanguard',
    nodes: [
      { person: 'Pelfort Vanguard', title: 'Roi d’Alagir', sex: 'MAN', generation: 0, order: 0, spouse: 'Guetel Vanguard' },
      { person: 'Guetel Vanguard', title: 'Reine', sex: 'WOMAN', generation: 0, order: 1 },
      { person: 'Priel Vanguard', title: 'Héritier (nourrisson)', sex: 'MAN', generation: 1, order: 0, father: 'Pelfort Vanguard', mother: 'Guetel Vanguard' },
    ],
  },
  {
    family: 'Famille Royal Ivelis Huriya',
    nodes: [
      { person: 'Aimon Ivelis', title: 'Chef de famille', sex: 'MAN', generation: 0, order: 0, spouse: 'Sana Ivelis' },
      { person: 'Sana Ivelis', title: 'Épouse d’Aimon · co-dirige Huriya', sex: 'WOMAN', generation: 0, order: 1 },
      { person: 'Volodar Ivelis', title: 'Membre de la famille', sex: 'MAN', generation: 0, order: 2 },
      { person: 'Akkar Ivelis', title: 'Fils', sex: 'MAN', generation: 1, order: 0, father: 'Aimon Ivelis', mother: 'Sana Ivelis' },
      { person: 'Ilrune Ivelis', title: 'Fils', sex: 'MAN', generation: 1, order: 1, father: 'Aimon Ivelis', mother: 'Sana Ivelis' },
      { person: 'Keerla Ivelis', title: 'Fille', sex: 'WOMAN', generation: 1, order: 2, father: 'Aimon Ivelis', mother: 'Sana Ivelis' },
      { person: 'Galya Ivelis', title: 'Fille', sex: 'WOMAN', generation: 1, order: 3, father: 'Aimon Ivelis', mother: 'Sana Ivelis' },
    ],
  },
  {
    family: 'Famille Varek',
    nodes: [
      { person: 'Odran Varek', title: 'Patriarche · chef de Valbrume', sex: 'MAN', generation: 0, order: 0, spouse: 'Maela Varek' },
      { person: 'Maela Varek', title: 'Épouse d’Odran', sex: 'WOMAN', generation: 0, order: 1 },
      { person: 'Garrik Varek', title: 'Fils aîné', sex: 'MAN', generation: 1, order: 0, father: 'Odran Varek', mother: 'Maela Varek' },
      { person: 'Elira Varek', title: 'Fille cadette', sex: 'WOMAN', generation: 1, order: 1, father: 'Odran Varek', mother: 'Maela Varek' },
    ],
  },
  {
    family: 'Famille Rigart',
    nodes: [
      { person: 'Dorian Rigart', title: 'Fondateur des entrepôts', sex: 'MAN', generation: 0, order: 0 },
      { person: 'Eldric Rigart', title: 'Héritier', sex: 'MAN', generation: 1, order: 0, father: 'Dorian Rigart' },
    ],
  },
  {
    family: 'Famille Elvaltis',
    nodes: [
      { person: 'Aedran Elvaltis', title: 'Gouverneur de Kalanos', sex: 'MAN', generation: 0, order: 0 },
      { person: 'Nyssara Elvaltis', title: 'Affaires sociales et religieuses', sex: 'WOMAN', generation: 0, order: 1 },
      { person: 'Maeltor Elvaltis', title: 'Fils aîné', sex: 'MAN', generation: 1, order: 0, father: 'Aedran Elvaltis' },
      { person: 'Lyris Elvaltis', title: 'Fille cadette', sex: 'WOMAN', generation: 1, order: 1, father: 'Aedran Elvaltis' },
    ],
  },
  {
    family: 'Famille Mastiggia',
    nodes: [
      { person: 'Donna Ilaria Mastiggia', title: 'Matriarche du comptoir', sex: 'WOMAN', generation: 0, order: 0 },
      { person: 'Gesouto Mastiggia', title: 'Ligne « Chaînes du Sang »', sex: 'MAN', generation: 0, order: 1 },
      { person: 'Vittore Mastiggia', title: 'Cadet de la maison', sex: 'MAN', generation: 1, order: 0 },
    ],
  },
  {
    family: 'Famille Tomasio (comtes Dolomites)',
    nodes: [
      { person: 'Ivano Tomasio', title: 'Comte', generation: 0, order: 0 },
      { person: 'Ennio Tomasio', title: 'Nourrisson', generation: 1, order: 0 },
    ],
  },
];

async function main() {
  let totalNodes = 0;
  const unlinked: string[] = [];

  for (const tree of TREES) {
    const family = await prisma.organisation.findFirst({ where: { name: tree.family }, select: { id: true, name: true } });
    if (!family) {
      console.log(`⚠ Famille introuvable : ${tree.family}`);
      continue;
    }

    // Résoudre les PNJ par nom
    const persons = await prisma.personOfInterest.findMany({
      where: { name: { in: tree.nodes.map((n) => n.person) } },
      select: { id: true, name: true },
    });
    const personIdByName = new Map(persons.map((p) => [p.name, p.id]));

    // 1re passe : créer / mettre à jour les nœuds
    const nodeIdByPerson = new Map<string, string>();
    for (const n of tree.nodes) {
      const personId = personIdByName.get(n.person) ?? null;
      if (!personId) {
        console.log(`  ⚠ PNJ introuvable : ${n.person}`);
        continue;
      }
      const data = {
        name: n.person,
        title: n.title ?? null,
        sex: n.sex ?? null,
        generation: n.generation,
        order: n.order,
        personId,
      };
      const existing = await prisma.familyMember.findFirst({
        where: { organisationId: family.id, name: n.person },
        select: { id: true },
      });
      const saved = existing
        ? await prisma.familyMember.update({ where: { id: existing.id }, data, select: { id: true } })
        : await prisma.familyMember.create({ data: { ...data, organisationId: family.id }, select: { id: true } });
      nodeIdByPerson.set(n.person, saved.id);
    }

    // 2e passe : filiations
    for (const n of tree.nodes) {
      const id = nodeIdByPerson.get(n.person);
      if (!id) continue;
      await prisma.familyMember.update({
        where: { id },
        data: {
          fatherId: n.father ? nodeIdByPerson.get(n.father) ?? null : null,
          motherId: n.mother ? nodeIdByPerson.get(n.mother) ?? null : null,
          spouseId: n.spouse ? nodeIdByPerson.get(n.spouse) ?? null : null,
        },
      });
      if (!n.father && !n.mother && !n.spouse) unlinked.push(`${tree.family} → ${n.person}`);
    }

    // Réciprocité des conjoints
    for (const n of tree.nodes) {
      if (!n.spouse) continue;
      const partnerId = nodeIdByPerson.get(n.spouse);
      const selfId = nodeIdByPerson.get(n.person);
      if (partnerId && selfId) await prisma.familyMember.update({ where: { id: partnerId }, data: { spouseId: selfId } });
    }

    const count = await prisma.familyMember.count({ where: { organisationId: family.id } });
    totalNodes += count;
    console.log(`✓ ${family.name} → ${count} membre(s)`);
  }

  console.log(`\nTotal : ${totalNodes} nœuds sur ${TREES.length} familles.`);
  console.log('\nNœuds sans filiation (à relier par le MJ si besoin) :');
  unlinked.forEach((u) => console.log('  · ' + u));
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
