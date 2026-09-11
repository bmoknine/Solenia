import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ALAGIR_ID = '6d39b2bc-6488-4763-9643-b57e9af59c03';
const DARN_ID   = '7a98f51c-2382-4a3c-9972-d28bd933e25c';
const TOVALIS_ORG_ID = 'e6a42128-6fb4-4dea-bd11-2e34be47c513';

async function main() {
  // 1. Créer le groupe de bandits
  const group = await prisma.organisation.create({
    data: {
      name: 'Les Rats des Fosses',
      description: `<p>Petite bande de bandits et contrebandiers opérant depuis les égouts d'Alagir. Spécialisés dans le transport de marchandises illicites sous la ville — poudre de marbre, alcool de contrebande, armes non déclarées. Ni idéologie ni allégeance : juste de l'or et la survie.</p>
<p>Leur repaire est creusé dans une alcôve désaffectée du réseau d'égouts au niveau de la Porte Basse, accessible par une grille descellée derrière le marché aux bestiaux. Une douzaine de membres au maximum, tous à la petite semaine.</p>`,
      membership: 'CRIMINALITE',
      organisationType: 'CELLULE',
      isForDM: false,
      cities: {
        create: { cityId: ALAGIR_ID }
      }
    }
  });
  console.log(`✓ Organisation créée : ${group.name} [${group.id}]`);

  // 2. Créer la sœur
  const sister = await prisma.personOfInterest.create({
    data: {
      name: 'Brynn Fer-Vallée',
      description: `<p>Naine de 28 ans, sœur cadette de Darn Fer-Vallée. Trapue et musclée, une énergie nerveuse dans chaque geste. Cheveux brun foncé coupés court et en désordre, quelques mèches brûlées à l'extrémité — souvenir d'une bagarre avec un alchimiste. Yeux noisette vifs, presque toujours plissés en mode évaluation ou en colère. Une cicatrice en demi-lune sous l'œil droit. Les mains couvertes de petites coupures et de callosités, tatouage de rat stylisé sur la nuque.</p>
<p>Tête brûlée notoire, elle a quitté son frère après un désaccord violent sur « la bonne façon de faire les choses ». Elle trouvait Darn trop prudent, trop loyal à des patrons qui ne les méritaient pas. Elle a rejoint <strong>Les Rats des Fosses</strong> il y a deux ans, groupe de bandits et contrebandiers dont la planque se trouve dans les égouts sous la Porte Basse.</p>
<p>Elle gère les passages de marchandises à travers le réseau souterrain et sert d'intermédiaire avec les receleurs de la Porte Pourpre. Impulsive en combat — elle frappe avant de poser des questions — mais elle connaît les égouts d'Alagir comme sa poche.</p>
<p>Entretient une relation froide avec son frère : elle n'apprécie pas ses allégeances, lui ne cautionne pas ses méthodes. Ils se sont parlé deux fois en deux ans. Mais en cas de danger mortel, le sang reste le sang.</p>`,
      breed: 'NAIN',
      sex: 'WOMAN',
      membership: 'CRIMINALITE',
      STR: 14,
      DEX: 13,
      CON: 15,
      INT: 10,
      WIS: 8,
      CHA: 11,
      pv: 38,
      ca: 13,
      fp: '1',
      showOnMap: true,
      isForDM: false,
      cityId: ALAGIR_ID,
    }
  });
  console.log(`✓ PNJ créé : ${sister.name} [${sister.id}]`);

  // 3. Lier au groupe Les Rats des Fosses
  await prisma.organisationMember.create({
    data: { organisationId: group.id, personId: sister.id }
  });
  console.log(`✓ Membre des Rats des Fosses`);

  // 4. Lier à la famille Tovalis (même sang que Darn, qui y est lié)
  await prisma.organisationMember.create({
    data: { organisationId: TOVALIS_ORG_ID, personId: sister.id }
  });
  console.log(`✓ Liée à la famille Tovalis`);

  console.log('\n✅ Brynn Fer-Vallée créée avec succès.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
