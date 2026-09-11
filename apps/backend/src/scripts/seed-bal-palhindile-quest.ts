import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const QUEST_TITLE = 'Bal Palhindile — « Le Bal des Verrières » (Soir 2)';
const QUEST_DESC =
  "Deuxième des quatre bals de la Fête de la Fondation, chez les Palhindile, sous les verrières du Palais des Ambassades. Ambiance feutrée et diplomatique : la Chancellerie y dévoile sa proposition d'abolition de l'esclavage, et les Maisons choisissent leur camp.";
const QUEST_NOTES =
  "Focus : l'abolition de l'esclavage (Édit d'Affranchissement porté par Selianne Palhindile / la Chancellerie) — payoff du fil Ezbehar du Soir 1.\nCamps — POUR : Palhindile ; CONTRE : Mastiggia + Couronne/Soleil Pourpre (en coulisse) ; INDÉCIS : Cilovard, Tovalis, délégations dolomicienne/gandorenne.\nLevier des PJ : la preuve du Fretin (livraisons Mastiggia → vampires). L'état des voix se reporte sur le Soir 3 / le vote au Conseil.\nFil secondaire : Rigart / Illevas (les Cilovard sont présents).";

type StepSeed = { title: string; description: string; optional: boolean };

const STEPS: StepSeed[] = [
  {
    title: 'Arrivée & présentation',
    optional: false,
    description:
      "Deuxième bal de la Fête de la Fondation, chez les Palhindile, sous les grandes verrières du Palais des Ambassades. Après la robustesse tovalis, place au feutré diplomatique : lumière filtrée, musiciens elfes, protocole millimétré. Les médiateurs de Selianne Palhindile accueillent chaque délégation ; le ton, ce soir, est à la politique. On sent qu'une annonce se prépare.",
  },
  {
    title: 'Les invités — les camps en présence',
    optional: false,
    description:
      "Toutes les Maisons sont là, mais ce soir elles se jaugent en futurs votants. Repères pour le MJ :\n— Hôtes / porteurs de la loi : Lady Serenya Palhindile (Chancelière), Selianne Palhindile (qui présente l'édit), Lord Calen Palhindile, Lior Palhindile, Nimra.\n— Marchands concernés : Vittore Mastiggia (émissaire, farouchement contre), délégations dolomicienne et gandorenne (traite encore légale chez elles).\n— Indécis à courtiser : les Cilovard (Garran Cilovard calcule ; Ismara Cilovard peut pencher pour) et les Tovalis (Daren Tovalis et Maerin Tovalis craignent un précédent sur leurs 3 000 travailleurs).\n— L'ombre de la Couronne : le Chambellan Aldric Vorréal, tout sourire — mais l'abolition tarirait un flux qui arrange le Roi.",
  },
  {
    title: '[Fil] Abolition de l’esclavage — Ezbehar',
    optional: false,
    description:
      "Fil porté par Ezbehar, en droite ligne du Bal Tovalis (Soir 1). C'est ici que se joue la proposition d'abolition.\nSon atout : depuis le Fretin, Ezbehar détient la preuve que les Mastiggia détournent des esclaves « traités » vers les vampires (contrat de livraison Mastiggia ↔ Nharivum — 6e chargement, 50 « unités »).\nCe qu'il peut faire ce soir :\n— Rallier les indécis (Cilovard, Tovalis) à la loi de Selianne Palhindile, Maison par Maison.\n— Choisir SON moment pour sortir la preuve contre les Mastiggia : bien placée, elle discrédite Vittore Mastiggia et fait basculer des voix ; mal placée, elle éveille le Soleil Pourpre (via le Chambellan Aldric Vorréal) et expose le fil vampire.\nSortie : l'état des voix en fin de nuit décide de l'élan de l'édit pour la suite (Soir 3 / Conseil).",
  },
  {
    title: 'Le dévoilement de la loi (Selianne)',
    optional: false,
    description:
      "Au centre de la verrière, Selianne Palhindile présente, au nom de la Chancellerie, l'Édit d'Affranchissement : interdire la traite et la détention d'esclaves à Alagir, et faire pression sur les Dolomites et Gandorenne. Elle prévoit des compensations pour les maisons marchandes — de quoi séduire les indécis. Lady Serenya Palhindile appuie de tout son poids de Chancelière. La salle se fige : chacun mesure ce que ça lui coûte ou lui rapporte.",
  },
  {
    title: 'Le débat d’abolition — pour, contre, indécis',
    optional: false,
    description:
      "Le cœur de la soirée. Les Maisons prennent position ; les PJ travaillent la salle.\n— POUR : Palhindile, courants réformistes, la voix (silencieuse) des affranchis.\n— CONTRE : Mastiggia (leur commerce même) et, en coulisse, la Couronne via le Soleil Pourpre.\n— INDÉCIS à convaincre : Cilovard (intérêt financier — Ismara Cilovard est une porte d'entrée), Tovalis (peur du précédent sur leur main-d'œuvre), délégations dolomicienne / gandorenne.\nJets utiles : Persuasion, Intuition, Tromperie ; un argument chiffré (compensations) ou moral (les affranchis) selon l'interlocuteur. Chaque Maison ralliée = une voix acquise pour la suite.",
  },
  {
    title: 'La contre-offensive Mastiggia (Vittore)',
    optional: false,
    description:
      "Vittore Mastiggia ne reste pas les bras croisés : il promet des « contrats de main-d'œuvre » avantageux aux Tovalis, agite la menace économique auprès des Cilovard, et rappelle discrètement que la traite est légale ailleurs. En sous-main, le Chambellan Aldric Vorréal appuie son jeu sans jamais se mouiller. Laissé libre, il retourne un ou deux indécis. Affronté (ou si les PJ sortent la preuve du Fretin), la partie devient publique — et dangereuse.",
  },
  {
    title: 'Fin de nuit — l’état des voix',
    optional: false,
    description:
      "Bilan : combien de Maisons ont basculé POUR, combien CONTRE, combien restent indécises. Le MJ note l'élan de l'édit. Si Ezbehar a sorti la preuve au bon moment, les Mastiggia sont sur la défensive et le Soleil Pourpre en alerte. Cet état des voix se reporte sur le Soir 3 (et le futur vote au Conseil). La proposition est lancée : reste à la faire aboutir.",
  },
  {
    title: '[Fil] Compagnie Rigart — Illevas (suite)',
    optional: true,
    description:
      "Continuation légère du fil du Soir 1. Les Cilovard sont présents : Illevas peut confirmer où l'on tient Eldric Rigart (geôles Cilovard, sur l'île) et affiner la piste du contrat Haldor — en jouant Ismara Cilovard ou en surprenant une conversation. Le sauvetage lui-même se prépare hors bal.",
  },
  {
    title: '[Contact] Selianne Palhindile',
    optional: true,
    description:
      "La championne de l'édit. Elle détaille sa loi, ce qu'elle craint (les Mastiggia, la tiédeur des grandes Maisons), et ce dont elle a besoin des PJ : des voix, et de quoi discréditer la traite. Alliée précieuse pour Ezbehar.",
  },
  {
    title: '[Contact] Vittore Mastiggia',
    optional: true,
    description:
      "L'opposition. Charmeur puis menaçant : il propose, achète, intimide. Face à Ezbehar (qui l'a déjà chassé au Fretin), le vernis craque. Il ignore encore que les PJ détiennent la preuve de ses livraisons aux vampires.",
  },
  {
    title: '[Contact] Lady Serenya Palhindile',
    optional: true,
    description:
      "La Chancelière. Son poids politique peut porter l'édit — mais elle joue serré, consciente que la Couronne n'aime pas qu'on touche à ce commerce. Bien manœuvrée, elle offre une tribune ; froissée, elle temporise.",
  },
  {
    title: '[Contact] Chambellan Aldric Vorréal',
    optional: true,
    description:
      "L'ombre de la Couronne. Officiellement neutre (le Roi est « souffrant »), il glisse des mots qui refroidissent les ardeurs abolitionnistes. MJ : agent du Soleil Pourpre, il défend en secret le flux d'esclaves détourné vers les vampires — sortir la preuve du Fretin le met directement en alerte.",
  },
  {
    title: '[Jeu] Joute d’éloquence — rallier une Maison indécise',
    optional: true,
    description:
      "Un débat de salon arbitré par les médiateurs de Selianne Palhindile. Persuasion ou Tromperie (DC 14, +2 avec un argument taillé pour l'interlocuteur : chiffré pour les Cilovard, social pour les Tovalis). Réussite = une Maison indécise bascule POUR ; échec critique = elle se braque CONTRE.",
  },
];

async function main() {
  const camp = await prisma.campaign.findFirst({
    where: { name: { contains: 'oeuf', mode: 'insensitive' } },
    select: { id: true, name: true },
  });
  if (!camp) throw new Error('Campagne « Un oeuf… » introuvable.');

  // Ordre : placer la quête après les autres de la campagne.
  const maxOrder = await prisma.quest.aggregate({
    where: { campaignId: camp.id },
    _max: { order: true },
  });
  const nextOrder = (maxOrder._max.order ?? 0) + 1;

  let quest = await prisma.quest.findFirst({ where: { title: QUEST_TITLE } });
  if (!quest) {
    quest = await prisma.quest.create({
      data: {
        title: QUEST_TITLE,
        description: QUEST_DESC,
        notes: QUEST_NOTES,
        status: 'A_FAIRE',
        campaignId: camp.id,
        order: nextOrder,
      },
    });
    console.log(`Quête créée (${quest.id}) dans « ${camp.name} », order ${nextOrder}.`);
  } else {
    await prisma.quest.update({
      where: { id: quest.id },
      data: { description: QUEST_DESC, notes: QUEST_NOTES, campaignId: camp.id },
    });
    console.log(`Quête déjà présente (${quest.id}) → description/notes mises à jour.`);
  }

  for (let i = 0; i < STEPS.length; i++) {
    const s = STEPS[i];
    const existing = await prisma.questStep.findFirst({ where: { questId: quest.id, title: s.title } });
    if (!existing) {
      await prisma.questStep.create({
        data: { questId: quest.id, title: s.title, description: s.description, optional: s.optional, order: i },
      });
    } else {
      await prisma.questStep.update({
        where: { id: existing.id },
        data: { description: s.description, optional: s.optional, order: i },
      });
    }
  }

  const steps = await prisma.questStep.findMany({
    where: { questId: quest.id },
    orderBy: [{ order: 'asc' }],
    select: { title: true, optional: true },
  });
  console.log(`\n${steps.length} étapes :`);
  steps.forEach((s, i) => console.log(`   ${String(i).padStart(2)} · ${s.title}${s.optional ? '  [opt]' : ''}`));
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
