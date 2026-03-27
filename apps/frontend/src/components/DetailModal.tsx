import { useEffect, useState, useRef } from 'react';
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
  type LoreDetail,
  type CityDetail,
  type DistrictDetail,
  type PlaceDetail,
  type PersonDetail,
  type OrganisationDetail,
} from '../api/entities';
import { LoreView } from './detail-modal/LoreView';
import type { LoreEditState } from './detail-modal/loreTypes';
import { useToast } from '../toast/ToastProvider';
import { toDateInputValue } from '../utils/solenia-date';
import './DetailModal.css';

import type { DetailModalProps, EditState, EntityData, OrganisationEditState, PersonEditState } from './detail-modal/detailModalTypes';
import {
  KingdomView,
  CityView,
  DistrictView,
  PlaceView,
  PersonView,
  OrganisationView,
} from './detail-modal/views';

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
        ? { kind: 'lore', title: '', content: '', tags: [], dateInGame: null, summary: null, kingdomIds: [], cityIds: [], placeIds: [], personIds: [], organisationIds: [] }
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
    if (!token) {
      const msg = 'Session expiree. Reconnecte-toi puis reessaie.';
      setError(msg);
      push(msg, 'error');
      return;
    }
    if (!editState) return;
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
              description: kingdomState.description ?? undefined,
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
              description: cityState.description ?? undefined,
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
              description: districtState.motto ?? undefined, // Utiliser motto comme description de base
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
              description: placeState.description ?? undefined,
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
              description: personState.description ?? undefined,
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
              description: organisationState.description ?? undefined,
              organisationType: organisationState.organisationType ?? undefined,
              parentOrganisationId: organisationState.parentOrganisationId ?? undefined,
              flag: organisationState.flag ?? undefined,
              kingdomIds: organisationState.kingdomIds || [],
              cityIds: organisationState.cityIds || [],
              placeIds: organisationState.placeIds || [],
              personIds: organisationState.personIds || [],
            };
            createdEntity = await createOrganisation(token, createData);
            break;
          }
          case 'lore': {
            const loreState = editState as LoreEditState;
            createdEntity = await createLore(token, {
              title: loreState.title ?? '',
              content: loreState.content ?? '',
              tags: loreState.tags ?? [],
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
          const newId = (createdEntity as { id: string }).id;
          const positionPayload =
            kind === 'kingdom'
              ? { x: createMode.initialPosition.x, y: createMode.initialPosition.y, kingdomId: newId }
              : kind === 'city'
              ? { x: createMode.initialPosition.x, y: createMode.initialPosition.y, cityId: newId }
              : kind === 'place'
              ? { x: createMode.initialPosition.x, y: createMode.initialPosition.y, placeId: newId }
              : { x: createMode.initialPosition.x, y: createMode.initialPosition.y, personOfInterestId: newId };

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
          tags: loreState.tags ?? [],
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
            name: cityState.name ?? '',
            description: cityState.description ?? null,
            iconUrl: cityIconUrl === '' || cityIconUrl === undefined ? null : cityIconUrl,
            map: cityState.map === '' || cityState.map === undefined ? null : cityState.map,
            flag: cityFlag === '' || cityFlag === undefined ? null : cityFlag,
            kingdomId: cityState.kingdomId ?? null,
          };
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
            name: ps.name ?? '',
            description: ps.description ?? null,
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
      const raw = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      const msg =
        /token expired|authorization token expired|401/i.test(raw)
          ? 'Session expiree. Reconnecte-toi puis reessaie.'
          : raw;
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
