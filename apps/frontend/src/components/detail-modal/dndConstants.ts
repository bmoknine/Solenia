import type { AbilityKey } from '../../api/entities';

/** Bonus de maîtrise selon le niveau total du personnage */
export function proficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

/** Modificateur de caractéristique D&D 5e */
export function abilityMod(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** Calcul complet du bonus de compétence */
export function skillBonus(score: number, level: number, proficient: boolean, expertise: boolean): number {
  const mod = abilityMod(score);
  const pb = proficiencyBonus(level);
  return mod + (proficient ? pb : 0) + (expertise ? pb : 0);
}

export function formatBonus(n: number): string {
  return (n >= 0 ? '+' : '') + n;
}

export const DND_SKILLS: { name: string; ability: AbilityKey }[] = [
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

/** Génère la liste complète des 17 compétences avec les maîtrises/expertise issues de la base */
export function mergeSkillsWithDefaults(
  stored: { id?: string; name: string; ability: AbilityKey; proficient: boolean; expertise: boolean }[],
) {
  return DND_SKILLS.map((sk) => {
    const found = stored.find((s) => s.name === sk.name);
    return found ?? { name: sk.name, ability: sk.ability, proficient: false, expertise: false };
  });
}

export const DND_SAVING_THROWS: AbilityKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

export function mergeSavingThrowsWithDefaults(
  stored: { id?: string; ability: string; proficient: boolean }[],
) {
  return DND_SAVING_THROWS.map((ability) => {
    const found = stored.find((s) => s.ability === ability);
    return found ?? { ability, proficient: false };
  });
}
