import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const TERTRE_ID = '23f62138-662c-47d5-855d-bdf7acf09462';

const OLD_13 = `13 Bibliothèque effondrée
Un seul tome a survécu : journal du mage. Y figure le mot de passe de la salle 7, et la révélation que le cœur ressuscite quiconque tente de le voler — le PNJ ne le sait pas encore.`;

const NEW_13 = `13 Bibliothèque effondrée
Un seul tome a survécu : journal du mage. Y figure le mot de passe de la salle 7, et la révélation que le cœur ressuscite quiconque tente de le voler — le PNJ ne le sait pas encore.
Une page arrachée, glissée entre deux chapitres, raconte comment Gib Vrani abattit un cavalier Beor Khan monté sur un pégase lors de sa conquête des steppes, et fit tanner la dépouille de la créature en cape — trophée destiné à humilier le peuple qui avait osé lui résister. Le nom du cavalier y est noté avec mépris : Vaskar Skoren, « le Cavalier du Ciel ».`;

const OLD_16 = `16 Salle des Trophées
Équipements des aventuriers tombés ici, exposés comme trophées. Armure +1 récupérable mais maudite (Arcanes DC 14).`;

const NEW_16 = `16 Salle des Trophées
Équipements des aventuriers tombés ici, exposés comme trophées. Armure +1 récupérable mais maudite (Arcanes DC 14).
Sur un mannequin de bois, une cape faite de peau et de plumes de pégase — la dépouille de la monture de Vaskar Skoren. Elle confère au porteur une chute plane et, une fois par jour, l'usage de Vol (10 minutes). La décrocher sans prononcer les paroles funéraires beor khan (transmises par Sylvae Irithiel) libère l'esprit du pégase, lié à l'objet depuis des décennies : un spectre équin hostile (profil de Spectre, vitesse de vol 40 ft.) qui ne se calme que si on lui rend son honneur (Religion ou Persuasion DC 15, ou preuve que le porteur agit au nom des Beor Khan).`;

async function main() {
  const place = await prisma.place.findUniqueOrThrow({ where: { id: TERTRE_ID } });

  if (!place.description.includes(OLD_13) || !place.description.includes(OLD_16)) {
    throw new Error('Contenu attendu introuvable — la description a peut-être déjà changé.');
  }

  const updatedDescription = place.description
    .replace(OLD_13, NEW_13)
    .replace(OLD_16, NEW_16);

  await prisma.place.update({
    where: { id: TERTRE_ID },
    data: { description: updatedDescription },
  });

  console.log('Tertre des Ombre mis à jour.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
