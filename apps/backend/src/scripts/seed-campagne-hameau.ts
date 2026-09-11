import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.quest.createMany({
    data: [
      {
        title: 'Échapper à la Main du Silence',
        description:
          "Neuf Nuits est un mage recherché par l'Ordre — la Main du Silence traque les magiciens clandestins de la Brèche en Momoritanie. Rester caché, éviter les patrouilles, semer les poursuivants.",
        status: 'EN_COURS',
        notes:
          "La patrouille postée au hameau a été anéantie cette nuit par des cavaliers Beor Khan — d'autres garnisons de l'Ordre risquent d'apprendre sa présence dans la région.",
        order: 0,
      },
      {
        title: 'Gagner la confiance des Beor Khan',
        description:
          "Le groupe est amené au camp nomade des Beor Khan dans les steppes, menés par le chef de guerre Drogan Kharvek et la grande druide Sylvae Irithiel — celle-ci observait déjà Neuf Nuits sous forme de corbeau avant l'attaque du hameau.",
        status: 'EN_COURS',
        notes:
          "Les Beor Khan se méfient des mages mais sont en guerre ouverte contre l'Empire et la Main du Silence. Ils proposent un marché : ramener la cape de plumes de pégase volée à leur ancêtre Vaskar Skoren, conservée en trophée dans le tertre des Ombre. En échange : protection, guides, dissimulation face à l'Ordre.",
        order: 1,
      },
      {
        title: 'La cape de plumes de pégase',
        description:
          "Récupérer, dans la Salle des Trophées (16) du tertre des Ombre, la cape faite de la dépouille du pégase de Vaskar Skoren — trophée pris par Gib Vrani lors de sa conquête des steppes.",
        status: 'A_FAIRE',
        notes:
          "La décrocher sans prononcer les paroles funéraires beor khan (transmises par Sylvae) réveille l'esprit du pégase, lié à l'objet : un spectre hostile qui ne se calme qu'en lui rendant son honneur (Religion/Persuasion DC 15). Le tertre abrite aussi Huit Nuits (nécromancien du Monastère des Nuits), posté en salle 8 — il cherche le cœur de Gib Vrani, pas la cape ; ses intentions envers Neuf Nuits, autre disciple du Monastère, restent à définir.",
        order: 2,
      },
      {
        title: 'Le cœur de Gib Vrani — agenda de Huit Nuits',
        description:
          "Huit Nuits, nécromancien issu du Monastère des Nuits comme Neuf Nuits, attend dans la Chambre du Cœur (salle 8 du tertre des Ombre) — il traque le cœur du mage noir Gib Vrani, exécuté et enterré en plusieurs lieux distincts.",
        status: 'A_FAIRE',
        notes: "Fil d'arrière-plan : pas une quête du groupe à proprement parler, à utiliser si les joueurs croisent Huit Nuits ou s'intéressent à son objectif.",
        order: 3,
      },
    ],
  });

  await prisma.gameSession.create({
    data: {
      date: new Date('2026-07-10'),
      title: "L'embuscade du hameau",
      summary:
        "Neuf Nuits arrive dans un hameau où stationne une patrouille de la Main du Silence ; un fermier le cache dans sa ferme. Un corbeau à l'œil violet sur le front observe la maison — Sylvae Irithiel, grande druide des Beor Khan, sous forme animale. Dans la nuit, des cavaliers Beor Khan menés par Drogan Kharvek attaquent le campement de la patrouille et la décime. Le groupe se retrouve repéré par les nomades.",
    },
  });

  console.log('Quêtes et session ajoutées.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
