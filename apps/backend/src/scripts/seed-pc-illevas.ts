import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Compétences maîtrisées (cercle rempli sur la fiche)
const PROF_SKILLS = new Set(['Discrétion', 'Intimidation', 'Médecine', 'Perception', 'Persuasion']);
const SKILLS: { name: string; ability: string }[] = [
  { name: 'Acrobaties', ability: 'DEX' },
  { name: 'Arcanes', ability: 'INT' },
  { name: 'Athlétisme', ability: 'STR' },
  { name: 'Discrétion', ability: 'DEX' },
  { name: 'Dressage', ability: 'WIS' },
  { name: 'Escamotage', ability: 'DEX' },
  { name: 'Histoire', ability: 'INT' },
  { name: 'Intimidation', ability: 'CHA' },
  { name: 'Investigation', ability: 'INT' },
  { name: 'Médecine', ability: 'WIS' },
  { name: 'Nature', ability: 'INT' },
  { name: 'Perception', ability: 'WIS' },
  { name: 'Performance', ability: 'CHA' },
  { name: 'Persuasion', ability: 'CHA' },
  { name: 'Religion', ability: 'INT' },
  { name: 'Survie', ability: 'WIS' },
  { name: 'Tromperie', ability: 'CHA' },
];

const PROF_SAVES = new Set(['DEX', 'WIS', 'CHA']);
const SAVES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

const DESCRIPTION = `Clerc haut-elfe (domaine de la Vie), niveau 8 — fiche v5.5 (D&D 2024).

Incantation (Sagesse) : modificateur +5 · DD des sorts 16 · attaque de sort +8. Emplacements de sorts : 4× niv 1, 3× niv 2, 3× niv 3, 2× niv 4. (Sorts préparés à renseigner — non indiqués sur la fiche.)

Capacités de classe :
— Thaumaturge : ajoute le bonus de Sagesse (+5) aux jets d'Arcanes et de Religion.
— Calcination de mort-vivant (destruction des morts-vivants).
— Incantation divine (conduit divin).

Traits d'espèce (haut-elfe) : Vision dans le noir 18 m ; Ascendance féérique (avantage contre l'état Charmé) ; Transe (immunisé au sommeil magique ; 4 h de méditation valent un repos long).

Dons : Chanceux ; Résilient (Dextérité — d'où la maîtrise du jet de sauvegarde de DEX).

Maîtrises : armures légères et intermédiaires, boucliers ; armes courantes ; outils de voleur. Langues : Commun, Elfique, Halfelin.

À noter : Intuition (Sagesse) est maîtrisée sur la fiche (+8) mais l'appli ne liste pas cette compétence ; Intimidation apparaît à +6 sur la fiche (à vérifier — expertise éventuelle).

Bourse : 136 pc · 125 pa · 23 pe · 4472 po · 235 pp. Banque : 2000 po, 400 pp.
Divers : perception passive 18 ; taille 1,65 m.`;

async function main() {
  const existing = await prisma.playerCharacter.findFirst({ where: { name: 'Illévas' } });
  if (existing) {
    console.log('Un PJ « Illévas » existe déjà :', existing.id);
    return;
  }

  const pc = await prisma.playerCharacter.create({
    data: {
      name: 'Illévas',
      class: 'CLERC',
      level: 8,
      race: 'ELFE',
      background: 'Voyageur',
      alignment: 'NEUTRE_BON',
      description: DESCRIPTION,
      STR: 8, DEX: 13, CON: 10, INT: 10, WIS: 20, CHA: 10,
      pv: 51, pvMax: 51, ca: 18, initiative: 1, speed: 9,
      showOnMap: false, isForDM: false,
      savingThrows: { create: SAVES.map((ability) => ({ ability, proficient: PROF_SAVES.has(ability) })) },
      skills: { create: SKILLS.map((s) => ({ name: s.name, ability: s.ability, proficient: PROF_SKILLS.has(s.name), expertise: false })) },
      equipment: {
        create: [
          { name: 'Armure d’écailles miroitantes', description: 'CA de base 15 ; avantage aux jets de sauvegarde de Constitution.', equipped: true },
          { name: 'Bouclier', description: '+2 CA', equipped: true },
          { name: 'Masse d’arme', description: '+2 à l’attaque, 1d6 dégâts', equipped: true },
          { name: 'Symbole sacré', description: 'Focaliseur d’incantation divine.', equipped: true },
          { name: 'Outils de voleur', description: 'Maîtrise.', equipped: false },
        ],
      },
    },
    include: { skills: true, savingThrows: true, equipment: true },
  });

  console.log('PJ créé :', pc.name, pc.id);
  console.log('  compétences:', pc.skills.length, '| sauvegardes:', pc.savingThrows.length, '| équipement:', pc.equipment.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
