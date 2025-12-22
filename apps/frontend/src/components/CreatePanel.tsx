import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import type { City, Kingdom, Place } from '../api/entities';
import { createCity, createKingdom, createPerson, createPlace, listCities, listKingdoms, listPlaces } from '../api/entities';
import './Panel.css';

type Kind = 'kingdom' | 'city' | 'place' | 'person';

type Props = {
  onCreated?: () => Promise<void> | void;
};

const defaultStats = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };

export function CreatePanel({ onCreated }: Props) {
  const { token, user } = useAuth();
  const [kind, setKind] = useState<Kind>('kingdom');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [population, setPopulation] = useState<number | ''>('');
  const [kingdomId, setKingdomId] = useState('');
  const [cityId, setCityId] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [membership, setMembership] = useState('');
  const [languages, setLanguages] = useState('');
  const [stats, setStats] = useState(defaultStats);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canSubmit = Boolean(user) && user?.type !== 'viewer';
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    listKingdoms()
      .then(setKingdoms)
      .catch(() => setKingdoms([]));
    listCities()
      .then(setCities)
      .catch(() => setCities([]));
    listPlaces()
      .then(setPlaces)
      .catch(() => setPlaces([]));
  }, []);

  const isValid = useMemo(() => {
    if (!name.trim()) return 'Nom requis';
    if (!token) return 'Authentification requise';
    if (kind === 'person') {
      const values = Object.values(stats);
      if (values.some((v) => Number.isNaN(v))) return 'Stats invalides';
    }
    return null;
  }, [kind, name, stats, token]);

  const reset = () => {
    setName('');
    setDescription('');
    setPopulation('');
    setKingdomId('');
    setCityId('');
    setPlaceId('');
    setMembership('');
    setLanguages('');
    setStats(defaultStats);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const validation = isValid;
    if (validation) {
      setError(validation);
      return;
    }
    if (!token) {
      setError('Authentification requise');
      return;
    }
    try {
      if (kind === 'kingdom') {
        await createKingdom(token, {
          name,
          description: description || undefined,
          population: population === '' ? undefined : Number(population),
        });
      } else if (kind === 'city') {
        await createCity(token, {
          name,
          description: description || undefined,
          kingdomId: kingdomId || undefined,
        });
      } else if (kind === 'place') {
        await createPlace(token, {
          name,
          description: description || undefined,
          kingdomId: kingdomId || undefined,
          cityId: cityId || undefined,
        });
      } else if (kind === 'person') {
        await createPerson(token, {
          name,
          description: description || undefined,
          kingdomId: kingdomId || undefined,
          cityId: cityId || undefined,
          placeId: placeId || undefined,
          membership: membership || undefined,
          languages: languages
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          ...stats,
        });
      }
      setMessage('Créé avec succès.');
      reset();
      await onCreated?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la création';
      setError(msg);
    }
  };

  return (
    <form className="panel glass" onSubmit={onSubmit}>
      <h3>Créer</h3>
      <label>
        Type
        <select value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
          <option value="kingdom">Royaume</option>
          <option value="city">Ville</option>
          <option value="place">Lieu</option>
          <option value="person">Personnage</option>
        </select>
      </label>
      <label>
        Nom
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Description
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      {kind === 'kingdom' && (
        <label>
          Population
          <input
            type="number"
            value={population}
            onChange={(e) => setPopulation(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </label>
      )}
      {(kind === 'city' || kind === 'place' || kind === 'person') && (
        <label>
          Royaume (optionnel)
          <select value={kingdomId} onChange={(e) => setKingdomId(e.target.value)}>
            <option value="">-</option>
            {kingdoms.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name}
              </option>
            ))}
          </select>
        </label>
      )}
      {(kind === 'place' || kind === 'person') && (
        <label>
          Ville (optionnel)
          <select value={cityId} onChange={(e) => setCityId(e.target.value)}>
            <option value="">-</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      )}
      {kind === 'person' && (
        <>
          <label>
            Lieu (optionnel)
            <select value={placeId} onChange={(e) => setPlaceId(e.target.value)}>
              <option value="">-</option>
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
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
                    setStats((prev) => ({ ...prev, [key]: Number(e.target.value) || 0 }))
                  }
                />
              </label>
            ))}
          </div>
        </>
      )}

      {message && <div className="panel-success">{message}</div>}
      {error && <div className="panel-error">{error}</div>}
      <button type="submit" disabled={!canSubmit}>
        Créer
      </button>
      {!canSubmit && <div className="panel-error">Connexion requise (admin/editor)</div>}
    </form>
  );
}

