import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Trois nettoyages de doublons demandés par le MJ :
 *  1. les deux « Brakk l'Enclume » (seuls les guillemets différaient) ;
 *  2. Amiro Léovine ⟵ Virion Omalee (même personne, alias contre vrai nom) ;
 *  3. suppression du PNJ « Elerÿna Solanmir », doublon de la fiche PJ.
 *
 * Aucune des cinq fiches n'a d'organisation, de lore, de nœud d'organigramme,
 * de combattant ni de commentaire — vérifié avant écriture. Leurs lignes Position
 * partent d'elles-mêmes grâce au ON DELETE CASCADE posé le 2026-09-10.
 * Idempotent.
 */
const BRAKK_GARDE = 'a50188f9-724b-4ba6-b62b-0a1a0f43bf97'; // stats complètes, PV 95, CA 15
const BRAKK_DOUBLON = 'c4086784-6bd1-4857-a2cc-b6763500486c';
const BRAKK_NOUVEAU_NOM = "Brakk « l'Enclume »";

const AMIRO = 'fe11f5e3-b52a-446f-b6bd-18cf660a6eb9';
const VIRION = '5c53bf0c-c38f-4681-9332-6c8bd0c5c1d7';
const ELERYNA_PNJ = 'a6aca165-4372-450b-ad9f-cc86be82e1d5';

/** Description fusionnée : les stats du survivant + le Monocle du Diable du doublon. */
const BRAKK_DESC = `
<p>Homme demi-orc, 38 ans, Maître de l'Arène. Bâti comme le billot dont il porte le nom : court sur pattes, épais, le cou disparu dans les épaules. Se déplace peu et lentement, sauf sur le sable.</p>
<p>Peau vert-gris épaisse et grêlée, crâne rasé. Défenses inférieures larges, l'une cassée en biseau. Arcades saillantes, sourcils quasi absents à force de coupures. Oreilles en chou-fleur, nez inexistant.</p>
<p><strong>Voix :</strong> caverneuse et pâteuse — les mâchoires ont trop encaissé pour articuler proprement, et il mange la moitié des consonnes. Débit très lent, trois ou quatre mots à la fois, avec de longues respirations entre. Rit d'un seul son, bas et bref, quand quelque chose lui plaît vraiment. Quand il annonce un combat, il ne dit que deux noms et un chiffre.</p>
<p><strong>Rôle :</strong> Maître de l'Arène et combattant de l'arène clandestine du <strong>Monocle du Diable</strong>, à Huriya — l'établissement que tient <strong>Ernil Sultaasar</strong>.</p>
<p><strong>Capacités notables :</strong> PV 95 · CA 15. Implacable : quand Brakk tombe à 0 PV, il reste à 1 PV (1/jour). Seigneur de l'Arène : avantage aux attaques dans l'arène. Multiattaque (2 attaques). Marteau d'arène : +7, 1d10+4 contondant. Projection brutale : test de FOR opposé, la cible est projetée et à terre.</p>
`.trim();

async function fusionner(gardeId: string, doublonId: string, label: string) {
  const garde = await prisma.personOfInterest.findUnique({ where: { id: gardeId }, select: { id: true, name: true } });
  if (!garde) throw new Error(`Survivant introuvable : ${label}`);
  const doublon = await prisma.personOfInterest.findUnique({ where: { id: doublonId }, select: { id: true, name: true } });
  if (!doublon) { console.log(`· ${label} : fusion déjà faite`); return garde; }

  // Report de tout ce qui pourrait pointer vers le doublon — on ne suppose rien.
  const rep = {
    commentaires: (await prisma.comment.updateMany({ where: { personOfInterestId: doublonId }, data: { personOfInterestId: gardeId } })).count,
    combattants: (await prisma.combatant.updateMany({ where: { personId: doublonId }, data: { personId: gardeId } })).count,
    noeuds: (await prisma.familyMember.updateMany({ where: { personId: doublonId }, data: { personId: gardeId } })).count,
  };
  let orgs = 0, lore = 0;
  for (const l of await prisma.organisationMember.findMany({ where: { personId: doublonId }, select: { id: true, organisationId: true } })) {
    const deja = await prisma.organisationMember.findFirst({ where: { organisationId: l.organisationId, personId: gardeId } });
    if (deja) await prisma.organisationMember.delete({ where: { id: l.id } });
    else { await prisma.organisationMember.update({ where: { id: l.id }, data: { personId: gardeId } }); orgs++; }
  }
  for (const l of await prisma.lorePerson.findMany({ where: { personId: doublonId }, select: { id: true, loreId: true } })) {
    const deja = await prisma.lorePerson.findFirst({ where: { loreId: l.loreId, personId: gardeId } });
    if (deja) await prisma.lorePerson.delete({ where: { id: l.id } });
    else { await prisma.lorePerson.update({ where: { id: l.id }, data: { personId: gardeId } }); lore++; }
  }

  await prisma.personOfInterest.delete({ where: { id: doublonId } });
  console.log(`✓ ${label} : « ${doublon.name} » supprimé (reports ${JSON.stringify({ ...rep, orgs, lore })})`);
  return garde;
}

async function main() {
  const orphAvant = await prisma.position.count({
    where: { kingdomId: null, cityId: null, placeId: null, personOfInterestId: null, playerCharacterId: null },
  });

  // ── 1. Les deux Brakk ───────────────────────────────────────────────
  await fusionner(BRAKK_GARDE, BRAKK_DOUBLON, 'Brakk');
  const brakk = await prisma.personOfInterest.findUnique({ where: { id: BRAKK_GARDE }, select: { name: true, description: true } });
  if (brakk && (brakk.name !== BRAKK_NOUVEAU_NOM || (brakk.description ?? '').includes('doublon'))) {
    await prisma.personOfInterest.update({
      where: { id: BRAKK_GARDE },
      data: { name: BRAKK_NOUVEAU_NOM, description: BRAKK_DESC },
    });
    console.log(`✓ Brakk : renommé « ${BRAKK_NOUVEAU_NOM} », note de doublon retirée, Monocle du Diable conservé`);
  }

  // ── 2. Amiro Léovine ⟵ Virion Omalee ────────────────────────────────
  await fusionner(AMIRO, VIRION, 'Amiro Léovine');

  // ── 3. Le PNJ Elerÿna Solanmir ──────────────────────────────────────
  const ely = await prisma.personOfInterest.findUnique({ where: { id: ELERYNA_PNJ }, select: { name: true } });
  if (ely) {
    await prisma.personOfInterest.delete({ where: { id: ELERYNA_PNJ } });
    console.log(`✓ PNJ « ${ely.name} » supprimé (doublon de la fiche PJ)`);
  } else {
    console.log('· PNJ Elerÿna Solanmir : déjà supprimé');
  }

  // ── Contrôles ───────────────────────────────────────────────────────
  const restants = await prisma.personOfInterest.findMany({
    where: { OR: [{ name: { contains: 'Brakk' } }, { name: { contains: 'Virion' } }, { name: { contains: 'Solanmir' } }, { name: { contains: 'Amiro' } }] },
    select: { name: true, pv: true, ca: true, place: { select: { name: true } } },
  });
  console.log('\n── Fiches restantes ──');
  restants.forEach((r) => console.log(`  ▸ ${r.name.padEnd(24)} PV ${r.pv ?? '—'} CA ${r.ca ?? '—'}  @ ${r.place?.name ?? '—'}`));

  const orphApres = await prisma.position.count({
    where: { kingdomId: null, cityId: null, placeId: null, personOfInterestId: null, playerCharacterId: null },
  });
  console.log(`\nPositions orphelines : ${orphAvant} avant → ${orphApres} après ${orphApres === orphAvant ? '(la cascade a bien fait son travail ✓)' : '⚠'}`);

  const pj = await prisma.playerCharacter.findMany({ where: { name: { contains: 'Elerÿna' } }, select: { name: true, level: true } });
  console.log(`Fiche PJ intacte : ${pj.map((x) => `${x.name} (niv.${x.level})`).join(', ') || 'AUCUNE ⚠'}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
