import type { FamilyMember } from '../../api/family';

// Proportions reprises de l'artefact de référence.
export const NODE_W = 130;
export const NODE_H = 60;
const COUPLE_GAP = 16; // espace entre les deux boîtes d'un couple
const UNIT_GAP = 50; // espace entre deux unités d'une même génération
const GEN_HEIGHT = 130; // hauteur d'une génération
const MARGIN_X = 40;
const MARGIN_Y = 40;
const DROP = 35; // hauteur du décrochement des connecteurs parent → enfants

export type NodeRole = 'founder' | 'male' | 'female' | 'pj' | 'neutral' | 'org' | 'suborg';

export type LayoutNode = {
  /** Nœud de personne ; `null` pour les nœuds synthétiques (organisation, sous-organisation). */
  member: FamilyMember | null;
  id: string;
  label: string;
  subtitle?: string | null;
  /** Renseigné sur les nœuds « organisation » : permet d'ouvrir la fiche au clic. */
  organisationId?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  role: NodeRole;
  /** Conjoint « entrant » (pas du sang de la famille) → style pointillé. */
  isSpouse: boolean;
};

export type LayoutResult = {
  nodes: LayoutNode[];
  /** Chemins SVG (attribut `d`) des connecteurs. */
  links: string[];
  width: number;
  height: number;
  /** Repères de génération pour l'étiquetage à gauche. */
  rows: { generation: number; y: number }[];
};

/** Tout ce que le moteur de placement a besoin de connaître d'un nœud. */
type Placeable = { key: string; depth: number; x: number; w: number };

type Unit = Placeable & {
  primary: FamilyMember;
  spouse: FamilyMember | null;
  generation: number;
};

/**
 * Moteur de placement partagé par l'arbre généalogique et l'organigramme :
 * les feuilles se suivent de gauche à droite, chaque parent se centre sur ses
 * enfants, puis un balayage rang par rang résout les chevauchements.
 * Renvoie les nœuds regroupés par profondeur.
 */
function placeTree<T extends Placeable>(all: T[], childrenOf: Map<string, T[]>, roots: T[]): Map<number, T[]> {
  let cursor = MARGIN_X;
  const placed = new Set<string>();
  const place = (u: T) => {
    if (placed.has(u.key)) return;
    placed.add(u.key);
    const children = childrenOf.get(u.key) ?? [];
    if (children.length === 0) {
      u.x = cursor;
      cursor += u.w + UNIT_GAP;
      return;
    }
    children.forEach(place);
    const first = children[0];
    const last = children[children.length - 1];
    u.x = (first.x + last.x + last.w - u.w) / 2;
  };
  roots.forEach(place);
  all.forEach(place); // filet de sécurité : nœuds non atteints depuis une racine

  const byDepth = new Map<number, T[]>();
  all.forEach((u) => {
    const list = byDepth.get(u.depth) ?? [];
    list.push(u);
    byDepth.set(u.depth, list);
  });
  byDepth.forEach((list) => {
    list.sort((a, b) => a.x - b.x);
    let right = MARGIN_X;
    for (const u of list) {
      if (u.x < right) u.x = right;
      right = u.x + u.w + UNIT_GAP;
    }
  });
  return byDepth;
}

function roleOf(m: FamilyMember): NodeRole {
  if (m.playerCharacterId) return 'pj';
  if (m.isFounder) return 'founder';
  if (m.sex === 'MAN') return 'male';
  if (m.sex === 'WOMAN') return 'female';
  return 'neutral';
}

const hasParents = (m: FamilyMember) => Boolean(m.fatherId || m.motherId);

/**
 * Génération de chaque membre : `generation` explicite si fourni, sinon
 * profondeur depuis les racines (max des parents + 1). DFS mémoïsé, protégé
 * contre les cycles. Les conjoints sont ensuite alignés sur la même ligne.
 */
function computeGenerations(members: FamilyMember[]): Map<string, number> {
  const byId = new Map(members.map((m) => [m.id, m]));
  const gen = new Map<string, number>();
  const visiting = new Set<string>();

  const resolve = (id: string): number => {
    const cached = gen.get(id);
    if (cached !== undefined) return cached;
    const m = byId.get(id);
    if (!m) return 0;
    if (visiting.has(id)) return 0; // cycle → on coupe
    visiting.add(id);

    let value: number;
    if (m.generation != null) {
      value = m.generation;
    } else {
      const parents = [m.fatherId, m.motherId].filter((p): p is string => Boolean(p) && byId.has(p!));
      value = parents.length === 0 ? 0 : Math.max(...parents.map(resolve)) + 1;
    }

    visiting.delete(id);
    gen.set(id, value);
    return value;
  };

  members.forEach((m) => resolve(m.id));

  // Aligner les conjoints sur la génération la plus basse des deux.
  for (let pass = 0; pass < 3; pass++) {
    let changed = false;
    for (const m of members) {
      if (!m.spouseId || !byId.has(m.spouseId)) continue;
      const a = gen.get(m.id) ?? 0;
      const b = gen.get(m.spouseId) ?? 0;
      const target = Math.max(a, b);
      if (a !== target) { gen.set(m.id, target); changed = true; }
      if (b !== target) { gen.set(m.spouseId, target); changed = true; }
    }
    if (!changed) break;
  }

  return gen;
}

/** Regroupe les membres en unités (célibataire ou couple). */
function buildUnits(members: FamilyMember[], gen: Map<string, number>): Unit[] {
  const byId = new Map(members.map((m) => [m.id, m]));
  const consumed = new Set<string>();
  const units: Unit[] = [];

  const sorted = [...members].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name),
  );

  for (const m of sorted) {
    if (consumed.has(m.id)) continue;
    const partner = m.spouseId ? byId.get(m.spouseId) ?? null : null;

    if (partner && !consumed.has(partner.id)) {
      // Le membre « du sang » (qui a des parents dans l'arbre) est le principal.
      let primary = m;
      let spouse = partner;
      if (!hasParents(m) && hasParents(partner)) {
        primary = partner;
        spouse = m;
      }
      consumed.add(primary.id);
      consumed.add(spouse.id);
      units.push({
        key: primary.id,
        primary,
        spouse,
        generation: gen.get(primary.id) ?? 0,
        depth: gen.get(primary.id) ?? 0,
        x: 0,
        w: NODE_W * 2 + COUPLE_GAP,
      });
    } else {
      consumed.add(m.id);
      units.push({
        key: m.id,
        primary: m,
        spouse: null,
        generation: gen.get(m.id) ?? 0,
        depth: gen.get(m.id) ?? 0,
        x: 0,
        w: NODE_W,
      });
    }
  }

  return units;
}

export function layoutFamilyTree(allMembers: FamilyMember[], includeDM = true): LayoutResult {
  const members = includeDM ? allMembers : allMembers.filter((m) => !m.isForDM);
  if (members.length === 0) {
    return { nodes: [], links: [], width: 400, height: 200, rows: [] };
  }

  const gen = computeGenerations(members);
  const units = buildUnits(members, gen);

  // Unité contenant un membre donné (pour relier enfant → couple parent).
  const unitOfMember = new Map<string, Unit>();
  units.forEach((u) => {
    unitOfMember.set(u.primary.id, u);
    if (u.spouse) unitOfMember.set(u.spouse.id, u);
  });

  // Enfants de chaque unité : membres dont un parent appartient à l'unité.
  const childUnits = new Map<string, Unit[]>();
  const parentUnitOf = new Map<string, Unit>();
  for (const u of units) {
    const parentIds = [u.primary.fatherId, u.primary.motherId].filter(Boolean) as string[];
    const parentUnit = parentIds.map((id) => unitOfMember.get(id)).find(Boolean);
    if (parentUnit && parentUnit.key !== u.key) {
      parentUnitOf.set(u.key, parentUnit);
      const list = childUnits.get(parentUnit.key) ?? [];
      list.push(u);
      childUnits.set(parentUnit.key, list);
    }
  }
  // Ordre des fratries
  childUnits.forEach((list) =>
    list.sort((a, b) => (a.primary.order ?? 0) - (b.primary.order ?? 0) || a.primary.name.localeCompare(b.primary.name)),
  );

  const roots = units
    .filter((u) => !parentUnitOf.has(u.key))
    .sort((a, b) => a.generation - b.generation || (a.primary.order ?? 0) - (b.primary.order ?? 0) || a.primary.name.localeCompare(b.primary.name));
  const byGeneration = placeTree(units, childUnits, roots);

  // Normaliser les générations en lignes consécutives (0,1,2… même si des rangs manquent).
  const usedGens = [...byGeneration.keys()].sort((a, b) => a - b);
  const rowIndex = new Map(usedGens.map((g, i) => [g, i]));
  const yOf = (generation: number) => MARGIN_Y + (rowIndex.get(generation) ?? 0) * GEN_HEIGHT;

  // Nœuds
  const nodes: LayoutNode[] = [];
  const toNode = (m: FamilyMember, x: number, y: number, isSpouse: boolean): LayoutNode => ({
    member: m, id: m.id, label: m.name, subtitle: m.title, x, y, w: NODE_W, h: NODE_H, role: roleOf(m), isSpouse,
  });
  for (const u of units) {
    const y = yOf(u.generation);
    nodes.push(toNode(u.primary, u.x, y, false));
    if (u.spouse) nodes.push(toNode(u.spouse, u.x + NODE_W + COUPLE_GAP, y, true));
  }

  // Connecteurs
  const links: string[] = [];

  // Trait de couple
  for (const u of units) {
    if (!u.spouse) continue;
    const my = yOf(u.generation) + NODE_H / 2;
    const x1 = u.x + NODE_W;
    links.push(`M${x1},${my} L${x1 + COUPLE_GAP},${my}`);
  }

  // Filiation : un connecteur par membre ayant un parent dans l'arbre — y compris
  // les conjoints « entrants », qui gardent ainsi le lien vers leur propre lignée.
  const nodeByMemberId = new Map(nodes.map((n) => [n.id, n]));
  for (const m of members) {
    const parentId = m.fatherId ?? m.motherId;
    if (!parentId) continue;
    const parentUnit = unitOfMember.get(parentId);
    const child = nodeByMemberId.get(m.id);
    if (!parentUnit || !child || parentUnit.key === m.id) continue;
    const px = parentUnit.x + parentUnit.w / 2;
    const py = yOf(parentUnit.generation) + NODE_H;
    const busY = py + DROP;
    const cx = child.x + child.w / 2;
    links.push(`M${px},${py} L${px},${busY} L${cx},${busY} L${cx},${child.y}`);
  }

  const width = Math.max(...units.map((u) => u.x + u.w)) + MARGIN_X;
  const height = MARGIN_Y + usedGens.length * GEN_HEIGHT;
  const rows = usedGens.map((g) => ({ generation: g, y: yOf(g) }));

  return { nodes, links, width, height, rows };
}

// ── Organigramme (organisations non familiales) ─────────────────────

const ROOT_W = 210; // la boîte racine doit accueillir un nom d'organisation

type OrgUnit = Placeable & {
  member: FamilyMember | null;
  label: string;
  subtitle: string | null;
  role: NodeRole;
  organisationId?: string;
};

/**
 * Organigramme : la racine est l'organisation elle-même, les membres se rangent
 * sous leur supérieur (`superiorId`), et les sous-organisations apparaissent comme
 * des nœuds distincts au premier rang.
 */
export function layoutOrgChart(
  allMembers: FamilyMember[],
  subOrganisations: { id: string; name: string; organisationType: string | null }[],
  organisation: { id: string; name: string },
  includeDM = true,
): LayoutResult {
  const members = includeDM ? allMembers : allMembers.filter((m) => !m.isForDM);
  if (members.length === 0 && subOrganisations.length === 0) {
    return { nodes: [], links: [], width: 400, height: 200, rows: [] };
  }

  const byId = new Map(members.map((m) => [m.id, m]));

  /** Profondeur = distance à la racine en remontant les supérieurs (DFS mémoïsé, anti-cycle). */
  const depthOf = new Map<string, number>();
  const visiting = new Set<string>();
  const resolve = (id: string): number => {
    const cached = depthOf.get(id);
    if (cached !== undefined) return cached;
    const m = byId.get(id);
    if (!m) return 1;
    if (visiting.has(id)) return 1; // cycle → on coupe
    visiting.add(id);
    const sup = m.superiorId && byId.has(m.superiorId) ? m.superiorId : null;
    const value = sup ? resolve(sup) + 1 : 1; // rang 0 = la racine
    visiting.delete(id);
    depthOf.set(id, value);
    return value;
  };
  members.forEach((m) => resolve(m.id));

  const ROOT_KEY = `org:${organisation.id}`;
  const units: OrgUnit[] = [
    { key: ROOT_KEY, depth: 0, x: 0, w: ROOT_W, member: null, label: organisation.name, subtitle: null, role: 'org', organisationId: organisation.id },
    ...members.map((m) => ({
      key: m.id,
      depth: depthOf.get(m.id) ?? 1,
      x: 0,
      w: NODE_W,
      member: m,
      label: m.name,
      subtitle: m.title ?? null,
      role: roleOf(m),
    })),
    ...subOrganisations.map((s) => ({
      key: `org:${s.id}`,
      depth: 1,
      x: 0,
      w: NODE_W,
      member: null,
      label: s.name,
      subtitle: 'sous-organisation',
      role: 'suborg' as NodeRole,
      organisationId: s.id,
    })),
  ];
  const unitByKey = new Map(units.map((u) => [u.key, u]));

  // Enfants : subordonnés directs, et tout ce qui n'a pas de supérieur pend sous la racine.
  const childrenOf = new Map<string, OrgUnit[]>();
  const attach = (parentKey: string, child: OrgUnit) => {
    const list = childrenOf.get(parentKey) ?? [];
    list.push(child);
    childrenOf.set(parentKey, list);
  };
  for (const u of units) {
    if (u.key === ROOT_KEY) continue;
    const sup = u.member?.superiorId;
    attach(sup && unitByKey.has(sup) ? sup : ROOT_KEY, u);
  }
  childrenOf.forEach((list) =>
    list.sort(
      (a, b) =>
        (a.member?.order ?? 999) - (b.member?.order ?? 999) || a.label.localeCompare(b.label),
    ),
  );

  const byDepth = placeTree(units, childrenOf, [unitByKey.get(ROOT_KEY)!]);

  const usedDepths = [...byDepth.keys()].sort((a, b) => a - b);
  const rowIndex = new Map(usedDepths.map((d, i) => [d, i]));
  const yOf = (depth: number) => MARGIN_Y + (rowIndex.get(depth) ?? 0) * GEN_HEIGHT;

  const nodes: LayoutNode[] = units.map((u) => ({
    member: u.member,
    id: u.key,
    label: u.label,
    subtitle: u.subtitle,
    organisationId: u.organisationId,
    x: u.x,
    y: yOf(u.depth),
    w: u.w,
    h: NODE_H,
    role: u.role,
    isSpouse: false,
  }));

  // Connecteurs en équerre, du supérieur vers chaque subordonné.
  const links: string[] = [];
  childrenOf.forEach((children, parentKey) => {
    const parent = unitByKey.get(parentKey);
    if (!parent) return;
    const px = parent.x + parent.w / 2;
    const py = yOf(parent.depth) + NODE_H;
    const busY = py + DROP;
    for (const c of children) {
      const cx = c.x + c.w / 2;
      links.push(`M${px},${py} L${px},${busY} L${cx},${busY} L${cx},${yOf(c.depth)}`);
    }
  });

  const width = Math.max(...units.map((u) => u.x + u.w)) + MARGIN_X;
  const height = MARGIN_Y + usedDepths.length * GEN_HEIGHT;
  const rows = usedDepths.map((d) => ({ generation: d, y: yOf(d) }));

  return { nodes, links, width, height, rows };
}
