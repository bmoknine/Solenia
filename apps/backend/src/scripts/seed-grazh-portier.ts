import { PrismaClient, type Language } from '@prisma/client';

const prisma = new PrismaClient();

/** Grazh — portier / videur de La Loutre SAOUL. Idempotent. */
const ALAGIR = '6d39b2bc-6488-4763-9643-b57e9af59c03';
const CHANT_TAL_TARIS = 'cd218e67-1630-4948-a3e2-585a884aee96';
const LOUTRE_PLACE = '57210a91-4e46-40ee-9e76-a6abd07189b1';

const DESC = `
<p>Homme demi-orc, 38 ans. Immense et lourd, des épaules qui obligent à se mettre de biais pour passer la porte à côté de lui ; il ne bouge pas beaucoup, et c'est précisément l'effet recherché.</p>
<p>Peau gris-vert, crâne rasé couvert de cicatrices fines et régulières — des marques faites une par une, pas au combat. Mâchoire lourde, canines inférieures limées à ras. Yeux petits et noirs, très calmes. Une cicatrice pâle lui barre la gorge sous le menton.</p>
<p><strong>Muet :</strong> on lui a coupé la langue. Il comprend parfaitement le commun et l'orc, mais ne lit ni n'écrit. Il s'exprime par gestes, par grognements, et en frappant du plat de la main sur le chambranle — un coup pour « entre », deux pour « dehors ». Miravosk est le seul à le comprendre couramment. Salue les habitués d'un hochement, et regarde les inconnus jusqu'à ce qu'ils détournent les yeux.</p>
<p><strong>Rôle :</strong> portier et videur de <strong>La Loutre SAOUL</strong>. <strong>Miravosk</strong> l'a recueilli des années plus tôt, du temps où la maison tournait encore ; quand elle est tombée en ruine, il n'est pas parti davantage que le vieux nain. Il a gardé une porte qui ne menait plus nulle part, jusqu'à ce que les PJ la rouvrent. Il connaît chaque visage passé par cette porte, et n'a jamais laissé entrer deux fois quelqu'un qui s'était mal conduit.</p>
<p><strong>Secret (MJ) :</strong> on lui a coupé la langue pour qu'il ne puisse jamais nommer les acheteurs. Vendu enfant, puis revendu plusieurs fois avant de s'échapper, il se souvient de tous les visages. Le soir de la réouverture de la Loutre, il en a reconnu un parmi les invités et a tenté de le signaler à Miravosk — qui avait trop bu. Il attend depuis. Ne sachant ni lire ni écrire, il ne pourra le dire qu'à qui prendra le temps de le comprendre, ou à qui saura le faire parler autrement.</p>
<p><strong>Capacités notables :</strong> costaud et endurant, il encaisse plus qu'il ne frappe. Ne dégaine jamais d'arme : il sort les gens à bras-le-corps.</p>
`.trim();

async function main() {
  const data = {
    description: DESC,
    breed: 'DEMI_ORC' as const, sex: 'MAN' as const, membership: 'OTHER' as const,
    languages: ['COMMUN', 'ORC'] as Language[],
    fp: '2', pv: 52, ca: 14,
    STR: 17, DEX: 12, CON: 16, INT: 9, WIS: 12, CHA: 8,
    cityId: ALAGIR, districtId: CHANT_TAL_TARIS, placeId: LOUTRE_PLACE,
    showOnMap: false, isForDM: false,
  };

  const exist = await prisma.personOfInterest.findFirst({ where: { name: 'Grazh' }, select: { id: true } });
  const person = exist
    ? await prisma.personOfInterest.update({ where: { id: exist.id }, data, select: { id: true } })
    : await prisma.personOfInterest.create({ data: { name: 'Grazh', ...data }, select: { id: true } });
  console.log(exist ? '↻ Grazh mis à jour' : '+ Grazh créé', `[${person.id}]`);

  const org = await prisma.organisation.findFirst({ where: { name: 'La Loutre SAOUL' }, select: { id: true } });
  if (!org) throw new Error('Organisation « La Loutre SAOUL » introuvable.');

  const membre = await prisma.organisationMember.findFirst({ where: { organisationId: org.id, personId: person.id } });
  if (!membre) await prisma.organisationMember.create({ data: { organisationId: org.id, personId: person.id } });

  // Sous Miravosk, comme le reste du personnel.
  const chef = await prisma.familyMember.findFirst({ where: { organisationId: org.id, name: 'Miravosk' }, select: { id: true } });
  const noeud = await prisma.familyMember.findFirst({ where: { organisationId: org.id, name: 'Grazh' }, select: { id: true } });
  const dataNoeud = { name: 'Grazh', title: 'Portier / videur', personId: person.id, sex: 'MAN' as const, order: 12, superiorId: chef?.id ?? null };
  if (noeud) await prisma.familyMember.update({ where: { id: noeud.id }, data: dataNoeud });
  else await prisma.familyMember.create({ data: { ...dataNoeud, organisationId: org.id } });
  console.log(`${noeud ? '↻' : '+'} Nœud Grazh — Portier / videur, sous Miravosk`);

  const tree = await prisma.familyMember.findMany({
    where: { organisationId: org.id }, orderBy: { order: 'asc' },
    select: { id: true, name: true, title: true, superiorId: true, personId: true, playerCharacterId: true },
  });
  const byId = new Map(tree.map((t) => [t.id, t.name]));
  console.log(`\nOrganigramme La Loutre SAOUL — ${tree.length} nœuds :`);
  for (const t of tree) {
    const lien = t.playerCharacterId ? 'PJ' : t.personId ? 'PNJ' : 'nom seul';
    console.log(`  · ${t.name.padEnd(15)} ${(t.title ?? '—').padEnd(42)} sup=${t.superiorId ? byId.get(t.superiorId) : '(la maison)'} [${lien}]`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
