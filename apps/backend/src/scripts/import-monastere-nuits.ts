/**
 * Import Monastère des Nuits — huit mages goliath (Une Nuit … Huit Nuits).
 * Idempotent.
 *
 * Usage: tsx src/scripts/import-monastere-nuits.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ORG_NAME = 'Monastère des Nuits';
const PLACE_NAME = 'Monastère des Nuits';

const DEFAULT_STATS = { STR: 14, DEX: 10, CON: 16, INT: 16, WIS: 12, CHA: 10 };

type NpcRow = {
  name: string;
  sex: 'MAN' | 'WOMAN';
  school: string;
  ca: number;
  pv: number;
  fp: string;
  INT: number;
  WIS: number;
  CHA: number;
  physical: string;
  abilities: string;
};

const NIGHTS: NpcRow[] = [
  {
    name: 'Une Nuit',
    sex: 'WOMAN',
    school: 'Abjuration',
    ca: 14,
    pv: 52,
    fp: '4',
    INT: 17,
    WIS: 16,
    CHA: 12,
    physical:
      "Goliathesse trapue aux stries d'ardoise bleutée sur les bras et les joues. Cheveux rasés en crête, yeux laiteux sans pupille visible. Porte une robe de laine noire bordée de fil d'argent et un gantelet de pierre gravé de glyphes protecteurs.",
    abilities:
      "Maître abjurateur : tisser et défaire les barrières magiques. Sorts signatures — Bouclier, Contresort, Protection contre les armes, Globe d'invulnérabilité (1/j). Réaction « Mur de runes » : annule un sort ciblant un allié à 9 m (recharge après repos court).",
  },
  {
    name: 'Deux Nuits',
    sex: 'MAN',
    school: 'Conjuration',
    ca: 13,
    pv: 48,
    fp: '4',
    INT: 18,
    WIS: 11,
    CHA: 13,
    physical:
      "Goliath massif, peau grise striée de veines noires comme de la fumée figée. Barbe tressée de cordes de cuir, anneaux d'os aux poignets. Une odeur d'ozone et de cendre froide l'entoure après chaque incantation.",
    abilities:
      "Maître conjurateur : appelle créatures et objets d'autres plans. Sorts signatures — Invoquer des animaux, Nuage nauséabond, Porte dimensionnelle. Capacité « Appel du seuil » : invoque 1 élémentaire mineur obéissant 1 h (1/j).",
  },
  {
    name: 'Trois Nuits',
    sex: 'WOMAN',
    school: 'Divination',
    ca: 12,
    pv: 44,
    fp: '4',
    INT: 17,
    WIS: 18,
    CHA: 14,
    physical:
      "Goliathesse élancée pour son peuple, stries argentées en spirale autour des tempes. Yeux violets constamment mi-clos. Tient un bâton creux rempli de sable d'étoile qui s'écoule au rythme de ses visions.",
    abilities:
      "Maître devin : lit les fils du possible. Sorts signatures — Détection de la magie, Clairvoyance, Scrutation. « Éclat de futur » : impose désavantage à une attaque qu'elle a entrevue (réaction, 3/j). Vision passive des mensonges à 9 m.",
  },
  {
    name: 'Quatre Nuits',
    sex: 'MAN',
    school: 'Enchantement',
    ca: 13,
    pv: 46,
    fp: '5',
    INT: 17,
    WIS: 15,
    CHA: 18,
    physical:
      "Goliath au regard doux, stries dorées sur les pommettes. Voix grave et posée, mains callleuses mais gestes précis. Collier de pierres de lune qui vibrent quand il chante les formules d'envoûtement.",
    abilities:
      "Maître enchanteur : sculpte volontés et émotions. Sorts signatures — Charme-personne, Sommeil, Hold person, Suggestion. « Résonance des âmes » : charme ou apeure une cible (JS Sagesse DD 15, 1/j). Immunité aux charmes non magiques.",
  },
  {
    name: 'Cinq Nuits',
    sex: 'WOMAN',
    school: 'Illusion',
    ca: 14,
    pv: 58,
    fp: '6',
    INT: 18,
    WIS: 14,
    CHA: 17,
    physical:
      "Goliathesse imposante aux stries noires et blanches en damier — on jurait qu'elles changent quand on détourne le regard. Cheveux longs tressés de rubans de soie sombre, sourire rare et déroutant. Ses pas ne font presque aucun bruit.",
    abilities:
      "Maîtresse illusionniste : tisse mirages et mensonges sensoriels. Sorts signatures — Image silencieuse, Image majeure, Invisibilité, Mirage. « Manteau des mille reflets » : copie illusoire de elle-même qui peut agir 1 round (recharge 5-6). Avantage aux JS pour dissiper ses illusions.",
  },
  {
    name: 'Six Nuits',
    sex: 'MAN',
    school: 'Évocation',
    ca: 13,
    pv: 55,
    fp: '5',
    INT: 16,
    WIS: 12,
    CHA: 11,
    physical:
      "Goliath cagneux, stries rouges comme des coulées de lave sur la pierre grise de sa peau. Crâne partiellement rasé, cicatrices de brûlures anciennes. Mains toujours chaudes ; l'air tremble légèrement à ses côtés.",
    abilities:
      "Maître évocateur : déchaîne feu, foudre et force brute. Sorts signatures — Boule de feu, Éclair, Mur de feu. « Frappe tellurique » : ligne 18 m, 6d6 dégâts de force (JS Dextérité moitié, recharge 5-6). Résistance aux dégâts de feu et foudre.",
  },
  {
    name: 'Sept Nuits',
    sex: 'WOMAN',
    school: 'Transmutation',
    ca: 14,
    pv: 50,
    fp: '5',
    INT: 18,
    WIS: 13,
    CHA: 12,
    physical:
      "Goliathesse aux proportions changeantes — parfois plus haute, parfois plus compacte selon l'heure du jour. Stries vertes comme de la mousse sur roche. Doigts longs, ongles de pierre polie. Porte des outils alchimiques à la ceinture.",
    abilities:
      "Maître transmuteur : altère matière et forme. Sorts signatures — Métamorphose, Hâte, Pierre en chair, Vol. « Reforge le vivant » : transforme un objet 1 m³ en autre matière non vivante (1/j). Peut marcher sur surfaces instables comme sur pierre plate.",
  },
  {
    name: 'Huit Nuits',
    sex: 'MAN',
    school: 'Nécromancie',
    ca: 15,
    pv: 72,
    fp: '5',
    INT: 18,
    WIS: 16,
    CHA: 14,
    physical:
      "Goliath au visage ascétique, peau gris cendre striée de veines noires. Crâne rasé, tatouages funéraires sur le cuir chevelu, voix rauque et basse. Les flammes vacillent en sa présence ; le froid s'attarde autour de ses mains.",
    abilities:
      "Maître nécromancien : dialogue avec la mort et les ombres. Sorts signatures — Animation des morts, Flétrissement, Parler avec les morts, Nuage mortel. « Poigne du dernier souffle » : 4d10 nécrotiques et réduit max PV (JS Constitution DD 16, recharge 5-6). Résistance aux dégâts nécrotiques ; avantage JS contre la mort.",
  },
];

let anchorX = 0.5;
let anchorY = 0.5;

async function main() {
  const place = await findExistingPlace();
  if (!place) {
    console.error(`❌ Lieu « ${PLACE_NAME} » introuvable — importez-le d'abord.`);
    process.exit(1);
  }

  const placePos = await prisma.position.findFirst({ where: { placeId: place.id } });
  if (placePos) {
    anchorX = placePos.x;
    anchorY = placePos.y;
  }

  const orgId = await ensureOrganisation(place.kingdomId);
  const placeId = await ensurePlaceLinks(place.id, orgId);
  await removeDuplicatePlaces(placeId);
  await ensurePersons(place.kingdomId, orgId, placeId);

  console.log('\n✅ Import Monastère des Nuits terminé');
}

/** Lieu déjà présent en base (import DriveSolenia) — pas de création. */
async function findExistingPlace() {
  const places = await prisma.place.findMany({
    where: { name: PLACE_NAME },
    include: { position: true },
    orderBy: { id: 'asc' },
  });
  if (places.length === 0) return null;
  return (
    places.find((p) => p.position && p.showOnMap) ??
    places.find((p) => !p.kingdomId) ??
    places[0]
  );
}

async function ensureOrganisation(kingdomId: string | null): Promise<string> {
  let org = await prisma.organisation.findFirst({ where: { name: ORG_NAME } });
  const description =
    "Ordre monastique des hautes Dolomites. Huit mages goliath — Une Nuit à Huit Nuits — chacun incarnant une école de la magie arcane. Le monastère veille sur l'équilibre des huit voies ; on n'y entre qu'après une veillée sans lune.";

  if (!org) {
    org = await prisma.organisation.create({
      data: {
        name: ORG_NAME,
        organisationType: 'PRINCIPAL',
        membership: 'RELIGEUX',
        description,
      },
    });
    console.log(`✅ Org : ${ORG_NAME}`);
  } else {
    await prisma.organisation.update({ where: { id: org.id }, data: { description } });
    console.log(`📝 Org : ${ORG_NAME}`);
  }

  if (kingdomId) {
    await prisma.organisationKingdom
      .create({ data: { organisationId: org.id, kingdomId } })
      .catch(() => {});
  }

  return org.id;
}

async function ensurePlaceLinks(placeId: string, orgId: string): Promise<string> {
  await prisma.organisationPlace
    .create({ data: { organisationId: orgId, placeId } })
    .catch(() => {});
  console.log(`🔗 Lieu existant relié : ${PLACE_NAME}`);
  return placeId;
}

/** Supprime les doublons créés par erreur (même nom, autre id). */
async function removeDuplicatePlaces(keepPlaceId: string) {
  const duplicates = await prisma.place.findMany({
    where: { name: PLACE_NAME, id: { not: keepPlaceId } },
  });
  for (const dup of duplicates) {
    await prisma.personOfInterest.updateMany({
      where: { placeId: dup.id },
      data: { placeId: keepPlaceId },
    });
    await prisma.organisationPlace.deleteMany({ where: { placeId: dup.id } });
    await prisma.position.deleteMany({ where: { placeId: dup.id } });
    await prisma.place.delete({ where: { id: dup.id } });
    console.log(`🗑️ Doublon supprimé : ${PLACE_NAME} (${dup.id})`);
  }
}

function buildDescription(npc: NpcRow): string {
  return [
    `École : ${npc.school}.`,
    '',
    'Description physique',
    npc.physical,
    '',
    'Capacités',
    npc.abilities,
  ].join('\n');
}

async function ensurePerson(
  kingdomId: string | null,
  orgId: string,
  placeId: string,
  npc: NpcRow,
) {
  const description = buildDescription(npc);

  let person = await prisma.personOfInterest.findFirst({
    where: { name: npc.name },
  });

  const data = {
    name: npc.name,
    breed: 'GOLIATH' as const,
    sex: npc.sex,
    description,
    kingdomId,
    placeId,
    ca: npc.ca,
    pv: npc.pv,
    fp: npc.fp,
    showOnMap: false,
    STR: DEFAULT_STATS.STR,
    DEX: DEFAULT_STATS.DEX,
    CON: DEFAULT_STATS.CON,
    INT: npc.INT,
    WIS: npc.WIS,
    CHA: npc.CHA,
  };

  if (!person) {
    person = await prisma.personOfInterest.create({ data });
    await prisma.position
      .create({ data: { x: anchorX, y: anchorY, personOfInterestId: person.id } })
      .catch(() => {});
    console.log(`✅ PNJ : ${npc.name} (${npc.school})`);
  } else {
    await prisma.personOfInterest.update({ where: { id: person.id }, data });
    console.log(`📝 PNJ : ${npc.name}`);
  }

  await prisma.organisationMember
    .create({ data: { organisationId: orgId, personId: person.id } })
    .catch(() => {});
}

async function ensurePersons(kingdomId: string | null, orgId: string, placeId: string) {
  for (const npc of NIGHTS) {
    await ensurePerson(kingdomId, orgId, placeId, npc);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
