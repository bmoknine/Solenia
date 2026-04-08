/**
 * Import des entités DriveSolenia → PostgreSQL via Prisma.
 *
 * Source  : DriveSolenia/extracted/drive-solenia-entities.json
 * Règles  :
 *   - Royaumes et villes résolus par nom normalisé (insensible casse/accents).
 *   - Si un nom correspond à plusieurs lignes, priorité à celle qui a une Position.
 *   - Si aucune correspondance : entités dépendantes ignorées + console.warn.
 *   - Places/PersonOfInterest créés avec showOnMap = false.
 *   - Une Position créée pour chaque lieu/PNJ (équivalent POST /positions),
 *     ancrée sur la Position de la ville ou du royaume parent.
 *   - UUID déterministes : ré-import idempotent (wipe du lot avant recréation).
 *
 * Usage (depuis apps/backend) : npm run db:import-drive-solenia
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient, type Membership, type Breed, type Sex } from '@prisma/client';

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

const DRIVE_HASH_NS = 'solenia-drive-v2';
// Anciens namespaces (imports précédents) — leurs entités seront aussi wipées
const LEGACY_HASH_NS = ['solenia-drive-solenia-v1'];

const VALID_BREEDS = new Set<string>([
  'ELFE','HALFELIN','HUMAIN','NAIN','DEMI_ELFE','DEMI_ORC','DRAKEIDE',
  'GNOME','TIEFFELIN','AASIMAR','GENASIAIR','GENASITERRE','GENASIFEUR',
  'GENASIEAU','GOLIATH','OTHER',
]);

// ─── UUID déterministe ────────────────────────────────────────────────────────
function stableUuid(kind: 'place' | 'person' | 'org', key: string): string {
  const h = createHash('sha256').update(`${DRIVE_HASH_NS}:${kind}:${key}`).digest();
  const buf = Buffer.allocUnsafe(16);
  for (let i = 0; i < 16; i++) buf[i] = h[i]!;
  buf[6] = (buf[6]! & 0x0f) | 0x40;
  buf[8] = (buf[8]! & 0x3f) | 0x80;
  const hex = buf.toString('hex');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
}

// ─── Normalisation du nom (casse + accents + apostrophes) ────────────────────
function normalizeName(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[''′`]/g, '')
    .replace(/\s+/g, ' ');
}

// ─── Décalage en spirale pour positionner les entités autour du parent ───────
function anchorOffset(index: number, base = 0.014): { dx: number; dy: number } {
  const angle = index * 0.92;
  const r = base * Math.sqrt(index + 1);
  return { dx: r * Math.cos(angle), dy: r * Math.sin(angle) };
}

function clamp01(v: number): number {
  return Math.max(0.001, Math.min(0.999, v));
}

// ─── Chargement du JSON ───────────────────────────────────────────────────────
const JSON_PATH = join(__dirname, '../DriveSolenia/extracted/drive-solenia-entities.json');

interface KingdomEntry  { key: string; name: string }
interface CityEntry     { key: string; name: string; kingdomKey?: string }
interface PlaceEntry    { key: string; name: string; description?: string; cityKey?: string; kingdomKey?: string }
interface PersonEntry   { key: string; name: string; role?: string; notes?: string; breed?: string; sex?: string; membership?: string; cityKey?: string; kingdomKey?: string }
interface OrgEntry      { key: string; name: string; description?: string; membership?: string; parentKey?: string; kingdomKeys?: string[]; cityKeys?: string[] }
interface Payload { kingdoms: KingdomEntry[]; cities: CityEntry[]; places: PlaceEntry[]; persons: PersonEntry[]; organisations: OrgEntry[] }

const payload = JSON.parse(readFileSync(JSON_PATH, 'utf-8')) as Payload;

// ─── Programme principal ──────────────────────────────────────────────────────
async function main() {
  console.log('🚀  Import DriveSolenia → DB\n');

  // ── 1. Charger royaumes (préférer celui avec Position) ──────────────────────
  const dbKingdoms = await prisma.kingdom.findMany({ include: { position: true } });
  const kingdomByNorm = new Map<string, string>(); // normName → id
  for (const k of dbKingdoms) {
    const norm = normalizeName(k.name);
    if (!kingdomByNorm.has(norm) || k.position !== null) {
      kingdomByNorm.set(norm, k.id);
    }
  }

  // ── 2. Charger villes ────────────────────────────────────────────────────────
  const dbCities = await prisma.city.findMany({ include: { position: true } });

  // Set des IDs de villes ayant une Position (pour la résolution par priorité)
  const cityIdsWithPos = new Set<string>(dbCities.filter(c => c.position !== null).map(c => c.id));

  const cityByKingdomAndName = new Map<string, string>(); // `${kingdomId}:${norm}` → id (préférer avec Position)
  const cityByNameOnly       = new Map<string, string>(); // normName → id (préférer avec Position)
  for (const c of dbCities) {
    const norm = normalizeName(c.name);
    if (c.kingdomId) {
      const key     = `${c.kingdomId}:${norm}`;
      const current = cityByKingdomAndName.get(key);
      if (!current || (!cityIdsWithPos.has(current) && cityIdsWithPos.has(c.id))) {
        cityByKingdomAndName.set(key, c.id);
      }
    }
    const current = cityByNameOnly.get(norm);
    if (!current || (!cityIdsWithPos.has(current) && cityIdsWithPos.has(c.id))) {
      cityByNameOnly.set(norm, c.id);
    }
  }

  // ── 3. Résoudre clés JSON → IDs DB (royaumes) ───────────────────────────────
  const kingdomKeyToId = new Map<string, string>();
  for (const k of payload.kingdoms) {
    const norm = normalizeName(k.name);
    const id   = kingdomByNorm.get(norm);
    if (id) {
      kingdomKeyToId.set(k.key, id);
    } else {
      console.warn(`⚠️  Royaume introuvable en base : "${k.name}" (norm: "${norm}")`);
    }
  }

  // ── 4. Résoudre clés JSON → IDs DB (villes) ─────────────────────────────────
  const cityKeyToId = new Map<string, string>();
  for (const c of payload.cities) {
    const norm      = normalizeName(c.name);
    const kingdomId = c.kingdomKey ? kingdomKeyToId.get(c.kingdomKey) : undefined;
    let   cityId: string | undefined;

    if (kingdomId) {
      cityId = cityByKingdomAndName.get(`${kingdomId}:${norm}`);
      // Si la ville trouvée n'a pas de Position mais qu'une homonyme avec Position existe, la préférer
      if (cityId && !cityIdsWithPos.has(cityId)) {
        const withPos = cityByNameOnly.get(norm);
        if (withPos && cityIdsWithPos.has(withPos)) {
          cityId = withPos;
          console.warn(`  ↩  "${c.name}" : préféré la version avec Position (ex: cité libre sans royaume)`);
        }
      }
    }
    if (!cityId) {
      cityId = cityByNameOnly.get(norm);
      if (cityId) {
        console.warn(`  ↩  Ville "${c.name}" trouvée sans royaume en base (fallback nom seul)`);
      }
    }
    if (cityId) {
      cityKeyToId.set(c.key, cityId);
    } else {
      console.warn(`⚠️  Ville introuvable en base : "${c.name}" (royaume: ${c.kingdomKey ?? '—'})`);
    }
  }

  // ── 5. Index de positions existantes (ancres pour spirale) ──────────────────
  const cityPositions    = new Map<string, { x: number; y: number }>();
  const kingdomPositions = new Map<string, { x: number; y: number }>();
  for (const c of dbCities)   if (c.position) cityPositions.set(c.id,    { x: c.position.x, y: c.position.y });
  for (const k of dbKingdoms) if (k.position) kingdomPositions.set(k.id, { x: k.position.x, y: k.position.y });

  // ── 6. Collecte des IDs stables (courant + legacy) ───────────────────────────
  function allIds(kind: 'place' | 'person' | 'org', key: string): string[] {
    return [
      stableUuid(kind, key),
      ...LEGACY_HASH_NS.map(ns => {
        const h = createHash('sha256').update(`${ns}:${kind}:${key}`).digest();
        const buf = Buffer.allocUnsafe(16);
        for (let i = 0; i < 16; i++) buf[i] = h[i]!;
        buf[6] = (buf[6]! & 0x0f) | 0x40;
        buf[8] = (buf[8]! & 0x3f) | 0x80;
        const hex = buf.toString('hex');
        return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
      }),
    ];
  }
  const placeIds  = payload.places.map(p => stableUuid('place',  p.key));
  const personIds = payload.persons.map(p => stableUuid('person', p.key));
  const orgIds    = payload.organisations.map(o => stableUuid('org', o.key));

  const allPlaceIds  = payload.places.flatMap(p => allIds('place',  p.key));
  const allPersonIds = payload.persons.flatMap(p => allIds('person', p.key));
  const allOrgIds    = payload.organisations.flatMap(o => allIds('org', o.key));

  // ── 7. Wipe idempotent du lot (courant + legacy namespaces) ─────────────────
  console.log('🗑️  Nettoyage des entités DriveSolenia existantes...');
  await prisma.position.deleteMany({ where: { OR: [
    { placeId:             { in: allPlaceIds  } },
    { personOfInterestId:  { in: allPersonIds } },
  ]}});
  await prisma.organisationMember.deleteMany ({ where: { organisationId: { in: allOrgIds } } });
  await prisma.organisationCity.deleteMany   ({ where: { organisationId: { in: allOrgIds } } });
  await prisma.organisationKingdom.deleteMany({ where: { organisationId: { in: allOrgIds } } });
  await prisma.organisationPlace.deleteMany  ({ where: { organisationId: { in: allOrgIds } } });
  // Supprimer les sous-orgs d'abord (FK parentOrganisationId)
  await prisma.organisation.deleteMany({ where: { id: { in: allOrgIds }, parentOrganisationId: { not: null } } });
  await prisma.organisation.deleteMany({ where: { id: { in: allOrgIds } } });
  await prisma.personOfInterest.deleteMany({ where: { id: { in: allPersonIds } } });
  await prisma.place.deleteMany            ({ where: { id: { in: allPlaceIds  } } });

  // ── 8. Compteurs de spirale par parent ───────────────────────────────────────
  const spiralCounter = new Map<string, number>();
  function nextOffset(parentId: string): { dx: number; dy: number } {
    const idx = spiralCounter.get(parentId) ?? 0;
    spiralCounter.set(parentId, idx + 1);
    return anchorOffset(idx);
  }

  // ── 9. Créer les lieux ───────────────────────────────────────────────────────
  let placesCreated = 0, placesSkipped = 0;
  console.log(`\n🏛️  Lieux (${payload.places.length})...`);
  for (const p of payload.places) {
    const id       = stableUuid('place', p.key);
    const cityId   = p.cityKey    ? cityKeyToId.get(p.cityKey)       : undefined;
    const kId      = p.kingdomKey ? kingdomKeyToId.get(p.kingdomKey)  : undefined;

    if (!cityId && !kId) {
      console.warn(`  ⏭  "${p.name}" ignoré (ville/royaume introuvables)`);
      placesSkipped++;
      continue;
    }

    // normalizePlaceGeo : cityId prend le dessus → kingdomId = null
    const finalCityId    = cityId   ?? null;
    const finalKingdomId = cityId   ? null : (kId ?? null);

    await prisma.place.create({ data: {
      id,
      name:        p.name,
      description: p.description ?? null,
      iconUrl:     '/Icon/place.png',
      cityId:      finalCityId,
      kingdomId:   finalKingdomId,
      showOnMap:   false,
      isForDM:     false,
    }});

    // Position ancrée sur la ville (ou royaume) parente
    const parentId  = cityId ?? kId;
    const parentPos = cityId ? cityPositions.get(cityId) : (kId ? kingdomPositions.get(kId) : undefined);
    if (parentId && parentPos) {
      const { dx, dy } = nextOffset(parentId);
      await prisma.position.upsert({
        where:  { placeId: id },
        create: { placeId: id, x: clamp01(parentPos.x + dx), y: clamp01(parentPos.y + dy) },
        update: {             x: clamp01(parentPos.x + dx), y: clamp01(parentPos.y + dy) },
      });
    } else {
      console.warn(`  ℹ️  "${p.name}" créé sans position (parent sans coordonnées)`);
    }
    placesCreated++;
  }

  // ── 10. Créer les personnages ────────────────────────────────────────────────
  let personsCreated = 0, personsSkipped = 0;
  console.log(`\n👤  Personnages (${payload.persons.length})...`);
  for (const p of payload.persons) {
    const id     = stableUuid('person', p.key);
    const cityId = p.cityKey    ? cityKeyToId.get(p.cityKey)      : undefined;
    const kId    = p.kingdomKey ? kingdomKeyToId.get(p.kingdomKey) : undefined;

    if (!cityId && !kId) {
      console.warn(`  ⏭  "${p.name}" ignoré (ville/royaume introuvables)`);
      personsSkipped++;
      continue;
    }

    const sexMap: Record<string, Sex> = { M: 'MAN', F: 'WOMAN' };
    const sex: Sex | undefined = p.sex ? (sexMap[p.sex] ?? 'OTHER') : undefined;

    const breed: Breed | undefined = p.breed
      ? (VALID_BREEDS.has(p.breed) ? (p.breed as Breed) : 'OTHER')
      : undefined;

    const finalCityId    = cityId ?? null;
    const finalKingdomId = cityId ? null : (kId ?? null);

    await prisma.personOfInterest.create({ data: {
      id,
      name:        p.name,
      description: p.notes ?? null,
      breed,
      sex,
      membership:  p.membership as Membership | undefined,
      STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10,
      cityId:    finalCityId,
      kingdomId: finalKingdomId,
      showOnMap: false,
      isForDM:   false,
    }});

    const parentId  = cityId ?? kId;
    const parentPos = cityId ? cityPositions.get(cityId) : (kId ? kingdomPositions.get(kId) : undefined);
    if (parentId && parentPos) {
      const { dx, dy } = nextOffset(parentId);
      await prisma.position.upsert({
        where:  { personOfInterestId: id },
        create: { personOfInterestId: id, x: clamp01(parentPos.x + dx), y: clamp01(parentPos.y + dy) },
        update: {                         x: clamp01(parentPos.x + dx), y: clamp01(parentPos.y + dy) },
      });
    } else {
      console.warn(`  ℹ️  "${p.name}" créé sans position (parent sans coordonnées)`);
    }
    personsCreated++;
  }

  // ── 11. Créer les organisations (parents en premier) ────────────────────────
  let orgsCreated = 0;
  console.log(`\n🏢  Organisations (${payload.organisations.length})...`);
  const orgKeyToId = new Map<string, string>();

  const orgsWithout = payload.organisations.filter(o => !o.parentKey);
  const orgsWith    = payload.organisations.filter(o =>  o.parentKey);

  for (const batch of [orgsWithout, orgsWith]) {
    for (const o of batch) {
      const id       = stableUuid('org', o.key);
      orgKeyToId.set(o.key, id);
      const parentId = o.parentKey ? orgKeyToId.get(o.parentKey) : undefined;

      await prisma.organisation.create({ data: {
        id,
        name:                o.name,
        description:         o.description ?? null,
        organisationType:    o.parentKey ? 'CELLULE' : 'PRINCIPAL',
        membership:          o.membership as Membership | undefined,
        parentOrganisationId: parentId ?? null,
        isForDM:             false,
      }});

      // Liens royaumes
      for (const kk of (o.kingdomKeys ?? [])) {
        const kingdomId = kingdomKeyToId.get(kk);
        if (kingdomId) {
          await prisma.organisationKingdom.create({ data: { organisationId: id, kingdomId } })
            .catch(() => { /* ignore doublons */ });
        }
      }

      // Liens villes
      for (const ck of (o.cityKeys ?? [])) {
        const cityId = cityKeyToId.get(ck);
        if (cityId) {
          await prisma.organisationCity.create({ data: { organisationId: id, cityId } })
            .catch(() => { /* ignore doublons */ });
        }
      }

      orgsCreated++;
    }
  }

  // ── 12. Déduplication — supprimer les homonymes qui NE sont PAS des entités v2 ─
  // Important : un même nom peut exister en 2 entités v2 légitimes (ex: "Faith" dans Alagir ET Huriya).
  // On ne supprime que les IDs qui ne font partie d'AUCUNE entité v2.
  console.log('\n🧹  Déduplication des résidus d\'anciens imports...');
  let dedupCount = 0;

  const v2PersonIdSet = new Set(personIds);
  const v2PlaceIdSet  = new Set(placeIds);
  const v2OrgIdSet    = new Set(orgIds);

  // Persons : supprimer les homonymes non-v2
  const processedPersonNames = new Set<string>();
  for (const p of payload.persons) {
    if (processedPersonNames.has(p.name)) continue; // déjà traité pour ce nom
    processedPersonNames.add(p.name);
    const dups = await prisma.personOfInterest.findMany({ where: { name: p.name, id: { notIn: [...v2PersonIdSet] } } });
    for (const dup of dups) {
      await prisma.position.deleteMany({ where: { personOfInterestId: dup.id } });
      await prisma.organisationMember.deleteMany({ where: { personId: dup.id } });
      await prisma.personOfInterest.delete({ where: { id: dup.id } });
      dedupCount++;
    }
  }

  // Places : idem
  const processedPlaceNames = new Set<string>();
  for (const p of payload.places) {
    if (processedPlaceNames.has(p.name)) continue;
    processedPlaceNames.add(p.name);
    const dups = await prisma.place.findMany({ where: { name: p.name, id: { notIn: [...v2PlaceIdSet] } } });
    for (const dup of dups) {
      await prisma.position.deleteMany({ where: { placeId: dup.id } });
      await prisma.organisationPlace.deleteMany({ where: { placeId: dup.id } });
      await prisma.place.delete({ where: { id: dup.id } });
      dedupCount++;
    }
  }

  // Orgs : supprimer aussi les homonymes normalisés (ex: "Conseil d'acier" vs "Conseil d'Acier")
  const processedOrgNorms = new Set<string>();
  for (const o of payload.organisations) {
    const norm = normalizeName(o.name);
    if (processedOrgNorms.has(norm)) continue;
    processedOrgNorms.add(norm);
    // Récupérer toutes les orgs non-v2 et vérifier par nom normalisé
    const allOrgs = await prisma.organisation.findMany({ where: { id: { notIn: [...v2OrgIdSet] } } });
    for (const dup of allOrgs.filter(d => normalizeName(d.name) === norm)) {
      await prisma.organisationMember.deleteMany({ where: { organisationId: dup.id } });
      await prisma.organisationCity.deleteMany({ where: { organisationId: dup.id } });
      await prisma.organisationKingdom.deleteMany({ where: { organisationId: dup.id } });
      await prisma.organisationPlace.deleteMany({ where: { organisationId: dup.id } });
      await prisma.organisation.updateMany({ where: { parentOrganisationId: dup.id }, data: { parentOrganisationId: null } });
      await prisma.organisation.delete({ where: { id: dup.id } });
      dedupCount++;
    }
  }

  if (dedupCount > 0) {
    console.log(`   ${dedupCount} doublon(s) supprimé(s).`);
  } else {
    console.log('   Aucun doublon détecté.');
  }

  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n✅  Import terminé :');
  console.log(`   Lieux         : ${placesCreated} créés, ${placesSkipped} ignorés`);
  console.log(`   Personnages   : ${personsCreated} créés, ${personsSkipped} ignorés`);
  console.log(`   Organisations : ${orgsCreated} créées`);
  if (placesSkipped + personsSkipped > 0) {
    console.log('\n  → Vérifiez les noms de villes/royaumes dans le JSON et en base.');
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
