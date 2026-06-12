import type {
  City,
  District,
  Kingdom,
  Lore,
  Organisation,
  Person,
  Place,
  PlayerCharacter,
} from '../api/entities';
import {
  listCities,
  listDistricts,
  listKingdoms,
  listLores,
  listOrganisations,
  listPersons,
  listPlaces,
  listPlayerCharacters,
} from '../api/entities';
import type { MapPoint } from '../api/map';
import { stripHtml } from '../components/rich-text/richTextUtils';
import type { GlobalSearchResult, SearchableKind } from './types';

export type EntityCatalog = {
  kingdoms: Kingdom[];
  cities: City[];
  districts: District[];
  places: Place[];
  persons: Person[];
  organisations: Organisation[];
  playerCharacters: PlayerCharacter[];
  lores: Lore[];
};

export async function fetchEntityCatalog(): Promise<EntityCatalog> {
  const [kingdoms, cities, districts, places, persons, organisations, playerCharacters, lores] =
    await Promise.all([
      listKingdoms(),
      listCities(),
      listDistricts(),
      listPlaces(),
      listPersons(),
      listOrganisations(),
      listPlayerCharacters(),
      listLores(),
    ]);
  return { kingdoms, cities, districts, places, persons, organisations, playerCharacters, lores };
}

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase();
}

function haystackIncludes(haystack: string, query: string): boolean {
  return haystack.toLowerCase().includes(query);
}

function searchableText(...parts: (string | null | undefined)[]): string {
  return parts
    .filter((part): part is string => Boolean(part?.trim()))
    .map((part) => stripHtml(part))
    .join(' ');
}

function coordsFor(
  kind: SearchableKind,
  targetId: string,
  coordIndex: Map<string, { x: number; y: number }>,
): { x: number; y: number } {
  return coordIndex.get(`${kind}:${targetId}`) ?? { x: 0, y: 0 };
}

function buildCoordIndex(mapPoints: MapPoint[]): Map<string, { x: number; y: number }> {
  const index = new Map<string, { x: number; y: number }>();
  for (const p of mapPoints) {
    if (!p.targetId || p.kind === 'unknown') continue;
    const kind = p.kind as SearchableKind;
    if (kind === 'lore') continue;
    index.set(`${kind}:${p.targetId}`, { x: p.x, y: p.y });
  }
  return index;
}

function pushResult(
  results: GlobalSearchResult[],
  seen: Set<string>,
  entry: Omit<GlobalSearchResult, 'id'>,
) {
  const id = `${entry.kind}:${entry.targetId}`;
  if (seen.has(id)) return;
  seen.add(id);
  results.push({ ...entry, id });
}

export function searchEntityCatalog(
  catalog: EntityCatalog,
  mapPoints: MapPoint[],
  rawQuery: string,
): GlobalSearchResult[] {
  const query = normalizeQuery(rawQuery);
  if (!query) return [];

  const coordIndex = buildCoordIndex(mapPoints);
  const results: GlobalSearchResult[] = [];
  const seen = new Set<string>();

  for (const k of catalog.kingdoms) {
    const text = searchableText(k.name, k.description);
    if (!haystackIncludes(text, query)) continue;
    pushResult(results, seen, {
      kind: 'kingdom',
      targetId: k.id,
      name: k.name,
      description: null,
      ...coordsFor('kingdom', k.id, coordIndex),
    });
  }

  for (const c of catalog.cities) {
    const text = searchableText(c.name, c.description);
    if (!haystackIncludes(text, query)) continue;
    pushResult(results, seen, {
      kind: 'city',
      targetId: c.id,
      name: c.name,
      description: null,
      ...coordsFor('city', c.id, coordIndex),
    });
  }

  for (const d of catalog.districts) {
    const text = searchableText(d.name, d.motto, d.ambiance, d.content, d.rumors, d.secret);
    if (!haystackIncludes(text, query)) continue;
    pushResult(results, seen, {
      kind: 'district',
      targetId: d.id,
      name: d.name,
      description: d.motto ?? d.ambiance ?? null,
      ...coordsFor('district', d.id, coordIndex),
    });
  }

  for (const p of catalog.places) {
    const text = searchableText(p.name, p.description);
    if (!haystackIncludes(text, query)) continue;
    pushResult(results, seen, {
      kind: 'place',
      targetId: p.id,
      name: p.name,
      description: null,
      ...coordsFor('place', p.id, coordIndex),
    });
  }

  for (const p of catalog.persons) {
    const text = searchableText(p.name, p.description);
    if (!haystackIncludes(text, query)) continue;
    pushResult(results, seen, {
      kind: 'person',
      targetId: p.id,
      name: p.name,
      description: p.description ?? null,
      ...coordsFor('person', p.id, coordIndex),
    });
  }

  for (const o of catalog.organisations) {
    const text = searchableText(o.name, o.description);
    if (!haystackIncludes(text, query)) continue;
    pushResult(results, seen, {
      kind: 'organisation',
      targetId: o.id,
      name: o.name,
      description: o.description ?? null,
      ...coordsFor('organisation', o.id, coordIndex),
    });
  }

  for (const pc of catalog.playerCharacters) {
    const text = searchableText(pc.name, pc.description, pc.background, pc.race);
    if (!haystackIncludes(text, query)) continue;
    pushResult(results, seen, {
      kind: 'playerCharacter',
      targetId: pc.id,
      name: pc.name,
      description: pc.description ?? null,
      ...coordsFor('playerCharacter', pc.id, coordIndex),
    });
  }

  for (const l of catalog.lores) {
    const text = searchableText(l.title, l.summary, l.content, ...(l.tags ?? []));
    if (!haystackIncludes(text, query)) continue;
    pushResult(results, seen, {
      kind: 'lore',
      targetId: l.id,
      name: l.title,
      description: l.summary ?? null,
      x: 0,
      y: 0,
    });
  }

  return results.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}
