import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DESCRIPTION = `Ensorceleuse draconique (ascendance Or/Feu — résistance au feu), Elfe sylvestre, niveau 9. Fiche v5.5 (D&D 2024). Jouée par Télina.

Physique : yeux de dragon orange, peau beige clair, cheveux roux ; 1,73 m.

Incantation : Charisme — DD des sorts 17, bonus d'attaque des sorts +9, modificateur d'incantation +5.
Défense : CA 19 = Résistance draconique 2024 (sans armure : 10 + Dex + Cha). Résistance au feu.

Traits d'espèce (elfe sylvestre) : vision dans le noir 18 m ; ascendance féerique (avantage contre l'état Charmé, immunité au sommeil magique) ; transe méditative (4 h = 8 h de sommeil) ; vitesse 10,5 m.
Capacités de classe : Sorcellerie innée (2/repos long : avantage aux attaques de sorts + DD des sorts +1) ; 9 points de sorcellerie (repos court = la moitié, repos long = la totalité) ; Métamagie ; Résistance draconique.
Dons : Doué ; Incantateur d'élite (les sorts ignorent l'abri, pas de désavantage au corps à corps, portée augmentée).

Langues : Commun, Elfe, Draconique, Nain, Sylvain.
Maîtrises d'armes : épée longue, épée courte, arbalète, dague.`;

async function main() {
  const pc = await prisma.playerCharacter.findFirst({ where: { name: 'Elerÿna' }, select: { id: true } });
  if (!pc) throw new Error('Elerÿna introuvable.');

  const updated = await prisma.playerCharacter.update({
    where: { id: pc.id },
    data: {
      level: 9,
      CHA: 20, // +5 (confirmé par DD 17 et attaque +9)
      ca: 19, // Résistance draconique 2024 : 10 + Dex(4) + Cha(5)
      background: 'Noble',
      description: DESCRIPTION,
      // Inchangés (confirmés par recoupement) : STR 10, DEX 18, CON 12, INT 11, WIS 12,
      // init 4, speed 10, saves CON/CHA, skills, alignement NEUTRE_BON.
    },
    select: { name: true, level: true, CHA: true, ca: true, STR: true, DEX: true, CON: true, INT: true, WIS: true, pvMax: true },
  });
  console.log('Elerÿna mise à jour :', JSON.stringify(updated, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
