import type { MapPoint } from '../api/map';
import './Panel.css';

type Props = {
  points: MapPoint[];
  onSelect: (p: MapPoint) => void;
};

export function PointsList({ points, onSelect }: Props) {
  return (
    <div className="panel glass list-panel">
      <h3>Résultats ({points.length})</h3>
      <div className="list-scroll">
        {points.slice(0, 100).map((p) => (
          <button key={p.id} className="list-item" onClick={() => onSelect(p)}>
            <div className="list-name">{p.name}</div>
            <div className="list-kind">{p.kind}</div>
          </button>
        ))}
        {points.length === 0 && <div className="hint">Aucun résultat</div>}
      </div>
    </div>
  );
}

