/**
 * Affichage des dates selon le calendrier de Solenia (6 jours/semaine, 12 mois de 30 j + 5 Jours Hors-Cycle).
 */

/** Jours de la semaine (6 jours). */
export const SOLENIA_WEEKDAYS = [
  'Lumenis — Jour de la Lumière',
  'Ignis — Jour du Feu',
  'Aquis — Jour de l’Eau',
  'Aeris — Jour de l’Air',
  'Terris — Jour de la Terre',
  'Umbris — Jour de l’Ombre',
];

/** Mois de l’année (12 mois). */
export const SOLENIA_MONTHS = [
  'Solalys', 'Ouralys', 'Verdalys', 'Floralys', 'Tonnalys', 'Séréalys',
  'Zenithalys', 'Sombralys', 'Telluralys', 'Astralys', 'Glacialys', 'Noctalys',
];

export const SOLENIA_SACRED_DAYS = [
  'Le Jour des Ancêtres',
  'Le Jour des Serments',
  'Le Jour des Ombres',
  'Le Jour des Offrandes',
  'Le Jour du Silence',
];

/**
 * Formate une date (Date, chaîne ISO ou nombre année) au format Solenia.
 */
export function formatSoleniaDate(
  date: Date | string | number | null | undefined
): string {
  const d =
    date == null
      ? undefined
      : typeof date === 'object' && 'getFullYear' in date
        ? (date as Date)
        : typeof date === 'string' || typeof date === 'number'
          ? parseDate(date)
          : undefined;
  if (!d) return '';
  const y = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  if (month === 11 && day >= 26 && day <= 30) {
    return `${SOLENIA_SACRED_DAYS[day - 26]}, ${y}`;
  }
  if (month === 0 && day === 1 && d.getHours() === 0 && d.getMinutes() === 0) {
    return String(y);
  }
  if (month >= 0 && month < 12) {
    return `${SOLENIA_MONTHS[month]} ${day}, ${y}`;
  }
  return typeof date === 'string' ? date.slice(0, 10) : String(y);
}

function parseDate(value: string | number): Date | undefined {
  if (typeof value === 'number') return new Date(value, 0, 1);
  const s = String(value).trim();
  if (/^\d{1,5}$/.test(s)) return new Date(parseInt(s, 10), 0, 1);
  const parsed = new Date(s);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
