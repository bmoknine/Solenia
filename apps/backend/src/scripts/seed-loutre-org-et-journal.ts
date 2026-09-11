import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LOUTRE_PLACE = '57210a91-4e46-40ee-9e76-a6abd07189b1';
const ALAGIR = '6d39b2bc-6488-4763-9643-b57e9af59c03';
const CAMPAGNE_OEUF = 'b53a0e0e-f892-40bc-add4-08714b7c88ce';

const ORG_DESC = `
<p>La maison de <strong>La Loutre SAOUL</strong> — taverne et auberge des Bas-Quais, dans le quartier du Chant de Tal Taris. Entité créée pour porter l'organigramme du personnel de l'établissement.</p>
<p>Elle verse chaque mois sa « contribution à la tranquillité » à la <strong>Cellule d'Alagir du Conseil d'Acier</strong>, collectée par <strong>Odon Pince</strong>.</p>
`.trim();

/**
 * Le résumé de session est rendu en TEXTE BRUT (linkifyPersons + white-space: pre-wrap) :
 * surtout pas de balises HTML ici, elles s'afficheraient telles quelles.
 */
const RESUME = `Nuit du 29 Astralys :

— Le captif trouvé avec le Fretin a été ramené dans le sous-sol de la Loutre SAOUL, en attendant que La Braise s'en occupe.
— Odon Pince est passé collecter la taxe du Conseil d'Acier. Les PJ lui ont fait bonne impression. Illevas lui a remis la dague de l'assassin de l'Orette ; Odon Pince leur conseille de rechercher ce dernier.
— Ezbehar et Core Belan ont eu une relation intime pendant la soirée d'ouverture de la Loutre SAOUL, où le barde jouait.

Matin du 30 Astralys :

— À son réveil, Illevas reçoit à la Loutre SAOUL la visite du Roi Pelfort Vanguard, venu récupérer en personne le captif descendu au sous-sol la veille.

Reste du 30 Astralys :

— Illevas lance deux Sending à Eldric Rigart : il vient le chercher dans les jours qui viennent, et lui demande s'il est motivé.
— Le groupe va chercher ses tenues pour le bal des Tovalis.

1er Glacialys :

— Au matin, Illevas rencontre Maître Ulric Brumel : le contrat se trouve au 2e étage du manoir des Cilovard.
— Les PJ viennent d'arriver au bal et s'apprêtent à descendre les escaliers.`;

async function main() {
  // ── 1. L'organisation qui porte l'organigramme de la taverne ────────
  let org = await prisma.organisation.findFirst({ where: { name: 'La Loutre SAOUL' }, select: { id: true } });
  if (!org) {
    org = await prisma.organisation.create({
      data: { name: 'La Loutre SAOUL', description: ORG_DESC, organisationType: 'PRINCIPAL', membership: 'OTHER' },
      select: { id: true },
    });
    console.log(`+ Organisation « La Loutre SAOUL » créée [${org.id}]`);
  } else {
    console.log('· Organisation déjà présente');
  }

  // Rattachements : le lieu et la ville
  const lienLieu = await prisma.organisationPlace.findFirst({ where: { organisationId: org.id, placeId: LOUTRE_PLACE } });
  if (!lienLieu) await prisma.organisationPlace.create({ data: { organisationId: org.id, placeId: LOUTRE_PLACE } });
  const lienVille = await prisma.organisationCity.findFirst({ where: { organisationId: org.id, cityId: ALAGIR } });
  if (!lienVille) await prisma.organisationCity.create({ data: { organisationId: org.id, cityId: ALAGIR } });

  // ── 2. Core Belan dans l'organigramme ───────────────────────────────
  const core = await prisma.personOfInterest.findFirst({ where: { name: 'Core Belan' }, select: { id: true } });
  if (!core) throw new Error('PNJ « Core Belan » introuvable.');

  const membre = await prisma.organisationMember.findFirst({ where: { organisationId: org.id, personId: core.id } });
  if (!membre) await prisma.organisationMember.create({ data: { organisationId: org.id, personId: core.id } });

  const noeud = await prisma.familyMember.findFirst({ where: { organisationId: org.id, personId: core.id }, select: { id: true } });
  const data = { name: 'Core Belan', title: 'Barde de maison', personId: core.id, sex: 'MAN' as const, order: 0 };
  if (noeud) {
    await prisma.familyMember.update({ where: { id: noeud.id }, data });
    console.log('· Nœud Core Belan mis à jour');
  } else {
    await prisma.familyMember.create({ data: { ...data, organisationId: org.id } });
    console.log('+ Core Belan ajouté à l’organigramme');
  }

  // ── 3. La note au journal ───────────────────────────────────────────
  const titre = 'La Loutre SAOUL — du captif aux marches du bal';
  const date = new Date('2026-09-07T00:00:00.000Z');
  const existante = await prisma.gameSession.findFirst({
    where: { campaignId: CAMPAGNE_OEUF, date },
    select: { id: true },
  });
  if (existante) {
    await prisma.gameSession.update({ where: { id: existante.id }, data: { title: titre, summary: RESUME } });
    console.log('· Entrée de journal du 7 septembre mise à jour');
  } else {
    await prisma.gameSession.create({ data: { date, title: titre, summary: RESUME, campaignId: CAMPAGNE_OEUF } });
    console.log('+ Entrée de journal du 7 septembre créée');
  }

  // ── Contrôle ────────────────────────────────────────────────────────
  const tree = await prisma.familyMember.findMany({
    where: { organisationId: org.id },
    select: { name: true, title: true, superiorId: true },
  });
  console.log('\nOrganigramme La Loutre SAOUL :', tree.map((t) => `${t.name} (${t.title})`).join(' | '));

  const sessions = await prisma.gameSession.findMany({
    where: { campaignId: CAMPAGNE_OEUF },
    orderBy: { date: 'desc' },
    select: { date: true, title: true },
  });
  console.log('Journal « Un oeuf pour les contrôler tous » :');
  sessions.forEach((s) => console.log(`  · ${s.date.toISOString().slice(0, 10)} — ${s.title}`));
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
