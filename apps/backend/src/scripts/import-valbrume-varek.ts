/**
 * Import Hameau de Valbrume (Famille Varek) + Garnison Main du Silence (Momoritanie).
 * Idempotent.
 *
 * Usage: tsx src/scripts/import-valbrume-varek.ts
 */
import { PrismaClient, PlaceType } from '@prisma/client';

const prisma = new PrismaClient();

const KINGDOM_NAMES = ['Le Saint-Empire Momoritanien', 'Saint-Empire Momoritanien'];
const HURIYA_CITY_NAME = 'Huriya';

type Breed = 'HUMAIN' | 'OTHER';
const DEFAULT_STATS = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };

let anchorX = 0.5;
let anchorY = 0.5;

type NpcRow = {
  name: string;
  breed?: Breed;
  description: string;
  placeKey?: 'valbrume' | 'garnison';
  orgs?: string[];
  ca: number | null;
  pv: number | null;
  fp: string | null;
  STR?: number;
  DEX?: number;
  CON?: number;
  INT?: number;
  WIS?: number;
  CHA?: number;
};

async function main() {
  const kingdom = await prisma.kingdom.findFirst({
    where: { name: { in: KINGDOM_NAMES } },
  });
  if (!kingdom) {
    console.error('❌ Royaume Momoritanien introuvable. Vérifiez le nom en base.');
    process.exit(1);
  }

  const huriya = await prisma.city.findFirst({
    where: { name: { equals: HURIYA_CITY_NAME, mode: 'insensitive' } },
  });

  const kingdomPos = await prisma.position.findFirst({ where: { kingdomId: kingdom.id } });
  if (kingdomPos) {
    anchorX = kingdomPos.x;
    anchorY = kingdomPos.y;
  }

  const orgIds = await ensureOrganisations(kingdom.id, huriya?.id);
  const placeIds = await ensurePlaces(kingdom.id, huriya?.id, orgIds);
  await ensurePersons(kingdom.id, orgIds, placeIds);

  console.log('\n✅ Import Valbrume / Main du Silence terminé');
}

async function ensureOrg(
  orgIds: Record<string, string>,
  data: {
    name: string;
    orgType: 'PRINCIPAL' | 'CELLULE';
    membership: 'POLITIC' | 'MARCHAND' | 'MILITAIRE' | 'CRIMINALITE' | 'OTHER';
    description: string;
    kingdomId: string;
    cityId?: string;
  },
): Promise<string> {
  let org = await prisma.organisation.findFirst({ where: { name: data.name } });
  if (!org) {
    org = await prisma.organisation.create({
      data: {
        name: data.name,
        organisationType: data.orgType,
        membership: data.membership,
        description: data.description,
      },
    });
    console.log(`✅ Org créée : ${data.name}`);
  } else if (data.description && !org.description?.includes('Valbrume')) {
    await prisma.organisation.update({
      where: { id: org.id },
      data: { description: data.description },
    });
    console.log(`📝 Org enrichie : ${data.name}`);
  } else {
    console.log(`ℹ️  Org existante : ${data.name}`);
  }

  orgIds[data.name] = org.id;

  await prisma.organisationKingdom
    .create({ data: { organisationId: org.id, kingdomId: data.kingdomId } })
    .catch(() => {});

  if (data.cityId) {
    await prisma.organisationCity
      .create({ data: { organisationId: org.id, cityId: data.cityId } })
      .catch(() => {});
  }

  return org.id;
}

async function ensureOrganisations(kingdomId: string, huriyaId?: string) {
  const orgIds: Record<string, string> = {};

  await ensureOrg(orgIds, {
    name: 'Famille Varek',
    orgType: 'PRINCIPAL',
    membership: 'POLITIC',
    kingdomId,
    cityId: huriyaId,
    description:
      "Famille dirigeante du hameau de Valbrume. Respectée depuis plusieurs générations : sans noblesse, elle possède les meilleures terres du hameau et sert d'intermédiaire entre paysans et autorités momoritaines. Pragmatiques, protecteurs, très attachés aux traditions (médaillon de Tal Alion).",
  });

  await ensureOrg(orgIds, {
    name: 'La Main du Silence',
    orgType: 'PRINCIPAL',
    membership: 'MILITAIRE',
    kingdomId,
    description:
      "Faction impériale (~25 membres à Valbrume). Officiellement : escorte militaire, protection des routes, maintien de l'ordre. En réalité : renseignement, surveillance politique, élimination discrète. Garnison dans un relais fortifié en pierre. Effectifs types : ~18 soldats, ~4 éclaireurs, ~2 vétérans (voir fiches PNJ clés).",
  });

  return orgIds;
}

async function ensurePlace(
  kingdomId: string,
  orgIds: Record<string, string>,
  data: {
    key: string;
    name: string;
    placeType: PlaceType;
    description: string;
    orgs?: string[];
    cityId?: string;
  },
): Promise<string> {
  let place = await prisma.place.findFirst({
    where: { name: data.name, kingdomId },
  });
  if (!place) {
    place = await prisma.place.create({
      data: {
        name: data.name,
        placeType: data.placeType,
        description: data.description,
        kingdomId,
        cityId: data.cityId ?? null,
        showOnMap: false,
      },
    });
    await prisma.position
      .create({ data: { x: anchorX, y: anchorY, placeId: place.id } })
      .catch(() => {});
    console.log(`✅ Lieu : ${data.name}`);
  } else if (data.description) {
    await prisma.place.update({ where: { id: place.id }, data: { description: data.description } });
  }

  for (const orgName of data.orgs ?? []) {
    const oid = orgIds[orgName];
    if (oid) {
      await prisma.organisationPlace
        .create({ data: { organisationId: oid, placeId: place.id } })
        .catch(() => {});
    }
  }

  return place.id;
}

async function ensurePlaces(kingdomId: string, huriyaId: string | undefined, orgIds: Record<string, string>) {
  const ids: Record<string, string> = {};

  ids.valbrume = await ensurePlace(kingdomId, orgIds, {
    key: 'valbrume',
    name: 'Hameau de Valbrume',
    placeType: 'AUTRE',
    cityId: huriyaId,
    orgs: ['Famille Varek'],
    description:
      "Petit hameau agricole des plaines fertiles de Momoritanie, à quelques jours de route d'Huriya. Terres Varek, traditions rurales, juge local pour conflits mineurs.",
  });

  ids.garnison = await ensurePlace(kingdomId, orgIds, {
    key: 'garnison',
    name: 'Relais fortifié — Garnison de la Main du Silence',
    placeType: 'DONJON_CAVERNE',
    cityId: huriyaId,
    orgs: ['La Main du Silence'],
    description:
      "Ancien relais fortifié en pierre. ~25 membres de la Main du Silence (escorte officielle, renseignement et actions discrètes). Commandé par Kaelen Voss « Voix Silencieuse ».",
  });

  return ids;
}

async function ensurePerson(
  kingdomId: string,
  orgIds: Record<string, string>,
  placeIds: Record<string, string>,
  npc: NpcRow,
) {
  const placeId = npc.placeKey ? placeIds[npc.placeKey] : undefined;

  let person = await prisma.personOfInterest.findFirst({
    where: { name: npc.name, kingdomId },
  });
  if (!person) {
    person = await prisma.personOfInterest.create({
      data: {
        name: npc.name,
        breed: npc.breed ?? 'HUMAIN',
        description: npc.description,
        kingdomId,
        placeId,
        ca: npc.ca,
        pv: npc.pv,
        fp: npc.fp,
        showOnMap: false,
        STR: npc.STR ?? DEFAULT_STATS.STR,
        DEX: npc.DEX ?? DEFAULT_STATS.DEX,
        CON: npc.CON ?? DEFAULT_STATS.CON,
        INT: npc.INT ?? DEFAULT_STATS.INT,
        WIS: npc.WIS ?? DEFAULT_STATS.WIS,
        CHA: npc.CHA ?? DEFAULT_STATS.CHA,
      },
    });
    await prisma.position
      .create({ data: { x: anchorX, y: anchorY, personOfInterestId: person.id } })
      .catch(() => {});
    console.log(`✅ PNJ : ${npc.name}`);
  } else {
    await prisma.personOfInterest.update({
      where: { id: person.id },
      data: {
        description: npc.description,
        placeId: placeId ?? person.placeId,
        ca: npc.ca,
        pv: npc.pv,
        fp: npc.fp,
        STR: npc.STR,
        DEX: npc.DEX,
        CON: npc.CON,
        INT: npc.INT,
        WIS: npc.WIS,
        CHA: npc.CHA,
      },
    });
    console.log(`📝 PNJ mis à jour : ${npc.name}`);
  }

  for (const orgName of npc.orgs ?? []) {
    const oid = orgIds[orgName];
    if (oid) {
      await prisma.organisationMember
        .create({ data: { organisationId: oid, personId: person.id } })
        .catch(() => {});
    }
  }
}

async function ensurePersons(
  kingdomId: string,
  orgIds: Record<string, string>,
  placeIds: Record<string, string>,
) {
  const npcs: NpcRow[] = [
    {
      name: 'Odran Varek',
      placeKey: 'valbrume',
      orgs: ['Famille Varek'],
      ca: 12,
      pv: 27,
      fp: '1',
      STR: 14,
      DEX: 10,
      CON: 13,
      INT: 11,
      WIS: 14,
      CHA: 15,
      description:
        "Patriarche et chef du hameau de Valbrume, 58 ans. Dos légèrement voûté, barbe grisonnante, visage buriné, mains cicatrisées. Tunique de laine brune, manteau de voyage, médaillon de Tal Alion. Pragmatique, protecteur, patient ; juge local des conflits mineurs.",
    },
    {
      name: 'Maela Varek',
      placeKey: 'valbrume',
      orgs: ['Famille Varek'],
      ca: 11,
      pv: 18,
      fp: '1/4',
      STR: 10,
      DEX: 11,
      CON: 12,
      INT: 13,
      WIS: 15,
      CHA: 14,
      description:
        "Épouse d'Odran, 54 ans. Cheveux gris argent en chignon, yeux verts perçants. Grande beauté malgré l'âge ; repère immédiatement les mensonges.",
    },
    {
      name: 'Garrik Varek',
      placeKey: 'valbrume',
      orgs: ['Famille Varek'],
      ca: 13,
      pv: 38,
      fp: '2',
      STR: 16,
      DEX: 11,
      CON: 15,
      INT: 10,
      WIS: 12,
      CHA: 12,
      description:
        "Fils aîné, 30 ans. Immense gaillard, cheveux châtains courts, épaules larges, tablier de cuir.",
    },
    {
      name: 'Elira Varek',
      placeKey: 'valbrume',
      orgs: ['Famille Varek'],
      ca: 11,
      pv: 16,
      fp: '1/4',
      STR: 9,
      DEX: 12,
      CON: 11,
      INT: 15,
      WIS: 13,
      CHA: 14,
      description:
        "Fille cadette, 22 ans. Cheveux noirs très longs, yeux noisette. Intelligence et curiosité remarquées.",
    },
    {
      name: 'Kaelen Voss',
      placeKey: 'garnison',
      orgs: ['La Main du Silence'],
      ca: 17,
      pv: 105,
      fp: '7',
      STR: 14,
      DEX: 18,
      CON: 16,
      INT: 15,
      WIS: 16,
      CHA: 14,
      description:
        "« Voix Silencieuse » — commandant de la garnison, ~40 ans. Silhouette fine et athlétique, cheveux noirs courts, yeux gris métalliques, visage impassible. Méthodique, calculateur, loyal à la Main. Combat : multiattaque, lame silencieuse (+7, 1d8+4 + 2d6 poison), arbalète ; attaque sournoise +4d6, évasion, disparition tactique (invisibilité 1 tour, recharge 5-6).",
    },
    {
      name: 'Lys Corven',
      placeKey: 'garnison',
      orgs: ['La Main du Silence'],
      ca: 16,
      pv: 68,
      fp: '5',
      STR: 12,
      DEX: 18,
      CON: 14,
      INT: 13,
      WIS: 15,
      CHA: 12,
      description:
        "Sergent — « Maîtresse des Éclaireurs », ~35 ans. Cheveux roux en tresse, cicatrices fines, yeux verts. Épée courte et arc court +7 ; attaque sournoise +3d6 ; camouflage naturel.",
    },
    {
      name: 'Dorian Hale',
      placeKey: 'garnison',
      orgs: ['La Main du Silence'],
      ca: 15,
      pv: 72,
      fp: '5',
      STR: 11,
      DEX: 14,
      CON: 14,
      INT: 15,
      WIS: 17,
      CHA: 16,
      description:
        "Frère Dorian Hale — agent inquisitorial. Chauve, traits sévères, manteau noir, yeux bleu pâle. Sorts DD 14 : thaumaturgie, guidance ; zone de vérité, détection des pensées ; suggestion 1/j.",
    },
    {
      name: 'Soldat type — Main du Silence',
      placeKey: 'garnison',
      orgs: ['La Main du Silence'],
      ca: 15,
      pv: 27,
      fp: '1',
      STR: 13,
      DEX: 14,
      CON: 12,
      INT: 11,
      WIS: 12,
      CHA: 10,
      description:
        "Archétype soldat de la garnison (~18 effectifs). CA 15, PV 27, FP 1. Épée courte +4, arbalète légère +4. Formation silencieuse, discipline absolue.",
    },
    {
      name: 'Éclaireur type — Main du Silence',
      placeKey: 'garnison',
      orgs: ['La Main du Silence'],
      ca: 15,
      pv: 32,
      fp: '2',
      STR: 11,
      DEX: 16,
      CON: 12,
      INT: 12,
      WIS: 14,
      CHA: 11,
      description:
        "Archétype éclaireur (~4 effectifs). Arc court +5, dague +5 ; attaque sournoise +2d6, camouflage.",
    },
    {
      name: 'Vétéran type — Main du Silence',
      placeKey: 'garnison',
      orgs: ['La Main du Silence'],
      ca: 17,
      pv: 58,
      fp: '4',
      STR: 16,
      DEX: 15,
      CON: 16,
      INT: 12,
      WIS: 14,
      CHA: 12,
      description:
        "Archétype vétéran (~2 effectifs). Multiattaque, épée longue +6, arbalète lourde +6. Indomptable 1/j, gardien du secret.",
    },
  ];

  for (const npc of npcs) {
    await ensurePerson(kingdomId, orgIds, placeIds, npc);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
