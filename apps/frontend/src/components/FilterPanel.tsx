import { useMemo, useState } from 'react';
import './Panel.css';

type Kind = 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'unknown';

type Props = {
  active: Set<Kind>;
  onToggle: (kind: Kind) => void;
};

const labels: Record<Kind, string> = {
  kingdom: 'Royaume',
  city: 'Ville',
  district: 'Quartier',
  place: 'Lieu',
  person: 'Personnage',
  unknown: 'Autre',
};

export function FilterPanel({ active, onToggle }: Props) {
  const [open, setOpen] = useState(false);
  const items = useMemo(() => Object.keys(labels) as Kind[], []);

  if (!open) {
    return (
      <div className="filter-inline">
        <button className="ghost" onClick={() => setOpen(true)}>Filtres</button>
      </div>
    );
  }

  return (
    <div className="filter-inline">
      <button className="ghost" onClick={() => setOpen(false)}>Fermer</button>
      <div className="filter-inline-box">
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
    </div>
  );
}

