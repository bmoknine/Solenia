import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TITLE = 'Maître Ulric Brumel — l’offre pour Eldric Rigart';
const SUMMARY = `Les PJ rencontrent Maître Ulric Brumel.

Il les félicite d'avoir survécu à l'embuscade des Cilovard, puis leur offre le thé et des biscuits avant d'en venir au fait.

Ce qu'il révèle :
— Les Cilovard ont approché Haldor pour un contrat.
— Haldor s'est débarrassé de Victus en échange d'un apport massif d'argent et de parts de la société.
— Depuis, les Cilovard ont grappillé les parts petit à petit : ils détiennent aujourd'hui 49 % de Rigart & fils (rebaptisée « Victus & fils »).
— Eldric Rigart est enfermé et sert de pantin aux Cilovard.

Sa proposition :
— Libérez Eldric : en échange, il vous cédera avec plaisir l'entièreté de ses parts de Rigart & fils (« Victus & fils »).
— Mieux : si vous mettez la main sur le contrat signé par Haldor, les parts détournées reviennent de droit à Eldric — et donc à vous. Un revers majeur pour les Cilovard.

Où le trouver : Eldric est retenu dans les geôles de la famille Cilovard, sur l'île.`;

async function main() {
  const camp = await prisma.campaign.findFirst({
    where: { name: { contains: 'oeuf', mode: 'insensitive' } },
    select: { id: true, name: true },
  });
  if (!camp) throw new Error('Campagne « Un oeuf… » introuvable.');

  const existing = await prisma.gameSession.findFirst({
    where: { campaignId: camp.id, title: TITLE },
    select: { id: true },
  });
  if (existing) {
    await prisma.gameSession.update({ where: { id: existing.id }, data: { summary: SUMMARY } });
    console.log('Session déjà présente → résumé mis à jour.');
  } else {
    const s = await prisma.gameSession.create({
      data: {
        campaignId: camp.id,
        date: new Date('2026-08-31'),
        title: TITLE,
        summary: SUMMARY,
      },
      select: { id: true, date: true },
    });
    console.log(`Session créée (${s.id}) dans « ${camp.name} », datée du ${s.date.toISOString().slice(0, 10)}.`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
