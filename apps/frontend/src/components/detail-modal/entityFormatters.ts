import type { Breed, Sex, Membership, Language } from '../../api/entities';

export function formatBreed(breed: Breed | null | undefined): string {
  if (!breed) return '-';
  return breed.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

export function formatSex(sex: Sex | null | undefined): string {
  if (!sex) return '-';
  const map: Record<Sex, string> = {
    MAN: 'Homme',
    WOMAN: 'Femme',
    OTHER: 'Autre',
  };
  return map[sex] || sex;
}

export function formatMembership(membership: Membership | null | undefined): string {
  if (!membership) return '-';
  const map: Record<Membership, string> = {
    POLITIC: 'Politique',
    RELIGEUX: 'Religieux',
    MARCHAND: 'Marchand',
    CCCH: 'CCCH',
    CRIMINALITE: 'Criminalité',
    OTHER: 'Autre',
  };
  return map[membership] || membership;
}

export function formatLanguage(lang: Language): string {
  const map: Record<Language, string> = {
    COMMUN: 'Commun',
    NAIN: 'Nain',
    ELFIQUE: 'Elfique',
    GNOME: 'Gnome',
    HALFELIN: 'Halfelin',
    ORC: 'Orc',
    GOBELIN: 'Gobelin',
    GEANT: 'Géant',
    DRACONIQUE: 'Draconique',
    SYLVESTRE: 'Sylvestre',
    INFERNAL: 'Infernal',
    ABYSSAL: 'Abyssal',
    CELESTE: 'Céleste',
    PRIMORDIAL: 'Primordial',
    AQUAN: 'Aquan',
    AURAN: 'Auran',
    IGNAN: 'Ignan',
    TERRAN: 'Terran',
    PROFOND: 'Profond',
    SLAADI: 'Slaadi',
    TELEPATHIQUE: 'Télépathique',
    ARGOT_VOLEUR: 'Argot des Voleurs',
  };
  return map[lang] || lang;
}
