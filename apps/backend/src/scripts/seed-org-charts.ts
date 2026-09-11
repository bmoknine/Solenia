import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Organigrammes des organisations non familiales (≥ 4 membres).
 * Règle : on ne pose un supérieur que lorsque la fiche l'établit noir sur blanc
 * (« commandant », « chef d'escouade », « meneuse », « capitaine des archers »…).
 * Tout le reste reste à plat sous l'organisation, et le script le signale.
 */
type Node = { person: string; title?: string; superior?: string; order?: number };

const CHARTS: { org: string; nodes: Node[] }[] = [
  {
    org: "Le Syndicat d'Alagir",
    nodes: [
      { person: 'Faith', title: 'Meneuse du Syndicat', order: 0 },
      { person: 'Jillian Riverpipe', title: 'Courtière', superior: 'Faith', order: 1 },
      { person: 'Dame Arinthe', title: 'Maîtresse des lieux', superior: 'Faith', order: 2 },
      { person: 'Capitaine Norven', title: 'Capitaine de navire', superior: 'Faith', order: 3 },
      { person: 'Marja la Cicatrice', title: "Maîtresse d'arène", superior: 'Faith', order: 4 },
      { person: 'Sarlis Nym', title: 'Cambiste nocturne', superior: 'Faith', order: 5 },
      { person: 'Maître Verel', title: 'Croupier masqué', superior: 'Faith', order: 6 },
      { person: 'Mada Lure', title: 'Gardienne de la clé', superior: 'Faith', order: 7 },
      { person: 'Bord Amac', title: 'Contremaître fluvial', superior: 'Faith', order: 8 },
    ],
  },
  {
    org: "Conseil d'Acier — Cellule d'Alagir",
    nodes: [
      { person: 'Rany Mullimax', title: 'Chef de cellule — « Magistrat de Fer »', order: 0 },
      { person: 'Tessa Kaorn', title: 'Coordinatrice des opérations', superior: 'Rany Mullimax', order: 1 },
      { person: 'Wilherm Cadenet', title: 'Teneur du Grand Registre', superior: 'Rany Mullimax', order: 2 },
      { person: 'Lysanne Orfe', title: 'Émissaire mondaine', superior: 'Rany Mullimax', order: 3 },
      { person: 'Capitaine Sorne Vask', title: 'Capitaine des Marteaux', superior: 'Rany Mullimax', order: 4 },
      { person: 'Hulda Brasefer', title: 'Maître-forgeronne', superior: 'Rany Mullimax', order: 5 },
      { person: 'Orane Ferrand', title: 'Agente des convois', superior: 'Rany Mullimax', order: 6 },
      { person: 'Odon Pince', title: 'Collecteur — « Trois-Coups »', superior: 'Tessa Kaorn', order: 7 },
    ],
  },
  {
    org: "Garnison des écus d'or",
    nodes: [
      { person: 'Sir Aldric de Valbourg', title: 'Commandant Suprême', order: 0 },
      { person: 'Dame Elara Brumetaille', title: 'Conseillère Émérite', superior: 'Sir Aldric de Valbourg', order: 1 },
      { person: 'Sir Gadwain Brise-fer', title: 'Capitaine de la Garde', superior: 'Sir Aldric de Valbourg', order: 2 },
      { person: 'Lady Lyra Astrebois', title: 'Capitaine des Archers', superior: 'Sir Aldric de Valbourg', order: 3 },
      { person: 'Ser Aric Lancelame', title: "Maître d'Armes", superior: 'Sir Aldric de Valbourg', order: 4 },
      { person: 'Serget Halvorn', title: 'Officier technique — Fonderie', superior: 'Sir Aldric de Valbourg', order: 5 },
      { person: "Garde des Écus d'Or", title: 'Fantassin', superior: 'Sir Gadwain Brise-fer', order: 6 },
      { person: 'Archer des Écus', title: 'Archer', superior: 'Lady Lyra Astrebois', order: 7 },
    ],
  },
  {
    org: 'La Main du Silence',
    nodes: [
      { person: 'Kaelen Voss', title: 'Commandant — « Voix Silencieuse »', order: 0 },
      { person: 'Lys Corven', title: 'Sergent — Maîtresse des Éclaireurs', superior: 'Kaelen Voss', order: 1 },
      { person: 'Dorian Hale', title: 'Officier', order: 2 },
      { person: 'Soldat type — Main du Silence', title: 'Troupe (~18)', superior: 'Kaelen Voss', order: 3 },
      { person: 'Vétéran type — Main du Silence', title: 'Vétérans (~2)', superior: 'Kaelen Voss', order: 4 },
      { person: 'Éclaireur type — Main du Silence', title: 'Éclaireurs (~4)', superior: 'Lys Corven', order: 5 },
    ],
  },
  {
    org: 'Le Soleil Pourpre',
    nodes: [
      { person: 'Ékénon Tracx', title: 'Capitaine — garde du Roi', order: 0 },
      // « Radius Ignis » est son grade, pas un second personnage : un seul nœud.
      { person: 'Mirdobas Filan', title: 'Radius Ignis — officier psychique, liaison Œil Pourpre', order: 1 },
      { person: 'Lira Morven', title: 'Ancienne capitaine de la Porte Pourpre', order: 2 },
      { person: 'Ikar Doven', title: 'Officier', order: 3 },
      { person: 'Officier Solarius', title: "Chef d'escouade", order: 5 },
      { person: 'Soldat du Soleil Pourpre', title: 'Troupe régulière', superior: 'Officier Solarius', order: 6 },
      { person: 'Acolyte Pourpre', title: 'Recrue endoctrinée', superior: 'Officier Solarius', order: 7 },
      { person: 'Gardien du Brasier', title: 'Élite lourde — garde des officiers', order: 8 },
      { person: 'Lame Incandescente', title: 'Assassin / éclaireur', order: 9 },
      { person: 'Porte-Flamme Pourpre', title: 'Mage de bataille', order: 10 },
      { person: 'Inquisiteur du Soleil Pourpre', title: 'Interrogateur', order: 11 },
      { person: 'Fanatique Écarlate', title: 'Kamikaze rituel', order: 12 },
      { person: "Adeptus de l'Effacement", title: 'Agent d’effacement', order: 13 },
    ],
  },
  {
    org: "L'Œil Pourpre",
    // « la filière du Roi » : Pelfort Vanguard est établi comme tête de réseau.
    nodes: [
      { person: 'Pelfort Vanguard', title: 'Le Roi — tête du réseau', order: 0 },
      { person: 'Mirdobas Filan', title: 'Radius Ignis — officier psychique et liaison', superior: 'Pelfort Vanguard', order: 1 },
      { person: 'Prêtre déchu Voren Kahl', title: 'Prêtre déchu', order: 3 },
      { person: 'Regalio Regani', title: 'Couverture mondaine', order: 4 },
      { person: 'Maître Verel', title: 'Relais — La Vigne Noire', order: 5 },
    ],
  },
  {
    org: 'Monastère des Nuits',
    // Aucune subordination écrite entre les maîtres : on les aligne de Une à Huit.
    nodes: [
      { person: 'Une Nuit', title: 'Maître abjurateur', order: 1 },
      { person: 'Deux Nuits', title: 'Maître conjurateur', order: 2 },
      { person: 'Trois Nuits', title: 'Maître devin', order: 3 },
      { person: 'Quatre Nuits', title: 'Maître enchanteur', order: 4 },
      { person: 'Cinq Nuits', title: 'Maîtresse illusionniste', order: 5 },
      { person: 'Six Nuits', title: 'Maître évocateur', order: 6 },
      { person: 'Sept Nuits', title: 'Maître transmuteur', order: 7 },
      { person: 'Huit Nuits', title: 'Maître nécromancien', order: 8 },
    ],
  },
  {
    org: 'La Braise',
    // Aucune hiérarchie établie dans les fiches : tout reste à plat.
    nodes: [
      { person: 'Faith', title: 'Meneuse (Syndicat)', order: 0 },
      { person: 'Jillian Riverpipe', title: 'Courtière', order: 1 },
      { person: 'Veda Karom', title: 'Contact Braise', order: 2 },
      { person: 'Darn Fer-Vallée', title: 'Garde Tovalis', order: 3 },
    ],
  },
];

async function main() {
  const sansSuperieur: string[] = [];
  let total = 0;

  for (const chart of CHARTS) {
    const org = await prisma.organisation.findFirst({ where: { name: chart.org }, select: { id: true, name: true } });
    if (!org) {
      console.log(`⚠ Organisation introuvable : ${chart.org}`);
      continue;
    }

    const persons = await prisma.personOfInterest.findMany({
      where: { name: { in: chart.nodes.map((n) => n.person) } },
      select: { id: true, name: true },
    });
    const personIdByName = new Map(persons.map((p) => [p.name, p.id]));

    // 1re passe : les nœuds
    const nodeIdByPerson = new Map<string, string>();
    for (const n of chart.nodes) {
      const personId = personIdByName.get(n.person);
      if (!personId) {
        console.log(`  ⚠ PNJ introuvable : ${n.person} (${chart.org})`);
        continue;
      }
      const data = { name: n.person, title: n.title ?? null, order: n.order ?? 0, personId };
      const existing = await prisma.familyMember.findFirst({
        where: { organisationId: org.id, name: n.person },
        select: { id: true },
      });
      const saved = existing
        ? await prisma.familyMember.update({ where: { id: existing.id }, data, select: { id: true } })
        : await prisma.familyMember.create({ data: { ...data, organisationId: org.id }, select: { id: true } });
      nodeIdByPerson.set(n.person, saved.id);
    }

    // 2e passe : la chaîne de commandement
    for (const n of chart.nodes) {
      const id = nodeIdByPerson.get(n.person);
      if (!id) continue;
      const superiorId = n.superior ? nodeIdByPerson.get(n.superior) ?? null : null;
      await prisma.familyMember.update({ where: { id }, data: { superiorId } });
      if (!superiorId) sansSuperieur.push(`${chart.org} → ${n.person}`);
    }

    const count = await prisma.familyMember.count({ where: { organisationId: org.id } });
    total += count;
    console.log(`✓ ${org.name} → ${count} nœuds`);
  }

  console.log(`\nTotal : ${total} nœuds sur ${CHARTS.length} organisations.`);
  console.log('\nNœuds rattachés directement à l’organisation (aucun supérieur écrit) :');
  sansSuperieur.forEach((s) => console.log('  · ' + s));
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
