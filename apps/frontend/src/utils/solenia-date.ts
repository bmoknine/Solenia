/**
 * Affichage des dates selon le calendrier de Solenia.
 * Réexporte le package partagé + helpers UI.
 */
export {
  SOLENIA_WEEKDAYS,
  SOLENIA_MONTHS,
  SOLENIA_SACRED_DAYS,
  formatSoleniaDate,
  formatSoleniaDateLong,
  parseSoleniaDate,
  compareSoleniaDates,
  getSoleniaWeekday,
  soleniaDateToParts,
  buildSoleniaDateValue,
} from '@solenia/shared';

import { parseSoleniaDate } from '@solenia/shared';

/**
 * Retourne une valeur YYYY-MM-DD pour <input type="date"> (API renvoie souvent une chaîne ISO).
 */
export function toDateInputValue(
  date: Date | string | number | null | undefined
): string {
  if (date == null || date === '') return '';
  if (typeof date === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const d = parseSoleniaDate(date);
    if (!d) {
      const parsed = new Date(date);
      return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
    }
    return d.toISOString().slice(0, 10);
  }
  if (typeof date === 'number') {
    const d = parseSoleniaDate(date);
    return d ? d.toISOString().slice(0, 10) : '';
  }
  if (typeof date === 'object' && 'toISOString' in date) {
    return (date as Date).toISOString().slice(0, 10);
  }
  return '';
}
