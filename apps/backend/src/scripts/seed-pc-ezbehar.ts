import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Ezbehar Izotsutzar — transcription de la fiche papier v5.5 (D&D 2024). Idempotent. */
const CAMPAGNE_OEUF = 'b53a0e0e-f892-40bc-add4-08714b7c88ce';
const LOUTRE_PLACE = '57210a91-4e46-40ee-9e76-a6abd07189b1';

const DESCRIPTION = `Guerrier — Soldat Psi, drakéide, niveau 7. Fiche v5.5 (D&D 2024). Historique : Noble.

Défense : CA 16 (cuirasse + Dex). PV 50. Dés de vie 7d10. Initiative +2, vitesse 9 m, Perception passive 14.
Bonus de maîtrise +3. Sauvegardes maîtrisées : Force +6, Constitution +5.
Compétences maîtrisées : Athlétisme +6, Histoire +7, Acrobaties +5, Discrétion +5, Intuition +4, Perception +4, Persuasion +3.

Traits d'espèce (drakéide) : vision nocturne 18 m ; résistance à la foudre ; souffle draconique ; vol cristallin (10 minutes) ; esprit psionique.
Dons : Doué ; Affinité ombreuse ; Respiration aquatique.
Outils : échecs draconiques.
Langues : Commun, Draconique, Primordial, Orc, Géant.

Armes : Épée longue aux reflets sous-marins +1 — attaque +6, 1d8+4, maîtrise Sape. Cimeterre « Tranchant de l'esprit brisé » +2 — attaque +6, 1d6+5, Coup double.
Objets magiques liés : épée longue aux reflets sous-marins, tranchant de l'esprit brisé, masque d'ombre du corbeau.
Sorts notés sur la fiche : Invisibilité, Blessure — aucune caractéristique d'incantation n'est renseignée, ils viennent vraisemblablement d'un objet ou d'un don.

Bourse : 246 po, 82 pa. En banque : 2 600 po.
Copropriétaire de La Loutre SAOUL (acte de propriété) et détenteur de parts de la Compagnie des Trois Moustiquaires.`;

const COMPETENCES: { name: string; ability: string }[] = [
  { name: 'Athlétisme', ability: 'STR' },
  { name: 'Histoire', ability: 'INT' },
  { name: 'Acrobaties', ability: 'DEX' },
  { name: 'Discrétion', ability: 'DEX' },
  { name: 'Intuition', ability: 'WIS' },
  { name: 'Perception', ability: 'WIS' },
  { name: 'Persuasion', ability: 'CHA' },
];

const EQUIPEMENT: { name: string; quantity: number; description?: string; equipped?: boolean }[] = [
  { name: 'Cuirasse', quantity: 1, description: 'CA 14 + Dex (max +2) = 16', equipped: true },
  { name: 'Épée longue aux reflets sous-marins +1', quantity: 1, description: 'Attaque +6, 1d8+4, maîtrise Sape. Objet magique lié.', equipped: true },
  { name: "Cimeterre « Tranchant de l'esprit brisé » +2", quantity: 1, description: 'Attaque +6, 1d6+5, Coup double. Objet magique lié.', equipped: true },
  { name: "Masque d'ombre du corbeau", quantity: 1, description: 'Objet magique lié.', equipped: true },
  { name: 'Potion de soins', quantity: 2, description: '4d4+4 PV' },
  { name: 'Acte de propriété de La Loutre SAOUL', quantity: 1 },
  { name: 'Parts de la Compagnie des Trois Moustiquaires', quantity: 1, description: 'Lecture incertaine sur la fiche papier — à confirmer.' },
  { name: 'Passeports de Loretta', quantity: 4 },
  { name: 'Livres en draconique', quantity: 10, description: 'Lecture incertaine sur la fiche papier — à confirmer.' },
  { name: 'Livre de religion', quantity: 1 },
  { name: 'Costume de bal en velours', quantity: 1 },
];

const SORTS: { name: string; level: number; school?: string; description?: string }[] = [
  { name: 'Invisibilité', level: 2, school: 'Illusion', description: "Noté sur la fiche sans caractéristique d'incantation — source à préciser (objet ou don)." },
  { name: 'Blessure', level: 1, school: 'Nécromancie', description: "Noté sur la fiche sans caractéristique d'incantation — source à préciser (objet ou don)." },
];

async function main() {
  const data = {
    class: 'GUERRIER' as const,
    level: 7,
    race: 'DRAKEIDE' as const,
    background: 'Noble',
    description: DESCRIPTION,
    STR: 16, DEX: 14, CON: 14, INT: 18, WIS: 12, CHA: 10,
    pv: 50, pvMax: 50, ca: 16, initiative: 2, speed: 9,
    placeId: LOUTRE_PLACE,
    // Alignement laissé vide : la case de la fiche papier ne l'est pas renseignée.
  };

  const exist = await prisma.playerCharacter.findFirst({ where: { name: 'Ezbehar Izotsutzar' }, select: { id: true } });
  const pc = exist
    ? await prisma.playerCharacter.update({ where: { id: exist.id }, data, select: { id: true } })
    : await prisma.playerCharacter.create({ data: { name: 'Ezbehar Izotsutzar', ...data }, select: { id: true } });
  console.log(exist ? '↻ Ezbehar mis à jour' : '+ Ezbehar Izotsutzar créé', `[${pc.id}]`);

  // Sous-tables : on repart de zéro pour rester idempotent
  await prisma.playerCharacterSkill.deleteMany({ where: { playerCharacterId: pc.id } });
  await prisma.playerCharacterSavingThrow.deleteMany({ where: { playerCharacterId: pc.id } });
  await prisma.playerCharacterEquipmentItem.deleteMany({ where: { playerCharacterId: pc.id } });
  await prisma.playerCharacterSpell.deleteMany({ where: { playerCharacterId: pc.id } });

  await prisma.playerCharacterSkill.createMany({
    data: COMPETENCES.map((c) => ({ playerCharacterId: pc.id, name: c.name, ability: c.ability, proficient: true })),
  });
  await prisma.playerCharacterSavingThrow.createMany({
    data: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((a) => ({
      playerCharacterId: pc.id, ability: a, proficient: a === 'STR' || a === 'CON',
    })),
  });
  await prisma.playerCharacterEquipmentItem.createMany({
    data: EQUIPEMENT.map((e) => ({ playerCharacterId: pc.id, name: e.name, quantity: e.quantity, description: e.description ?? null, equipped: e.equipped ?? false })),
  });
  await prisma.playerCharacterSpell.createMany({
    data: SORTS.map((s) => ({ playerCharacterId: pc.id, name: s.name, level: s.level, school: s.school ?? null, description: s.description ?? null, prepared: true })),
  });

  // Campagne
  await prisma.playerCharacter.update({
    where: { id: pc.id },
    data: { campaigns: { connect: { id: CAMPAGNE_OEUF } } },
  });

  // Le nœud « Ezbehar » de l'organigramme pointe désormais vers la fiche PJ
  const org = await prisma.organisation.findFirst({ where: { name: 'La Loutre SAOUL' }, select: { id: true } });
  if (org) {
    const noeud = await prisma.familyMember.findFirst({ where: { organisationId: org.id, name: 'Ezbehar' }, select: { id: true } });
    if (noeud) {
      await prisma.familyMember.update({ where: { id: noeud.id }, data: { playerCharacterId: pc.id } });
      console.log('✓ Nœud « Ezbehar » relié à sa fiche PJ');
    }
  }

  // ── Contrôle ────────────────────────────────────────────────────────
  const check = await prisma.playerCharacter.findUnique({
    where: { id: pc.id },
    include: {
      skills: { where: { proficient: true }, select: { name: true } },
      savingThrows: { where: { proficient: true }, select: { ability: true } },
      equipment: { select: { name: true, quantity: true } },
      spells: { select: { name: true, level: true } },
      campaigns: { select: { name: true } },
      place: { select: { name: true } },
    },
  });
  console.log(`\n${check!.name} — ${check!.race} ${check!.class} niv.${check!.level} (${check!.background})`);
  console.log(`  FOR ${check!.STR} DEX ${check!.DEX} CON ${check!.CON} INT ${check!.INT} SAG ${check!.WIS} CHA ${check!.CHA}`);
  console.log(`  PV ${check!.pv}/${check!.pvMax} · CA ${check!.ca} · init +${check!.initiative} · vitesse ${check!.speed}`);
  console.log(`  sauvegardes : ${check!.savingThrows.map((s) => s.ability).join(', ')}`);
  console.log(`  compétences : ${check!.skills.map((s) => s.name).join(', ')}`);
  console.log(`  sorts : ${check!.spells.map((s) => `${s.name} (niv.${s.level})`).join(', ')}`);
  console.log(`  équipement : ${check!.equipment.length} lignes`);
  console.log(`  campagne : ${check!.campaigns.map((c) => c.name).join(', ')} · lieu : ${check!.place?.name}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
