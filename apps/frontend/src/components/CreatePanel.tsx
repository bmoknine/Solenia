import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../auth/AuthProvider';
import type { City, Kingdom, Place, Breed, Sex, Membership, Language } from '../api/entities';
import { createCity, createKingdom, createPerson, createPlace, listCities, listKingdoms, listPlaces, updatePosition } from '../api/entities';
import { BREED_OPTIONS, MEMBERSHIP_OPTIONS, SEX_OPTIONS } from './detail-modal/entityOptions';
import { formatBreed, formatMembership, formatSex } from './detail-modal/entityFormatters';
import { LanguageDropdown } from './detail-modal/LanguageDropdown';
import './Panel.css';

type Kind = 'kingdom' | 'city' | 'place' | 'person';

type Props = {
  initialPosition?: { x: number; y: number };
  onCreated?: () => Promise<void> | void;
  onCancel?: () => void;
};

const defaultStats = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };

export function CreatePanel({ initialPosition, onCreated, onCancel }: Props) {
  const { token, user } = useAuth();
  const [kind, setKind] = useState<Kind>('kingdom');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [population, setPopulation] = useState<number | ''>('');
  const [kingdomId, setKingdomId] = useState('');
  const [cityId, setCityId] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [breed, setBreed] = useState<Breed | ''>('');
  const [sex, setSex] = useState<Sex | ''>('');
  const [membership, setMembership] = useState<Membership | ''>('');
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
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
    setIconUrl('');
    setPopulation('');
    setKingdomId('');
    setCityId('');
    setPlaceId('');
    setBreed('');
    setSex('');
    setMembership('');
    setSelectedLanguages([]);
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
      let createdId: string | undefined;
      
      if (kind === 'kingdom') {
        const result = await createKingdom(token, {
          name,
          description: description || undefined,
          population: population === '' ? undefined : Number(population),
        });
        createdId = result.id;
      } else if (kind === 'city') {
        const result = await createCity(token, {
          name,
          description: description || undefined,
          iconUrl: iconUrl || undefined,
          kingdomId: kingdomId || undefined,
        });
        createdId = result.id;
      } else if (kind === 'place') {
        const result = await createPlace(token, {
          name,
          description: description || undefined,
          // iconUrl sera défini automatiquement par le backend avec la valeur par défaut
          kingdomId: kingdomId || undefined,
          cityId: cityId || undefined,
        });
        createdId = result.id;
      } else if (kind === 'person') {
        const result = await createPerson(token, {
          name,
          description: description || undefined,
          breed: breed || undefined,
          sex: sex || undefined,
          kingdomId: kingdomId || undefined,
          cityId: cityId || undefined,
          placeId: placeId || undefined,
          membership: membership || undefined,
          languages: selectedLanguages,
          ...stats,
        });
        createdId = result.id;
      }
      
      // Si une position initiale a été fournie, créer la position
      if (initialPosition && createdId) {
        const payload =
          kind === 'kingdom'
            ? { x: initialPosition.x, y: initialPosition.y, kingdomId: createdId }
            : kind === 'city'
            ? { x: initialPosition.x, y: initialPosition.y, cityId: createdId }
            : kind === 'place'
            ? { x: initialPosition.x, y: initialPosition.y, placeId: createdId }
            : { x: initialPosition.x, y: initialPosition.y, personOfInterestId: createdId };
        
        await updatePosition(token, payload);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0 }}>Créer</h3>
        {onCancel && (
          <button type="button" className="ghost" onClick={onCancel} style={{ padding: '4px 8px', fontSize: '0.875rem' }}>
            ×
          </button>
        )}
      </div>
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
      {kind === 'city' && (
        <label>
          Icône
          <select value={iconUrl} onChange={(e) => setIconUrl(e.target.value)}>
            <option value="">Aucune icône</option>
            <option value="/Icon/capital.png">Capital</option>
            <option value="/Icon/city.png">Cité</option>
            <option value="/Icon/village.png">Village</option>
            <option value="/Icon/fortified-city.png">Ville Fortifiée</option>
          </select>
        </label>
      )}
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
            Race
            <select value={breed} onChange={(e) => setBreed(e.target.value as Breed | '')}>
              <option value="">Non spécifié</option>
              {BREED_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {formatBreed(opt)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sexe
            <select value={sex} onChange={(e) => setSex(e.target.value as Sex | '')}>
              <option value="">Non spécifié</option>
              {SEX_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {formatSex(opt)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Affiliation
            <select value={membership} onChange={(e) => setMembership(e.target.value as Membership | '')}>
              <option value="">Aucune affiliation</option>
              {MEMBERSHIP_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {formatMembership(opt)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Langues
            <LanguageDropdown
              selectedLanguages={selectedLanguages}
              onLanguagesChange={setSelectedLanguages}
            />
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

