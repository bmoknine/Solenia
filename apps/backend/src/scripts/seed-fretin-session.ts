import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const campaign = await prisma.campaign.findFirst({ where: { name: 'Un oeuf pour les contrôler tous' } });
  if (!campaign) {
    console.log('Campagne introuvable.');
    return;
  }

  const summary = [
    "Assaut du repaire du Fretin, dans les égouts de la Porte Basse. Bilan de la soirée :",
    "",
    "— Le Vampirien (escorte de Nharivum) a été tué.",
    "— Sélas Vharkorn, l'émissaire vampire, s'est échappé par une porte dimensionnelle.",
    "— Vittore Mastiggia a fui mais Ezbehar l'a pris en chasse ; acculé, il a dégainé un parchemin de Boule de feu — dont l'explosion l'a laissé inconscient.",
    "— Libération de Darn Fer-Vallée (retenu par la bande) et d'un drakéide qui servait de « modèle d'exposition ».",
    "— Popox a quitté le groupe pour suivre une colonie de rats (départ du personnage).",
    "",
    "Trouvaille : un contrat de livraison Mastiggia ↔ Nharivum, indiquant qu'il s'agissait du 6e chargement, pour un total de 50 unités « équivalent modèle ».",
  ].join('\n');

  const session = await prisma.gameSession.create({
    data: {
      date: new Date('2026-08-23'),
      title: 'Le Fretin — l’assaut du repaire',
      summary,
      campaignId: campaign.id,
    },
  });
  console.log('Entrée de journal créée :', session.id, '→', session.title);
}

main().catch(console.error).finally(() => prisma.$disconnect());
