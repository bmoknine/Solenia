import { useEffect, useState } from 'react';
import { getFlags } from '../../api/entities';

export function FlagSelect({
  value,
  onChange,
  editMode,
}: {
  value: string | null | undefined;
  onChange: (v: string | null) => void;
  editMode: boolean;
}) {
  const [flags, setFlags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (editMode) {
      setLoading(true);
      getFlags()
        .then(setFlags)
        .catch(() => setFlags([]))
        .finally(() => setLoading(false));
    }
  }, [editMode]);
  const current = value ?? '';
  if (!editMode) {
    if (!current) return null;
    return (
      <span className="detail-value">
        {current ? (
          <img src={current} alt="Drapeau" style={{ maxWidth: 200, maxHeight: 120, verticalAlign: 'middle', marginRight: 8 }} />
        ) : null}
        {current.split('/').pop() ?? current}
      </span>
    );
  }
  if (loading) return <span className="detail-value">Chargement...</span>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <select className="detail-input" value={current} onChange={(e) => onChange(e.target.value || null)} style={{ minWidth: 200 }}>
        <option value="">— Aucun drapeau</option>
        {flags.map((path) => (
          <option key={path} value={path}>
            {path.split('/').pop() ?? path}
          </option>
        ))}
      </select>
      {current ? <img src={current} alt="" style={{ maxWidth: 200, maxHeight: 120, objectFit: 'contain' }} /> : null}
    </div>
  );
}
