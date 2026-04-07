import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import type { MapPoint } from '../api/map';
import { getKingdom, getPerson, listOrganisations, type Language, type Organisation, type PersonDetail } from '../api/entities';
import { updateCity, updateKingdom, updatePerson, updatePlace } from '../api/update';
import { LanguageDropdown } from './detail-modal/LanguageDropdown';
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
  const [organisationIds, setOrganisationIds] = useState<string[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
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
          const [p, orgs] = await Promise.all([getPerson(point.targetId), listOrganisations()]);
          if (!mounted) return;
          const pd = p as PersonDetail;
          setOrganisations(orgs);
          setOrganisationIds(pd.organisations?.map((o) => o.id) ?? []);
          setSelectedLanguages(pd.languages ?? []);
          setStats({
            STR: pd.STR,
            DEX: pd.DEX,
            CON: pd.CON,
            INT: pd.INT,
            WIS: pd.WIS,
            CHA: pd.CHA,
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
          organisationIds,
          languages: selectedLanguages,
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
            Organisations
            <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {organisations.map((org) => {
                const checked = organisationIds.includes(org.id);
                return (
                  <label key={org.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setOrganisationIds((prev) =>
                          checked ? prev.filter((id) => id !== org.id) : [...prev, org.id],
                        );
                      }}
                    />
                    {org.name}
                  </label>
                );
              })}
            </div>
          </label>
          <label>
            Langues
            <LanguageDropdown selectedLanguages={selectedLanguages} onLanguagesChange={setSelectedLanguages} />
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

