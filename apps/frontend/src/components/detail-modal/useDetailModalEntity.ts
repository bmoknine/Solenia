import { useCallback, useEffect, useState } from 'react';
import { idSchema } from '@solenia/shared';
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
  updatePosition,
  type KingdomDetail,
  type CityDetail,
  type DistrictDetail,
  type PlaceDetail,
} from '../../api/entities';
import type { LoreEditState } from './loreTypes';
import type { DetailModalProps, EditState, EntityData, OrganisationEditState, PersonEditState } from './detailModalTypes';
import {
  buildEditStateAfterSaveRefetch,
  buildEditStateFromFetchedEntity,
  defaultEditStateForCreate,
} from './entityToEditState';
import { toDateInputValue } from '../../utils/solenia-date';

type ToastPush = (message: string, type?: 'info' | 'success' | 'error') => void;

type UseDetailModalEntityArgs = Pick<DetailModalProps, 'point' | 'createMode' | 'loreId' | 'onUpdated' | 'onClose'> & {
  token?: string | null;
  push: ToastPush;
};

export function useDetailModalEntity({
  point,
  createMode,
  loreId,
  token,
  onUpdated,
  onClose,
  push,
}: UseDetailModalEntityArgs) {
  const [data, setData] = useState<EntityData>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(!!createMode);
  const [saving, setSaving] = useState(false);
  const [editState, setEditState] = useState<EditState>(null);

  const handleUpdated = useCallback(async () => {
    if (onUpdated) await onUpdated();
  }, [onUpdated]);

  useEffect(() => {
    if (createMode) {
      setData(null);
      setEditMode(true);
      setLoading(false);
      setError(null);
      setEditState(defaultEditStateForCreate(createMode));
    } else if (!point && !loreId) {
      setEditState(null);
    }
  }, [createMode, point, loreId]);

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
    void fetchLore();
  }, [loreId, createMode]);

  useEffect(() => {
    if (createMode || loreId) return;
    if (!point || !point.targetId) {
      setData(null);
      setEditMode(false);
      setEditState(null);
      return;
    }
    if (
      point.kind === 'unknown' ||
      !['kingdom', 'city', 'district', 'place', 'person', 'organisation'].includes(point.kind)
    ) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const k = point.kind as 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation';
        let result: EntityData = null;
        switch (k) {
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
        setEditState(buildEditStateFromFetchedEntity(k, result));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [point, createMode, loreId]);

  const updateField = useCallback((key: string, value: unknown) => {
    setEditState((prev) => {
      const updated = prev ? { ...prev, [key]: value } : prev;
      return updated as EditState;
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!token) {
      const msg = 'Session expiree. Reconnecte-toi puis reessaie.';
      setError(msg);
      push(msg, 'error');
      return;
    }
    if (!editState) return;
    if (!createMode && !loreId && (!point || !point.targetId)) return;

    if (editState && 'name' in (editState as object)) {
      const rawName = (editState as { name?: string }).name;
      if (!String(rawName ?? '').trim()) {
        push('Le nom est requis.', 'error');
        return;
      }
    }

    setSaving(true);
    setError(null);
    try {
      const kind = createMode ? createMode.kind : loreId ? 'lore' : point!.kind;

      if (createMode) {
        let createdEntity: { id: string } | undefined;
        switch (kind) {
          case 'kingdom': {
            const kingdomState = editState as KingdomDetail;
            createdEntity = await createKingdom(token, {
              name: (kingdomState.name ?? '').trim(),
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
              name: (cityState.name ?? '').trim(),
              description: cityState.description ?? undefined,
              iconUrl: cityState.iconUrl ?? undefined,
              map: cityState.map ?? undefined,
              flag: cityState.flag ?? undefined,
              kingdomId: (() => {
              const k = cityState.kingdomId;
              if (k == null || k === '') return undefined;
              return idSchema.safeParse(k).success ? k : undefined;
            })(),
            });
            break;
          }
          case 'district': {
            const districtState = editState as DistrictDetail;
            createdEntity = await createDistrict(token, {
              name: (districtState.name ?? '').trim(),
              description: districtState.motto ?? undefined,
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
              name: (placeState.name ?? '').trim(),
              description: placeState.description ?? undefined,
              map: placeState.map ?? undefined,
              placeType: placeState.placeType ?? 'AUTRE',
              kingdomId: placeState.kingdomId ?? undefined,
              cityId: placeState.cityId ?? undefined,
              districtId: placeState.districtId ?? undefined,
              organisationIds: placeState.organisationIds ?? [],
              showOnMap: placeState.showOnMap ?? true,
            });
            break;
          }
          case 'person': {
            const personState = editState as PersonEditState;
            createdEntity = await createPerson(token, {
              name: (personState.name ?? '').trim(),
              description: personState.description ?? undefined,
              breed: personState.breed ?? undefined,
              sex: personState.sex ?? undefined,
              languages: personState.languages ?? [],
              kingdomId: personState.kingdomId ?? undefined,
              cityId: personState.cityId ?? undefined,
              districtId: personState.districtId ?? undefined,
              placeId: personState.placeId ?? undefined,
              organisationIds: personState.organisationIds ?? [],
              pv: personState.pv ?? null,
              ca: personState.ca ?? null,
              showOnMap: personState.showOnMap ?? true,
              STR: personState.STR ?? 10,
              DEX: personState.DEX ?? 10,
              CON: personState.CON ?? 10,
              INT: personState.INT ?? 10,
              WIS: personState.WIS ?? 10,
              CHA: personState.CHA ?? 10,
            });
            break;
          }
          case 'organisation': {
            const organisationState = editState as OrganisationEditState;
            createdEntity = await createOrganisation(token, {
              name: (organisationState.name ?? '').trim(),
              description: organisationState.description ?? undefined,
              organisationType: organisationState.organisationType ?? undefined,
              membership: organisationState.membership ?? undefined,
              parentOrganisationId: organisationState.parentOrganisationId ?? undefined,
              flag: organisationState.flag ?? undefined,
              kingdomIds: organisationState.kingdomIds || [],
              cityIds: organisationState.cityIds || [],
              placeIds: organisationState.placeIds || [],
              personIds: organisationState.personIds || [],
            });
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
          const newId = createdEntity.id;
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

      if (!point || !point.targetId) return;
      const pk = point.kind;
      if (
        pk === 'unknown' ||
        !['kingdom', 'city', 'district', 'place', 'person', 'organisation'].includes(pk)
      ) {
        return;
      }
      const entityKind = pk as 'kingdom' | 'city' | 'district' | 'place' | 'person' | 'organisation';

      switch (entityKind) {
        case 'kingdom': {
          const kingdomState = editState as KingdomDetail;
          await updateKingdom(token, point.targetId, {
            name: (kingdomState.name ?? '').trim(),
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
          await updateCity(token, point.targetId, {
            name: (cityState.name ?? '').trim(),
            description: cityState.description ?? null,
            iconUrl: cityIconUrl === '' || cityIconUrl === undefined ? null : cityIconUrl,
            map: cityState.map === '' || cityState.map === undefined ? null : cityState.map,
            flag: cityFlag === '' || cityFlag === undefined ? null : cityFlag,
            kingdomId: (() => {
              const k = cityState.kingdomId;
              if (k == null || k === '') return null;
              return idSchema.safeParse(k).success ? k : null;
            })(),
          });
          break;
        }
        case 'district': {
          const districtState = editState as DistrictDetail;
          await updateDistrict(token, point.targetId, {
            name: (districtState.name ?? '').trim(),
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
            name: (ps.name ?? '').trim(),
            description: ps.description ?? null,
            map: ps.map ?? null,
            placeType: ps.placeType ?? 'AUTRE',
            kingdomId: ps.kingdomId ?? null,
            cityId: ps.cityId ?? null,
            districtId: ps.districtId ?? null,
            organisationIds: ps.organisationIds ?? [],
            showOnMap: ps.showOnMap ?? true,
          });
          break;
        }
        case 'person': {
          const personState = editState as PersonEditState;
          await updatePerson(token, point.targetId, {
            name: (personState.name ?? '').trim(),
            description: personState.description ?? null,
            breed: personState.breed ?? null,
            sex: personState.sex ?? null,
            languages: personState.languages ?? [],
            kingdomId: personState.kingdomId ?? null,
            cityId: personState.cityId ?? null,
            districtId: personState.districtId ?? null,
            placeId: personState.placeId ?? null,
            organisationIds: personState.organisationIds ?? [],
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
          await updateOrganisation(token, point.targetId, {
            name: (organisationState.name ?? '').trim(),
            description: organisationState.description ?? null,
            organisationType: organisationState.organisationType ?? null,
            membership: organisationState.membership ?? null,
            parentOrganisationId: organisationState.parentOrganisationId ?? null,
            flag: organisationState.flag ?? null,
            kingdomIds: organisationState.kingdomIds ?? [],
            cityIds: organisationState.cityIds ?? [],
            placeIds: organisationState.placeIds ?? [],
            personIds: organisationState.personIds ?? [],
          });
          break;
        }
      }

      push('Enregistré', 'success');
      setEditMode(false);
      await handleUpdated();

      const refreshed = await (entityKind === 'kingdom'
        ? getKingdom(point.targetId!)
        : entityKind === 'city'
          ? getCity(point.targetId!)
          : entityKind === 'district'
            ? getDistrict(point.targetId!)
            : entityKind === 'place'
              ? getPlace(point.targetId!)
              : entityKind === 'organisation'
                ? getOrganisation(point.targetId!)
                : getPerson(point.targetId!));
      setData(refreshed);
      setEditState(buildEditStateAfterSaveRefetch(entityKind, refreshed));
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      const msg = /token expired|authorization token expired|401/i.test(raw)
        ? 'Session expiree. Reconnecte-toi puis reessaie.'
        : raw;
      setError(msg);
      push(msg, 'error');
    } finally {
      setSaving(false);
    }
  }, [
    token,
    editState,
    createMode,
    loreId,
    point,
    push,
    handleUpdated,
    onClose,
  ]);

  return {
    data,
    loading,
    error,
    editMode,
    setEditMode,
    saving,
    editState,
    updateField,
    handleSave,
    handleUpdated,
  };
}
