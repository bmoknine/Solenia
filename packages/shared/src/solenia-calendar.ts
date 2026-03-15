import { z } from 'zod';

/**
 * Calendrier de Solenia
 * - 12 mois de 30 jours (360 jours)
 * - 5 Jours Hors-Cycle en fin d'année (365 jours au total)
 */

/** Schéma Zod : année (nombre), "YYYY", ou "YYYY-MM-DD" (mois 1-12, jour 1-30 ou 31-35 pour Jours Hors-Cycle). */
export const soleniaDateInGameSchema = z.preprocess(
  (v) => (v === '' || v === null ? undefined : v),
  z
    .union([
      z.number().int(),
      z.string().min(1).refine(
        (s) => /^\d{1,5}$/.test(s) || /^\d{1,5}-\d{1,2}-\d{1,2}$/.test(s),
        { message: 'Date : année (nombre) ou YYYY-MM-DD (calendrier Solenia)' }
      ),
    ])
    .optional()
);

/** Jours de la semaine (6 jours). */
export const SOLENIA_WEEKDAYS = [
  'Lumenis — Jour de la Lumière',
  'Ignis — Jour du Feu',
  'Aquis — Jour de l’Eau',
  'Aeris — Jour de l’Air',
  'Terris — Jour de la Terre',
  'Umbris — Jour de l’Ombre',
] as const;

/** Mois de l’année (12 mois de 30 jours). */
export const SOLENIA_MONTHS = [
  'Solalys',    // 1
  'Ouralys',    // 2
  'Verdalys',   // 3
  'Floralys',   // 4
  'Tonnalys',   // 5
  'Séréalys',   // 6
  'Zenithalys', // 7
  'Sombralys',  // 8
  'Telluralys', // 9
  'Astralys',   // 10
  'Glacialys',  // 11
  'Noctalys',   // 12
] as const;

export const SOLENIA_SACRED_DAYS = [
  'Le Jour des Ancêtres',
  'Le Jour des Serments',
  'Le Jour des Ombres',
  'Le Jour des Offrandes',
  'Le Jour du Silence',
] as const;

/** Index des Jours Hors-Cycle (361 à 365 dans l’année). */
export const SACRED_DAY_OFFSET = 361;

/**
 * Accepte : année (nombre), chaîne "YYYY", ou "YYYY-MM-DD" (mois 1–12, jour 1–30 ou 31–35 pour les 5 Jours Hors-Cycle).
 * Pour les Jours Hors-Cycle : jour 31 = premier jour sacré, …, 35 = dernier.
 */
export function parseSoleniaDate(
  value: number | string | null | undefined
): Date | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  if (typeof value === 'number') {
    return new Date(value, 0, 1);
  }
  const s = String(value).trim();
  if (/^\d{1,5}$/.test(s)) {
    return new Date(parseInt(s, 10), 0, 1);
  }
  const match = s.match(/^(\d{1,5})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    const y = parseInt(match[1], 10);
    const m = parseInt(match[2], 10) - 1;
    const d = parseInt(match[3], 10);
    if (m >= 0 && m < 12 && d >= 1 && d <= 30) {
      return new Date(y, m, d);
    }
    if (m === 11 && d >= 31 && d <= 35) {
      return new Date(y, 11, 25 + (d - 30));
    }
  }
  return undefined;
}

/**
 * Retourne une représentation lisible pour une Date stockée (année seule ou date complète).
 * Pour les Jours Hors-Cycle (jour 31–35 du mois 12), utilise les noms sacrés.
 */
export function formatSoleniaDate(date: Date | string | number | null | undefined): string {
  const d = date == null ? undefined : typeof date === 'object' && 'getFullYear' in date
    ? date as Date
    : typeof date === 'string' || typeof date === 'number'
      ? parseSoleniaDate(date)
      : undefined;
  if (!d) return '';
  const y = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  if (month === 11 && day >= 26 && day <= 30) {
    const idx = day - 26;
    return `${SOLENIA_SACRED_DAYS[idx]}, ${y}`;
  }
  if (month === 0 && day === 1 && d.getHours() === 0 && d.getMinutes() === 0) {
    return String(y);
  }
  if (month >= 0 && month < 12) {
    return `${SOLENIA_MONTHS[month]} ${day}, ${y}`;
  }
  return d.toISOString().slice(0, 10);
}
