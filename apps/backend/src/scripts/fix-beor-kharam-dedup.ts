import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CITY_ID = 'f64aae8f-c25e-446d-b281-cc1c0fff707e';
const MISTAKEN_ORG_ID = '0747c00f-8a6c-4ef2-a02d-e89c3bf309b4';

const VENDOR_IDS = {
  tarek: '29f44204-2e22-4a66-9302-c6eb832ce530',
  yenna: '5aadd87e-afca-4a89-917a-c4eb9ebffcbb',
  ashka: 'd0b4d7af-c5c3-4cc5-8fdd-e1505a6aaa7d',
};

const ADDITION = `

Le camp (repères pour le MJ)

Le Cercle des Braises — feu central, cœur social de la tribu. Drogan y juge les étrangers ; les récits des ancêtres s'y content le soir.

L'Enclos des Vents — parc à chevaux semi-sauvages. Dressage DC 13 pour s'attacher une monture.

La Tente des Cendres — tente funéraire où sont conservées les reliques des morts. Accès restreint ; c'est là qu'aurait dû reposer la cape de Vaskar Skoren si Gib Vrani ne l'avait pas volée (voir tertre des Ombre).

L'Autel de Pierre-Levée — menhir sacré en périphérie du camp, où Sylvae mène ses rituels (Communion avec la Nature).

Interactions possibles

L'épreuve du Cercle — duel à mains nues non létal contre un guerrier, pour gagner un respect réel, pas juste la tolérance.

La lecture des vents — Sylvae offre une vision rituelle contre une confidence : un secret du visiteur contre une vision.

Défi équestre — course improvisée avec les enfants du camp, moyen léger de gagner en sympathie avant une discussion sérieuse avec Drogan.

Vendeurs du camp

Le troc reste largement préféré à l'or. Voir les fiches individuelles pour l'inventaire détaillé et les prix.

Tarek l'Échangeur — fournitures de voyage et curiosités glanées sur les routes.

Vieille Yenna — peaux, fourrures, réparation d'objets en cuir/plume.

Old Ashka — conteur aveugle, légendes de la tribu et babioles porte-bonheur.`;

async function main() {
  await prisma.organisation.delete({ where: { id: MISTAKEN_ORG_ID } });
  console.log('Organisation en doublon supprimée.');

  const city = await prisma.city.findUniqueOrThrow({ where: { id: CITY_ID } });
  await prisma.city.update({
    where: { id: CITY_ID },
    data: { description: city.description + ADDITION },
  });
  console.log('Description de la ville Beor Kharam (N.) mise à jour.');

  for (const id of Object.values(VENDOR_IDS)) {
    await prisma.personOfInterest.update({ where: { id }, data: { cityId: CITY_ID } });
  }
  console.log('Vendeurs rattachés à la ville.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
