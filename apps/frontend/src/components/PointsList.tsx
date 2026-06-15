import type { GlobalSearchResult } from '../search/types';
import './Panel.css';
import './PointsList.css';

type Props = {
  points: GlobalSearchResult[];
  onSelect: (p: GlobalSearchResult) => void;
  loading?: boolean;
  query?: string;
};

const kindLabels: Record<string, string> = {
  kingdom: 'Royaume',
  city: 'Ville',
  district: 'Quartier',
  place: 'Lieu',
  person: 'Personnage',
  organisation: 'Organisation',
  playerCharacter: 'PJ',
  lore: 'Lore',
  unknown: 'Autre',
};

function HighlightedSnippet({ text, query }: { text: string; query: string }) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="search-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

export function PointsList({ points, onSelect, loading, query = '' }: Props) {
  return (
    <div className="panel glass list-panel">
      <h3>Résultats ({points.length})</h3>
      <div className="list-scroll">
        {loading && <div className="hint">Chargement du catalogue…</div>}
        {!loading &&
          points.slice(0, 100).map((p) => (
            <button key={p.id} className="list-item list-item--rich" onClick={() => onSelect(p)}>
              <div className="list-item-top">
                <div className="list-name">{p.name}</div>
                <div className="list-kind">{kindLabels[p.kind] || p.kind}</div>
              </div>
              {p.snippet && (
                <div className="list-snippet">
                  <HighlightedSnippet text={p.snippet} query={query} />
                </div>
              )}
            </button>
          ))}
        {!loading && points.length === 0 && <div className="hint">Aucun résultat</div>}
      </div>
    </div>
  );
}
