import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import type { MapPoint } from '../api/map';
import { getKingdom, getPerson } from '../api/entities';
import type { Person } from '../api/entities';
import { updateCity, updateKingdom, updatePerson, updatePlace } from '../api/update';
import './Panel.css';

type Props = {
  point: MapPoint | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
};

export function EditDrawer({ point, onClose, onSaved }: Props) {
  const { token, user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [population, setPopulation] = useState<number | ''>('');
  const [dateInGame, setDateInGame] = useState('');
  const [membership, setMembership] = useState('');
  const [languages, setLanguages] = useState('');
  const [stats, setStats] = useState({ STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canEdit = !!user && user.type !== 'viewer';

  useEffect(() => {
    if (!point) return;
    let mounted = true;
    setTimeout(() => {
      if (!mounted) return;
      setLoading(true);
      setMessage(null);
      setError(null);
    }, 0);
    const base = () => {
      setName(point.name);
      setDescription(point.description ?? '');
    };
    const load = async () => {
      base();
      if (point.kind === 'kingdom' && point.targetId) {
        try {
          const k = await getKingdom(point.targetId);
          if (!mounted) return;
          setPopulation(k.population ?? '');
          setDateInGame(k.dateInGame ?? '');
        } catch {
          /* ignore */
        }
      } else if (point.kind === 'person' && point.targetId) {
        try {
          const p: Person = await getPerson(point.targetId);
          if (!mounted) return;
          setMembership(p.membership ?? '');
          setLanguages(p.languages?.join(', ') ?? '');
          setStats({
            STR: p.STR,
            DEX: p.DEX,
            CON: p.CON,
            INT: p.INT,
            WIS: p.WIS,
            CHA: p.CHA,
          });
        } catch {
          /* ignore */
        }
      }
    };
    load()
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [point]);

  if (!point) return null;

  const disabled = !canEdit || !token;

  const onSubmit = async () => {
    if (!token) {
      setError('Authentification requise');
      return;
    }
    setMessage(null);
    setError(null);
    try {
      if (point.kind === 'kingdom' && point.targetId) {
        await updateKingdom(token, point.targetId, {
          name,
          description: description || undefined,
          population: population === '' ? undefined : Number(population),
          dateInGame: dateInGame || undefined,
        });
      } else if (point.kind === 'city' && point.targetId) {
        await updateCity(token, point.targetId, { name, description: description || undefined });
      } else if (point.kind === 'place' && point.targetId) {
        await updatePlace(token, point.targetId, { name, description: description || undefined });
      } else if (point.kind === 'person' && point.targetId) {
        await updatePerson(token, point.targetId, {
          name,
          description: description || undefined,
          membership: membership || undefined,
          languages: languages
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          ...stats,
        });
      }
      setMessage('Enregistré.');
      await onSaved();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur';
      setError(msg);
    }
  };

  return (
    <div className="drawer glass">
      <div className="drawer-header">
        <div>
          <div className="hint">{point.kind}</div>
          <div className="drawer-title">{point.name}</div>
        </div>
        <button className="ghost" onClick={onClose}>
          Fermer
        </button>
      </div>
      <label>
        Nom
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Description
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      {point.kind === 'kingdom' && (
        <>
          <label>
            Population
            <input
              type="number"
              value={population}
              onChange={(e) => setPopulation(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </label>
          <label>
            Date in game
            <input value={dateInGame} onChange={(e) => setDateInGame(e.target.value)} placeholder="YYYY-MM-DD" />
          </label>
        </>
      )}
      {point.kind === 'person' && (
        <>
          <label>
            Membership
            <input value={membership} onChange={(e) => setMembership(e.target.value)} />
          </label>
          <label>
            Langues (séparées par virgule)
            <input value={languages} onChange={(e) => setLanguages(e.target.value)} />
          </label>
          <div className="stats-grid">
            {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const).map((key) => (
              <label key={key}>
                {key}
                <input
                  type="number"
                  value={stats[key]}
                  onChange={(e) =>
                    setStats((prev) => ({
                      ...prev,
                      [key]: Number(e.target.value) || 0,
                    }))
                  }
                />
              </label>
            ))}
          </div>
        </>
      )}
      {message && <div className="panel-success">{message}</div>}
      {error && <div className="panel-error">{error}</div>}
      <button onClick={onSubmit} disabled={disabled || loading}>
        {loading ? '...' : 'Sauvegarder'}
      </button>
      {!canEdit && <div className="panel-error">Connexion admin/editor requise</div>}
    </div>
  );
}

