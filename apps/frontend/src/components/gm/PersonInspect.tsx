import { useState, type ReactNode } from 'react';
import DOMPurify from 'dompurify';
import { getPerson, type Person } from '../../api/entities';

const ABILITIES: { key: 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'; label: string }[] = [
  { key: 'STR', label: 'FOR' },
  { key: 'DEX', label: 'DEX' },
  { key: 'CON', label: 'CON' },
  { key: 'INT', label: 'INT' },
  { key: 'WIS', label: 'SAG' },
  { key: 'CHA', label: 'CHA' },
];

const fmtMod = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

export type InspectState = { loading: boolean; person: Person | null } | null;

/** État + chargement d'une fiche PNJ à inspecter (résumé stats/attaques/sauvegardes). */
export function usePersonInspect(onError?: (e: unknown) => void) {
  const [inspect, setInspect] = useState<InspectState>(null);
  const inspectPerson = async (personId: string) => {
    setInspect({ loading: true, person: null });
    try {
      setInspect({ loading: false, person: await getPerson(personId) });
    } catch (e) {
      setInspect(null);
      onError?.(e);
    }
  };
  return { inspect, inspectPerson, closeInspect: () => setInspect(null) };
}

/** Fenêtre modale d'une fiche PNJ. */
export function PersonInspectModal({ inspect, onClose }: { inspect: InspectState; onClose: () => void }) {
  if (!inspect) return null;
  return (
    <div className="combat-inspect-overlay" onClick={onClose}>
      <div className="combat-inspect glass" onClick={(e) => e.stopPropagation()}>
        <button className="ghost combat-inspect-close" onClick={onClose}>×</button>
        {inspect.loading && <div className="gm-hint">Chargement…</div>}
        {!inspect.loading && inspect.person && (
          <>
            <h4 className="combat-inspect-title">{inspect.person.name}</h4>
            <div className="combat-inspect-line">
              {inspect.person.fp && <span>FP {inspect.person.fp}</span>}
              {inspect.person.ca != null && <span>CA {inspect.person.ca}</span>}
              {inspect.person.pv != null && <span>{inspect.person.pv} PV</span>}
            </div>
            <div className="combat-inspect-abilities">
              {ABILITIES.map(({ key, label }) => {
                const score = inspect.person![key];
                return (
                  <div key={key} className="combat-ability">
                    <span className="combat-ability-label">{label}</span>
                    <span className="combat-ability-score">{score}</span>
                    <span className="combat-ability-mod">{fmtMod(Math.floor((score - 10) / 2))}</span>
                  </div>
                );
              })}
            </div>
            {inspect.person.description && (
              <div
                className="combat-inspect-desc"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(inspect.person.description) }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Mise en lien des noms de PNJ dans un texte ──────────────────────────────

export type PersonMatcher = { regex: RegExp | null; byLabel: Map<string, string> };

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Construit un index de correspondance nom → id à partir de la liste des PNJ. */
export function buildPersonMatcher(persons: { id: string; name: string }[]): PersonMatcher {
  const byLabel = new Map<string, string>();
  for (const p of persons) {
    // Label principal : nom avant un « — », un guillemet ou une parenthèse (ex. "Drogan Kharvek — Le Porte-Faille" → "Drogan Kharvek")
    const label = p.name.split(/\s+—\s+| «| \(/)[0].trim();
    if (label.length >= 3 && !byLabel.has(label)) byLabel.set(label, p.id);
    if (p.name.length >= 3 && !byLabel.has(p.name)) byLabel.set(p.name, p.id);
  }
  const labels = [...byLabel.keys()].sort((a, b) => b.length - a.length).map(escapeRegex);
  if (labels.length === 0) return { regex: null, byLabel };
  const regex = new RegExp('(?<![\\p{L}])(' + labels.join('|') + ')(?![\\p{L}])', 'gu');
  return { regex, byLabel };
}

/** Rend un texte en remplaçant les noms de PNJ connus par des boutons cliquables. */
export function linkifyPersons(text: string, matcher: PersonMatcher, onClick: (id: string) => void): ReactNode[] {
  if (!text || !matcher.regex) return [text];
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  matcher.regex.lastIndex = 0;
  while ((m = matcher.regex.exec(text)) !== null) {
    const label = m[0];
    const id = matcher.byLabel.get(label);
    if (m.index > last) out.push(text.slice(last, m.index));
    if (id) {
      out.push(
        <button key={`${m.index}-${id}`} type="button" className="person-link" onClick={() => onClick(id)}>
          {label}
        </button>,
      );
    } else {
      out.push(label);
    }
    last = m.index + label.length;
    if (matcher.regex.lastIndex === m.index) matcher.regex.lastIndex++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
