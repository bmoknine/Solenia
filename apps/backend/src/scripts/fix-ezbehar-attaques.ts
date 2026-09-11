import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Corrections MJ sur la fiche d'Ezbehar :
 *  — bonus d'attaque recalculés (FOR +3, maîtrise +3, bonus d'arme) : épée +7, cimeterre +8 ;
 *  — Invisibilité et Blessure viennent du don « Affinité ombreuse », incantation à l'Intelligence
 *    → DD des sorts 8 + 3 + 4 = 15, bonus d'attaque des sorts +7.
 */
const NOUVELLE_DESC = `Guerrier — Soldat Psi, drakéide, niveau 7. Fiche v5.5 (D&D 2024). Historique : Noble.

Défense : CA 16 (cuirasse + Dex). PV 50. Dés de vie 7d10. Initiative +2, vitesse 9 m, Perception passive 14.
Bonus de maîtrise +3. Sauvegardes maîtrisées : Force +6, Constitution +5.
Compétences maîtrisées : Athlétisme +6, Histoire +7, Acrobaties +5, Discrétion +5, Intuition +4, Perception +4, Persuasion +3.

Traits d'espèce (drakéide) : vision nocturne 18 m ; résistance à la foudre ; souffle draconique ; vol cristallin (10 minutes) ; esprit psionique.
Dons : Doué ; Affinité ombreuse ; Respiration aquatique.
Outils : échecs draconiques.
Langues : Commun, Draconique, Primordial, Orc, Géant.

Armes : Épée longue aux reflets sous-marins +1 — attaque +7, 1d8+4, maîtrise Sape. Cimeterre « Tranchant de l'esprit brisé » +2 — attaque +8, 1d6+5, Coup double.
Objets magiques liés : épée longue aux reflets sous-marins, tranchant de l'esprit brisé, masque d'ombre du corbeau.

Incantation (don Affinité ombreuse) : Intelligence — DD des sorts 15, bonus d'attaque des sorts +7. Sorts : Invisibilité, Blessure.

Bourse : 246 po, 82 pa. En banque : 2 600 po.
Copropriétaire de La Loutre SAOUL (acte de propriété) et détenteur de parts de la Compagnie des Trois Moustiquaires.`;

const SOURCE_SORT = 'Accordé par le don « Affinité ombreuse » — incantation à l\'Intelligence (DD 15, attaque +7).';

async function main() {
  const pc = await prisma.playerCharacter.findFirst({ where: { name: 'Ezbehar Izotsutzar' }, select: { id: true } });
  if (!pc) throw new Error('Ezbehar introuvable.');

  await prisma.playerCharacter.update({ where: { id: pc.id }, data: { description: NOUVELLE_DESC } });
  console.log('✓ Description : attaques +7 / +8, incantation via Affinité ombreuse (Int, DD 15)');

  const arme1 = await prisma.playerCharacterEquipmentItem.updateMany({
    where: { playerCharacterId: pc.id, name: { contains: 'Épée longue' } },
    data: { description: 'Attaque +7, 1d8+4, maîtrise Sape. Objet magique lié.' },
  });
  const arme2 = await prisma.playerCharacterEquipmentItem.updateMany({
    where: { playerCharacterId: pc.id, name: { contains: 'Cimeterre' } },
    data: { description: 'Attaque +8, 1d6+5, Coup double. Objet magique lié.' },
  });
  console.log(`✓ Équipement : ${arme1.count + arme2.count} armes corrigées`);

  const sorts = await prisma.playerCharacterSpell.updateMany({
    where: { playerCharacterId: pc.id, name: { in: ['Invisibilité', 'Blessure'] } },
    data: { description: SOURCE_SORT },
  });
  console.log(`✓ Sorts : ${sorts.count} rattachés au don Affinité ombreuse`);

  const check = await prisma.playerCharacter.findUnique({
    where: { id: pc.id },
    include: { equipment: { where: { equipped: true }, select: { name: true, description: true } }, spells: { select: { name: true, description: true } } },
  });
  console.log('\nArmes équipées :');
  check!.equipment.forEach((e) => console.log(`  · ${e.name} → ${e.description}`));
  console.log('Sorts :');
  check!.spells.forEach((s) => console.log(`  · ${s.name} → ${s.description}`));
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
