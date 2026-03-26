import { useEffect, useState, useRef } from 'react';
import type { MapPoint, NavigablePoint, EntityKind } from '../api/map';
import {
  getKingdom,
  getCity,
  getDistrict,
  getPlace,
  getPerson,
  getOrganisation,
  getLore,
  updateKingdom,
  updateCity,
  updateDistrict,
  updatePlace,
  updatePerson,
  updateOrganisation,
  createKingdom,
  createCity,
  createDistrict,
  createPlace,
  createPerson,
  createOrganisation,
  createLore,
  updateLore,
  deleteLore,
  updatePosition,
  type KingdomDetail,
  type LoreRef,
  type LoreDetail,
  type CityDetail,
  type DistrictDetail,
  type PlaceDetail,
  type PersonDetail,
  type OrganisationDetail,
  type Kingdom,
  type City,
  type Place,
  type District,
  type Organisation,
  type Person,
  listOrganisations,
  listKingdoms,
  listCities,
  listDistricts,
  listPlaces,
  listPersons,
  getFlags,
  getMaps,
} from '../api/entities';
import { useToast } from '../toast/ToastProvider';
import type { Breed, Sex, Membership, Language } from '../api/entities';
import { formatSoleniaDate, toDateInputValue } from '../utils/solenia-date';
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

// Type étendu pour le point qui peut inclure organisation et district
// Compatible avec HierarchyNavigablePoint
type ExtendedMapPoint = MapPoint | {
  id: string;
  x: number;
  y: number;
  kind: 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation' | 'unknown';
  targetId: string | null;
  name: string;
  description: string | null;
  iconUrl?: string | null;
};

type DetailModalProps = {
  point: ExtendedMapPoint | null;
  onClose: () => void;
  token?: string | null;
  onUpdated?: () => void;
  onDelete?: (point: MapPoint) => void;
  onNavigate?: (point: NavigablePoint) => void;
  onCreateDistrict?: (cityId: string) => void;
  onOpenLore?: (loreId: string) => void;
  /** Ouverture directe d'une Lore par ID (modal liste ou section entité) */
  loreId?: string | null;
  // Mode création
  createMode?: {
    kind: MapPoint['kind'] | 'district' | 'organisation' | 'lore';
    initialPosition?: { x: number; y: number };
    parentCityId?: string; // Pour les districts
  };
};

type EntityData = KingdomDetail | CityDetail | DistrictDetail | PlaceDetail | PersonDetail | OrganisationDetail | LoreDetail | null;

type PersonEditState = Partial<PersonDetail> & { 
  kind: 'person';
  kingdomId?: string | null;
  cityId?: string | null;
  districtId?: string | null;
  placeId?: string | null;
};

type DistrictEditState = Partial<DistrictDetail> & {
  kind: 'district';
  cityId: string;
};

type OrganisationEditState = Partial<OrganisationDetail> & {
  kind: 'organisation';
  parentOrganisationId?: string | null;
  kingdomIds?: string[];
  cityIds?: string[];
  placeIds?: string[];
  personIds?: string[];
};

type LoreEditState = Partial<LoreDetail> & { kind: 'lore'; kingdomIds?: string[]; cityIds?: string[]; placeIds?: string[]; personIds?: string[]; organisationIds?: string[] };

type EditState =
  | (Partial<KingdomDetail> & { kind: 'kingdom' })
  | (Partial<CityDetail> & { kind: 'city' })
  | DistrictEditState
  | (Partial<PlaceDetail> & { kind: 'place' })
  | PersonEditState
  | OrganisationEditState
  | LoreEditState
  | null;

function FlagSelect({
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
      <select
        className="detail-input"
        value={current}
        onChange={(e) => onChange(e.target.value || null)}
        style={{ minWidth: 200 }}
      >
        <option value="">— Aucun drapeau</option>
        {flags.map((path) => (
          <option key={path} value={path}>
            {path.split('/').pop() ?? path}
          </option>
        ))}
      </select>
      {current ? (
        <img src={current} alt="" style={{ maxWidth: 200, maxHeight: 120, objectFit: 'contain' }} />
      ) : null}
    </div>
  );
}

function MapSelect({
  value,
  onChange,
  editMode,
}: {
  value: string | null | undefined;
  onChange: (v: string | null) => void;
  editMode: boolean;
}) {
  const [maps, setMaps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (editMode) {
      setLoading(true);
      getMaps()
        .then(setMaps)
        .catch(() => setMaps([]))
        .finally(() => setLoading(false));
    }
  }, [editMode]);
  const current = value ?? '';
  if (!editMode) {
    if (!current) return null;
    return (
      <span className="detail-value">
        <img src={current} alt="Map" style={{ maxWidth: 240, maxHeight: 160, objectFit: 'contain' }} />
      </span>
    );
  }
  if (loading) return <span className="detail-value">Chargement...</span>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <select
        className="detail-input"
        value={current}
        onChange={(e) => onChange(e.target.value || null)}
        style={{ minWidth: 220 }}
      >
        <option value="">— Aucune map</option>
        {maps.map((path) => (
          <option key={path} value={path}>
            {path.split('/').pop() ?? path}
          </option>
        ))}
      </select>
      {current ? (
        <img src={current} alt="" style={{ maxWidth: 180, maxHeight: 120, objectFit: 'contain' }} />
      ) : null}
    </div>
  );
}

export default function DetailModal({ point, onClose, token, onUpdated, onDelete, onNavigate, onCreateDistrict, onOpenLore, loreId, createMode }: DetailModalProps) {
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
    if (point || createMode || loreId) {
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
  }, [point, createMode, loreId]);

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
        ? { kind: 'kingdom', name: '', description: null, population: null, dateInGame: null, color: null, flag: null }
        : createMode.kind === 'city'
        ? { kind: 'city', name: '', description: null, iconUrl: null, map: null, flag: null, kingdomId: null }
        : createMode.kind === 'district'
        ? { kind: 'district', name: '', motto: null, ambiance: null, content: null, rumors: null, secret: null, cityId: createMode.parentCityId || '' }
        : createMode.kind === 'place'
        ? {
            kind: 'place',
            name: '',
            description: null,
            map: null,
            kingdomId: null,
            cityId: null,
            districtId: null,
            organisationIds: [] as string[],
            showOnMap: true,
          }
        : createMode.kind === 'organisation'
        ? { kind: 'organisation', name: '', description: null, organisationType: null, parentOrganisationId: null, flag: null, kingdomIds: [], cityIds: [], placeIds: [], personIds: [] }
        : createMode.kind === 'lore'
        ? { kind: 'lore', title: '', content: '', tag: null, dateInGame: null, summary: null, kingdomIds: [], cityIds: [], placeIds: [], personIds: [], organisationIds: [] }
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
            districtId: null,
            placeId: null,
            pv: null,
            ca: null,
            showOnMap: true,
            STR: 10,
            DEX: 10,
            CON: 10,
            INT: 10,
            WIS: 10,
            CHA: 10,
          };
      console.log('editState initialisé:', defaultState);
      setEditState(defaultState);
    } else if (!point && !loreId) {
      // Réinitialiser editState quand on sort du mode création et qu'il n'y a pas de point ni loreId
      setEditState(null);
    }
  }, [createMode, point, loreId]);

  // Charger une Lore par ID (ouverture depuis liste ou section entité)
  useEffect(() => {
    if (!loreId || createMode) return;
    const fetchLore = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getLore(loreId);
        setData(result);
        setEditState({
          kind: 'lore',
          ...result,
          kingdomIds: result.kingdoms?.map((k) => k.id) || [],
          cityIds: result.cities?.map((c) => c.id) || [],
          placeIds: result.places?.map((p) => p.id) || [],
          personIds: result.persons?.map((p) => p.id) || [],
          organisationIds: result.organisations?.map((o) => o.id) || [],
        } as LoreEditState);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchLore();
  }, [loreId, createMode]);

  // Recharger les données quand le point change ou après une mise à jour
  useEffect(() => {
    // Ne pas charger les données si on est en mode création ou si on affiche une lore par ID
    if (createMode || loreId) return;
    
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
          case 'district':
            result = await getDistrict(point.targetId!);
            break;
          case 'place':
            result = await getPlace(point.targetId!);
            break;
          case 'person':
            result = await getPerson(point.targetId!);
            break;
          case 'organisation':
            result = await getOrganisation(point.targetId!);
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
              : point.kind === 'organisation'
              ? ({
                  kind: 'organisation' as const,
                  ...result,
                  organisationType: (result as OrganisationDetail).organisationType ?? null,
                  parentOrganisationId: (result as OrganisationDetail).parentOrganisation?.id ?? null,
                  kingdomIds: (result as OrganisationDetail).kingdoms?.map(k => k.id) || [],
                  cityIds: (result as OrganisationDetail).cities?.map(c => c.id) || [],
                  placeIds: (result as OrganisationDetail).places?.map(p => p.id) || [],
                  personIds: (result as OrganisationDetail).members?.map(m => m.id) || [],
                } as OrganisationEditState)
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
              : point.kind === 'district'
              ? ({
                  kind: 'district' as const,
                  ...result,
                  cityId: (result as DistrictDetail).cityId,
                } as EditState)
              : point.kind === 'place'
              ? ({
                  kind: 'place' as const,
                  ...result,
                  kingdomId: (result as PlaceDetail).kingdom?.id ?? null,
                  cityId: (result as PlaceDetail).city?.id ?? null,
                  districtId: (result as PlaceDetail).district?.id ?? null,
                  organisationIds: (result as PlaceDetail).organisations?.map((o) => o.id) ?? [],
                } as EditState)
              : ({
                  kind: 'person' as const,
                  ...result,
                  kingdomId: (result as PersonDetail).kingdom?.id ?? null,
                  cityId: (result as PersonDetail).city?.id ?? null,
                  districtId: (result as PersonDetail).district?.id ?? null,
                  placeId: (result as PersonDetail).place?.id ?? null,
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
  }, [point, createMode, loreId]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const valueOrDash = (v: unknown): string | number =>
    v === null || v === undefined || v === '' ? '' : (v as string | number);

  const handleSave = async () => {
    if (!token || !editState) return;
    if (!createMode && !loreId && (!point || !point.targetId)) return;
    
    setSaving(true);
    setError(null);
    try {
      const kind = createMode ? createMode.kind : loreId ? 'lore' : point!.kind;
      
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
              color: kingdomState.color ?? undefined,
              flag: kingdomState.flag ?? undefined,
            });
            break;
          }
          case 'city': {
            const cityState = editState as CityDetail;
            createdEntity = await createCity(token, {
              name: cityState.name ?? '',
              description: cityState.description ?? null,
              iconUrl: cityState.iconUrl ?? undefined,
              map: cityState.map ?? undefined,
              flag: cityState.flag ?? undefined,
              kingdomId: cityState.kingdomId ?? undefined,
            });
            break;
          }
          case 'district': {
            const districtState = editState as DistrictDetail;
            createdEntity = await createDistrict(token, {
              name: districtState.name ?? '',
              description: districtState.motto ?? null, // Utiliser motto comme description de base
              cityId: districtState.cityId,
              motto: districtState.motto ?? undefined,
              ambiance: districtState.ambiance ?? undefined,
              content: districtState.content ?? undefined,
              rumors: districtState.rumors ?? undefined,
              secret: districtState.secret ?? undefined,
            });
            break;
          }
          case 'place': {
            const placeState = editState as PlaceDetail & { organisationIds?: string[] };
            createdEntity = await createPlace(token, {
              name: placeState.name ?? '',
              description: placeState.description ?? null,
              map: placeState.map ?? undefined,
              kingdomId: placeState.kingdomId ?? undefined,
              cityId: placeState.cityId ?? undefined,
              districtId: placeState.districtId ?? undefined,
              organisationIds: placeState.organisationIds ?? [],
              showOnMap: placeState.showOnMap ?? true,
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
              districtId: (personState as PersonEditState).districtId ?? undefined,
              placeId: (personState as PersonEditState).placeId ?? undefined,
              pv: personState.pv ?? null,
              ca: personState.ca ?? null,
              showOnMap: personState.showOnMap ?? true,
              STR: personState.STR,
              DEX: personState.DEX,
              CON: personState.CON,
              INT: personState.INT,
              WIS: personState.WIS,
              CHA: personState.CHA,
            });
            break;
          }
          case 'organisation': {
            const organisationState = editState as OrganisationEditState;
            const createData = {
              name: organisationState.name ?? '',
              description: organisationState.description ?? null,
              organisationType: organisationState.organisationType ?? undefined,
              parentOrganisationId: organisationState.parentOrganisationId ?? undefined,
              flag: organisationState.flag ?? undefined,
              kingdomIds: organisationState.kingdomIds || [],
              cityIds: organisationState.cityIds || [],
              placeIds: organisationState.placeIds || [],
              personIds: organisationState.personIds || [],
            };
            console.log('Frontend - Création organisation:', createData);
            createdEntity = await createOrganisation(token, createData);
            break;
          }
          case 'lore': {
            const loreState = editState as LoreEditState;
            createdEntity = await createLore(token, {
              title: loreState.title ?? '',
              content: loreState.content ?? '',
              tag: loreState.tag ?? undefined,
              dateInGame: loreState.dateInGame ?? undefined,
              summary: loreState.summary ?? undefined,
              kingdomIds: loreState.kingdomIds ?? [],
              cityIds: loreState.cityIds ?? [],
              placeIds: loreState.placeIds ?? [],
              personIds: loreState.personIds ?? [],
              organisationIds: loreState.organisationIds ?? [],
            });
            break;
          }
        }
        
        // Créer la position si une position initiale a été fournie (sauf districts, orgs, lore, et lieux rattachés ville/quartier)
        const placeEmbedded =
          kind === 'place'
            ? Boolean(
                (editState as PlaceDetail & { organisationIds?: string[] }).cityId ||
                  (editState as PlaceDetail & { organisationIds?: string[] }).districtId,
              )
            : false;
        if (
          createdEntity &&
          createMode.initialPosition &&
          kind !== 'district' &&
          kind !== 'organisation' &&
          kind !== 'lore' &&
          !placeEmbedded
        ) {
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
        await handleUpdated();
        onClose();
        return;
      }
      
      // Mode édition Lore (ouverture par loreId)
      if (loreId && kind === 'lore') {
        const loreState = editState as LoreEditState;
        await updateLore(token, loreId, {
          title: loreState.title ?? '',
          content: loreState.content ?? '',
          tag: loreState.tag ?? undefined,
          dateInGame: loreState.dateInGame ?? undefined,
          summary: loreState.summary ?? undefined,
          kingdomIds: loreState.kingdomIds ?? [],
          cityIds: loreState.cityIds ?? [],
          placeIds: loreState.placeIds ?? [],
          personIds: loreState.personIds ?? [],
          organisationIds: loreState.organisationIds ?? [],
        });
        push('Enregistré', 'success');
        setEditMode(false);
        await handleUpdated();
        const refreshed = await getLore(loreId);
        setData(refreshed);
        setEditState({
          kind: 'lore',
          ...refreshed,
          kingdomIds: refreshed.kingdoms?.map((k) => k.id) || [],
          cityIds: refreshed.cities?.map((c) => c.id) || [],
          placeIds: refreshed.places?.map((p) => p.id) || [],
          personIds: refreshed.persons?.map((p) => p.id) || [],
          organisationIds: refreshed.organisations?.map((o) => o.id) || [],
        } as LoreEditState);
        return;
      }
      
      // Mode édition (entités carte)
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
            dateInGame: toDateInputValue(kingdomState.dateInGame) || null,
            color: kingdomState.color ?? null,
            flag: kingdomState.flag ?? null,
          });
          break;
        }
        case 'city': {
          const cityState = editState as CityDetail;
          const cityIconUrl = cityState.iconUrl;
          const cityFlag = cityState.flag;
          const payload = {
            name: editState.name ?? '',
            description: editState.description ?? null,
            iconUrl: cityIconUrl === '' || cityIconUrl === undefined ? null : cityIconUrl,
            map: cityState.map === '' || cityState.map === undefined ? null : cityState.map,
            flag: cityFlag === '' || cityFlag === undefined ? null : cityFlag,
            kingdomId: cityState.kingdomId ?? null,
          };
          console.log('Frontend - payload complet:', payload);
          await updateCity(token, point.targetId, payload);
          break;
        }
        case 'district': {
          const districtState = editState as DistrictDetail;
          await updateDistrict(token, point.targetId, {
            name: districtState.name ?? '',
            motto: districtState.motto ?? null,
            ambiance: districtState.ambiance ?? null,
            content: districtState.content ?? null,
            rumors: districtState.rumors ?? null,
            secret: districtState.secret ?? null,
            cityId: districtState.cityId,
          });
          break;
        }
        case 'place': {
          const ps = editState as PlaceDetail & { organisationIds?: string[] };
          await updatePlace(token, point.targetId, {
            name: editState.name ?? '',
            description: editState.description ?? null,
            map: ps.map ?? null,
            kingdomId: ps.kingdomId ?? null,
            cityId: ps.cityId ?? null,
            districtId: ps.districtId ?? null,
            organisationIds: ps.organisationIds ?? [],
            showOnMap: ps.showOnMap ?? true,
          });
          break;
        }
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
            districtId: (personState as PersonEditState).districtId ?? null,
            placeId: (personState as PersonEditState).placeId ?? null,
            pv: personState.pv ?? null,
            ca: personState.ca ?? null,
            showOnMap: personState.showOnMap ?? true,
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
        case 'organisation': {
          const organisationState = editState as OrganisationEditState;
          const updateData = {
            name: organisationState.name ?? '',
            description: organisationState.description ?? null,
            organisationType: organisationState.organisationType ?? null,
            parentOrganisationId: organisationState.parentOrganisationId ?? null,
            flag: organisationState.flag ?? null,
            kingdomIds: organisationState.kingdomIds ?? [],
            cityIds: organisationState.cityIds ?? [],
            placeIds: organisationState.placeIds ?? [],
            personIds: organisationState.personIds ?? [],
          };
          console.log('Frontend - Mise à jour organisation - Données complètes:', JSON.stringify(updateData, null, 2));
          console.log('Frontend - kingdomIds:', updateData.kingdomIds, 'type:', typeof updateData.kingdomIds, 'isArray:', Array.isArray(updateData.kingdomIds));
          await updateOrganisation(token, point.targetId, updateData);
          break;
        }
      }
      push('Enregistré', 'success');
      setEditMode(false);
      await handleUpdated();
      // refetch to display updated data
      if (point) {
        const refreshed = await (point.kind === 'kingdom'
          ? getKingdom(point.targetId!)
          : point.kind === 'city'
          ? getCity(point.targetId!)
          : point.kind === 'district'
          ? getDistrict(point.targetId!)
          : point.kind === 'place'
          ? getPlace(point.targetId!)
          : point.kind === 'organisation'
          ? getOrganisation(point.targetId!)
          : getPerson(point.targetId!));
        setData(refreshed);
        if (point.kind === 'person') {
          setEditState({
            kind: 'person' as const,
            ...refreshed,
            kingdomId: (refreshed as PersonDetail).kingdom?.id ?? null,
            cityId: (refreshed as PersonDetail).city?.id ?? null,
            placeId: (refreshed as PersonDetail).place?.id ?? null,
          } as PersonEditState);
        } else if (point.kind === 'organisation') {
          console.log('Frontend - Données rechargées après sauvegarde:', refreshed);
          setEditState({
            kind: 'organisation' as const,
            ...refreshed,
            organisationType: (refreshed as OrganisationDetail).organisationType ?? null,
            parentOrganisationId: (refreshed as OrganisationDetail).parentOrganisation?.id ?? null,
            kingdomIds: (refreshed as OrganisationDetail).kingdoms?.map(k => k.id) || [],
            cityIds: (refreshed as OrganisationDetail).cities?.map(c => c.id) || [],
            placeIds: (refreshed as OrganisationDetail).places?.map(p => p.id) || [],
            personIds: (refreshed as OrganisationDetail).members?.map(m => m.id) || [],
          } as OrganisationEditState);
        } else if (point.kind === 'place') {
          const pr = refreshed as PlaceDetail;
          setEditState({
            kind: 'place' as const,
            ...pr,
            kingdomId: pr.kingdom?.id ?? null,
            cityId: pr.city?.id ?? null,
            districtId: pr.district?.id ?? null,
            organisationIds: pr.organisations?.map((o) => o.id) ?? [],
          } as EditState);
        } else {
          setEditState({ kind: point.kind, ...refreshed } as EditState);
        }
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
    setEditState((prev) => {
      const updated = prev ? { ...prev, [key]: value } : prev;
      return updated as EditState;
    });
  };



  // Fonction wrapper pour onUpdated qui force le rechargement des données
  const handleUpdated = async () => {
    if (onUpdated) {
      await onUpdated();
    }
  };

  if (!point && !createMode && !loreId) return null;
  
  const currentKind = createMode ? createMode.kind : loreId ? 'lore' : point!.kind;
  const headerName =
    currentKind === 'lore'
      ? ((editState as LoreEditState | null)?.title ?? (data as LoreDetail | null)?.title ?? 'Lore')
      : ((editState as { name?: string } | null)?.name ??
        (data as { name?: string } | null)?.name ??
        (createMode ? `Nouveau ${createMode.kind}` : 'Détail'));
  const headerFlag =
    currentKind === 'kingdom'
      ? ((editState as KingdomDetail | null)?.flag ?? (data as KingdomDetail | null)?.flag ?? null)
      : currentKind === 'city'
      ? ((editState as CityDetail | null)?.flag ?? (data as CityDetail | null)?.flag ?? null)
      : currentKind === 'organisation'
      ? ((editState as OrganisationDetail | null)?.flag ?? (data as OrganisationDetail | null)?.flag ?? null)
      : null;
  const headerMap =
    currentKind === 'city'
      ? ((editState as CityDetail | null)?.map ?? (data as CityDetail | null)?.map ?? null)
      : currentKind === 'place'
      ? ((editState as PlaceDetail | null)?.map ?? (data as PlaceDetail | null)?.map ?? null)
      : null;

  // Fonction pour obtenir les entités regroupées par type pour la sidebar (liées à l'entité courante)
  const getGroupedEntities = (): { kind: 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation'; label: string; entities: Array<{ id: string; name: string; kind: 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation' }> }[] => {
    if (!data || !point) return [];
    // La ville utilise une sidebar dédiée (quartiers + entités imbriquées)
    if (point.kind === 'city') return [];

    const groups: Map<'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation', Array<{ id: string; name: string; kind: 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation' }>> = new Map();
    
    if (point.kind === 'kingdom') {
      const kingdomData = data as KingdomDetail;
      if (kingdomData.cities && kingdomData.cities.length > 0) {
        groups.set('city', kingdomData.cities.map(c => ({ id: c.id, name: c.name, kind: 'city' as const })));
      }
      if (kingdomData.places && kingdomData.places.length > 0) {
        groups.set('place', kingdomData.places.map(p => ({ id: p.id, name: p.name, kind: 'place' as const })));
      }
      if (kingdomData.persons && kingdomData.persons.length > 0) {
        groups.set('person', kingdomData.persons.map(p => ({ id: p.id, name: p.name, kind: 'person' as const })));
      }
      if (kingdomData.organisations && kingdomData.organisations.length > 0) {
        groups.set('organisation', kingdomData.organisations.map(o => ({ id: o.id, name: o.name, kind: 'organisation' as const })));
      }
    } else if (point.kind === 'district') {
      const districtData = data as DistrictDetail;
      if (districtData.city) {
        groups.set('city', [{ id: districtData.city.id, name: districtData.city.name, kind: 'city' as const }]);
      }
      if (districtData.places && districtData.places.length > 0) {
        groups.set('place', districtData.places.map(p => ({ id: p.id, name: p.name, kind: 'place' as const })));
      }
      if (districtData.persons && districtData.persons.length > 0) {
        groups.set('person', districtData.persons.map(p => ({ id: p.id, name: p.name, kind: 'person' as const })));
      }
    } else if (point.kind === 'place') {
      const placeData = data as PlaceDetail;
      if (placeData.kingdom) {
        groups.set('kingdom', [{ id: placeData.kingdom.id, name: placeData.kingdom.name, kind: 'kingdom' as const }]);
      }
      if (placeData.city) {
        groups.set('city', [{ id: placeData.city.id, name: placeData.city.name, kind: 'city' as const }]);
      }
      if (placeData.district) {
        groups.set('district', [{ id: placeData.district.id, name: placeData.district.name, kind: 'district' as const }]);
      }
      if (placeData.persons && placeData.persons.length > 0) {
        groups.set('person', placeData.persons.map(p => ({ id: p.id, name: p.name, kind: 'person' as const })));
      }
      if (placeData.organisations && placeData.organisations.length > 0) {
        groups.set('organisation', placeData.organisations.map(o => ({ id: o.id, name: o.name, kind: 'organisation' as const })));
      }
    } else if (point.kind === 'person') {
      const personData = data as PersonDetail;
      if (personData.kingdom) {
        groups.set('kingdom', [{ id: personData.kingdom.id, name: personData.kingdom.name, kind: 'kingdom' as const }]);
      }
      if (personData.city) {
        groups.set('city', [{ id: personData.city.id, name: personData.city.name, kind: 'city' as const }]);
      }
      if (personData.district) {
        groups.set('district', [{ id: personData.district.id, name: personData.district.name, kind: 'district' as const }]);
      }
      if (personData.place) {
        groups.set('place', [{ id: personData.place.id, name: personData.place.name, kind: 'place' as const }]);
      }
      if (personData.organisations && personData.organisations.length > 0) {
        groups.set('organisation', personData.organisations.map(o => ({ id: o.id, name: o.name, kind: 'organisation' as const })));
      }
    } else if (point.kind === 'organisation') {
      const organisationData = data as OrganisationDetail;
      const orgItems: Array<{ id: string; name: string; kind: 'organisation' }> = [];
      if (organisationData.parentOrganisation) {
        orgItems.push({ id: organisationData.parentOrganisation.id, name: organisationData.parentOrganisation.name, kind: 'organisation' as const });
      }
      if (organisationData.subOrganisations && organisationData.subOrganisations.length > 0) {
        orgItems.push(...organisationData.subOrganisations.map(subOrg => ({ id: subOrg.id, name: subOrg.name, kind: 'organisation' as const })));
      }
      if (orgItems.length > 0) {
        groups.set('organisation', orgItems);
      }
      if (organisationData.kingdoms && organisationData.kingdoms.length > 0) {
        groups.set('kingdom', organisationData.kingdoms.map(k => ({ id: k.id, name: k.name, kind: 'kingdom' as const })));
      }
      if (organisationData.members && organisationData.members.length > 0) {
        groups.set('person', organisationData.members.map(m => ({ id: m.id, name: m.name, kind: 'person' as const })));
      }
      if (organisationData.cities && organisationData.cities.length > 0) {
        groups.set('city', organisationData.cities.map(c => ({ id: c.id, name: c.name, kind: 'city' as const })));
      }
      if (organisationData.places && organisationData.places.length > 0) {
        groups.set('place', organisationData.places.map(p => ({ id: p.id, name: p.name, kind: 'place' as const })));
      }
    }
    
    // Convertir la Map en tableau avec les labels
    const kindLabels: Record<'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation', string> = {
      kingdom: 'Royaume :',
      city: 'Ville :',
      district: 'Quartier :',
      place: 'Lieu :',
      person: 'Personne :',
      organisation: 'Organisation :'
    };
    
    const result: { kind: 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation'; label: string; entities: Array<{ id: string; name: string; kind: 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation' }> }[] = [];
    
    // Ordre d'affichage : Royaume > Organisation > Ville > Quartier > Lieu > Personnage
    const order: Array<'kingdom' | 'organisation' | 'city' | 'district' | 'place' | 'person'> = ['kingdom', 'organisation', 'city', 'district', 'place', 'person'];
    for (const kind of order) {
      const entities = groups.get(kind);
      if (entities && entities.length > 0) {
        result.push({ kind, label: kindLabels[kind], entities });
      }
    }
    
    return result;
  };

  const groupedEntities = point && data ? getGroupedEntities() : [];

  // Fonction pour rendre la sidebar avec les entités liées à l'entité sélectionnée
  const renderSidebar = () => {
    if (!point && !createMode) return null;

    const handleNavigate = (kind: 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation', id: string, name: string) => {
      if (onNavigate) {
        onNavigate({
          id,
          x: 0,
          y: 0,
          kind: kind as any,
          targetId: id,
          name,
          description: null,
        });
      }
    };

    // Ville : quartiers avec lieux / personnages regroupés sur le côté
    if (point?.kind === 'city' && data) {
      const cityData = data as CityDetail;
      const districts = (cityData.districts ?? []) as Array<{
        id: string;
        name: string;
        places?: { id: string; name: string }[];
        persons?: { id: string; name: string }[];
      }>;
      const districtsWithChildren = districts.filter(
        (d) => (d.places?.length ?? 0) > 0 || (d.persons?.length ?? 0) > 0,
      );
      const districtsEmpty = districts.filter(
        (d) => (d.places?.length ?? 0) === 0 && (d.persons?.length ?? 0) === 0,
      );

      const hasKingdom = Boolean(cityData.kingdom);
      const hasOrgs = (cityData.organisations?.length ?? 0) > 0;
      const hasCityPlaces = (cityData.places?.length ?? 0) > 0;
      const hasCityPersons = (cityData.persons?.length ?? 0) > 0;
      const hasSidebar =
        hasKingdom ||
        hasOrgs ||
        districtsWithChildren.length > 0 ||
        districtsEmpty.length > 0 ||
        hasCityPlaces ||
        hasCityPersons;

      if (!hasSidebar) return null;

      return (
        <div className="detail-sidebar glass">
          <div className="detail-sidebar-list">
            {hasKingdom && cityData.kingdom && (
              <div style={{ marginBottom: '16px' }}>
                <h3 className="section-title detail-sidebar-section-title">Royaume :</h3>
                <button
                  type="button"
                  className="detail-sidebar-item ghost"
                  onClick={() => handleNavigate('kingdom', cityData.kingdom!.id, cityData.kingdom!.name)}
                >
                  <span className="detail-sidebar-icon">👑</span>
                  <span className="detail-sidebar-name">{cityData.kingdom.name}</span>
                </button>
              </div>
            )}
            {hasOrgs && (
              <div style={{ marginBottom: '16px' }}>
                <h3 className="section-title detail-sidebar-section-title">Organisations :</h3>
                {cityData.organisations!.map((org) => (
                  <button
                    key={org.id}
                    type="button"
                    className="detail-sidebar-item ghost"
                    onClick={() => handleNavigate('organisation', org.id, org.name)}
                  >
                    <span className="detail-sidebar-icon">🏛️</span>
                    <span className="detail-sidebar-name">{org.name}</span>
                  </button>
                ))}
              </div>
            )}
            {districtsWithChildren.map((d) => (
              <div key={d.id} className="detail-sidebar-district-block">
                <button
                  type="button"
                  className="detail-sidebar-district-title ghost"
                  onClick={() => handleNavigate('district', d.id, d.name)}
                >
                  <span className="detail-sidebar-icon">🏘️</span>
                  <span>{d.name}</span>
                </button>
                {(d.places ?? []).map((p) => (
                  <button
                    key={`p-${p.id}`}
                    type="button"
                    className="detail-sidebar-item ghost detail-sidebar-nested"
                    onClick={() => handleNavigate('place', p.id, p.name)}
                  >
                    <span className="detail-sidebar-icon">📍</span>
                    <span className="detail-sidebar-name">{p.name}</span>
                  </button>
                ))}
                {(d.persons ?? []).map((p) => (
                  <button
                    key={`per-${p.id}`}
                    type="button"
                    className="detail-sidebar-item ghost detail-sidebar-nested"
                    onClick={() => handleNavigate('person', p.id, p.name)}
                  >
                    <span className="detail-sidebar-icon">👤</span>
                    <span className="detail-sidebar-name">{p.name}</span>
                  </button>
                ))}
              </div>
            ))}
            {districtsEmpty.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h3 className="section-title detail-sidebar-section-title">Quartiers :</h3>
                {districtsEmpty.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className="detail-sidebar-item ghost"
                    onClick={() => handleNavigate('district', d.id, d.name)}
                  >
                    <span className="detail-sidebar-icon">🏘️</span>
                    <span className="detail-sidebar-name">{d.name}</span>
                  </button>
                ))}
              </div>
            )}
            {hasCityPlaces && (
              <div style={{ marginBottom: '16px' }}>
                <h3 className="section-title detail-sidebar-section-title">Lieux (ville) :</h3>
                {cityData.places!.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="detail-sidebar-item ghost"
                    onClick={() => handleNavigate('place', p.id, p.name)}
                  >
                    <span className="detail-sidebar-icon">📍</span>
                    <span className="detail-sidebar-name">{p.name}</span>
                  </button>
                ))}
              </div>
            )}
            {hasCityPersons && (
              <div style={{ marginBottom: '16px' }}>
                <h3 className="section-title detail-sidebar-section-title">Personnages (ville) :</h3>
                {cityData.persons!.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="detail-sidebar-item ghost"
                    onClick={() => handleNavigate('person', p.id, p.name)}
                  >
                    <span className="detail-sidebar-icon">👤</span>
                    <span className="detail-sidebar-name">{p.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (groupedEntities.length === 0) {
      return null;
    }

    return (
      <div className="detail-sidebar glass">
        <div className="detail-sidebar-list">
          {groupedEntities.map((group) => (
            <div key={group.kind} style={{ marginBottom: '16px' }}>
              <h3 className="section-title detail-sidebar-section-title">{group.label}</h3>
              {group.entities.map((entity) => (
                <button
                  key={entity.id}
                  type="button"
                  className="detail-sidebar-item ghost"
                  onClick={() => handleNavigate(entity.kind, entity.id, entity.name)}
                >
                  <span className="detail-sidebar-icon">
                    {entity.kind === 'kingdom' && '👑'}
                    {entity.kind === 'organisation' && '🏛️'}
                    {entity.kind === 'city' && '🏙️'}
                    {entity.kind === 'district' && '🏘️'}
                    {entity.kind === 'place' && '📍'}
                    {entity.kind === 'person' && '👤'}
                  </span>
                  <span className="detail-sidebar-name">{entity.name}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="detail-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className={`detail-modal-container ${currentKind === 'lore' ? 'detail-modal-container-lore' : ''}`}>
        {renderSidebar()}
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
                  <button className="primary glass" disabled={saving} onClick={handleSave}>
                    {saving ? (createMode ? 'Création…' : 'Enregistrement…') : (createMode ? 'Créer' : 'Enregistrer')}
                  </button>
                )}
                {onDelete && point && !createMode && (
                  <button
                    className="danger glass"
                    onClick={() => {
                      if (point && point.targetId) {
                        onDelete(point);
                      }
                    }}
                  >
                    Supprimer
                  </button>
                )}
                {token && loreId && !createMode && (
                  <button
                    className="danger glass"
                    onClick={async () => {
                      try {
                        await deleteLore(token, loreId);
                        push('Lore supprimée', 'success');
                        await handleUpdated();
                        onClose();
                      } catch (err) {
                        push(err instanceof Error ? err.message : 'Erreur', 'error');
                      }
                    }}
                  >
                    Supprimer
                  </button>
                )}
              </>
            )}
          </div>
          <div className="detail-modal-header-block">
            <h2 className="detail-title">
              {headerName}
              {headerFlag ? (
                <img
                  src={headerFlag}
                  alt=""
                  style={{ height: 56, width: 'auto', objectFit: 'contain', display: 'block' }}
                />
              ) : null}
            </h2>
            {headerMap ? (
              <div className="detail-header-map">
                <img
                  src={headerMap}
                  alt="Map"
                  style={{ width: '100%', maxHeight: 520, objectFit: 'contain', display: 'block' }}
                />
              </div>
            ) : null}
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
                onOpenLore={onOpenLore}
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
                onCreateDistrict={onCreateDistrict}
                cityId={point?.targetId || (data as CityDetail)?.id}
                onOpenLore={onOpenLore}
              />
            )}
            {currentKind === 'district' && (
              <DistrictView
                data={data as DistrictDetail | null}
                editMode={editMode}
                editState={editState!}
                onChange={updateField}
                valueOrDash={valueOrDash}
                onNavigate={onNavigate}
                onOpenLore={onOpenLore}
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
                onOpenLore={onOpenLore}
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
                onOpenLore={onOpenLore}
              />
            )}
            {currentKind === 'organisation' && (
              <OrganisationView
                data={data as OrganisationDetail | null}
                editMode={editMode}
                editState={editState!}
                onChange={updateField}
                valueOrDash={valueOrDash}
                onNavigate={onNavigate}
                onOpenLore={onOpenLore}
              />
            )}
            {currentKind === 'lore' && (
              <LoreView
                data={data as LoreDetail | null}
                editMode={editMode}
                editState={editState as LoreEditState}
                onChange={updateField}
                valueOrDash={valueOrDash}
              />
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

// Helper pour créer un NavigablePoint à partir d'une référence
function createMapPointFromRef(ref: { id: string; name: string }, kind: EntityKind): NavigablePoint {
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

// Section liste des Lore liées (dans les modales entité)
function LoreSection({ lores, onOpenLore }: { lores?: LoreRef[]; onOpenLore?: (loreId: string) => void }) {
  if (!lores || lores.length === 0) return null;
  const [tagFilter, setTagFilter] = useState<string>('__all__');

  const tags = Array.from(
    new Set(lores.map((l) => (l.tag ?? '').trim()).filter((t) => t !== '')),
  ).sort((a, b) => a.localeCompare(b));

  const sorted = [...lores].sort((a, b) => {
    const da = a.dateInGame ?? Number.POSITIVE_INFINITY;
    const db = b.dateInGame ?? Number.POSITIVE_INFINITY;
    return da - db;
  });

  const filtered = tagFilter === '__all__' ? sorted : sorted.filter((l) => (l.tag ?? '').trim() === tagFilter);

  return (
    <div className="detail-section lore-section">
      <div className="lore-filter-bar">
        <h3 className="section-title lore-filter-title">Lore :</h3>
        {tags.length > 0 && (
          <label className="lore-filter-label">
            <span className="lore-filter-label-text">Filtre tag</span>
            <select className="detail-input lore-tag-select" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
              <option value="__all__">Tous les tags</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <ul className="detail-list">
        {filtered.map((lore) => (
          <li
            key={lore.id}
            style={{ cursor: onOpenLore ? 'pointer' : 'default', textDecoration: onOpenLore ? 'underline' : 'none' }}
            onClick={() => onOpenLore?.(lore.id)}
          >
            <span style={{ fontWeight: 600 }}>{lore.title}</span>
            {(lore.tag != null && lore.tag !== '') || lore.dateInGame != null ? (
              <span style={{ marginLeft: 8, color: '#94a3b8', fontSize: '0.9em' }}>
                {[lore.tag, lore.dateInGame != null ? String(lore.dateInGame) : ''].filter(Boolean).join(' · ')}
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <div className="detail-error" style={{ marginTop: 12, padding: 0 }}>
          Aucun lore pour ce tag.
        </div>
      )}
    </div>
  );
}

// Composant d'onglets
function KingdomView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
  onOpenLore,
}: {
  data: KingdomDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: NavigablePoint) => void;
  onOpenLore?: (loreId: string) => void;
}) {
  return (
    <>
      {editMode && (
        <div className="detail-item">
          <span className="detail-label">Nom</span>
          <input
            className="detail-input"
            value={(editState?.name as string) ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nom du royaume"
          />
        </div>
      )}
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
          <span className="detail-label">Couleur (icônes villes)</span>
          {editMode ? (
            <div className="detail-input-group">
              <input
                className="detail-input"
                type="color"
                value={((editState as KingdomDetail | null)?.color as string) || '#1a73e8'}
                onChange={(e) => onChange('color', e.target.value)}
                style={{ width: 48, height: 32, padding: 2, cursor: 'pointer' }}
              />
              <input
                className="detail-input"
                type="text"
                value={((editState as KingdomDetail | null)?.color as string) ?? ''}
                onChange={(e) => onChange('color', e.target.value || null)}
                placeholder="#1a73e8"
                style={{ flex: 1, marginLeft: 8 }}
              />
            </div>
          ) : (
            <span className="detail-value">
              {data?.color ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 20,
                      height: 20,
                      backgroundColor: data.color,
                      borderRadius: 4,
                      border: '1px solid #ccc',
                    }}
                  />
                  {data.color}
                </span>
              ) : (
                valueOrDash(data?.color)
              )}
            </span>
          )}
        </div>
      {editMode && (
          <div className="detail-item">
            <span className="detail-label">Drapeau</span>
            <FlagSelect
              editMode={editMode}
              value={(editState as KingdomDetail | null)?.flag ?? data?.flag}
              onChange={(v) => onChange('flag', v)}
            />
          </div>
        )}
        <div className="detail-item">
          <span className="detail-label">Date (en jeu)</span>
          {editMode ? (
            <input
              className="detail-input"
              type="date"
              value={toDateInputValue((editState as KingdomDetail | null)?.dateInGame ?? data?.dateInGame)}
              onChange={(e) => onChange('dateInGame', e.target.value || null)}
            />
          ) : (
            <span className="detail-value">
              {data?.dateInGame ? formatSoleniaDate(data.dateInGame) : valueOrDash(data?.dateInGame)}
            </span>
          )}
        </div>
      </div>
      {data?.organisations && data.organisations.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Organisations :</h3>
          <ul className="detail-list">
            {data?.organisations.map((org) => (
              <li 
                key={org.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => {
                  if (onNavigate) {
                    onNavigate({
                      id: org.id,
                      x: 0,
                      y: 0,
                      kind: 'organisation' as any,
                      targetId: org.id,
                      name: org.name,
                      description: null,
                    });
                  }
                }}
              >
                {org.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data?.cities && data.cities.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Villes :</h3>
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
          <h3 className="section-title">Lieux :</h3>
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
          <h3 className="section-title">Personnages :</h3>
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
      <LoreSection lores={data?.lores} onOpenLore={onOpenLore} />
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
  onCreateDistrict,
  cityId,
  onOpenLore,
}: {
  data: CityDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: NavigablePoint) => void;
  onCreateDistrict?: (cityId: string) => void;
  cityId?: string;
  onOpenLore?: (loreId: string) => void;
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
      {editMode && (
        <div className="detail-item">
          <span className="detail-label">Nom</span>
          <input
            className="detail-input"
            value={(editState?.name as string) ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nom de la ville"
          />
        </div>
      )}
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
      {editMode && (
        <div className="detail-item">
          <span className="detail-label">Drapeau</span>
          <FlagSelect
            editMode={editMode}
            value={(editState as CityDetail | null)?.flag ?? data?.flag}
            onChange={(v) => onChange('flag', v)}
          />
        </div>
      )}
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
      {!editMode && onCreateDistrict && cityId && (
        <div className="detail-section">
          <button
            className="ghost"
            onClick={() => onCreateDistrict(cityId)}
            style={{ width: '100%', marginTop: '10px' }}
          >
            + Créer un quartier
          </button>
        </div>
      )}
      {data?.districts && data.districts.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Quartiers :</h3>
          <ul className="detail-list">
            {data?.districts.map((d) => (
              <li 
                key={d.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(d, 'district'))}
              >
                {d.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data?.places && data.places.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Lieux :</h3>
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
          <h3 className="section-title">Personnages :</h3>
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
      {data?.organisations && data.organisations.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Organisations :</h3>
          <ul className="detail-list">
            {data?.organisations.map((org) => (
              <li 
                key={org.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => {
                  if (onNavigate) {
                    onNavigate({
                      id: org.id,
                      x: 0,
                      y: 0,
                      kind: 'organisation' as any,
                      targetId: org.id,
                      name: org.name,
                      description: null,
                    });
                  }
                }}
              >
                {org.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <LoreSection lores={data?.lores} onOpenLore={onOpenLore} />
      <CommentsSection comments={data?.comments} />
    </>
  );
}

function DistrictView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
  onOpenLore,
}: {
  data: DistrictDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: NavigablePoint) => void;
  onOpenLore?: (loreId: string) => void;
}) {
  const [cities, setCities] = useState<City[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  useEffect(() => {
    if (editMode) {
      const loadLists = async () => {
        setLoadingLists(true);
        try {
          const citiesData = await listCities();
          setCities(citiesData);
        } catch (err) {
          console.error('Erreur lors du chargement des villes:', err);
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
            placeholder="Nom du quartier"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.name)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Devise</span>
        {editMode ? (
          <input
            className="detail-input"
            value={((editState as DistrictDetail)?.motto as string) ?? ''}
            onChange={(e) => onChange('motto', e.target.value)}
            placeholder="Devise du quartier"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.motto)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Ambiance</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={((editState as DistrictDetail)?.ambiance as string) ?? ''}
            onChange={(e) => onChange('ambiance', e.target.value)}
            placeholder="Ambiance et description"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.ambiance)}</p>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Contenu</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={((editState as DistrictDetail)?.content as string) ?? ''}
            onChange={(e) => onChange('content', e.target.value)}
            placeholder="Contenu du quartier"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.content)}</p>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Rumeurs</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={((editState as DistrictDetail)?.rumors as string) ?? ''}
            onChange={(e) => onChange('rumors', e.target.value)}
            placeholder="Rumeurs et murmures"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.rumors)}</p>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Secret</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={((editState as DistrictDetail)?.secret as string) ?? ''}
            onChange={(e) => onChange('secret', e.target.value)}
            placeholder="Secret caché"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.secret)}</p>
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
              selectedId={(editState as DistrictDetail)?.cityId !== undefined 
                ? (editState as DistrictDetail).cityId 
                : data?.city?.id}
              onSelect={(id) => onChange('cityId', id ?? '')}
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
      {data?.places && data.places.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Lieux :</h3>
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
          <h3 className="section-title">Personnages :</h3>
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
      <LoreSection lores={data?.lores} onOpenLore={onOpenLore} />
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
  onOpenLore,
}: {
  data: PlaceDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: NavigablePoint) => void;
  onOpenLore?: (loreId: string) => void;
}) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  const placeEdit = editState as PlaceDetail & { organisationIds?: string[] };
  const selectedCityId =
    placeEdit.cityId !== undefined && placeEdit.cityId !== null
      ? placeEdit.cityId
      : data?.city?.id ?? null;
  const districtsForCity = selectedCityId
    ? districts.filter((d) => d.cityId === selectedCityId)
    : [];

  useEffect(() => {
    if (editMode) {
      const loadLists = async () => {
        setLoadingLists(true);
        try {
          const [kingdomsData, citiesData, districtsData, orgsData] = await Promise.all([
            listKingdoms(),
            listCities(),
            listDistricts(),
            listOrganisations(),
          ]);
          setKingdoms(kingdomsData);
          setCities(citiesData);
          setDistricts(districtsData);
          setOrganisations(orgsData);
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
      <p className="detail-hint" style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#94a3b8' }}>
        Rattachement : royaume, ville, quartier et/ou organisations. Un lieu lié à une ville ou un quartier partage sa position sur la carte avec cette ville (pas de marqueur séparé).
      </p>
      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Royaume</span>
          {editMode ? (
            loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <SearchableSelect
                items={kingdoms}
                selectedId={placeEdit.kingdomId !== undefined ? placeEdit.kingdomId : data?.kingdom?.id}
                onSelect={(id) => {
                  onChange('kingdomId', id);
                  onChange('cityId', null);
                  onChange('districtId', null);
                }}
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
                selectedId={placeEdit.cityId !== undefined ? placeEdit.cityId : data?.city?.id}
                onSelect={(id) => {
                  onChange('cityId', id);
                  onChange('districtId', null);
                  onChange('kingdomId', null);
                }}
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
        <div className="detail-item">
          <span className="detail-label">Quartier</span>
          {editMode ? (
            loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <SearchableSelect
                items={districtsForCity}
                selectedId={placeEdit.districtId !== undefined ? placeEdit.districtId : data?.district?.id}
                onSelect={(id) => {
                  onChange('districtId', id);
                  if (id) {
                    const di = districts.find((x) => x.id === id);
                    if (di) {
                      onChange('cityId', di.cityId);
                      onChange('kingdomId', null);
                    }
                  }
                }}
                placeholder={selectedCityId ? 'Quartier (optionnel)' : 'Choisir une ville d’abord'}
              />
            )
          ) : data?.district ? (
            <span
              className="detail-value"
              style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
              onClick={() => {
                if (onNavigate && data.district) {
                  onNavigate(createMapPointFromRef(data.district, 'district'));
                }
              }}
            >
              {valueOrDash(data.district.name)}
            </span>
          ) : (
            <span className="detail-value">{valueOrDash(null)}</span>
          )}
        </div>
      </div>
      {editMode && (
        <div className="detail-item">
          <span className="detail-label">Organisations</span>
          {loadingLists ? (
            <span className="detail-value">Chargement...</span>
          ) : (
            <div className="detail-checkbox-list">
              {organisations.map((org) => {
                const ids = placeEdit.organisationIds ?? [];
                const checked = ids.includes(org.id);
                return (
                  <label key={org.id} className="detail-checkbox-label">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = checked ? ids.filter((i) => i !== org.id) : [...ids, org.id];
                        onChange('organisationIds', next);
                      }}
                    />
                    {org.name}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
      <div className="detail-item">
        <span className="detail-label">Afficher sur la carte</span>
        {editMode ? (
          <label className="detail-checkbox-label">
            <input
              type="checkbox"
              checked={(placeEdit.showOnMap ?? true)}
              onChange={(e) => onChange('showOnMap', e.target.checked)}
            />
            Oui
          </label>
        ) : (
          <span className="detail-value">{(data?.showOnMap ?? true) ? 'Oui' : 'Non'}</span>
        )}
      </div>
      {data?.persons && data.persons.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Personnages :</h3>
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
      {!editMode && data?.organisations && data.organisations.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Organisations :</h3>
          <ul className="detail-list">
            {data?.organisations.map((org) => (
              <li 
                key={org.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => {
                  if (onNavigate) {
                    onNavigate({
                      id: org.id,
                      x: 0,
                      y: 0,
                      kind: 'organisation' as any,
                      targetId: org.id,
                      name: org.name,
                      description: null,
                    });
                  }
                }}
              >
                {org.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <LoreSection lores={data?.lores} onOpenLore={onOpenLore} />
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
  onOpenLore,
}: {
  data: PersonDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: NavigablePoint) => void;
  onOpenLore?: (loreId: string) => void;
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
        <div className="stats-grid" style={{ marginTop: '12px', gap: '12px' }}>
          <div className="stat-item">
            <span className="stat-label">PV</span>
            {editMode ? (
              <input
                className="detail-input stat-input"
                type="number"
                min={0}
                value={(editState as PersonDetail | null)?.pv ?? ''}
                onChange={(e) => onChange('pv', e.target.value === '' ? null : Number(e.target.value))}
                placeholder="—"
              />
            ) : (
              <span className="stat-value">{valueOrDash((data as PersonDetail)?.pv)}</span>
            )}
          </div>
          <div className="stat-item">
            <span className="stat-label">CA</span>
            {editMode ? (
              <input
                className="detail-input stat-input"
                type="number"
                min={0}
                value={(editState as PersonDetail | null)?.ca ?? ''}
                onChange={(e) => onChange('ca', e.target.value === '' ? null : Number(e.target.value))}
                placeholder="—"
              />
            ) : (
              <span className="stat-value">{valueOrDash((data as PersonDetail)?.ca)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="detail-item">
        <span className="detail-label">Afficher sur la carte</span>
        {editMode ? (
          <label className="detail-checkbox-label">
            <input
              type="checkbox"
              checked={(editState as PersonDetail | null)?.showOnMap ?? true}
              onChange={(e) => onChange('showOnMap', e.target.checked)}
            />
            Oui
          </label>
        ) : (
          <span className="detail-value">{((data as PersonDetail)?.showOnMap ?? true) ? 'Oui' : 'Non'}</span>
        )}
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
      
      {data?.organisations && data.organisations.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Organisations :</h3>
          <ul className="detail-list">
            {data?.organisations.map((org) => (
              <li 
                key={org.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => {
                  if (onNavigate) {
                    onNavigate({
                      id: org.id,
                      x: 0,
                      y: 0,
                      kind: 'organisation' as any,
                      targetId: org.id,
                      name: org.name,
                      description: null,
                    });
                  }
                }}
              >
                {org.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <LoreSection lores={data?.lores} onOpenLore={onOpenLore} />
      <CommentsSection comments={data?.comments} />
    </>
  );
}

function OrganisationView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
  onNavigate,
  onOpenLore,
}: {
  data: OrganisationDetail | null;
  editMode: boolean;
  editState: EditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
  onNavigate?: (point: NavigablePoint) => void;
  onOpenLore?: (loreId: string) => void;
}) {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);

  useEffect(() => {
    if (editMode || !data?.id) { // Charger aussi en mode création
      const loadLists = async () => {
        setLoadingLists(true);
        try {
          const [organisationsData, kingdomsData, citiesData, placesData, personsData] = await Promise.all([
            listOrganisations(),
            listKingdoms(),
            listCities(),
            listPlaces(),
            listPersons(),
          ]);
          // Exclure l'organisation actuelle de la liste des parents possibles
          const filteredOrgs = data?.id 
            ? organisationsData.filter(org => org.id !== data.id)
            : organisationsData;
          setOrganisations(filteredOrgs);
          setKingdoms(kingdomsData);
          setCities(citiesData);
          setPlaces(placesData);
          setPersons(personsData);
        } catch (err) {
          console.error('Erreur lors du chargement des listes:', err);
        } finally {
          setLoadingLists(false);
        }
      };
      loadLists();
    }
  }, [editMode, data?.id]);

  return (
    <>
      {editMode && (
        <div className="detail-item">
          <span className="detail-label">Nom</span>
          <input
            className="detail-input"
            value={(editState?.name as string) ?? ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nom de l'organisation"
          />
        </div>
      )}
      <div className="detail-item">
        <span className="detail-label">Description</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={((editState as OrganisationDetail)?.description as string) ?? ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Description de l'organisation"
          />
        ) : (
          <p className="detail-desc">{valueOrDash(data?.description)}</p>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Type</span>
        {editMode ? (
          <select
            className="detail-input"
            value={((editState as OrganisationDetail)?.organisationType as string) ?? ''}
            onChange={(e) => onChange('organisationType', e.target.value === '' ? null : e.target.value)}
          >
            <option value="">— (Non défini)</option>
            <option value="PRINCIPAL">Principal</option>
            <option value="CELLULE">Cellule</option>
          </select>
        ) : (
          <span className="detail-value">
            {(data as OrganisationDetail)?.organisationType === 'PRINCIPAL'
              ? 'Principal'
              : (data as OrganisationDetail)?.organisationType === 'CELLULE'
              ? 'Cellule'
              : valueOrDash(null)}
          </span>
        )}
      </div>
      {editMode && (
        <div className="detail-item">
          <span className="detail-label">Drapeau</span>
          <FlagSelect
            editMode={editMode}
            value={(editState as OrganisationDetail | null)?.flag ?? data?.flag}
            onChange={(v) => onChange('flag', v)}
          />
        </div>
      )}
      <div className="detail-item">
        <span className="detail-label">Organisation parente</span>
        {editMode ? (
          loadingLists ? (
            <span className="detail-value">Chargement...</span>
          ) : (
            <SearchableSelect
              items={organisations}
              selectedId={(editState as OrganisationDetail)?.parentOrganisationId !== undefined 
                ? (editState as OrganisationDetail).parentOrganisationId 
                : data?.parentOrganisation?.id}
              onSelect={(id) => onChange('parentOrganisationId', id)}
              placeholder="Sélectionner une organisation parente (optionnel)"
            />
          )
        ) : data?.parentOrganisation ? (
          <span 
            className="detail-value" 
            style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
            onClick={() => {
              if (onNavigate && data?.parentOrganisation) {
                onNavigate({
                  id: data.parentOrganisation.id,
                  x: 0,
                  y: 0,
                  kind: 'organisation' as any,
                  targetId: data.parentOrganisation.id,
                  name: data.parentOrganisation.name,
                  description: null,
                });
              }
            }}
          >
            {valueOrDash(data.parentOrganisation?.name)}
          </span>
        ) : (
          <span className="detail-value">{valueOrDash(null)}</span>
        )}
      </div>
      {data?.subOrganisations && data.subOrganisations.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Sous-organisations :</h3>
          <ul className="detail-list">
            {data?.subOrganisations.map((subOrg) => (
              <li 
                key={subOrg.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => {
                  if (onNavigate) {
                    onNavigate({
                      id: subOrg.id,
                      x: 0,
                      y: 0,
                      kind: 'organisation' as any,
                      targetId: subOrg.id,
                      name: subOrg.name,
                      description: null,
                    });
                  }
                }}
              >
                {subOrg.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data?.members && data.members.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Membres :</h3>
          <ul className="detail-list">
            {data?.members.map((m) => (
              <li 
                key={m.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(m, 'person'))}
              >
                {m.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data?.cities && data.cities.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Villes :</h3>
          <ul className="detail-list">
            {data?.cities.map((c) => (
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
          <h3 className="section-title">Lieux :</h3>
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
      {data?.kingdoms && data.kingdoms.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Royaumes :</h3>
          <ul className="detail-list">
            {data?.kingdoms.map((k) => (
              <li 
                key={k.id}
                style={{ cursor: onNavigate ? 'pointer' : 'default', textDecoration: onNavigate ? 'underline' : 'none' }}
                onClick={() => onNavigate && onNavigate(createMapPointFromRef(k, 'kingdom'))}
              >
                {k.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {editMode && (
        <>
          <div className="detail-item">
            <span className="detail-label">Royaumes</span>
            {loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                {kingdoms.map((kingdom) => {
                  const orgState = editState as OrganisationEditState;
                  const selectedIds = orgState?.kingdomIds || (data?.kingdoms?.map(k => k.id) || []);
                  const isSelected = selectedIds.includes(kingdom.id);
                  return (
                    <label key={kingdom.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const currentIds = (orgState?.kingdomIds || data?.kingdoms?.map(k => k.id) || []);
                          const newIds = e.target.checked
                            ? [...currentIds, kingdom.id]
                            : currentIds.filter(id => id !== kingdom.id);
                          onChange('kingdomIds', newIds);
                        }}
                      />
                      <span>{kingdom.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          <div className="detail-item">
            <span className="detail-label">Villes</span>
            {loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                {cities.map((city) => {
                  const orgState = editState as OrganisationEditState;
                  const selectedIds = orgState?.cityIds || (data?.cities?.map(c => c.id) || []);
                  const isSelected = selectedIds.includes(city.id);
                  return (
                    <label key={city.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const currentIds = (orgState?.cityIds || data?.cities?.map(c => c.id) || []);
                          const newIds = e.target.checked
                            ? [...currentIds, city.id]
                            : currentIds.filter(id => id !== city.id);
                          onChange('cityIds', newIds);
                        }}
                      />
                      <span>{city.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          <div className="detail-item">
            <span className="detail-label">Lieux</span>
            {loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                {places.map((place) => {
                  const orgState = editState as OrganisationEditState;
                  const selectedIds = orgState?.placeIds || (data?.places?.map(p => p.id) || []);
                  const isSelected = selectedIds.includes(place.id);
                  return (
                    <label key={place.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const currentIds = (orgState?.placeIds || data?.places?.map(p => p.id) || []);
                          const newIds = e.target.checked
                            ? [...currentIds, place.id]
                            : currentIds.filter(id => id !== place.id);
                          onChange('placeIds', newIds);
                        }}
                      />
                      <span>{place.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          <div className="detail-item">
            <span className="detail-label">Personnes</span>
            {loadingLists ? (
              <span className="detail-value">Chargement...</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                {persons.map((person) => {
                  const orgState = editState as OrganisationEditState;
                  const selectedIds = orgState?.personIds || (data?.members?.map(m => m.id) || []);
                  const isSelected = selectedIds.includes(person.id);
                  return (
                    <label key={person.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const currentIds = (orgState?.personIds || data?.members?.map(m => m.id) || []);
                          const newIds = e.target.checked
                            ? [...currentIds, person.id]
                            : currentIds.filter(id => id !== person.id);
                          onChange('personIds', newIds);
                        }}
                      />
                      <span>{person.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

function LoreView({
  data,
  editMode,
  editState,
  onChange,
  valueOrDash,
}: {
  data: LoreDetail | null;
  editMode: boolean;
  editState: LoreEditState;
  onChange: (key: string, value: unknown) => void;
  valueOrDash: (v: unknown) => string | number;
}) {
  return (
    <>
      <div className="detail-item">
        <span className="detail-label">Titre</span>
        {editMode ? (
          <input
            className="detail-input"
            value={editState.title ?? ''}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="Titre de la lore"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.title)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Tag</span>
        {editMode ? (
          <input
            className="detail-input"
            value={editState.tag ?? ''}
            onChange={(e) => onChange('tag', e.target.value || null)}
            placeholder="Tag (optionnel)"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.tag)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Date (en jeu)</span>
        {editMode ? (
          <input
            className="detail-input"
            type="number"
            value={editState.dateInGame ?? ''}
            onChange={(e) => onChange('dateInGame', e.target.value === '' ? null : Number(e.target.value))}
            placeholder="ex: 859, -120, 1330"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.dateInGame)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Résumé</span>
        {editMode ? (
          <input
            className="detail-input"
            value={editState.summary ?? ''}
            onChange={(e) => onChange('summary', e.target.value || null)}
            placeholder="Résumé court (optionnel)"
          />
        ) : (
          <span className="detail-value">{valueOrDash(data?.summary)}</span>
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">Contenu</span>
        {editMode ? (
          <textarea
            className="detail-textarea"
            value={editState.content ?? ''}
            onChange={(e) => onChange('content', e.target.value)}
            placeholder="Contenu de la lore"
            rows={12}
          />
        ) : (
          <p className="detail-desc" style={{ whiteSpace: 'pre-wrap' }}>{valueOrDash(data?.content)}</p>
        )}
      </div>
      {!editMode && data && (data.kingdoms?.length || data.cities?.length || data.places?.length || data.persons?.length || data.organisations?.length) ? (
        <div className="detail-section">
          <h3 className="section-title">Entités liées</h3>
          <ul className="detail-list">
            {data.kingdoms?.map((k) => <li key={k.id}>{k.name} (royaume)</li>)}
            {data.cities?.map((c) => <li key={c.id}>{c.name} (ville)</li>)}
            {data.places?.map((p) => <li key={p.id}>{p.name} (lieu)</li>)}
            {data.persons?.map((p) => <li key={p.id}>{p.name} (personnage)</li>)}
            {data.organisations?.map((o) => <li key={o.id}>{o.name} (organisation)</li>)}
          </ul>
        </div>
      ) : null}
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
              <span className="comment-date">{formatSoleniaDate(c.dateInGame)}</span>
            )}
            <p>{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
