/**
 * Import Maître Ulric Brumel — secrétaire d'Eldric Rigart (Famille Rigart, Alagir).
 * Idempotent.
 *
 * Usage: tsx src/scripts/import-rigart-secretary.ts
 */
import { PrismaClient, PlaceType } from '@prisma/client';

const prisma = new PrismaClient();

const CITY_NAME = 'Alagir';
const ORG_NAME = 'Famille Rigart';
const PLACE_NAME = 'Bureau Rigart — quais du Pourpre';
const NPC_NAME = 'Maître Ulric Brumel';

const DEFAULT_STATS = { STR: 8, DEX: 9, CON: 10, INT: 15, WIS: 14, CHA: 11 };

const DESCRIPTION = [
  "Secrétaire particulier et archiviste de la maison Rigart. Bras droit d'Eldric Rigart pour la paperasse, les contrats fluviaux et la correspondance avec les Cilovard. N'a jamais mis les pieds sur un ponton sans escorte — et préfère de loin les couloirs poussiéreux aux aventures des quais.",
  '',
  'Description physique',
  "Homme d'une cinquantaine d'années, maigre et légèrement voûté — le dos plié par vingt ans de registres. Peau pâle, grise de poussière de papier. Cheveux gris peignés avec une raie d'une rectitude militaire ; favoris minutieusement taillés. Yeux châtains myopes, plissés ; petites lunettes rondes à monture d'étain qu'il essuie sans cesse. Mains longues, doigts tachés d'encre jusqu'aux cuticules. Costume sombre en laine dolomicienne, gilet boutonné jusqu'au col, cachet de cire suspendu à une chaîne plate. Sent la cire d'abeille et le vieux cuir.",
  '',
  'Personnalité',
  "Bureaucrate jusqu'au bout des doigts : poli, méthodique, prudent. Évite les quais, les disputes et tout ce qui ressemble à une aventure. Mesure chaque mot, connaît les numéros de liasse par cœur. Loyal envers Eldric, mais infiniment plus à l'aise avec un registre qu'avec une épée.",
].join('\n');

async function main() {
  const city = await prisma.city.findFirst({
    where: { name: { equals: CITY_NAME, mode: 'insensitive' } },
    include: { position: true },
  });
  if (!city) {
    console.error(`❌ Ville « ${CITY_NAME} » introuvable.`);
    process.exit(1);
  }

  const org = await prisma.organisation.findFirst({ where: { name: ORG_NAME } });
  if (!org) {
    console.error(`❌ Organisation « ${ORG_NAME} » introuvable.`);
    process.exit(1);
  }

  const district = await prisma.district.findFirst({
    where: { cityId: city.id, name: { contains: 'Porte Pourpre', mode: 'insensitive' } },
  });

  const anchorX = city.position?.x ?? 0.5;
  const anchorY = city.position?.y ?? 0.5;

  const placeId = await ensurePlace(city.id, district?.id, org.id, anchorX, anchorY);
  await ensurePerson(city.id, district?.id, placeId, org.id, anchorX, anchorY);

  console.log('\n✅ Import secrétaire Rigart terminé');
}

async function ensurePlace(
  cityId: string,
  districtId: string | undefined,
  orgId: string,
  x: number,
  y: number,
): Promise<string> {
  const description =
    "Petit bureau administratif de la maison Rigart, niché au-dessus des entrepôts du Pourpre. Registres de fret, contrats fluviaux, correspondance Cilovard : tout y passe sous la plume du secrétaire. L'odeur d'encre et de cire domine ; on n'y voit presque jamais Eldric — c'est Ulric Brumel qui tient la maison debout sur le papier.";

  let place = await prisma.place.findFirst({
    where: { name: PLACE_NAME, cityId },
  });

  if (!place) {
    place = await prisma.place.create({
      data: {
        name: PLACE_NAME,
        description,
        placeType: PlaceType.AUTRE,
        cityId,
        districtId: districtId ?? null,
        showOnMap: false,
      },
    });
    await prisma.position
      .create({ data: { x, y, placeId: place.id } })
      .catch(() => {});
    console.log(`✅ Lieu : ${PLACE_NAME}`);
  } else {
    await prisma.place.update({ where: { id: place.id }, data: { description, districtId: districtId ?? null } });
    console.log(`📝 Lieu : ${PLACE_NAME}`);
  }

  await prisma.organisationPlace
    .create({ data: { organisationId: orgId, placeId: place.id } })
    .catch(() => {});

  return place.id;
}

async function ensurePerson(
  cityId: string,
  districtId: string | undefined,
  placeId: string,
  orgId: string,
  x: number,
  y: number,
) {
  let person = await prisma.personOfInterest.findFirst({
    where: { name: NPC_NAME, cityId },
  });

  const data = {
    name: NPC_NAME,
    breed: 'HUMAIN' as const,
    sex: 'MAN' as const,
    membership: 'MARCHAND' as const,
    description: DESCRIPTION,
    cityId,
    districtId: districtId ?? null,
    placeId,
    showOnMap: false,
    ...DEFAULT_STATS,
    ca: null,
    pv: null,
    fp: null,
  };

  if (!person) {
    person = await prisma.personOfInterest.create({ data });
    await prisma.position
      .create({ data: { x, y, personOfInterestId: person.id } })
      .catch(() => {});
    console.log(`✅ PNJ : ${NPC_NAME}`);
  } else {
    await prisma.personOfInterest.update({ where: { id: person.id }, data });
    console.log(`📝 PNJ : ${NPC_NAME}`);
  }

  await prisma.organisationMember
    .create({ data: { organisationId: orgId, personId: person.id } })
    .catch(() => {});
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
