import { useEffect, useState, useRef } from 'react';
import type { MapPoint } from '../api/map';
import {
  getKingdom,
  getCity,
  getPlace,
  getPerson,
  updateKingdom,
  updateCity,
  updatePlace,
  updatePerson,
  createKingdom,
  createCity,
  createPlace,
  createPerson,
  updatePosition,
  listKingdoms,
  listCities,
  listPlaces,
  type KingdomDetail,
  type CityDetail,
  type PlaceDetail,
  type PersonDetail,
  type Kingdom,
  type City,
  type Place,
} from '../api/entities';
import { useToast } from '../toast/ToastProvider';
import type { Breed, Sex, Membership, Language } from '../api/entities';
import './DetailModal.css';

// Options pour les enums
const BREED_OPTIONS: Breed[] = [
  'ELFE',
  'HALFELIN',
  'HUMAIN',
  'NAIN',
  'DEMI_ELFE',
  'DEMI_ORC',
  'DRAKEIDE',
  'GNOME',
  'TIEFFELIN',
  'AASIMAR',
  'GENASIAIR',
  'GENASITERRE',
  'GENASIFEUR',
  'GENASIEAU',
  'GOLIATH',
  'OTHER',
];

const SEX_OPTIONS: Sex[] = ['MAN', 'WOMAN', 'OTHER'];

const MEMBERSHIP_OPTIONS: Membership[] = [
  'POLITIC',
  'RELIGEUX',
  'MARCHAND',
  'CCCH',
  'CRIMINALITE',
  'OTHER',
];

const LANGUAGE_OPTIONS: Language[] = [
  'COMMUN',
  'NAIN',
  'ELFIQUE',
  'GNOME',
  'HALFELIN',
  'ORC',
  'GOBELIN',
  'GEANT',
  'DRACONIQUE',
  'SYLVESTRE',
  'INFERNAL',
  'ABYSSAL',
  'CELESTE',
  'PRIMORDIAL',
  'AQUAN',
  'AURAN',
  'IGNAN',
  'TERRAN',
  'PROFOND',
  'SLAADI',
  'TELEPATHIQUE',
  'ARGOT_VOLEUR',
];

// Fonctions de formatage pour l'affichage
const formatBreed = (breed: Breed | null | undefined): string => {
  if (!breed) return '-';
  return breed.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
};

const formatSex = (sex: Sex | null | undefined): string => {
  if (!sex) return '-';
  const map: Record<Sex, string> = {
    MAN: 'Homme',
    WOMAN: 'Femme',
    OTHER: 'Autre',
  };
  return map[sex] || sex;
};

const formatMembership = (membership: Membership | null | undefined): string => {
  if (!membership) return '-';
  const map: Record<Membership, string> = {
    POLITIC: 'Politique',
    RELIGEUX: 'Religieux',
    MARCHAND: 'Marchand',
    CCCH: 'CCCH',
    CRIMINALITE: 'Criminalité',
    OTHER: 'Autre',
  };
  return map[membership] || membership;
};

const formatLanguage = (lang: Language): string => {
  const map: Record<Language, string> = {
    COMMUN: 'Commun',
    NAIN: 'Nain',
    ELFIQUE: 'Elfique',
    GNOME: 'Gnome',
    HALFELIN: 'Halfelin',
    ORC: 'Orc',
    GOBELIN: 'Gobelin',
    GEANT: 'Géant',
    DRACONIQUE: 'Draconique',
    SYLVESTRE: 'Sylvestre',
    INFERNAL: 'Infernal',
    ABYSSAL: 'Abyssal',
    CELESTE: 'Céleste',
    PRIMORDIAL: 'Primordial',
    AQUAN: 'Aquan',
    AURAN: 'Auran',
    IGNAN: 'Ignan',
    TERRAN: 'Terran',
    PROFOND: 'Profond',
    SLAADI: 'Slaadi',
    TELEPATHIQUE: 'Télépathique',
    ARGOT_VOLEUR: "Argot des Voleurs",
  };
  return map[lang] || lang;
};

// Composant de recherche pour sélectionner une entité
function SearchableSelect<T extends { id: string; name: string }>({
  items,
  selectedId,
  onSelect,
  placeholder,
}: {
  items: T[];
  selectedId: string | null | undefined;
  onSelect: (id: string | null) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedItem = items.find((item) => item.id === selectedId);
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayText = selectedItem ? selectedItem.name : (selectedId === null ? '—' : placeholder);

  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="language-dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayText}</span>
        <span className="language-dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="language-dropdown-menu">
          <input
            type="text"
            className="detail-input"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            style={{ marginBottom: '8px' }}
          />
          <button
            type="button"
            className="language-checkbox"
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
              setSearch('');
            }}
            style={{ 
              justifyContent: 'center',
              backgroundColor: selectedId === null ? 'rgba(99, 102, 241, 0.2)' : undefined,
            }}
          >
            <span>— (Aucun)</span>
          </button>
          {filteredItems.length === 0 ? (
            <div className="language-checkbox" style={{ justifyContent: 'center' }}>
              <span style={{ color: '#94a3b8' }}>Aucun résultat</span>
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="language-checkbox"
                onClick={() => {
                  onSelect(item.id);
                  setIsOpen(false);
                  setSearch('');
                }}
                style={{
                  backgroundColor: item.id === selectedId ? 'rgba(99, 102, 241, 0.2)' : undefined,
                }}
              >
                <span>{item.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Composant dropdown pour les langues
function LanguageDropdown({
  selectedLanguages,
  onLanguagesChange,
}: {
  selectedLanguages: string[];
  onLanguagesChange: (languages: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleLanguage = (lang: Language) => {
    if (selectedLanguages.includes(lang)) {
      onLanguagesChange(selectedLanguages.filter((l) => l !== lang));
    } else {
      onLanguagesChange([...selectedLanguages, lang]);
    }
  };

  const displayText = selectedLanguages.length > 0 
    ? `${selectedLanguages.length} langue(s) sélectionnée(s)` 
    : 'Sélectionner des langues';

  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="language-dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayText}</span>
        <span className="language-dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="language-dropdown-menu">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = selectedLanguages.includes(lang);
            return (
              <label key={lang} className="language-checkbox">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleLanguage(lang)}
                />
                <span>{formatLanguage(lang)}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

type DetailModalProps = {
  point: MapPoint | null;
  onClose: () => void;
  token?: string | null;
  onUpdated?: () => void;
  onDelete?: (point: MapPoint) => void;
  onNavigate?: (point: MapPoint) => void;
  // Mode création
  createMode?: {
    kind: MapPoint['kind'];
    initialPosition: { x: number; y: number };
  };
};

type EntityData = KingdomDetail | CityDetail | PlaceDetail | PersonDetail | null;

type PersonEditState = Partial<PersonDetail> & { 
  kind: 'person';
  kingdomId?: string | null;
  cityId?: string | null;
  placeId?: string | null;
};

type EditState =
  | (Partial<KingdomDetail> & { kind: 'kingdom' })
  | (Partial<CityDetail> & { kind: 'city' })
  | (Partial<PlaceDetail> & { kind: 'place' })
  | PersonEditState
  | null;

export default function DetailModal({ point, onClose, token, onUpdated, onDelete, onNavigate, createMode }: DetailModalProps) {
  const [data, setData] = useState<EntityData>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(!!createMode); // Mode édition par défaut en mode création
  const [saving, setSaving] = useState(false);
  
  const [editState, setEditState] = useState<EditState>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { push } = useToast();

  // Désactiver le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (point || createMode) {
      // Sauvegarder la position de scroll actuelle
      const scrollY = window.scrollY;
      // Désactiver le scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Réactiver le scroll quand la modal se ferme
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [point, createMode]);

  // Initialiser le mode création
  useEffect(() => {
    if (createMode) {
      console.log('Initialisation du mode création, kind:', createMode.kind);
      setData(null);
      setEditMode(true);
      setLoading(false);
      setError(null);
      // Initialiser editState avec le kind et des valeurs par défaut
      const defaultState: EditState = createMode.kind === 'kingdom'
        ? { kind: 'kingdom', name: '', description: null, population: null, dateInGame: null }
        : createMode.kind === 'city'
        ? { kind: 'city', name: '', description: null, iconUrl: null, kingdomId: null }
        : createMode.kind === 'place'
        ? { kind: 'place', name: '', description: null, kingdomId: null, cityId: null }
        : {
            kind: 'person',
            name: '',
            description: null,
            breed: null,
            sex: null,
            membership: null,
            languages: [],
            kingdomId: null,
            cityId: null,
            placeId: null,
            STR: 10,
            DEX: 10,
            CON: 10,
            INT: 10,
            WIS: 10,
            CHA: 10,
          };
      console.log('editState initialisé:', defaultState);
      setEditState(defaultState);
    } else if (!point) {
      // Réinitialiser editState quand on sort du mode création et qu'il n'y a pas de point
      setEditState(null);
    }
  }, [createMode, point]);

  useEffect(() => {
    // Ne pas charger les données si on est en mode création
    if (createMode) return;
    
    if (!point || !point.targetId) {
      setData(null);
      setEditMode(false);
      setEditState(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let result: EntityData = null;
        switch (point.kind) {
          case 'kingdom':
            result = await getKingdom(point.targetId!);
            break;
          case 'city':
            result = await getCity(point.targetId!);
            break;
          case 'place':
            result = await getPlace(point.targetId!);
            break;
          case 'person':
            result = await getPerson(point.targetId!);
            break;
        }
        setData(result);
        const initialState = result
          ? (point.kind === 'person'
              ? ({
                  kind: 'person' as const,
                  ...result,
                  kingdomId: (result as PersonDetail).kingdom?.id ?? null,
                  cityId: (result as PersonDetail).city?.id ?? null,
                  placeId: (result as PersonDetail).place?.id ?? null,
                } as PersonEditState)
              : point.kind === 'kingdom'
              ? ({
                  kind: 'kingdom' as const,
                  ...result,
                } as EditState)
              : point.kind === 'city'
              ? ({
                  kind: 'city' as const,
                  ...result,
                  kingdomId: (result as CityDetail).kingdom?.id ?? null,
                } as EditState)
              : ({
                  kind: 'place' as const,
                  ...result,
                  kingdomId: (result as PlaceDetail).kingdom?.id ?? null,
                  cityId: (result as PlaceDetail).city?.id ?? null,
                } as EditState))
          : null;
        console.log('Frontend - Initial editState:', JSON.stringify(initialState, null, 2));
        setEditState(initialState as EditState);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [point, createMode]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const valueOrDash = (v: unknown): string | number =>
    v === null || v === undefined || v === '' ? '—' : (v as string | number);

  const handleSave = async () => {
    if (!token || !editState) return;
    if (!createMode && (!point || !point.targetId)) return;
    
    setSaving(true);
    setError(null);
    try {
      const kind = createMode ? createMode.kind : point!.kind;
      
      // Mode création
      if (createMode) {
        let createdEntity;
        switch (kind) {
          case 'kingdom': {
            const kingdomState = editState as KingdomDetail;
            createdEntity = await createKingdom(token, {
              name: kingdomState.name ?? '',
              description: kingdomState.description ?? null,
              population:
                kingdomState.population !== undefined && kingdomState.population !== null
                  ? Number(kingdomState.population)
                  : undefined,
              dateInGame: kingdomState.dateInGame ?? undefined,
            });
            break;
          }
          case 'city': {
            const cityState = editState as CityDetail;
            createdEntity = await createCity(token, {
              name: cityState.name ?? '',
              description: cityState.description ?? null,
              iconUrl: cityState.iconUrl ?? undefined,
              kingdomId: cityState.kingdomId ?? undefined,
            });
            break;
          }
          case 'place': {
            const placeState = editState as PlaceDetail;
            createdEntity = await createPlace(token, {
              name: placeState.name ?? '',
              description: placeState.description ?? null,
              kingdomId: placeState.kingdomId ?? undefined,
              cityId: placeState.cityId ?? undefined,
            });
            break;
          }
          case 'person': {
            const personState = editState as PersonDetail;
            createdEntity = await createPerson(token, {
              name: personState.name ?? '',
              description: personState.description ?? null,
              breed: personState.breed ?? undefined,
              sex: personState.sex ?? undefined,
              membership: personState.membership ?? undefined,
              languages: personState.languages ?? [],
              kingdomId: (personState as PersonEditState).kingdomId ?? undefined,
              cityId: (personState as PersonEditState).cityId ?? undefined,
              placeId: (personState as PersonEditState).placeId ?? undefined,
              STR: personState.STR,
              DEX: personState.DEX,
              CON: personState.CON,
              INT: personState.INT,
              WIS: personState.WIS,
              CHA: personState.CHA,
            });
            break;
          }
        }
        
        // Créer la position si une position initiale a été fournie
        if (createdEntity && createMode.initialPosition) {
          const positionPayload =
            kind === 'kingdom'
              ? { x: createMode.initialPosition.x, y: createMode.initialPosition.y, kingdomId: createdEntity.id }
              : kind === 'city'
              ? { x: createMode.initialPosition.x, y: createMode.initialPosition.y, cityId: createdEntity.id }
              : kind === 'place'
              ? { x: createMode.initialPosition.x, y: createMode.initialPosition.y, placeId: createdEntity.id }
              : { x: createMode.initialPosition.x, y: createMode.initialPosition.y, personOfInterestId: createdEntity.id };
          
          await updatePosition(token, positionPayload);
        }
        
        push('Créé avec succès', 'success');
        if (onUpdated) await onUpdated();
        onClose();
        return;
      }
      
      // Mode édition
      if (!point || !point.targetId) return;
      switch (point.kind) {
        case 'kingdom': {
          const kingdomState = editState as KingdomDetail;
          await updateKingdom(token, point.targetId, {
            name: kingdomState.name ?? '',
            description: kingdomState.description ?? null,
            population:
              kingdomState.population !== undefined && kingdomState.population !== null
                ? Number(kingdomState.population)
                : null,
            dateInGame: kingdomState.dateInGame ?? null,
          });
          break;
        }
        case 'city': {
          const cityIconUrl = (editState as CityDetail).iconUrl;
          console.log('Frontend - iconUrl avant envoi:', cityIconUrl);
          const payload = {
            name: editState.name ?? '',
            description: editState.description ?? null,
            iconUrl: cityIconUrl === '' || cityIconUrl === undefined ? null : cityIconUrl,
            kingdomId: (editState as CityDetail).kingdomId ?? null,
          };
          console.log('Frontend - payload complet:', payload);
          await updateCity(token, point.targetId, payload);
          break;
        }
        case 'place':
          await updatePlace(token, point.targetId, {
            name: editState.name ?? '',
            description: editState.description ?? null,
            // iconUrl n'est pas modifiable, on ne l'envoie pas
            kingdomId: (editState as PlaceDetail).kingdomId ?? null,
            cityId: (editState as PlaceDetail).cityId ?? null,
          });
          break;
        case 'person': {
          const personState = editState as PersonDetail;
          console.log('Frontend - personState complet:', JSON.stringify(personState, null, 2));
          const payload = {
            name: personState.name ?? '',
            description: personState.description ?? null,
            breed: personState.breed ?? null,
            sex: personState.sex ?? null,
            membership: personState.membership ?? null,
            languages: personState.languages ?? [],
            kingdomId: (personState as PersonEditState).kingdomId ?? null,
            cityId: (personState as PersonEditState).cityId ?? null,
            placeId: (personState as PersonEditState).placeId ?? null,
            STR: personState.STR,
            DEX: personState.DEX,
            CON: personState.CON,
            INT: personState.INT,
            WIS: personState.WIS,
            CHA: personState.CHA,
          };
          console.log('Frontend - Payload avant envoi:', JSON.stringify(payload, null, 2));
          console.log('Frontend - breed:', payload.breed, 'sex:', payload.sex);
          await updatePerson(token, point.targetId, payload);
          break;
        }
      }
      push('Enregistré', 'success');
      setEditMode(false);
      if (onUpdated) await onUpdated();
      // refetch to display updated data
      if (point) {
        const refreshed = await (point.kind === 'kingdom'
          ? getKingdom(point.targetId!)
          : point.kind === 'city'
          ? getCity(point.targetId!)
          : point.kind === 'place'
          ? getPlace(point.targetId!)
          : getPerson(point.targetId!));
        setData(refreshed);
        setEditState({ kind: point.kind, ...refreshed } as EditState);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setError(msg);
      push(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: unknown) => {
    console.log('Frontend - updateField:', key, '=', value);
    setEditState((prev) => {
      const updated = prev ? { ...prev, [key]: value } : prev;
      console.log('Frontend - editState après update:', updated);
      return updated as EditState;
    });
  };

  // Fonction pour obtenir l'ordre de tri des entités
  const getEntityOrder = (kind: 'kingdom' | 'city' | 'place' | 'person'): number => {
    const order: Record<'kingdom' | 'city' | 'place' | 'person', number> = {
      kingdom: 1,
      city: 2,
      place: 5, // Lieu vient après quartier et taverne (pas encore implémentés)
      person: 6,
    };
    return order[kind] || 99;
  };

  // Fonction pour obtenir la liste des entités reliées pour la sidebar
  const getRelatedEntities = (): Array<{ id: string; name: string; kind: 'kingdom' | 'city' | 'place' | 'person'; count?: number }> => {
    if (!data || !point) return [];
    
    const entities: Array<{ id: string; name: string; kind: 'kingdom' | 'city' | 'place' | 'person'; count?: number }> = [];
    
    if (point.kind === 'kingdom') {
      const kingdomData = data as KingdomDetail;
      if (kingdomData.cities && kingdomData.cities.length > 0) {
        kingdomData.cities.forEach(city => {
          entities.push({ id: city.id, name: city.name, kind: 'city' });
        });
      }
      if (kingdomData.places && kingdomData.places.length > 0) {
        kingdomData.places.forEach(place => {
          entities.push({ id: place.id, name: place.name, kind: 'place' });
        });
      }
      if (kingdomData.persons && kingdomData.persons.length > 0) {
        kingdomData.persons.forEach(person => {
          entities.push({ id: person.id, name: person.name, kind: 'person' });
        });
      }
    } else if (point.kind === 'city') {
      const cityData = data as CityDetail;
      if (cityData.kingdom) {
        entities.push({ id: cityData.kingdom.id, name: cityData.kingdom.name, kind: 'kingdom' });
      }
      if (cityData.places && cityData.places.length > 0) {
        cityData.places.forEach(place => {
          entities.push({ id: place.id, name: place.name, kind: 'place' });
        });
      }
      if (cityData.persons && cityData.persons.length > 0) {
        cityData.persons.forEach(person => {
          entities.push({ id: person.id, name: person.name, kind: 'person' });
        });
      }
    } else if (point.kind === 'place') {
      const placeData = data as PlaceDetail;
      if (placeData.kingdom) {
        entities.push({ id: placeData.kingdom.id, name: placeData.kingdom.name, kind: 'kingdom' });
      }
      if (placeData.city) {
        entities.push({ id: placeData.city.id, name: placeData.city.name, kind: 'city' });
      }
      if (placeData.persons && placeData.persons.length > 0) {
        placeData.persons.forEach(person => {
          entities.push({ id: person.id, name: person.name, kind: 'person' });
        });
      }
    } else if (point.kind === 'person') {
      const personData = data as PersonDetail;
      if (personData.kingdom) {
        entities.push({ id: personData.kingdom.id, name: personData.kingdom.name, kind: 'kingdom' });
      }
      if (personData.city) {
        entities.push({ id: personData.city.id, name: personData.city.name, kind: 'city' });
      }
      if (personData.place) {
        entities.push({ id: personData.place.id, name: personData.place.name, kind: 'place' });
      }
    }
    
    // Trier les entités selon l'ordre : Royaume > Ville > Quartier > Taverne > Lieu > Personnage
    return entities.sort((a, b) => getEntityOrder(a.kind) - getEntityOrder(b.kind));
  };

  const relatedEntities = point && data ? getRelatedEntities() : [];

  if (!point && !createMode) return null;
  
  const currentKind = createMode ? createMode.kind : point!.kind;

  return (
    <div className="detail-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="detail-modal-container">
        {relatedEntities.length > 0 && (
          <div className="detail-sidebar glass">
            <div className="detail-sidebar-header">
              <h3>Onglets du document</h3>
            </div>
            <div className="detail-sidebar-list">
              {relatedEntities.map((entity) => (
                <button
                  key={entity.id}
                  type="button"
                  className="detail-sidebar-item ghost"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate({
                        id: entity.id,
                        x: 0,
                        y: 0,
                        kind: entity.kind,
                        targetId: entity.id,
                        name: entity.name,
                        description: null,
                      });
                    }
                  }}
                >
                  <span className="detail-sidebar-icon">
                    {entity.kind === 'kingdom' && '👑'}
                    {entity.kind === 'city' && '🏙️'}
                    {entity.kind === 'place' && '📍'}
                    {entity.kind === 'person' && '👤'}
                  </span>
                  <span className="detail-sidebar-name">{entity.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="detail-modal glass">
          <button className="detail-close ghost" onClick={onClose}>×</button>
          <div className="detail-actions">
            {token && (data || createMode) && (
              <>
                {!createMode && (
                  <button className="ghost" onClick={() => setEditMode((v) => !v)}>
                    {editMode ? 'Annuler édition' : 'Mode édition'}
                  </button>
                )}
                {editMode && (
                  <button className="primary" disabled={saving} onClick={handleSave}>
                    {saving ? (createMode ? 'Création…' : 'Enregistrement…') : (createMode ? 'Créer' : 'Enregistrer')}
                  </button>
                )}
                {onDelete && point && !createMode && (
                  <button
                    className="danger"
                    onClick={() => {
                      if (point && point.targetId) {
                        onDelete(point);
                      }
                    }}
                  >
                    Supprimer
                  </button>
                )}
              </>
            )}
          </div>
          {loading && <div className="detail-loading">Chargement…</div>}
          {error && <div className="detail-error">{error}</div>}
          {!loading && !error && createMode && !editState && (
            <div className="detail-error">Erreur: editState n'est pas initialisé</div>
          )}
          {((data || createMode) && !loading && editState) && (
            <div className="detail-content">
            {currentKind === 'kingdom' && (
              <KingdomView
                data={data as KingdomDetail | null}
                editMode={editMode}
                editState={editState!}
                onChange={updateField}
                valueOrDash={valueOrDash}
                onNavigate={onNavigate}
              />
            )}
            {currentKind === 'city' && (
              <CityView
                data={data as CityDetail | null}
                editMode={editMode}
                editState={editState!}
                onChange={updateField}
                valueOrDash={valueOrDash}
                onNavigate={onNavigate}
              />
            )}
            {currentKind === 'place' && (
              <PlaceView
                data={data as PlaceDetail | null}
                editMode={editMode}
                editState={editState!}
                onChange={updateField}
                valueOrDash={valueOrDash}
                onNavigate={onNavigate}
              />
            )}
            {currentKind === 'person' && (
              <PersonView
                data={data as PersonDetail | null}
                editMode={editMode}
                editState={editState!}
                onChange={updateField}
                valueOrDash={valueOrDash}
                onNavigate={onNavigate}
              />
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

// Helper pour créer un MapPoint à partir d'une référence
function createMapPointFromRef(ref: { id: string; name: string }, kind: 'kingdom' | 'city' | 'place' | 'person'): MapPoint {
  return {
    id: ref.id,
    x: 0,
    y: 0,
    kind,
    targetId: ref.id,
    name: ref.name,
    description: null,
  };
}

// Composant d'onglets
function KingdomView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
}: {
  data: KingdomDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: MapPoint) => void;
}) {
  return (
    <>
      <div className="detail-item">
        <span className="detail-label">Nom</span>
        {editMode ? (
          <input
            className="detail-input"
            value={(editState?.name as string) ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nom du royaume"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.name)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Description</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={(editState?.description as string) ?? ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Description du royaume"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.description)}</p>
        )}
      </div>
      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Population</span>
          {editMode ? (
            <input
              className="detail-input"
              type="number"
              value={((editState as KingdomDetail | null)?.population as number | undefined | null) ?? ''}
              onChange={(e) => onChange('population', e.target.value === '' ? null : Number(e.target.value))}
            />
          ) : (
            <span className="detail-value">
              {data?.population != null ? data.population.toLocaleString() : valueOrDash(data?.population)}
            </span>
          )}
        </div>
        <div className="detail-item">
          <span className="detail-label">Date (en jeu)</span>
          {editMode ? (
            <input
              className="detail-input"
              type="date"
              value={((editState as KingdomDetail | null)?.dateInGame as string | undefined | null) ?? ''}
              onChange={(e) => onChange('dateInGame', e.target.value || null)}
            />
          ) : (
            <span className="detail-value">
              {data?.dateInGame ? new Date(data.dateInGame).toLocaleDateString() : valueOrDash(data?.dateInGame)}
            </span>
          )}
        </div>
      </div>
      {data?.cities && data.cities.length > 0 && (
        <div className="detail-section">
          <h3>Villes ({data.cities.length})</h3>
          <ul className="detail-list">
            {data.cities.map((c) => (
              <li 
                key={c.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(c, 'city'))}
              >
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data?.places && data.places.length > 0 && (
        <div className="detail-section">
          <h3>Lieux ({data?.places.length})</h3>
          <ul className="detail-list">
            {data?.places.map((p) => (
              <li 
                key={p.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(p, 'place'))}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data?.persons && data.persons.length > 0 && (
        <div className="detail-section">
          <h3>Personnages ({data.persons.length})</h3>
          <ul className="detail-list">
            {data?.persons.map((p) => (
              <li 
                key={p.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(p, 'person'))}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <CommentsSection comments={data?.comments} />
    </>
  );
}

function CityView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
}: {
  data: CityDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: MapPoint) => void;
}) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  useEffect(() => {
    if (editMode) {
      const loadLists = async () => {
        setLoadingLists(true);
        try {
          const kingdomsData = await listKingdoms();
          setKingdoms(kingdomsData);
        } catch (err) {
          console.error('Erreur lors du chargement des royaumes:', err);
        } finally {
          setLoadingLists(false);
        }
      };
      loadLists();
    }
  }, [editMode]);

  return (
    <>
      <div className="detail-item">
        <span className="detail-label">Nom</span>
        {editMode ? (
          <input
            className="detail-input"
            value={(editState?.name as string) ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nom de la ville"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.name)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Description</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={(editState?.description as string) ?? ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Description de la ville"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.description)}</p>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Icône</span>
        {editMode ? (
          <select
            className="detail-input"
            value={((editState as CityDetail | null)?.iconUrl as string | undefined | null) ?? ''}
            onChange={(e) => onChange('iconUrl', e.target.value === '' ? null : e.target.value)}
          >
            <option value="">Aucune icône</option>
            <option value="/Icon/capital.png">Capital</option>
            <option value="/Icon/city.png">Cité</option>
            <option value="/Icon/village.png">Village</option>
            <option value="/Icon/fortified-city.png">Ville Fortifiée</option>
          </select>
        ) : (
          <span className="detail-value">
            {data?.iconUrl ? (
              <img src={data?.iconUrl} alt="Icône" style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginLeft: '8px' }} />
            ) : (
              valueOrDash(data?.iconUrl)
            )}
          </span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Royaume</span>
        {editMode ? (
          loadingLists ? (
            <span className="detail-value">Chargement...</span>
          ) : (
            <SearchableSelect
              items={kingdoms}
              selectedId={(editState as CityDetail)?.kingdomId !== undefined 
                ? (editState as CityDetail).kingdomId 
                : data?.kingdom?.id}
              onSelect={(id) => onChange('kingdomId', id)}
              placeholder="Sélectionner un royaume"
            />
          )
        ) : data?.kingdom ? (
          <span 
            className="detail-value" 
            style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
            onClick={() => {
              if (onNavigate && data?.kingdom) {
                onNavigate(createMapPointFromRef(data.kingdom, 'kingdom'));
              }
            }}
          >
            {valueOrDash(data.kingdom?.name)}
          </span>
        ) : (
          <span className="detail-value">{valueOrDash((data?.kingdom as { name: string } | null | undefined)?.name)}</span>
        )}
      </div>
      {data?.places && data.places.length > 0 && (
        <div className="detail-section">
          <h3>Lieux ({data?.places.length})</h3>
          <ul className="detail-list">
            {data?.places.map((p) => (
              <li 
                key={p.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(p, 'place'))}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data?.persons && data.persons.length > 0 && (
        <div className="detail-section">
          <h3>Personnages ({data.persons.length})</h3>
          <ul className="detail-list">
            {data?.persons.map((p) => (
              <li 
                key={p.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(p, 'person'))}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <CommentsSection comments={data?.comments} />
    </>
  );
}

function PlaceView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
}: {
  data: PlaceDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: MapPoint) => void;
}) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  useEffect(() => {
    if (editMode) {
      const loadLists = async () => {
        setLoadingLists(true);
        try {
          const [kingdomsData, citiesData] = await Promise.all([
            listKingdoms(),
            listCities(),
          ]);
          setKingdoms(kingdomsData);
          setCities(citiesData);
        } catch (err) {
          console.error('Erreur lors du chargement des listes:', err);
        } finally {
          setLoadingLists(false);
        }
      };
      loadLists();
    }
  }, [editMode]);

  return (
    <>
      <div className="detail-item">
        <span className="detail-label">Nom</span>
        {editMode ? (
          <input
            className="detail-input"
            value={(editState?.name as string) ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nom du lieu"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.name)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Description</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={(editState?.description as string) ?? ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Description du lieu"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.description)}</p>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Icône</span>
        <span className="detail-value">
          {data?.iconUrl ? (
            <img src={data.iconUrl} alt="Icône" style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginLeft: '8px' }} />
          ) : (
            valueOrDash(data?.iconUrl)
          )}
        </span>
      </div>
      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Royaume</span>
          {editMode ? (
            loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <SearchableSelect
                items={kingdoms}
                selectedId={(editState as PlaceDetail)?.kingdomId !== undefined 
                  ? (editState as PlaceDetail).kingdomId 
                  : data?.kingdom?.id}
                onSelect={(id) => onChange('kingdomId', id)}
                placeholder="Sélectionner un royaume"
              />
            )
          ) : data?.kingdom ? (
            <span 
              className="detail-value" 
              style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
              onClick={() => {
                if (onNavigate && data.kingdom) {
                  onNavigate(createMapPointFromRef(data.kingdom, 'kingdom'));
                }
              }}
            >
              {valueOrDash(data.kingdom?.name)}
            </span>
          ) : (
            <span className="detail-value">{valueOrDash((data?.kingdom as { name: string } | null | undefined)?.name)}</span>
          )}
        </div>
        <div className="detail-item">
          <span className="detail-label">Ville</span>
          {editMode ? (
            loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <SearchableSelect
                items={cities}
                selectedId={(editState as PlaceDetail)?.cityId !== undefined 
                  ? (editState as PlaceDetail).cityId 
                  : data?.city?.id}
                onSelect={(id) => onChange('cityId', id)}
                placeholder="Sélectionner une ville"
              />
            )
          ) : data?.city ? (
            <span 
              className="detail-value" 
              style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
              onClick={() => {
                if (onNavigate && data?.city) {
                  onNavigate(createMapPointFromRef(data.city, 'city'));
                }
              }}
            >
              {valueOrDash(data.city?.name)}
            </span>
          ) : (
            <span className="detail-value">{valueOrDash((data?.city as { name: string } | null | undefined)?.name)}</span>
          )}
        </div>
      </div>
      {data?.persons && data.persons.length > 0 && (
        <div className="detail-section">
          <h3>Personnages ({data.persons.length})</h3>
          <ul className="detail-list">
            {data?.persons.map((p) => (
              <li 
                key={p.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(p, 'person'))}
              >
                {p.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <CommentsSection comments={data?.comments} />
    </>
  );
}

function PersonView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
}: {
  data: PersonDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: MapPoint) => void;
}) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  useEffect(() => {
    if (editMode) {
      const loadLists = async () => {
        setLoadingLists(true);
        try {
          const [kingdomsData, citiesData, placesData] = await Promise.all([
            listKingdoms(),
            listCities(),
            listPlaces(),
          ]);
          setKingdoms(kingdomsData);
          setCities(citiesData);
          setPlaces(placesData);
        } catch (err) {
          console.error('Erreur lors du chargement des listes:', err);
        } finally {
          setLoadingLists(false);
        }
      };
      loadLists();
    }
  }, [editMode]);

  const stats = [
    { label: 'FOR', key: 'STR', value: (editState as PersonDetail | null)?.STR },
    { label: 'DEX', key: 'DEX', value: (editState as PersonDetail | null)?.DEX },
    { label: 'CON', key: 'CON', value: (editState as PersonDetail | null)?.CON },
    { label: 'INT', key: 'INT', value: (editState as PersonDetail | null)?.INT },
    { label: 'SAG', key: 'WIS', value: (editState as PersonDetail | null)?.WIS },
    { label: 'CHA', key: 'CHA', value: (editState as PersonDetail | null)?.CHA },
  ];

  return (
    <>
      <div className="detail-item">
        <span className="detail-label">Nom</span>
        {editMode ? (
          <input
            className="detail-input"
            value={(editState?.name as string) ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nom du personnage"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.name)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Affiliation</span>
        {editMode ? (
          <select
            className="detail-input"
            value={(editState as PersonDetail | null)?.membership ?? ''}
            onChange={(e) => onChange('membership', (e.target.value || null) as Membership | null)}
          >
            <option value="">Aucune affiliation</option>
            {MEMBERSHIP_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {formatMembership(opt)}
              </option>
            ))}
          </select>
        ) : (
          <span className="detail-value">{valueOrDash(formatMembership(data?.membership))}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Description</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={(editState?.description as string) ?? ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Description du personnage"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.description)}</p>
        )}
      </div>
      
      <div className="detail-section">
        <h3>Statistiques</h3>
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-label">{s.label}</span>
              {editMode ? (
                <input
                  className="detail-input stat-input"
                  type="number"
                  value={s.value ?? ''}
                  onChange={(e) => onChange(s.key, e.target.value === '' ? undefined : Number(e.target.value))}
                />
              ) : (
                <span className="stat-value">{valueOrDash(s.value)}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <h3>Langues</h3>
        {editMode ? (
          <LanguageDropdown
            selectedLanguages={(editState as PersonDetail | null)?.languages ?? []}
            onLanguagesChange={(languages) => onChange('languages', languages)}
          />
        ) : (
          <div className="tags">
            {(data.languages ?? []).length === 0
              ? valueOrDash('')
              : data.languages.map((lang, i) => <span key={i} className="tag">{formatLanguage(lang)}</span>)}
          </div>
        )}
      </div>

      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Race</span>
          {editMode ? (
            <select
              className="detail-input"
              value={(editState as PersonDetail | null)?.breed ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                const newValue = value === '' ? null : (value as Breed);
                console.log('Frontend - onChange breed:', value, '->', newValue);
                onChange('breed', newValue);
              }}
            >
              <option value="">Non spécifié</option>
              {BREED_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {formatBreed(opt)}
                </option>
              ))}
            </select>
          ) : (
            <span className="detail-value">{valueOrDash(formatBreed(data.breed))}</span>
          )}
        </div>
        <div className="detail-item">
          <span className="detail-label">Sexe</span>
          {editMode ? (
            <select
              className="detail-input"
              value={(editState as PersonDetail | null)?.sex ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                const newValue = value === '' ? null : (value as Sex);
                console.log('Frontend - onChange sex:', value, '->', newValue);
                onChange('sex', newValue);
              }}
            >
              <option value="">Non spécifié</option>
              {SEX_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {formatSex(opt)}
                </option>
              ))}
            </select>
          ) : (
            <span className="detail-value">{valueOrDash(formatSex(data.sex))}</span>
          )}
        </div>
      </div>

      <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Royaume</span>
              {editMode ? (
                loadingLists ? (
                  <span className="detail-value">Chargement...</span>
                ) : (
                  <SearchableSelect
                    items={kingdoms}
                    selectedId={(editState as PersonEditState)?.kingdomId !== undefined 
                      ? (editState as PersonEditState).kingdomId 
                      : data.kingdom?.id}
                    onSelect={(id) => onChange('kingdomId', id)}
                    placeholder="Sélectionner un royaume"
                  />
                )
              ) : data?.kingdom ? (
                <span 
                  className="detail-value" 
                  style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                  onClick={() => {
                    if (onNavigate && data?.kingdom) {
                      onNavigate({
                        id: data.kingdom.id,
                        x: 0,
                        y: 0,
                        kind: 'kingdom',
                        targetId: data.kingdom.id,
                        name: data.kingdom?.name || '',
                        description: null,
                      });
                    }
                  }}
                >
                  {valueOrDash(data?.kingdom?.name)}
                </span>
              ) : (
                <span className="detail-value">{valueOrDash((data?.kingdom as { name: string } | null | undefined)?.name)}</span>
              )}
            </div>
            <div className="detail-item">
              <span className="detail-label">Ville</span>
              {editMode ? (
                loadingLists ? (
                  <span className="detail-value">Chargement...</span>
                ) : (
                  <SearchableSelect
                    items={cities}
                    selectedId={(editState as PersonEditState)?.cityId !== undefined 
                      ? (editState as PersonEditState).cityId 
                      : data.city?.id}
                    onSelect={(id) => onChange('cityId', id)}
                    placeholder="Sélectionner une ville"
                  />
                )
              ) : data?.city ? (
                <span 
                  className="detail-value" 
                  style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                  onClick={() => {
                    if (onNavigate && data?.city) {
                      onNavigate({
                        id: data.city.id,
                        x: 0,
                        y: 0,
                        kind: 'city',
                        targetId: data.city.id,
                        name: data.city?.name || '',
                        description: null,
                      });
                    }
                  }}
                >
                  {valueOrDash(data?.city?.name)}
                </span>
              ) : (
                <span className="detail-value">{valueOrDash((data?.city as { name: string } | null | undefined)?.name)}</span>
              )}
            </div>
            <div className="detail-item">
              <span className="detail-label">Lieu</span>
              {editMode ? (
                loadingLists ? (
                  <span className="detail-value">Chargement...</span>
                ) : (
                  <SearchableSelect
                    items={places}
                    selectedId={(editState as PersonEditState)?.placeId !== undefined 
                      ? (editState as PersonEditState).placeId 
                      : data.place?.id}
                    onSelect={(id) => onChange('placeId', id)}
                    placeholder="Sélectionner un lieu"
                  />
                )
              ) : data?.place ? (
                <span 
                  className="detail-value" 
                  style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                  onClick={() => {
                    if (onNavigate && data?.place) {
                      onNavigate({
                        id: data.place.id,
                        x: 0,
                        y: 0,
                        kind: 'place',
                        targetId: data.place.id,
                        name: data.place?.name || '',
                        description: null,
                      });
                    }
                  }}
                >
                  {valueOrDash(data?.place?.name)}
                </span>
              ) : (
                <span className="detail-value">{valueOrDash((data?.place as { name: string } | null | undefined)?.name)}</span>
              )}
            </div>
          </div>
      
      <CommentsSection comments={data?.comments} />
    </>
  );
}

type Comment = { id: string; description: string; dateInGame?: string | null };

function CommentsSection({ comments }: { comments?: Comment[] }) {
  if (!comments || comments.length === 0) return null;
  
  return (
    <div className="detail-section comments-section">
      <h3>Notes ({comments.length})</h3>
      <div className="comments-list">
        {comments.map((c) => (
          <div key={c.id} className="comment-item">
            {c.dateInGame && (
              <span className="comment-date">{new Date(c.dateInGame).toLocaleDateString()}</span>
            )}
            <p>{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
