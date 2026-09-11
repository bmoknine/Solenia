import { PrismaClient, type Language, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Organigramme de La Loutre SAOUL : les PJ propriétaires + le personnel.
 *
 * Note sur la hiérarchie : `superiorId` est simple-valué, or le personnel travaille
 * pour la maison, pas pour un PJ en particulier. Tout le monde est donc rattaché
 * directement à l'organisation ; c'est le champ `order` qui groupe propriétaires
 * puis personnel. Idempotent.
 */
const LOUTRE_PLACE = '57210a91-4e46-40ee-9e76-a6abd07189b1';
const ALAGIR = '6d39b2bc-6488-4763-9643-b57e9af59c03';
const CHANT_TAL_TARIS = 'cd218e67-1630-4948-a3e2-585a884aee96';

const CUISINIERE = 'Sabine Quenot';
const CUISINIERE_DESC = `
<p>Femme naine, 61 ans. Courte et large, avant-bras de forgeronne à force de pétrir et de porter des marmites de fonte ; elle se déplace vite malgré la carrure, écartant les gens du coude sans s'excuser.</p>
<p>Visage rond et rougi par la chaleur des fourneaux, nez cassé jamais remis droit. Cheveux gris fer tressés serré et enroulés sous un foulard qui fut blanc. Yeux noisette très vifs sous des sourcils broussailleux. Une vieille brûlure court de son poignet droit jusqu'au coude.</p>
<p>Goûte tout avec le même couteau, qu'elle essuie sur son tablier. Compte à voix haute quand elle est contrariée — arrivée à dix, quelqu'un sort de sa cuisine. Refuse catégoriquement qu'on entre dans son réduit à provisions, propriétaires compris. Toute la salle l'appelle « <strong>la Louche</strong> », y compris les habitués qui n'ont jamais su son nom.</p>
<p><strong>Rôle :</strong> cuisinière engagée par les PJ pour la réouverture de <strong>La Loutre SAOUL</strong>. Trente ans de cambuses sur les navires marchands avant de poser son sac aux Bas-Quais : elle sait nourrir quarante personnes avec trois fois rien, et repérer une denrée avariée à l'odeur à travers une caisse fermée. Son ragoût de poisson au poivre noir fait déjà partie de la réputation de la maison.</p>
<p><strong>Secret (MJ) :</strong> son réduit à provisions donne sur la trappe de contrebande. Elle l'a compris dès la première semaine et n'en a rien dit — elle attend de voir quel genre de patrons sont les PJ. Elle tient un compte exact de ce qui transite ; pas pour le vendre, pour savoir dans quoi elle travaille.</p>
`.trim();

/** Nœuds à poser. `pc` = nom du PlayerCharacter, `pnj` = nom du PersonOfInterest. */
type Noeud = { nom: string; titre: string | null; pc?: string; pnj?: string; order: number };

const NOEUDS: Noeud[] = [
  // Propriétaires
  { nom: 'Elerÿna', titre: 'Propriétaire', pc: 'Elerÿna', order: 0 },
  { nom: 'Illevas', titre: 'Propriétaire', pc: 'Illevas', order: 1 },
  { nom: 'milo', titre: 'Propriétaire', pc: 'milo', order: 2 },
  { nom: 'Neuf Nuits', titre: 'Propriétaire', pc: 'Neuf Nuits', order: 3 },
  // Ezbehar n'a pas encore de fiche PJ : nœud au nom seul, à relier quand la fiche existera.
  { nom: 'Ezbehar', titre: 'Propriétaire', order: 4 },
  // Personnel
  { nom: 'Core Belan', titre: 'Barde de maison', pnj: 'Core Belan', order: 10 },
  { nom: CUISINIERE, titre: 'Cuisinière — « la Louche »', pnj: CUISINIERE, order: 11 },
  // Mira : introuvable en base, rôle inconnu — nœud posé, à compléter.
  { nom: 'Mira', titre: null, order: 12 },
];

async function main() {
  const org = await prisma.organisation.findFirst({ where: { name: 'La Loutre SAOUL' }, select: { id: true } });
  if (!org) throw new Error('Organisation « La Loutre SAOUL » introuvable.');

  // ── 1. La cuisinière ────────────────────────────────────────────────
  const dataCuis = {
    description: CUISINIERE_DESC,
    breed: 'NAIN' as const, sex: 'WOMAN' as const, membership: 'OTHER' as const,
    languages: ['COMMUN', 'NAIN'] as Language[],
    fp: '1/2', pv: 30, ca: 12,
    STR: 15, DEX: 10, CON: 16, INT: 11, WIS: 14, CHA: 12,
    cityId: ALAGIR, districtId: CHANT_TAL_TARIS, placeId: LOUTRE_PLACE,
    showOnMap: false, isForDM: false,
  };
  const existCuis = await prisma.personOfInterest.findFirst({ where: { name: CUISINIERE }, select: { id: true } });
  const cuis = existCuis
    ? await prisma.personOfInterest.update({ where: { id: existCuis.id }, data: dataCuis, select: { id: true } })
    : await prisma.personOfInterest.create({ data: { name: CUISINIERE, ...dataCuis }, select: { id: true } });
  console.log(existCuis ? `↻ ${CUISINIERE} mise à jour` : `+ ${CUISINIERE} créée`, `[${cuis.id}]`);

  // ── 2. Les nœuds ────────────────────────────────────────────────────
  const pcs = await prisma.playerCharacter.findMany({ select: { id: true, name: true } });
  const pcId = new Map(pcs.map((p) => [p.name, p.id]));
  const pnjs = await prisma.personOfInterest.findMany({
    where: { name: { in: NOEUDS.map((n) => n.pnj).filter(Boolean) as string[] } },
    select: { id: true, name: true, sex: true },
  });
  const pnjById = new Map(pnjs.map((p) => [p.name, p]));

  // Le sexe des PJ n'est pas stocké sur PlayerCharacter : on le reprend d'un nœud
  // existant s'il y en a un, sinon on le laisse vide (nœud neutre) plutôt que deviner.
  const sexeConnu = new Map<string, Sex>();
  for (const n of await prisma.familyMember.findMany({
    where: { playerCharacterId: { not: null }, sex: { not: null } },
    select: { name: true, sex: true },
  })) {
    if (n.sex) sexeConnu.set(n.name, n.sex);
  }

  for (const n of NOEUDS) {
    const playerCharacterId = n.pc ? pcId.get(n.pc) ?? null : null;
    if (n.pc && !playerCharacterId) console.log(`  ⚠ PJ introuvable : ${n.pc}`);
    const pnj = n.pnj ? pnjById.get(n.pnj) : undefined;
    if (n.pnj && !pnj) console.log(`  ⚠ PNJ introuvable : ${n.pnj}`);

    const data = {
      name: n.nom,
      title: n.titre,
      order: n.order,
      playerCharacterId,
      personId: pnj?.id ?? null,
      sex: pnj?.sex ?? sexeConnu.get(n.nom) ?? null,
      superiorId: null, // tout le monde dépend de la maison
    };

    const exist = await prisma.familyMember.findFirst({
      where: { organisationId: org.id, name: n.nom },
      select: { id: true },
    });
    if (exist) await prisma.familyMember.update({ where: { id: exist.id }, data });
    else await prisma.familyMember.create({ data: { ...data, organisationId: org.id } });
    console.log(`  ${exist ? '↻' : '+'} ${n.nom} — ${n.titre ?? '(rôle à définir)'}`);
  }

  // ── 3. La cuisinière comme membre de l'organisation ─────────────────
  const lien = await prisma.organisationMember.findFirst({ where: { organisationId: org.id, personId: cuis.id } });
  if (!lien) await prisma.organisationMember.create({ data: { organisationId: org.id, personId: cuis.id } });

  // ── Contrôle ────────────────────────────────────────────────────────
  const tree = await prisma.familyMember.findMany({
    where: { organisationId: org.id },
    orderBy: { order: 'asc' },
    select: { name: true, title: true, sex: true, personId: true, playerCharacterId: true },
  });
  console.log(`\nOrganigramme La Loutre SAOUL — ${tree.length} nœuds :`);
  for (const t of tree) {
    const lien = t.playerCharacterId ? 'PJ' : t.personId ? 'PNJ' : 'nom seul';
    console.log(`  · ${t.name.padEnd(16)} ${(t.title ?? '—').padEnd(30)} [${lien}]`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
