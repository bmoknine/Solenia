import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * « Sneuk » (stub d'import Partie 5 : tavernier de La Loutre SAOUL, stats par défaut)
 * est en réalité Miravosk — décision du MJ. On le renomme, on le passe en nain et on
 * lui écrit une vraie fiche. Rien ne dépendait de Sneuk : ni lore, ni quête, ni session.
 * Idempotent.
 */
const SNEUK = '38b3360c-8a20-408c-ada3-195cbb1fe0eb';
const ALAGIR = '6d39b2bc-6488-4763-9643-b57e9af59c03';
const CHANT_TAL_TARIS = 'cd218e67-1630-4948-a3e2-585a884aee96';
const LOUTRE_PLACE = '57210a91-4e46-40ee-9e76-a6abd07189b1';
const COMPAGNIE = '4d3a2795-a6b7-4ace-8250-3c24c8a1f78b';

const DESC = `
<p>Homme nain, 142 ans. Large et voûté, la carrure encore là sous le laisser-aller ; il porte son ventre comme un homme qui fut costaud et a cessé de s'en soucier. Démarche lente, une main toujours prête à trouver un appui.</p>
<p>Visage buriné, joues et nez marbrés de couperose. Barbe grise mal égalisée, autrefois tressée — on devine encore le pli des anneaux qu'il n'y met plus. Yeux gris pâle bordés de rouge, qui se réveillent d'un coup dès qu'on parle chiffres, fournisseurs ou fûts. Sourcils épais, front barré de rides horizontales.</p>
<p>Il n'occupe jamais la table du fond, à gauche de l'âtre : c'est là qu'il l'a rencontrée. Il l'essuie chaque matin et n'y laisse asseoir personne. Tutoie tout le monde à partir du deuxième verre. Sait au litre près ce qui reste en cave sans avoir jamais rien noté.</p>
<p><strong>Rôle :</strong> ancien tavernier de <strong>La Loutre SAOUL</strong> — la maison était la sienne avant d'être une ruine. À la mort de sa femme, il a laissé l'établissement se délabrer autour de lui sans jamais s'en aller : partir, ce serait la laisser. C'est là que les PJ l'ont trouvé, en train de cuver dans sa propre taverne. Les parts sont passées par la <strong>Guilde du Marteau Blanc</strong> à la <strong>Compagnie des Trois Moustiquaires</strong> ; lui est resté. Il en est aujourd'hui l'<strong>homme de confiance et l'administrateur</strong> : commandes, fournisseurs, gages, comptes et embauches passent par lui — c'est lui qui a engagé <strong>Sabine Quenot</strong>. Il connaît les Bas-Quais depuis un siècle et sait à qui l'on parle et à qui l'on ne parle pas.</p>
<p><strong>Secret (MJ) :</strong> sa femme est morte le mois où il a cessé de verser la « contribution à la tranquillité » au <strong>Conseil d'Acier</strong>. Un accident, a-t-on conclu. Il n'a jamais rien pu prouver et n'en parle à personne — mais il quitte la salle chaque fois qu'<strong>Odon Pince</strong> franchit la porte. Que les PJ se soient attiré les bonnes grâces du collecteur est, pour lui, la pire nouvelle depuis des années.</p>
<p><strong>Capacités notables :</strong> aucun talent martial — il n'a plus levé autre chose qu'un tonneau depuis trente ans. En revanche, mémoire absolue des visages et des ardoises : il reconnaît un client vu une seule fois trente ans plus tôt, et se souvient de ce qu'il devait.</p>
`.trim();

async function main() {
  const sneuk = await prisma.personOfInterest.findUnique({ where: { id: SNEUK }, select: { id: true, name: true } });
  if (!sneuk) throw new Error('Fiche introuvable (déjà supprimée ?).');

  const person = await prisma.personOfInterest.update({
    where: { id: SNEUK },
    data: {
      name: 'Miravosk',
      description: DESC,
      breed: 'NAIN', sex: 'MAN', membership: 'MARCHAND',
      languages: ['COMMUN', 'NAIN'],
      fp: '1/4', pv: 26, ca: 11,
      STR: 13, DEX: 9, CON: 15, INT: 13, WIS: 14, CHA: 12,
      cityId: ALAGIR, districtId: CHANT_TAL_TARIS, placeId: LOUTRE_PLACE,
      showOnMap: false,
    },
    select: { id: true, name: true },
  });
  console.log(`✓ « ${sneuk.name} » → « ${person.name} » (nain, fiche complète)`);

  const org = await prisma.organisation.findFirst({ where: { name: 'La Loutre SAOUL' }, select: { id: true } });
  if (!org) throw new Error('Organisation « La Loutre SAOUL » introuvable.');

  // Membre de la maison
  const membre = await prisma.organisationMember.findFirst({ where: { organisationId: org.id, personId: person.id } });
  if (!membre) await prisma.organisationMember.create({ data: { organisationId: org.id, personId: person.id } });

  // Le nœud de l'organigramme pointe désormais vers la fiche
  const noeud = await prisma.familyMember.findFirst({ where: { organisationId: org.id, name: 'Miravosk' }, select: { id: true } });
  if (noeud) {
    await prisma.familyMember.update({ where: { id: noeud.id }, data: { personId: person.id, sex: 'MAN' } });
    console.log('✓ Nœud « Miravosk » relié à sa fiche');
  }

  // La Loutre appartient à la Compagnie des Trois Moustiquaires : elle en devient
  // une sous-organisation, ce qui la fait apparaître dans l'organigramme de la Compagnie.
  const cie = await prisma.organisation.findUnique({ where: { id: COMPAGNIE }, select: { id: true, name: true } });
  if (cie) {
    await prisma.organisation.update({ where: { id: org.id }, data: { parentOrganisationId: cie.id } });
    console.log(`✓ « La Loutre SAOUL » rattachée à « ${cie.name} »`);
  }

  // ── Contrôle ────────────────────────────────────────────────────────
  const check = await prisma.personOfInterest.findUnique({
    where: { id: person.id },
    select: {
      name: true, breed: true, sex: true, fp: true, pv: true, ca: true, languages: true,
      place: { select: { name: true } }, district: { select: { name: true } },
      organisations: { select: { organisation: { select: { name: true } } } },
    },
  });
  console.log('\n' + JSON.stringify(check, null, 2));

  const tree = await prisma.familyMember.findMany({
    where: { organisationId: org.id }, orderBy: { order: 'asc' },
    select: { id: true, name: true, title: true, superiorId: true, personId: true, playerCharacterId: true },
  });
  const byId = new Map(tree.map((t) => [t.id, t.name]));
  console.log('\nOrganigramme La Loutre SAOUL :');
  for (const t of tree) {
    const lien = t.playerCharacterId ? 'PJ' : t.personId ? 'PNJ' : 'nom seul';
    console.log(`  · ${t.name.padEnd(15)} ${(t.title ?? '—').padEnd(42)} sup=${t.superiorId ? byId.get(t.superiorId) : '(la maison)'} [${lien}]`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
