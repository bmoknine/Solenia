import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ASHKA_ID = 'd0b4d7af-c5c3-4cc5-8fdd-e1505a6aaa7d';

const NEW_DESCRIPTION = `Humain très âgé, yeux d'un blanc laiteux depuis « une vision qui l'a brûlé », visage buriné, voix rauque et posée. Assis presque en permanence près du Cercle des Braises, un bâton d'histoire encoché à chaque récit conté posé sur les genoux.

**Répertoire de récits** (contre un récit du visiteur, ou parfois gratuitement s'il apprécie l'interlocuteur)

Le Cavalier du Ciel — Vaskar Skoren dressa un pégase blessé tombé du ciel et devint l'éclaireur ailé de la tribu. Il tomba en défendant les steppes contre les légions de Gib Vrani, qui fit tanner la dépouille de sa monture en cape, trophée d'humiliation. Révèle l'origine et l'importance de la cape conservée dans le tertre des Ombre.

La Faille qui a Tenu — Kaddar Kharvek, premier « Porte-Faille », tint seul une brèche une nuit entière face aux morts-vivants de Gib Vrani pour couvrir l'évacuation des siens ; au matin, ni corps ni arme, seulement la faille refermée. Explique le poids du titre que porte aujourd'hui Drogan Kharvek.

Le Serment Rompu — un jeune guerrier promit à Ral Odius de ne jamais tirer sur un ennemi désarmé en échange d'un vent favorable ; le jour où il rompit son serment par orgueil, le vent dispersa son camp. Conte moral sur la valeur d'une parole donnée aux Beor Khan.

Les Huit qui Comptent leurs Nuits — il y a longtemps, huit moines encapuchonnés venus des montagnes du nord traversèrent les terres du clan sans un mot, sinon des chiffres en guise de noms. Le dernier, portant un froid qu'aucun feu ne réchauffait, s'arrêta longuement devant les tentes des morts avant de repartir. Depuis ce jour, dit-on, une des huit voies s'est brisée et un neuvième marche seul, sans titre, sans cercle pour l'accueillir. (Ashka ignore tout lien avec un PJ éventuel — pur hasard troublant à exploiter si Neuf Nuits l'entend.)

Le Chant de la Terre Vivante — mythe fondateur : Tal Odius rêva des montagnes, Ral Odius du ciel qui les frôle, et de leur rêve commun naquirent les plaines. Ral Alion y sema la vie sauvage, et Tal Brahnera jura de garder la paix entre eux tant que les Beor Khan chanteraient leur nom au Cercle des Braises. Pure couleur spirituelle, sans enjeu mécanique.

**Autres articles** (contre récit ou troc)
— Amulette d'os gravée « porte-voix des ancêtres » (cosmétique, avantage RP en négociation avec les Beor Khan) : 10 po ou un récit
— Petite pierre runique (souvenir, sans effet mécanique) : 3 po
— Rumeurs/informations sur la région (le tertre, la Main du Silence, Gib Vrani) : gratuit s'il apprécie l'interlocuteur`;

async function main() {
  await prisma.personOfInterest.update({
    where: { id: ASHKA_ID },
    data: { description: NEW_DESCRIPTION },
  });
  console.log('Répertoire de récits de Old Ashka mis à jour.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
