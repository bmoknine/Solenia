import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type Step = { title: string; description: string; optional: boolean };

// Déroulé (principales)
const MAIN: Step[] = [
  {
    title: "Arrivée & présentation",
    description:
      "Au Palazzo Khaz'Kanoon (marbre kintsugi, balcon sur l'excavation illuminée). L'intendant Pellione annonce chaque invité à voix haute. Premier test de posture : tenue, titre, escorte (Darn Fer-Vallée peut les faire entrer). Comment les PJ sont-ils perçus ?",
    optional: false,
  },
  {
    title: "Discours d'accueil & toast d'Ordan",
    description:
      "Daren Tovalis souhaite la bienvenue « à ceux qui bâtissent la ville de leurs mains ». Puis Ordan Tovalis porte un toast provocateur contre les Cilovard → premier froid public (fil du Port).",
    optional: false,
  },
  {
    title: "Le banquet",
    description:
      "Le placement à table crée les opportunités : un PJ peut se retrouver près d'Ismara Cilovard, de Maerin Tovalis ou d'un contremaître bavard (Bord Amac éméché). Moment des confidences et des indiscrétions.",
    optional: false,
  },
  {
    title: "Ouverture du bal (les danses)",
    description:
      "Les danses commencent ; l'étiquette pousse les hôtes de marque à ouvrir un tour — occasion d'un tête-à-tête forcé (Selianne Palhindile ? Ismara Cilovard ?).",
    optional: false,
  },
  {
    title: "Le pic mondain — l'incident",
    description:
      "Temps fort à déclencher au bon moment : un pli remis à Daren qui le fait blêmir (son dossier secret sur le Soleil Pourpre), ou un accrochage Ordan ↔ Lorian Cilovard qui manque de dégénérer.",
    optional: false,
  },
  {
    title: "Fin de nuit — l'after",
    description:
      "L'assistance se clairsème. Velric Tovalis propose l'« after » (paris, Arène du Goulet Écarlate) ; les langues se délient au balcon ; un agent de l'Œil Pourpre traîne dans les couloirs.",
    optional: false,
  },
];

// Interactions optionnelles — jeux & défis
const OPT_GAMES: Step[] = [
  {
    title: "[Jeu] Le pari du balcon (Velric)",
    description:
      "On lâche une pièce dans l'excavation et on mise sur le temps avant l'écho… qui ne vient jamais. Mise en jeu ; Intuition DC 12 pour flairer l'arnaque. Gagner l'estime de Velric = un contact pègre pour plus tard.",
    optional: true,
  },
  {
    title: "[Jeu] Bras-de-fer contre Bœuf-de-Pierre",
    description:
      "Ancien tailleur devenu colosse de fête. Force (Athlétisme) opposé — imbattable jusqu'à son 6e verre (le faire boire d'abord). Récompense : réputation + une bourse.",
    optional: true,
  },
  {
    title: "[Jeu] Dés & cartes des nobles",
    description:
      "Escamotage / Intuition / Tromperie pour gagner (ou repérer un tricheur). Enjeu : de l'or, ou une dette morale d'un petit noble (faveur à encaisser).",
    optional: true,
  },
  {
    title: "[Jeu] Ouvrir une danse",
    description:
      "Représentation, Persuasion ou Acrobaties (DC 13). Bien danser avec Ismara ou Selianne débloque une confidence ; un faux pas = petit scandale amusant.",
    optional: true,
  },
  {
    title: "[Jeu] Le présage de Sipha la Liseuse d'Ombres",
    description:
      "Contre une pièce, elle tire un présage joliment vague. Le MJ y glisse un indice voilé sur l'une des trois intrigues (Port / Esclavage / Roi).",
    optional: true,
  },
  {
    title: "[Jeu] Joute d'éloquence",
    description:
      "Un noble hautain provoque un PJ en duel verbal. Persuasion / Intimidation / Tromperie opposé — gagner impose le respect à la tablée.",
    optional: true,
  },
  {
    title: "[Jeu] Défi de boisson tovalis",
    description:
      "L'alcool de contrebande de Bord Amac. Jet de Constitution en escalade — tenir délie SA langue (bonus RP) ; tomber = réveil compromettant.",
    optional: true,
  },
  {
    title: "[Jeu] Poudre de marbre",
    description:
      "Dans un salon à l'écart, de jeunes nobles « prisent » le stimulant de Velric. Observer, refuser, ou s'en servir comme levier de chantage plus tard.",
    optional: true,
  },
];

// Interactions optionnelles — rencontres sociales (indices)
const OPT_SOCIAL: Step[] = [
  {
    title: "[Contact] Maerin Tovalis",
    description:
      "Parle Huriya et affaires ; lâche que « Eldric n'a plus signé de sa main depuis des mois » (fil du Port).",
    optional: true,
  },
  {
    title: "[Contact] Ismara Cilovard",
    description:
      "Mal à l'aise, sincère ; bien traitée, elle devient une alliée et confirme l'existence du contrat Haldor (Port).",
    optional: true,
  },
  {
    title: "[Contact] Harl Denvar",
    description:
      "Si on gagne sa confiance : son dossier « Les Yeux dans la pierre » et le salut codé « Rayon » (fil du Roi).",
    optional: true,
  },
  {
    title: "[Contact] Bord Amac (ivre)",
    description:
      "« Les barges tournent moins rond depuis que les gens en pourpre inspectent les cales la nuit » → convois nocturnes vers la Citadelle Rouge (Roi).",
    optional: true,
  },
  {
    title: "[Contact] Selianne Palhindile",
    description:
      "Évoque sa loi d'abolition et le négociant dolomicien (Mastiggia) qui rôde de trop près (fil de l'Esclavage).",
    optional: true,
  },
];

async function main() {
  const campaign = await prisma.campaign.findFirst({ where: { name: 'Un oeuf pour les contrôler tous' } });
  if (!campaign) {
    console.log('Campagne « Un oeuf pour les contrôler tous » introuvable.');
    return;
  }

  const existing = await prisma.quest.findFirst({ where: { title: { startsWith: 'Bal Tovalis' }, campaignId: campaign.id } });
  if (existing) {
    console.log('Une quête « Bal Tovalis » existe déjà — abandon pour éviter un doublon.', existing.id);
    return;
  }

  const steps = [...MAIN, ...OPT_GAMES, ...OPT_SOCIAL];

  const quest = await prisma.quest.create({
    data: {
      title: 'Bal Tovalis — « Le Bal de la Pierre » (Soir 1)',
      campaignId: campaign.id,
      status: 'A_FAIRE',
      description:
        "Premier des quatre bals de la Fête de la Fondation, au Palazzo Khaz'Kanoon. Ambiance mondaine et robuste, sous laquelle avancent trois intrigues.",
      notes:
        "Indices semés ce soir — Port : Ordan provoque, Maerin dit qu'Eldric ne signe plus, Ismara confirme le contrat Haldor. Esclavage : Selianne annonce sa loi, un Mastiggia rôde. Roi : convois nocturnes (Bord Amac) + dossier « Les Yeux dans la pierre » / salut « Rayon » (Harl Denvar).",
      order: 5,
      steps: {
        create: steps.map((s, i) => ({
          title: s.title,
          description: s.description,
          optional: s.optional,
          order: i,
        })),
      },
    },
    include: { steps: true },
  });

  const opt = quest.steps.filter((s) => s.optional).length;
  console.log(`Quête créée : ${quest.title} (${quest.id})`);
  console.log(`  ${quest.steps.length} péripéties — ${quest.steps.length - opt} principales, ${opt} optionnelles.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
