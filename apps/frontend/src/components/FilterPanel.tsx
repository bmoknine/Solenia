import { useMemo } from 'react';
import './Panel.css';

type Kind = 'kingdom' | 'city' | 'place' | 'person' | 'unknown';

type Props = {
  active: Set<Kind>;
  onToggle: (kind: Kind) => void;
};

const labels: Record<Kind, string> = {
  kingdom: 'Royaume',
  city: 'Ville',
  place: 'Lieu',
  person: 'Personnage',
  unknown: 'Autre',
};

export function FilterPanel({ active, onToggle }: Props) {
  const items = useMemo(() => Object.keys(labels) as Kind[], []);
  return (
    <div className="panel glass">
      <h3>Filtres</h3>
      {items.map((k) => (
        <label key={k} className="row">
          <input
            type="checkbox"
            checked={active.has(k)}
            onChange={() => onToggle(k)}
          />
          {labels[k]}
        </label>
      ))}
    </div>
  );
}

