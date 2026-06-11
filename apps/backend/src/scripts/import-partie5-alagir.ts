/**
 * Import des entités extraites de Partie 5.md (session Alagir).
 * Idempotent. Exécuter d'abord extract-partie5.ts pour le JSON brut.
 *
 * Usage: tsx src/scripts/import-partie5-alagir.ts
 */
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient, PlaceType } from '@prisma/client';

const prisma = new PrismaClient();
const CITY_ID = '6d39b2bc-6488-4763-9643-b57e9af59c03';
const __dirname = dirname(fileURLToPath(import.meta.url));
const EXTRACTED_JSON = join(__dirname, '../../DriveSolenia/extracted/partie5-entities.json');

type Breed =
  | 'HUMAIN'
  | 'ELFE'
  | 'NAIN'
  | 'DEMI_ELFE'
  | 'DEMI_ORC'
  | 'GNOME'
  | 'TIEFFELIN'
  | 'HALFELIN'
  | 'OTHER';

const DEFAULT_STATS = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };

let cityX = 0;
let cityY = 0;

async function main() {
  const cityPos = await prisma.position.findFirst({ where: { cityId: CITY_ID } });
  if (cityPos) {
    cityX = cityPos.x;
    cityY = cityPos.y;
  }

  const orgIds = await loadOrgIds();
  const districtIds = await loadDistrictIds();
  const orgIdsNew = await createOrganisations(orgIds);
  Object.assign(orgIds, orgIdsNew);

  const placeIds = await createPlaces(districtIds, orgIds);
  await createPersons(districtIds, orgIds, placeIds);
  await createLores(orgIds, placeIds);
  await enrichFromExtracted(districtIds, orgIds);
  await linkPalazzoToTovalis(placeIds, orgIds);

  console.log('\n✅ Import Partie 5 (Alagir) terminé');
}

async function loadOrgIds(): Promise<Record<string, string>> {
  const orgs = await prisma.organisation.findMany({
    where: { cities: { some: { cityId: CITY_ID } } },
    select: { id: true, name: true },
  });
  const map: Record<string, string> = {};
  for (const o of orgs) map[o.name] = o.id;
  return map;
}

async function loadDistrictIds(): Promise<Record<string, string>> {
  const districts = await prisma.district.findMany({
    where: { cityId: CITY_ID },
    select: { id: true, name: true },
  });
  const map: Record<string, string> = {};
  for (const d of districts) {
    if (d.name.includes('Jardins')) map.jardins = d.id;
    if (d.name.includes('Porte Pourpre')) map.portePourpre = d.id;
    if (d.name.includes('Cinquième')) map.cinquieme = d.id;
    if (d.name.includes('Comptes de Zitris') || d.name.includes('Zitris')) map.zitris = d.id;
    if (d.name.includes('Chant de Tal')) map.chant = d.id;
    if (d.name.includes('Château de Verre')) map.chateau = d.id;
  }
  return map;
}

async function ensureOrg(
  orgIds: Record<string, string>,
  data: {
    name: string;
    orgType: 'PRINCIPAL' | 'CELLULE';
    membership: 'POLITIC' | 'MARCHAND' | 'MILITAIRE' | 'CRIMINALITE';
    description: string;
  },
): Promise<string> {
  if (orgIds[data.name]) return orgIds[data.name];
  const created = await prisma.organisation.create({
    data: {
      name: data.name,
      organisationType: data.orgType,
      membership: data.membership,
      description: data.description,
    },
  });
  await prisma.organisationCity
    .create({ data: { organisationId: created.id, cityId: CITY_ID } })
    .catch(() => {});
  orgIds[data.name] = created.id;
  console.log(`✅ Org : ${data.name}`);
  return created.id;
}

async function ensurePlace(
  districtIds: Record<string, string>,
  orgIds: Record<string, string>,
  data: {
    name: string;
    placeType: PlaceType;
    description: string;
    districtKey?: keyof typeof districtIds extends string ? string : never;
    orgs?: string[];
  },
): Promise<string> {
  const districtId = data.districtKey ? districtIds[data.districtKey] : undefined;
  let place = await prisma.place.findFirst({ where: { name: data.name, cityId: CITY_ID } });
  if (!place) {
    place = await prisma.place.create({
      data: {
        name: data.name,
        placeType: data.placeType,
        description: data.description,
        cityId: CITY_ID,
        districtId,
        showOnMap: false,
      },
    });
    await prisma.position.create({ data: { x: cityX, y: cityY, placeId: place.id } }).catch(() => {});
    console.log(`✅ Lieu : ${data.name}`);
  } else if (districtId && !place.districtId) {
    await prisma.place.update({ where: { id: place.id }, data: { districtId } });
  }
  if (!place.description && data.description) {
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

async function ensurePerson(
  districtIds: Record<string, string>,
  orgIds: Record<string, string>,
  data: {
    name: string;
    breed?: Breed;
    description: string;
    districtKey?: string;
    placeId?: string;
    ca?: number | null;
    pv?: number | null;
    fp?: string | null;
    orgs?: string[];
  },
): Promise<string> {
  const districtId = data.districtKey ? districtIds[data.districtKey] : undefined;
  let person = await prisma.personOfInterest.findFirst({ where: { name: data.name, cityId: CITY_ID } });
  if (!person) {
    person = await prisma.personOfInterest.create({
      data: {
        name: data.name,
        breed: data.breed,
        description: data.description,
        cityId: CITY_ID,
        districtId,
        placeId: data.placeId,
        ca: data.ca ?? null,
        pv: data.pv ?? null,
        fp: data.fp ?? null,
        showOnMap: false,
        ...DEFAULT_STATS,
      },
    });
    await prisma.position
      .create({ data: { x: cityX, y: cityY, personOfInterestId: person.id } })
      .catch(() => {});
    console.log(`✅ PNJ : ${data.name}`);
  } else {
    const updates: Record<string, string> = {};
    if (data.placeId && !person.placeId) updates.placeId = data.placeId;
    if (districtId && !person.districtId) updates.districtId = districtId;
    if (Object.keys(updates).length) {
      await prisma.personOfInterest.update({ where: { id: person.id }, data: updates });
    }
  }
  for (const orgName of data.orgs ?? []) {
    const oid = orgIds[orgName];
    if (oid) {
      await prisma.organisationMember
        .create({ data: { organisationId: oid, personId: person.id } })
        .catch(() => {});
    }
  }
  return person.id;
}

async function ensureLore(
  data: {
    title: string;
    content: string;
    summary?: string;
    tags?: string[];
    dateInGame?: string | number;
    isForDM?: boolean;
    orgNames?: string[];
    placeNames?: string[];
    personNames?: string[];
  },
  orgIds: Record<string, string>,
  placeIds: Record<string, string>,
) {
  const existing = await prisma.lore.findFirst({ where: { title: data.title } });
  if (existing) {
    console.log(`ℹ️  Lore existante : ${data.title}`);
    return existing.id;
  }
  const lore = await prisma.lore.create({
    data: {
      title: data.title,
      content: data.content,
      summary: data.summary ?? null,
      tags: data.tags ?? ['Partie 5', 'Alagir'],
      dateInGame: data.dateInGame != null ? String(data.dateInGame) : null,
      isForDM: data.isForDM ?? true,
    },
  });
  await prisma.loreCity.create({ data: { loreId: lore.id, cityId: CITY_ID } }).catch(() => {});
  for (const on of data.orgNames ?? []) {
    const oid = orgIds[on];
    if (oid) await prisma.loreOrganisation.create({ data: { loreId: lore.id, organisationId: oid } }).catch(() => {});
  }
  for (const pn of data.placeNames ?? []) {
    const pid = placeIds[pn];
    if (pid) await prisma.lorePlace.create({ data: { loreId: lore.id, placeId: pid } }).catch(() => {});
  }
  for (const name of data.personNames ?? []) {
    const p = await prisma.personOfInterest.findFirst({ where: { name, cityId: CITY_ID } });
    if (p) await prisma.lorePerson.create({ data: { loreId: lore.id, personId: p.id } }).catch(() => {});
  }
  console.log(`✅ Lore : ${data.title}`);
  return lore.id;
}

async function createOrganisations(orgIds: Record<string, string>) {
  await ensureOrg(orgIds, {
    name: 'Famille Rigart',
    orgType: 'PRINCIPAL',
    membership: 'MARCHAND',
    description:
      "Maison marchande fluviale d'Alagir. Dorian Rigart a bâti les entrepôts des quais ; Eldric poursuit l'ouverture commerciale. Alliance officielle avec les Cilovard (Partie 5) — concurrence avec les Tovalis sur le fleuve.",
  });
  await ensureOrg(orgIds, {
    name: 'Guilde du Marteau Blanc',
    orgType: 'PRINCIPAL',
    membership: 'MARCHAND',
    description:
      "Guilde des artisans et taverniers. Cède les parts de « La Loutre SAOUL » à la Compagnie des Trois Moustiquaires (récompense Harl Denvar, Partie 5).",
  });
  await ensureOrg(orgIds, {
    name: 'Compagnie des Trois Moustiquaires',
    orgType: 'CELLULE',
    membership: 'MARCHAND',
    description: "Compagnie d'aventuriers propriétaire de La Loutre SAOUL après contrat Sneuk (Partie 5).",
  });
  await ensureOrg(orgIds, {
    name: 'Famille Mastiggia',
    orgType: 'PRINCIPAL',
    membership: 'MARCHAND',
    description:
      "Aristocratie dolomitcienne, marchands d'âmes et de corps. Comptoir à Alagir (Porte Pourpre). Gesouto Mastiggia — ligne Ezbehar / clan Izotzargi (Partie 5).",
  });
  return orgIds;
}

async function createPlaces(
  districtIds: Record<string, string>,
  orgIds: Record<string, string>,
): Promise<Record<string, string>> {
  const ids: Record<string, string> = {};

  ids['Palazzo Khaz\'Kanoon'] = await ensurePlace(districtIds, orgIds, {
    name: "Palazzo Khaz'Kanoon",
    placeType: 'AUTRE',
    districtKey: 'jardins',
    orgs: ['Famille Tovalis'],
    description:
      "Siège Tovalis dans les Jardins des Âmes. Mur d'enceinte, pins, jardins, écuries. Monolithe d'onyx et bas-relief « Les Fils de la Pierre » (Arkhal le Premier). Grande salle de balle, dédale de couloirs, salle d'entraînement de Harl Denvar.",
  });

  ids['Salle de balle du Palazzo'] = await ensurePlace(districtIds, orgIds, {
    name: 'Salle de balle du Palazzo',
    placeType: 'AUTRE',
    districtKey: 'jardins',
    orgs: ['Famille Tovalis'],
    description:
      "Hall ~50 m, marbre blanc veiné de pourpre (kintsugi), tentures, chandeliers magiques. Balcon sur excavation illuminée vers les abîmes — vitrine du pouvoir Tovalis.",
  });

  ids["Salle d'entraînement Harl Denvar"] = await ensurePlace(districtIds, orgIds, {
    name: "Salle d'entraînement Harl Denvar",
    placeType: 'AUTRE',
    districtKey: 'jardins',
    orgs: ['Famille Tovalis'],
    description:
      "10×10 m, marbre pourpre veiné de blanc. Râteliers d'armes, cheminée, marteau blanc veiné de pourpre. Harl y entraîne Cryta et la garde personnelle.",
  });

  ids['Crypte Rubis'] = await ensurePlace(districtIds, orgIds, {
    name: 'Crypte Rubis',
    placeType: 'AUTRE',
    districtKey: 'chateau',
    orgs: ["L'Œil Pourpre", 'Le Soleil Pourpre'],
    description:
      "Sous-sol lié à la Citadelle Rouge. Préparatifs d'« écailles » et matrices mentales (réunion Radius–Regalio, Partie 5).",
  });

  ids["Conservatoire d'Alagir"] = await ensurePlace(districtIds, orgIds, {
    name: "Conservatoire d'Alagir",
    placeType: 'AUTRE',
    districtKey: 'chateau',
    orgs: ['Famille Palhindile'],
    description:
      "Institution artistique des Palhindile. Représentation « L'Hymne de la Flamme et du Marbre » — side quest « Les Ombres du Conservatoire » (harpe possédée).",
  });

  ids['Carrières Écarlates — galerie Veine Hurlante'] = await ensurePlace(districtIds, orgIds, {
    name: 'Carrières Écarlates — galerie Veine Hurlante',
    placeType: 'AUTRE',
    districtKey: 'cinquieme',
    orgs: ['Famille Tovalis'],
    description:
      "Galerie secondaire fermée en urgence. Veine de marbre pourpre luminescent ; roche qui hurle. Fragment dormant de Tal Odius (side quest Partie 5).",
  });

  ids['Manoir Regalio Regani'] = await ensurePlace(districtIds, orgIds, {
    name: 'Manoir Regalio Regani',
    placeType: 'AUTRE',
    districtKey: 'portePourpre',
    orgs: ["L'Œil Pourpre"],
    description:
      "Nobiliau dolomitcien 3e ordre. Soirée pour Marcheto Spazi ; pièce au 2e étage pour rendez-vous OP. Mesures anti-magie, combes accessibles, garde privée.",
  });

  ids['Atelier Amiro Léovine'] = await ensurePlace(districtIds, orgIds, {
    name: 'Atelier Amiro Léovine',
    placeType: 'AUTRE',
    districtKey: 'cinquieme',
    description:
      "Atelier de cristomancie (clé donnée par Laguna Temper). Accès au laboratoire souterrain en montagne.",
  });

  ids['Laboratoire abandonné d\'Amiro Léovine'] = await ensurePlace(districtIds, orgIds, {
    name: "Laboratoire abandonné d'Amiro Léovine",
    placeType: 'AUTRE',
    description:
      "Ancien labo d'alchimie et cristaux en montagne (salles I–VI). Virion Omalee / Amiro Léovine, clones cristallins, Valdris. Environnement inflammable.",
  });

  ids['Échoppe Folduin Xyrlana'] = await ensurePlace(districtIds, orgIds, {
    name: 'Échoppe Folduin Xyrlana',
    placeType: 'MAGASIN',
    districtKey: 'portePourpre',
    orgs: ['Famille Cilovard', 'Famille Palhindile'],
    description:
      "Échoppe cossue Porte Pourpre. Clerc-usurier de Zitris, pourpoint or et noir, garde armée. Dette 300 Po envers Laguna Temper.",
  });

  ids['Demeure de Laguna Temper'] = await ensurePlace(districtIds, orgIds, {
    name: 'Demeure de Laguna Temper',
    placeType: 'AUTRE',
    districtKey: 'cinquieme',
    description:
      "Demeure gnome façonnée comme de la terre glaise (5e Roue). Laguna Temper, sorcière cristomancie 158 ans, niveau 4.",
  });

  ids['Domaine Mastiggia'] = await ensurePlace(districtIds, orgIds, {
    name: 'Domaine Mastiggia',
    placeType: 'AUTRE',
    districtKey: 'portePourpre',
    orgs: ['Famille Mastiggia'],
    description:
      "Domaine de Gesouto Mastiggia (Porte Pourpre). Banquets, caves, commerce d'esclaves — storyline Ezbehar / Izotzargi.",
  });

  ids['Comptoir Mastiggia — Larmes d\'Ambre'] = await ensurePlace(districtIds, orgIds, {
    name: "Comptoir Mastiggia — Larmes d'Ambre",
    placeType: 'MAGASIN',
    districtKey: 'zitris',
    orgs: ['Famille Mastiggia'],
    description: "Bastion commercial Mastiggia près des comptoirs de Zitris. Acte II storyline Ezbehar.",
  });

  return ids;
}

async function createPersons(
  districtIds: Record<string, string>,
  orgIds: Record<string, string>,
  placeIds: Record<string, string>,
) {
  await ensurePerson(districtIds, orgIds, {
    name: 'Eldric Rigart',
    breed: 'HUMAIN',
    orgs: ['Famille Rigart', 'Famille Cilovard'],
    description:
      "Jeune héritier Rigart. Discours au port sur l'alliance Cilovard (Partie 5). Fils de Dorian Rigart, vision commerce fluvial ouvert.",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Dorian Rigart',
    breed: 'HUMAIN',
    orgs: ['Famille Rigart'],
    description:
      "Père d'Eldric, fondateur des entrepôts des quais d'Alagir (évoqué au discours du port, Partie 5).",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Ordan Tovalis',
    breed: 'HUMAIN',
    orgs: ['Famille Tovalis'],
    description:
      "Porte-parole Tovalis. Protestation publique contre l'alliance Cilovard–Rigart sur l'estrade du port (Partie 5).",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Veda Karom',
    breed: 'HUMAIN',
    orgs: ['La Braise'],
    description:
      "Contact Braise. Donne rendez-vous à La Roue de Secours ; met Harl Denvar en relation avec les PJ (Partie 5).",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Darn Fer-Vallée',
    breed: 'HUMAIN',
    orgs: ['La Braise'],
    description:
      "Membre de la Braise. Contact à La Roue de Secours, escorte vers Palazzo Khaz'Kanoon et Harl Denvar.",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Cryta',
    breed: 'DEMI_ORC',
    districtKey: 'jardins',
    placeId: placeIds["Salle d'entraînement Harl Denvar"],
    orgs: ['Famille Tovalis'],
    ca: 14,
    pv: 45,
    fp: '3',
    description:
      "Demi-orc ~40 ans, peau verte, crocs, yeux jaunes, cheveux noirs striés de gris. Garde en entraînement avec Harl Denvar au Palazzo.",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Radius Ignis Mirdobas',
    breed: 'HUMAIN',
    orgs: ["L'Œil Pourpre", 'Le Soleil Pourpre'],
    description:
      "Officier liaison Œil Pourpre. Rencontre secrète chez Regalio Regani : Crypte Rubis, écailles, canalistes, quais Arrezo (Partie 5).",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Regalio Regani',
    breed: 'HUMAIN',
    placeId: placeIds['Manoir Regalio Regani'],
    orgs: ["L'Œil Pourpre"],
    description:
      "Nobliau dolomitcien 3e ordre à Alagir. Couverture artistique ; officier de liaison OP–Duchés. Hôte de Marcheto Spazi.",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Marcheto Spazi',
    breed: 'HUMAIN',
    description:
      "Sculpteur dolomitcien. Soirée mondaine chez Regalio Regani — quête d'infiltration Harl Denvar (Partie 5).",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Narboki Runrock',
    breed: 'NAIN',
    placeId: placeIds['Manoir Regalio Regani'],
    description:
      "Nain, cuisinier du manoir Regani. Peut aider à infiltrer la soirée (peu fiable) moyennant finance.",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Sneuk',
    breed: 'HUMAIN',
    orgs: ['Guilde du Marteau Blanc'],
    description: "Tavernier de La Loutre SAOUL ; contrat cédé à la Compagnie des Trois Moustiquaires (Partie 5).",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Laguna Temper',
    breed: 'GNOME',
    placeId: placeIds['Demeure de Laguna Temper'],
    ca: 12,
    pv: 22,
    fp: '2',
    description:
      "Sorcière gnome 158 ans (niv. 4). Cheveux roux rasés côté gauche, yeux noirs, 84 cm. Cristomancie — renvoie vers atelier Amiro Léovine après dette Folduin.",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Folduin Xyrlana',
    breed: 'HUMAIN',
    placeId: placeIds['Échoppe Folduin Xyrlana'],
    orgs: ['Famille Cilovard', 'Famille Palhindile'],
    description:
      "Clerc de Zitris et usurier. Échoppe Porte Pourpre, pourpoint or/noir, 300 Po dus à Laguna. Liens Cilovard et Palhindile.",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Amiro Léovine',
    breed: 'ELFE',
    placeId: placeIds["Laboratoire abandonné d'Amiro Léovine"],
    description:
      "Cristomancien, anciennement Virion Omalee (V.O.). Précepteur d'Elerÿna ; clones cristallins et expériences Valdris.",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Gesouto Mastiggia',
    breed: 'HUMAIN',
    placeId: placeIds['Domaine Mastiggia'],
    orgs: ['Famille Mastiggia'],
    description:
      "Aristocrate dolomitcien, domaine Porte Pourpre. Ligne « Chaînes du Sang » / clan Izotzargi (Partie 5).",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Virion Omalee',
    breed: 'ELFE',
    description: "Véritable nom d'Amiro Léovine (initiales V.O.). Précepteur d'Elerÿna, cristomancien.",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Elerÿna Solanmir',
    breed: 'ELFE',
    description: "PJ / lignée draconique Valdris. Quête laboratoire Amiro Léovine (Partie 5).",
  });

  await ensurePerson(districtIds, orgIds, {
    name: 'Nerios Vozin',
    breed: 'HUMAIN',
    description: "Alchimiste recherché (Zenos VIRION) — piste cristomancie Eleryna.",
  });

  // Enrichir Harl si déjà présent
  const harl = await prisma.personOfInterest.findFirst({
    where: { name: 'Harl Denvar', cityId: CITY_ID },
  });
  if (harl) {
    const extra =
      " Partie 5 : test de garde de l'écaille ; quête infiltration soirée Regalio/Marcheto ; récompense Loutre SAOUL.";
    if (!harl.description?.includes('Partie 5')) {
      await prisma.personOfInterest.update({
        where: { id: harl.id },
        data: { description: (harl.description ?? '') + extra },
      });
      console.log('📝 Harl Denvar enrichi (Partie 5)');
    }
  }
}

async function createLores(orgIds: Record<string, string>, placeIds: Record<string, string>) {
  await ensureLore(
    {
      title: 'Bas-relief « Les Fils de la Pierre » (Arkhal le Premier)',
      summary: 'Frise historique Tovalis au Palazzo.',
      isForDM: true,
      content: `Autour du monolithe d'onyx : premiers Tovalis, Arkhal le Premier au marteau runique, justice clanique. Inscription : « Nous ne bâtissons pas des murs — nous bâtissons des serments. »`,
      tags: ['Partie 5', 'Tovalis', 'Histoire'],
      placeNames: ["Palazzo Khaz'Kanoon"],
      orgNames: ['Famille Tovalis'],
    },
    orgIds,
    placeIds,
  );

  await ensureLore(
    {
      title: "Alliance Cilovard–Rigart au port d'Alagir",
      dateInGame: '887',
      summary: 'Discours de Velena et Eldric ; protestation Ordan Tovalis.',
      content: `Lady Velena Cilovard et Eldric Rigart annoncent le partenariat officiel Cilovard–Rigart sur l'estrade du port. Eldric rend hommage à Dorian Rigart. Ordan Tovalis conteste violemment le changement sur les quais. Garde Cilovard disperse la foule ; rumeur d'arrivée du Soleil Pourpre.`,
      tags: ['Partie 5', 'Alagir', 'Politique', '887'],
      personNames: ['Lady Velena Cilovard', 'Eldric Rigart', 'Ordan Tovalis'],
      orgNames: ['Famille Cilovard', 'Famille Rigart', 'Famille Tovalis'],
    },
    orgIds,
    placeIds,
  );

  await ensureLore(
    {
      title: 'Réunion Radius Ignis Mirdobas – Regalio Regani',
      dateInGame: '887-06-09',
      summary: 'Crypte Rubis, écailles, Braise, quais Arrezo.',
      isForDM: true,
      content: `Réunion secrète : Radius (OP) et Regalio. Crypte Rubis, cadence des écailles, canalistes d'aplanissement émotionnel, surveillance quais Arrezo, Braise intercepte transports. Première des Dames Falci demande +100 unités/mois.`,
      tags: ['Partie 5', 'Œil Pourpre', '887'],
      personNames: ['Radius Ignis Mirdobas', 'Regalio Regani'],
      placeNames: ['Crypte Rubis', 'Manoir Regalio Regani'],
      orgNames: ["L'Œil Pourpre", 'La Braise'],
    },
    orgIds,
    placeIds,
  );

  await ensureLore(
    {
      title: 'Quête Harl — infiltration soirée Marcheto Spazi',
      dateInGame: '887',
      summary: 'Espionner Regalio Regani, 2e étage, contact OP.',
      isForDM: true,
      content: `Harl Denvar engage les PJ après test de l'écaille. Soirée chez Regalio Regani pour Marcheto Spazi. Objectifs : identifier contact OP, sujets, représentant duchés. Pistes : Narboki, invisibilité (brouilleur), combes, garde privée. Récompense : parts La Loutre SAOUL.`,
      tags: ['Partie 5', 'Quête', '887'],
      personNames: ['Harl Denvar', 'Marcheto Spazi', 'Regalio Regani', 'Narboki Runrock'],
      placeNames: ['Manoir Regalio Regani'],
      orgNames: ['Famille Tovalis', "L'Œil Pourpre"],
    },
    orgIds,
    placeIds,
  );

  await ensureLore(
    {
      title: 'Side quest — La Veine Hurlante',
      summary: 'Carrières Écarlates, fragment Tal Odius.',
      isForDM: true,
      content: `Galerie fermée des Carrières Écarlates. Veine de marbre pourpre qui hurle ; statue semi-formée. Fragment dormant de Tal Odius. Dilemme libération vs séisme.`,
      tags: ['Partie 5', 'Side quest', 'Tal Odius'],
      placeNames: ['Carrières Écarlates — galerie Veine Hurlante'],
      orgNames: ['Famille Tovalis', 'Famille Palhindile'],
    },
    orgIds,
    placeIds,
  );

  await ensureLore(
    {
      title: 'Side quest — Les Ombres du Conservatoire',
      summary: 'Hymne de la Flamme et du Marbre, harpe possédée.',
      isForDM: true,
      content: `Conservatoire Palhindile : musiciens malades, partitions volées, harpe avec âme d'artiste emprisonnée. Dissonance interdite.`,
      tags: ['Partie 5', 'Side quest'],
      placeNames: ["Conservatoire d'Alagir"],
      orgNames: ['Famille Palhindile'],
    },
    orgIds,
    placeIds,
  );

  await ensureLore(
    {
      title: 'Side quest — La Fête des Poids (Ral Zitris)',
      summary: 'Balances déréglées, enfant au manteau violet.',
      isForDM: true,
      content: `Fête annuelle Ral Zitris. Maison des Listes : balances déréglées, oxydation. Enfant manteau violet. Éclat ancien de Ral Zitris dans balance sacrée.`,
      tags: ['Partie 5', 'Side quest', 'Zitris'],
      orgNames: ['Famille Cilovard'],
    },
    orgIds,
    placeIds,
  );

  await ensureLore(
    {
      title: 'Ligne Eleryna — laboratoire Amiro Léovine',
      summary: 'Laguna Temper, Folduin, clones cristallins.',
      isForDM: true,
      content: `Quête cristomancie : Laguna Temper (5e Roue) → dette Folduin Xyrlana → clé atelier → laboratoire montagne (salles I–VI), Virion Omalee, clone Élerÿna cristalline, Valdris.`,
      tags: ['Partie 5', 'Eleryna', 'MJ'],
      personNames: ['Laguna Temper', 'Folduin Xyrlana', 'Amiro Léovine'],
      placeNames: ['Demeure de Laguna Temper', 'Atelier Amiro Léovine', "Laboratoire abandonné d'Amiro Léovine"],
    },
    orgIds,
    placeIds,
  );

  await ensureLore(
    {
      title: 'Storyline Ezbehar — Les Chaînes du Sang',
      summary: 'Mastiggia, Izotzargi, trois actes.',
      isForDM: true,
      content: `Clan Izotzargi réduit en esclavage, vendu aux Mastiggia. Acte I : domaine Gesouto (Porte Pourpre). Acte II : Huriya / Larmes d'Ambre. Acte III : Sépulcre de Lune, Tharelium. Lien sang draconique / Tyrannœil.`,
      tags: ['Partie 5', 'Ezbehar', 'MJ'],
      personNames: ['Gesouto Mastiggia'],
      placeNames: ['Domaine Mastiggia', "Comptoir Mastiggia — Larmes d'Ambre"],
      orgNames: ['Famille Mastiggia', "L'Œil Pourpre"],
    },
    orgIds,
    placeIds,
  );
}

/** Noms propres additionnels repérés dans Partie 5 (hors import curaté). */
const EXTRA_PERSON_NAMES = new Set([
  'Elerÿna Solanmir',
  'Virion Omalee',
  'Nerios Vozin',
  'Illevas',
  'Ezbehar',
  'Première des Dames Falci',
]);

/** Import PNJ/lieux supplémentaires depuis le JSON (liste blanche stricte). */
async function enrichFromExtracted(districtIds: Record<string, string>, orgIds: Record<string, string>) {
  if (!existsSync(EXTRACTED_JSON)) {
    console.log('ℹ️  Pas de JSON extrait — lancer extract-partie5.ts');
    return;
  }
  const raw = JSON.parse(readFileSync(EXTRACTED_JSON, 'utf8')) as {
    persons: { name: string; context: string }[];
    places: { name: string; context: string }[];
  };

  let addedP = 0;
  for (const p of raw.persons) {
    if (!EXTRA_PERSON_NAMES.has(p.name)) continue;
    const exists = await prisma.personOfInterest.findFirst({
      where: { name: p.name, cityId: CITY_ID },
    });
    if (exists) continue;
    await ensurePerson(districtIds, orgIds, {
      name: p.name,
      description: `Extrait Partie 5.md : ${p.context.slice(0, 500)}`,
    });
    addedP++;
  }

  const extraPlaces = [
    'Le Bas-relief – Les Fils de la Pierre',
    "Salle d'entrainement",
    'Salle de balle',
  ];
  let addedL = 0;
  for (const pl of raw.places) {
    const normalized = pl.name.replace(/[""]/g, '"').replace(/Les Fils de la Pierre/, 'Les Fils de la Pierre');
    if (!extraPlaces.some((e) => pl.name.includes(e.slice(0, 12)) || normalized.includes('Bas-relief'))) continue;
    if (!isLikelyPlaceName(pl.name)) continue;
    const exists = await prisma.place.findFirst({ where: { name: pl.name, cityId: CITY_ID } });
    if (exists) continue;
    await ensurePlace(districtIds, orgIds, {
      name: pl.name,
      placeType: 'AUTRE',
      description: `Extrait Partie 5.md : ${pl.context.slice(0, 500)}`,
    });
    addedL++;
  }
  if (addedP || addedL) console.log(`📦 JSON (liste blanche) : +${addedP} PNJ, +${addedL} lieux`);
}

function isLikelyPlaceName(name: string): boolean {
  if (name.length < 4 || name.length > 70) return false;
  return /^(Le |La |Les |L'|Palazzo|Domaine|Comptoir|Crypte|Conservatoire|Carrières|Atelier|Laboratoire|Citadelle|Port |Quartier|Maison |Marché|Temple|Salle |Manoir|Galerie|Bastion|Hôtel|Auberge|Taverne|Banque|Place |Docks|Entrepôt|Arène|Cour |Rotonde|Four |Cercle|Dépôt|Oratoire|Grand |Échoppe|Demeure)/i.test(
    name,
  );
}

async function linkPalazzoToTovalis(placeIds: Record<string, string>, orgIds: Record<string, string>) {
  const palazzoId = placeIds["Palazzo Khaz'Kanoon"];
  const tovalisId = orgIds['Famille Tovalis'];
  if (palazzoId && tovalisId) {
    await prisma.organisationPlace
      .create({ data: { organisationId: tovalisId, placeId: palazzoId } })
      .catch(() => {});
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
