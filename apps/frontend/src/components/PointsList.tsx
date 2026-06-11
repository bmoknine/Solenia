import type { GlobalSearchResult } from '../search/types';
import './Panel.css';

type Props = {
  points: GlobalSearchResult[];
  onSelect: (p: GlobalSearchResult) => void;
  loading?: boolean;
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

export function PointsList({ points, onSelect, loading }: Props) {
  return (
    <div className="panel glass list-panel">
      <h3>Résultats ({points.length})</h3>
      <div className="list-scroll">
        {loading && <div className="hint">Chargement du catalogue…</div>}
        {!loading &&
          points.slice(0, 100).map((p) => (
            <button key={p.id} className="list-item" onClick={() => onSelect(p)}>
              <div className="list-name">{p.name}</div>
              <div className="list-kind">{kindLabels[p.kind] || p.kind}</div>
            </button>
          ))}
        {!loading && points.length === 0 && <div className="hint">Aucun résultat</div>}
      </div>
    </div>
  );
}
