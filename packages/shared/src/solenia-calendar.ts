import { z } from 'zod';

/**
 * Calendrier de Solenia
 * - 12 mois de 30 jours (360 jours)
 * - 5 Jours Hors-Cycle en fin d'année (365 jours au total)
 */

/** Normalise une chaîne ISO (ex. 0671-09-11T23:50:39.000Z) en YYYY-MM-DD pour la validation. */
function normalizeDateInput(v: unknown): unknown {
  if (v === '' || v === null || v === undefined) return undefined;
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) {
    return v.slice(0, 10);
  }
  return v;
}

/** Schéma Zod : année (nombre), "YYYY", "YYYY-MM-DD" ou chaîne ISO (acceptée puis normalisée). */
export const soleniaDateInGameSchema = z.preprocess(
  (v) => normalizeDateInput(v === '' || v === null ? undefined : v),
  z
    .union([
      z.number().int(),
      z.string().min(1).refine(
        (s) => /^-?\d{1,5}$/.test(s) || /^-?\d{1,5}-\d{1,2}-\d{1,2}$/.test(s),
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
  let s = String(value).trim();
  // Accepter chaîne ISO (ex. 0671-09-11T23:50:39.000Z) : garder uniquement YYYY-MM-DD
  if (s.length > 10 && /^\d{4}-\d{2}-\d{2}/.test(s)) {
    s = s.slice(0, 10);
  }
  if (/^-?\d{1,5}$/.test(s)) {
    return new Date(parseInt(s, 10), 0, 1);
  }
  const match = s.match(/^(-?\d{1,5})-(\d{1,2})-(\d{1,2})$/);
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

export type SoleniaDateParts = {
  year: number;
  month: number | null;
  day: number | null;
  isYearOnly: boolean;
  isSacredDay: boolean;
};

/** Jour de l’année Solenia (1–365). */
export function soleniaDayOfYear(monthIndex: number, day: number): number {
  if (monthIndex === 11 && day >= 26) return 360 + (day - 25);
  return monthIndex * 30 + day;
}

/** Index du jour de la semaine (0 = Lumenis … 5 = Umbris). */
export function soleniaWeekdayIndex(monthIndex: number, day: number): number {
  return (soleniaDayOfYear(monthIndex, day) - 1) % 6;
}

export function getSoleniaWeekday(date: Date | string | number | null | undefined): string {
  const d = date == null ? undefined : typeof date === 'object' && 'getFullYear' in date
    ? date as Date
    : parseSoleniaDate(date);
  if (!d) return '';
  const month = d.getMonth();
  const day = d.getDate();
  if (month === 0 && day === 1 && d.getHours() === 0 && d.getMinutes() === 0) return '';
  return SOLENIA_WEEKDAYS[soleniaWeekdayIndex(month, day)];
}

export function soleniaDateToParts(
  value: Date | string | number | null | undefined
): SoleniaDateParts | null {
  const d = value == null ? undefined : typeof value === 'object' && 'getFullYear' in value
    ? value as Date
    : parseSoleniaDate(value);
  if (!d) return null;
  const year = d.getFullYear();
  const monthIndex = d.getMonth();
  const day = d.getDate();
  if (monthIndex === 0 && day === 1 && d.getHours() === 0 && d.getMinutes() === 0) {
    return { year, month: null, day: null, isYearOnly: true, isSacredDay: false };
  }
  if (monthIndex === 11 && day >= 26 && day <= 30) {
    return {
      year,
      month: 12,
      day: 30 + (day - 25),
      isYearOnly: false,
      isSacredDay: true,
    };
  }
  return {
    year,
    month: monthIndex + 1,
    day,
    isYearOnly: false,
    isSacredDay: false,
  };
}

export function buildSoleniaDateValue(parts: {
  year: number | string;
  month?: number | string | null;
  day?: number | string | null;
}): number | string | null {
  const year = typeof parts.year === 'string' ? parseInt(parts.year, 10) : parts.year;
  if (!Number.isFinite(year)) return null;
  const monthRaw = parts.month;
  const dayRaw = parts.day;
  if (monthRaw == null || monthRaw === '' || dayRaw == null || dayRaw === '') {
    return year;
  }
  const month = typeof monthRaw === 'string' ? parseInt(monthRaw, 10) : monthRaw;
  const day = typeof dayRaw === 'string' ? parseInt(dayRaw, 10) : dayRaw;
  if (!Number.isFinite(month) || !Number.isFinite(day)) return year;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Normalise une date Solenia pour stockage en base (texte). */
export function normalizeSoleniaDateStorage(
  value: string | number | null | undefined
): string | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return String(value);
  let s = String(value).trim();
  if (/^-?\d{1,5}$/.test(s)) return s;
  const isoPrefix = s.length > 10 && /^-?\d{1,5}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : s;
  const match = isoPrefix.match(/^(-?\d{1,5})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    const y = match[1];
    const m = String(parseInt(match[2], 10)).padStart(2, '0');
    const d = String(parseInt(match[3], 10)).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return s;
}

/** Clé de tri chronologique (année seule = début d’année). */
export function soleniaDateToSortKey(
  value: Date | string | number | null | undefined
): number {
  const d = value == null ? undefined : typeof value === 'object' && 'getFullYear' in value
    ? value as Date
    : parseSoleniaDate(value);
  if (!d) return Number.POSITIVE_INFINITY;
  const year = d.getFullYear();
  const monthIndex = d.getMonth();
  const day = d.getDate();
  if (monthIndex === 0 && day === 1 && d.getHours() === 0 && d.getMinutes() === 0) {
    return year * 1000;
  }
  return year * 1000 + soleniaDayOfYear(monthIndex, day);
}

export function compareSoleniaDates(
  a: Date | string | number | null | undefined,
  b: Date | string | number | null | undefined
): number {
  return soleniaDateToSortKey(a) - soleniaDateToSortKey(b);
}

/** Date lisible avec jour de la semaine (si date complète). */
export function formatSoleniaDateLong(
  date: Date | string | number | null | undefined
): string {
  const formatted = formatSoleniaDate(date);
  if (!formatted) return '';
  const weekday = getSoleniaWeekday(date);
  if (!weekday) return formatted;
  const shortWeekday = weekday.split(' — ')[0];
  return `${shortWeekday}, ${formatted}`;
}
