import {
  SOLENIA_MONTHS,
  SOLENIA_SACRED_DAYS,
  buildSoleniaDateValue,
  getSoleniaWeekday,
  soleniaDateToParts,
} from '@solenia/shared';

type SoleniaDateInputProps = {
  value: string | number | null | undefined;
  onChange: (value: string | number | null) => void;
  className?: string;
};

const MONTH_OPTIONS = SOLENIA_MONTHS.map((name, index) => ({ value: index + 1, name }));

function regularDayOptions() {
  return Array.from({ length: 30 }, (_, index) => index + 1);
}

function sacredDayOptions() {
  return SOLENIA_SACRED_DAYS.map((name, index) => ({
    value: 31 + index,
    name,
  }));
}

/** Saisie d’une date du calendrier Solenia (année seule ou date complète). */
export function SoleniaDateInput({ value, onChange, className }: SoleniaDateInputProps) {
  const parts = soleniaDateToParts(value);
  const year = parts?.year ?? '';
  const month = parts?.month ?? '';
  const day = parts?.day ?? '';
  const weekday = getSoleniaWeekday(value);

  const emit = (next: { year: number | string; month?: number | string | null; day?: number | string | null }) => {
    const built = buildSoleniaDateValue(next);
    onChange(built);
  };

  const dayOptions =
    month === 12
      ? sacredDayOptions()
      : regularDayOptions().map((d) => ({ value: d, name: String(d) }));

  return (
    <div className={className ? `solenia-date-input ${className}` : 'solenia-date-input'}>
      <div className="solenia-date-input-row">
        <label className="solenia-date-field">
          <span className="detail-hint">Année</span>
          <input
            className="detail-input"
            type="number"
            value={year}
            placeholder="ex: 859"
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === '') {
                onChange(null);
                return;
              }
              emit({ year: raw, month, day });
            }}
          />
        </label>
        <label className="solenia-date-field">
          <span className="detail-hint">Mois</span>
          <select
            className="detail-input"
            value={month === '' ? '' : String(month)}
            disabled={year === ''}
            onChange={(e) => {
              const nextMonth = e.target.value === '' ? null : Number(e.target.value);
              emit({ year, month: nextMonth, day: nextMonth ? day || 1 : null });
            }}
          >
            <option value="">—</option>
            {MONTH_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
        <label className="solenia-date-field">
          <span className="detail-hint">Jour</span>
          <select
            className="detail-input"
            value={day === '' ? '' : String(day)}
            disabled={year === '' || month === ''}
            onChange={(e) => {
              const nextDay = e.target.value === '' ? null : Number(e.target.value);
              emit({ year, month, day: nextDay });
            }}
          >
            <option value="">—</option>
            {dayOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {weekday ? (
        <span className="detail-hint solenia-date-weekday">{weekday}</span>
      ) : year !== '' && month === '' ? (
        <span className="detail-hint solenia-date-weekday">Année seule (sans mois ni jour)</span>
      ) : null}
    </div>
  );
}
