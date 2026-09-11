import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const EXISTING_MEMBER_IDS = [
  '84d45a45-0b27-44e8-bbae-7746c82fd96e', // Drogan Kharvek
  '53ab6d68-6d6d-4d29-af36-0982564af74d', // Brise-Terre (x5)
  '608b70c9-bf82-4fcb-8d6a-b64cf7b78683', // Cavalier des Steppes (x90)
  'efa72d8b-f525-4adf-9f29-497eb2301563', // Sylvae Irithiel
  'cd665704-3386-4cca-b611-7c7d76a65876', // Chaman des Collines (x3)
  '7b2ec74b-dd52-4532-b35a-ce8a967f84aa', // Guerrier Beor Khan (x120)
];

const ORG_DESCRIPTION = `Confédération de tribus nomades des steppes du nord, vivant de l'élevage de chevaux, de la chasse et du pillage occasionnel des convois impériaux. Culture guerrière et druidique indissociables : le chef de guerre (actuellement Drogan Kharvek, dit « le Porte-Faille ») dirige la tribu au combat, tandis que la grande druide (Sylvae Irithiel, dite « la Voix des Collines ») en est l'autorité spirituelle et gardienne des rites funéraires. En guerre larvée avec l'Empire et la Main du Silence depuis que Gib Vrani a écrasé leur résistance dans les steppes, des décennies plus tôt.

**Le camp**
— Le Cercle des Braises : feu central, cœur social de la tribu. Drogan y juge les étrangers ; les récits des ancêtres s'y content le soir.
— L'Enclos des Vents : parc à chevaux semi-sauvages. Dressage DC 13 pour s'attacher une monture.
— La Tente des Cendres : tente funéraire où sont conservées les reliques des morts. Accès restreint — c'est là qu'aurait dû reposer la cape de Vaskar Skoren si Gib Vrani ne l'avait pas volée (voir tertre des Ombre).
— L'Autel de Pierre-Levée : menhir sacré en périphérie du camp, où Sylvae mène ses rituels (Communion avec la Nature).

**Interactions**
— L'épreuve du Cercle : duel à mains nues non létal contre un guerrier, pour gagner un respect réel — pas juste la tolérance.
— La lecture des vents : Sylvae offre une vision rituelle contre une confidence — un secret du visiteur contre une vision.
— Défi équestre : course improvisée avec les enfants du camp, moyen léger de gagner en sympathie avant une discussion sérieuse avec Drogan.

**Vendeurs du camp** (le troc reste largement préféré à l'or — voir fiches individuelles pour l'inventaire détaillé et les prix)
— Tarek l'Échangeur : fournitures de voyage et curiosités glanées sur les routes.
— Vieille Yenna : peaux, fourrures, réparation d'objets en cuir/plume.
— Old Ashka : conteur aveugle, légendes de la tribu et babioles porte-bonheur.`;

const TAREK_DESCRIPTION = `Humain d'âge moyen (~45 ans), teint tanné par le vent, moustache tressée de perles d'os, manteau rapiécé de mille tissus différents pris en échange au fil des routes. Sacoche toujours en bandoulière, ne se sépare jamais de sa balance de troc.

**Inventaire** (prix indicatifs en po — préfère très largement l'échange en nature)
— Ration de voyage (7 jours) : 3 po
— Outre d'eau renforcée : 2 po
— Corde en crin tressé (15 m) : 4 po
— Carte des steppes du nord, annotée à la main : 15 po
— Silex enchanté (allume un feu même sous la pluie, usage illimité) : 25 po
— Amulette porte-bonheur beor khan (cosmétique) : 8 po
— Fiole de teinture de guerre (peinture rituelle, cosmétique) : 5 po
— Petit couteau d'os gravé : 6 po`;

const YENNA_DESCRIPTION = `Naine ancienne (~150 ans), dos voûté par des décennies de travail du cuir, mains couvertes de cicatrices fines et de cals, cheveux blancs tressés d'aiguilles à coudre en os. Ne quitte jamais sa tente sans son établi portatif.

**Inventaire** (prix en po)
— Cape de fourrure d'hiver (résistance au froid) : 20 po
— Armure de cuir clouté (qualité tribale) : 45 po
— Sac à dos en peau tannée (capacité augmentée) : 12 po
— Réparation d'un objet en cuir/peau/plume : 5 à 15 po selon l'ampleur (peut réparer/entretenir la cape de plumes de pégase si le groupe la ramène endommagée)
— Bottes fourrées (avantage aux JS contre le froid extrême) : 18 po
— Tente individuelle en peau imperméabilisée : 30 po`;

const ASHKA_DESCRIPTION = `Humain très âgé, yeux d'un blanc laiteux depuis « une vision qui l'a brûlé », visage buriné, voix rauque et posée. Assis presque en permanence près du Cercle des Braises, un bâton d'histoire encoché à chaque récit conté posé sur les genoux.

**Inventaire** (contre récit ou service plutôt que troc)
— Un récit véridique de la tribu, dont celui de Vaskar Skoren et du pégase : gratuit contre un récit du visiteur en échange
— Amulette d'os gravée « porte-voix des ancêtres » (cosmétique, avantage RP en négociation avec les Beor Khan) : 10 po ou un récit
— Petite pierre runique (souvenir, sans effet mécanique) : 3 po
— Rumeurs/informations sur la région (le tertre, la Main du Silence, Gib Vrani) : gratuit s'il apprécie l'interlocuteur`;

async function main() {
  const org = await prisma.organisation.create({
    data: {
      name: 'Beor Kharam (N.)',
      description: ORG_DESCRIPTION,
      organisationType: 'PRINCIPAL',
      membership: 'MILITAIRE',
    },
  });

  const tarek = await prisma.personOfInterest.create({
    data: {
      name: "Tarek l'Échangeur",
      description: TAREK_DESCRIPTION,
      breed: 'HUMAIN',
      sex: 'MAN',
      membership: 'MARCHAND',
      STR: 8,
      DEX: 12,
      CON: 10,
      INT: 13,
      WIS: 11,
      CHA: 14,
      showOnMap: false,
    },
  });

  const yenna = await prisma.personOfInterest.create({
    data: {
      name: 'Vieille Yenna',
      description: YENNA_DESCRIPTION,
      breed: 'NAIN',
      sex: 'WOMAN',
      membership: 'MARCHAND',
      STR: 9,
      DEX: 14,
      CON: 12,
      INT: 12,
      WIS: 13,
      CHA: 10,
      showOnMap: false,
    },
  });

  const ashka = await prisma.personOfInterest.create({
    data: {
      name: 'Old Ashka',
      description: ASHKA_DESCRIPTION,
      breed: 'HUMAIN',
      sex: 'MAN',
      membership: 'OTHER',
      STR: 6,
      DEX: 8,
      CON: 10,
      INT: 14,
      WIS: 17,
      CHA: 16,
      showOnMap: false,
    },
  });

  const memberIds = [...EXISTING_MEMBER_IDS, tarek.id, yenna.id, ashka.id];

  await prisma.organisationMember.createMany({
    data: memberIds.map((personId) => ({ organisationId: org.id, personId })),
  });

  console.log('Organisation créée :', org.id);
  console.log('Vendeurs créés :', { tarek: tarek.id, yenna: yenna.id, ashka: ashka.id });
  console.log('Membres liés :', memberIds.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
