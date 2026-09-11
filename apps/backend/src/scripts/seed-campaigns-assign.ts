import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CAMPAIGNS = [
  { name: 'Une Nuit de trop', color: '#5b53a8', order: 0 },
  { name: 'Un oeuf pour les contrôler tous', color: '#c9962f', order: 1 },
];

const ASSIGN: Record<string, string[]> = {
  'Une Nuit de trop': [
    'Échapper à la Main du Silence',
    'Gagner la confiance des Beor Khan',
    'La cape de plumes de pégase',
    'Le cœur de Zarak Solara — agenda de Huit Nuits',
  ],
  'Un oeuf pour les contrôler tous': ['Le Fretin — libérer Brynn Fer-Vallée'],
};

const FRETIN_STEPS: { title: string; description: string }[] = [
  {
    title: "L'accroche — Darn Fer-Vallée",
    description:
      "Darn vient trouver les PJ, blême : sa sœur Brynn est retenue « en bas » par sa propre bande, le Fretin (Porte Basse, grille derrière le marché aux bestiaux). Il croit à une dette de contrebande et ignore la vraie raison. Trop identifiable pour y aller, il confie l'extraction aux PJ.",
  },
  {
    title: "Trouver l'entrée",
    description:
      "Repérer la grille descellée derrière le marché aux bestiaux — bruyant et puant (couvre l'approche). Un guetteur du Fretin planqué en gamin de boucher surveille : le neutraliser, le corrompre, le semer ou attendre la nuit. On peut lui soutirer le contresigne d'entrée.",
  },
  {
    title: 'La descente dans les égouts',
    description:
      "Boyaux en dédale, eau montante, poches de gaz. Une bête de garde (rats géants / charognard) lâchée dans un tronçon. Des fils à clochettes en travers d'un boyau : réussite = silence ; échec = le repaire est prévenu (cargaison déplacée, garde renforcée, horloge qui tourne).",
  },
  {
    title: 'Le poste de garde',
    description:
      "Le sas de l'alcôve est gardé : forcer, se faufiler, ou bluffer avec le contresigne (acheteurs / recrues / convoyeur en retard). On surprend une bribe : « le client est en bas », « la cargaison part cette nuit ». Pression temporelle posée, sans rien révéler encore.",
  },
  {
    title: 'La découverte (le choc)',
    description:
      "La salle du fond : sous la contrebande banale, une caisse qui respire, une main qui dépasse, des carcans gravés du monogramme Mastiggia. La marchandise, ce sont des gens. Pas de jet — on laisse le tableau parler.",
  },
  {
    title: 'La transaction à trois',
    description:
      "Échange tripartite en cours : le Fretin (Sesk Orlo + hommes de main), les Mastiggia (Vittore, qui encaisse), et l'acheteur vampire — Sélas Vharkorn, émissaire de Nharivum, escorté d'un Vampirien qui inspecte le cheptel.",
  },
  {
    title: 'Libérer Brynn',
    description:
      "Brynn est bouclée dans un cul-de-basse-fosse à côté, parce qu'elle a compris. La sortir est facile ; la calmer et l'emmener vite, moins — objectif secondaire sous pression, souvent en plein combat (elle peut aider ou paniquer).",
  },
  {
    title: 'Le combat final',
    description:
      "Vampirien (FP 5) x1 · Sesk Orlo, bandit capitaine (FP 2) x1 · Malfrat (FP 1/2) x6. Vittore ne se bat pas : il négocie (« aucune juridiction ») ou s'éclipse (à rattraper = preuve vivante). Sélas fuit vers Mongar s'il le peut. Exploiter soleil / dégâts radiants / eau courante contre le Vampirien (bloquent sa régénération).",
  },
  {
    title: "L'exfiltration",
    description:
      "Sortir le cheptel affaibli sans laisser l'émissaire filer prévenir Nharivum. Émerger au grand jour attire le guet — et peut-être l'Œil Pourpre, qui reconnaîtrait « sa » marchandise détournée. Complications possibles : tunnel qui s'inonde, passage qui s'effondre, la muscle de Mastiggia si Orsino… (Vittore) a fui.",
  },
  {
    title: 'Résolution & retombées',
    description:
      "Brynn passe de complice inconsciente à témoin à charge ; sa relation avec Darn se répare (ou pas). Preuves anti-Mastiggia (registre de Vittore, jetons) : faire tomber les Mastiggia moralement (loi de Selianne) ou les balancer au Roi. Lead ouvert : le clan Ezbehar déporté à Nharivum, sous Mongar.",
  },
];

async function main() {
  // 1) Campagnes (créées si absentes)
  const byName = new Map<string, string>();
  for (const c of CAMPAIGNS) {
    const existing = await prisma.campaign.findFirst({ where: { name: c.name } });
    const camp = existing
      ? await prisma.campaign.update({ where: { id: existing.id }, data: { color: c.color, order: c.order } })
      : await prisma.campaign.create({ data: c });
    byName.set(c.name, camp.id);
    console.log(`Campagne ${existing ? 'MAJ' : 'créée'} : ${camp.name} (${camp.id})`);
  }

  // 2) Rattachement des quêtes
  for (const [campName, titles] of Object.entries(ASSIGN)) {
    const campaignId = byName.get(campName)!;
    for (const title of titles) {
      const q = await prisma.quest.findFirst({ where: { title } });
      if (!q) {
        console.log(`  ⚠️ quête introuvable : "${title}"`);
        continue;
      }
      await prisma.quest.update({ where: { id: q.id }, data: { campaignId } });
      console.log(`  "${title}" -> ${campName}`);
    }
  }

  // 3) Péripéties du Fretin
  const fretin = await prisma.quest.findFirst({ where: { title: 'Le Fretin — libérer Brynn Fer-Vallée' } });
  if (fretin) {
    const existingSteps = await prisma.questStep.count({ where: { questId: fretin.id } });
    if (existingSteps > 0) {
      console.log(`\nLe Fretin a déjà ${existingSteps} péripétie(s) — aucune ajoutée (évite les doublons).`);
    } else {
      await prisma.questStep.createMany({
        data: FRETIN_STEPS.map((s, i) => ({ questId: fretin.id, title: s.title, description: s.description, order: i })),
      });
      console.log(`\n${FRETIN_STEPS.length} péripéties ajoutées à « Le Fretin — libérer Brynn Fer-Vallée ».`);
    }
  }

  // 4) État de la campagne "Général" (désormais vide ?)
  const general = await prisma.campaign.findFirst({ where: { name: 'Général' }, include: { _count: { select: { quests: true } } } });
  if (general) console.log(`\nCampagne « Général » : ${general._count.quests} quête(s) restante(s).`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
