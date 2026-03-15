import type { MapPoint } from '../api/map';
import './Panel.css';

type OrganisationSearchResult = {
  id: string;
  x: number;
  y: number;
  kind: 'organisation';
  targetId: string;
  name: string;
  description: string | null;
};

type SearchResult = MapPoint | OrganisationSearchResult;

type Props = {
  points: SearchResult[];
  onSelect: (p: SearchResult) => void;
};

const kindLabels: Record<string, string> = {
  kingdom: 'Royaume',
  city: 'Ville',
  district: 'Quartier',
  place: 'Lieu',
  person: 'Personnage',
  organisation: 'Organisation',
  unknown: 'Autre',
};

export function PointsList({ points, onSelect }: Props) {
  return (
    <div className="panel glass list-panel">
      <h3>Résultats ({points.length})</h3>
      <div className="list-scroll">
        {points.slice(0, 100).map((p) => (
          <button key={p.id} className="list-item" onClick={() => onSelect(p)}>
            <div className="list-name">{p.name}</div>
            <div className="list-kind">{kindLabels[p.kind] || p.kind}</div>
          </button>
        ))}
        {points.length === 0 && <div className="hint">Aucun résultat</div>}
      </div>
    </div>
  );
}

