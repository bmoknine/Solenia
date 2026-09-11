import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const QUEST_TITLE = 'Le Fretin — libérer Brynn Fer-Vallée';

const DESCRIPTIONS: Record<string, string> = {
  "L'accroche — Darn Fer-Vallée":
    `Darn vient trouver les PJ, blême : sa sœur Brynn est retenue « en bas » par sa propre bande, le Fretin (Porte Basse, grille derrière le marché aux bestiaux). Il croit à une dette ou une punition de contrebande — il ignore le fret humain. Trop identifiable (garde Tovalis) et trop à cran pour rester lucide, il confie l'extraction aux PJ.

Options d'accroche :
— Il les paie (bourse) ou promet une faveur de la maison Tovalis / de Harl Denvar.
— Il sollicite directement un PJ déjà lié à Brynn ou à Darn.
— Il les intercepte au sortir du bal Tovalis, en pleine nuit.

Ce qu'il peut fournir : le plan de la grille, un contact sûr (La Roue de Secours), et l'heure où les Rats montent/descendent.
Ton : l'urgence d'un frère qui a peur, pas d'un commanditaire.`,

  "Trouver l'entrée":
    `La grille descellée est derrière le marché aux bestiaux — bruyant, bondé, puant (couvre l'approche, gêne le repérage). Un guetteur du Fretin planqué en gamin de boucher / mendiant surveille l'accès.

Options :
— Discrétion : contourner, attendre la tombée de la nuit, se fondre dans la foule du marché.
— Social : corrompre ou bluffer le guetteur pour obtenir le contresigne d'entrée (utile plus loin).
— Force/Intimidation : le neutraliser vite — efficace mais risque d'alerte s'il crie.
— Alternative : une autre bouche d'égout plus loin, non gardée, mais trajet plus long et plus insalubre.

Échec bruyant ici = le repaire peut être prévenu (voir « La descente »).`,

  "La descente dans les égouts":
    `Tunnels en dédale (« boyaux »), eau montante, poches de gaz, courant qui emporte le matériel. Le Fretin a laissé des surprises.

Options / obstacles :
— Suivre les traces fraîches du convoi (Survie/Investigation) pour ne pas se perdre.
— Bête de garde lâchée dans un tronçon (rats géants, charognard) : l'éviter en discrétion, ou l'affronter (bruit = alerte).
— Fils à clochettes en travers d'un boyau : les repérer et désamorcer (Perception/Dextérité). Échec = le repaire est prévenu → cargaison déplacée, garde renforcée, compte à rebours enclenché.

Choix de fond : rapidité contre discrétion. Chaque alarme rapproche le départ de la cargaison.`,

  "Le poste de garde":
    `L'alcôve-repaire a un sas gardé. Trois voies d'entrée.

Options :
— Bluff : se présenter comme acheteurs, recrues, ou convoyeur en retard, contresigne à l'appui.
— Infiltration : trouver un passage détourné / une conduite pour contourner le sas.
— Assaut : forcer — rapide mais bruyant, met tout le repaire en alerte.

Ce qu'on peut apprendre en écoutant avant d'agir : « le client est en bas », « la cargaison part cette nuit », le nombre d'hommes présents. Pression temporelle posée — sans rien révéler encore de la nature du fret.`,

  "La découverte (le choc)":
    `La salle du fond : d'abord la contrebande banale (poudre de marbre, tonneaux, armes), puis une caisse qui respire, une main qui dépasse, des carcans gravés du monogramme Mastiggia. La marchandise, ce sont des gens.

Options de réaction :
— Ouvrir discrètement une caisse pour confirmer (et rassurer un captif).
— Rester caché pour observer la transaction en cours (renseignement maximal, mais l'horreur continue).
— Intervenir immédiatement (on perd l'effet de surprise mais on stoppe l'inspection).

Indices à collecter sur place : les carcans, le sceau « Larmes d'Ambre », un registre de livraison. Preuves réutilisables plus tard.`,

  "La transaction à trois":
    `Échange tripartite en cours au fond du repaire :
— Le Fretin : Sesk Orlo + hommes de main (le passeur).
— Les Mastiggia : Vittore, qui vend et empoche.
— L'acheteur vampire : Sélas Vharkorn, émissaire de Nharivum, escorté d'un Vampirien qui inspecte le « cheptel ».

Options :
— Attaque par surprise : avantage au premier tour, mais met les captifs en danger immédiat.
— Parlementer / écouter : Vittore lâche des informations, minimise (« marchandise légale »), tente de corrompre ou de gagner du temps.
— Se positionner d'abord : couper les issues pour empêcher Sélas et Vittore de fuir avant de frapper.

Décision clé : neutraliser qui en premier — le Vampirien (menace), Sesk (moral de la bande), ou bloquer les fuyards.`,

  "Libérer Brynn":
    `Brynn est bouclée dans un cul-de-basse-fosse à côté de la salle d'échange — retenue parce qu'elle a compris.

Options :
— Crocheter / forcer la serrure, ou arracher le trousseau à Sesk.
— La libérer avant le combat (discret) ou pendant (sous pression).

État de Brynn : affaiblie, en état de choc, honteuse.
— Peut aider : elle connaît les lieux, les habitudes de la bande, une sortie de secours.
— Peut gêner : panique, cris, gestes brusques.
— Peut devenir un levier : si un Fretin la prend en otage pendant la bagarre.
La calmer sans la braquer referme son arc (complice inconsciente → témoin).`,

  "Le combat final":
    `Composition : Vampirien (FP 5) x1 · Sesk Orlo, bandit capitaine (FP 2) x1 · Malfrat (FP 1/2) x6.
Vittore ne se bat pas : il négocie (« aucune juridiction ») ou s'éclipse — à rattraper = preuve vivante. Sélas fuit vers Mongar s'il le peut → Nharivum sera prévenue.

Options / tactique :
— Exploiter les faiblesses du Vampirien : lumière du soleil, dégâts radiants, eau courante (bloquent sa régénération). Le repousser dans le courant d'un égout, un sort de Lumière du jour, l'attirer vers une bouche éclairée.
— Briser le moral du Fretin : si Sesk tombe, les malfrats peuvent fuir ou se rendre.
— Empêcher les fuites : bloquer Vittore et Sélas (leads + preuves).

Environnement : obscurité, caisses comme couverts, eau courante à exploiter, risque de blesser les captifs dans les tirs/zones.`,

  "L'exfiltration":
    `Sortir avec Brynn et le cheptel affaibli, sans laisser l'émissaire filer prévenir Nharivum.

Options de sortie :
— Par la grille du marché : rapide, mais au grand jour = risque de guet urbain… et peut-être de l'Œil Pourpre, qui reconnaîtrait « sa » marchandise détournée.
— Par une autre bouche d'égout : plus long, plus discret.
— Planquer les captifs à La Roue de Secours (contact de Darn) et les sortir la nuit.

Complications possibles : tunnel qui s'inonde, passage qui s'effondre, poursuite de la muscle Mastiggia si Vittore a fui, un captif blessé qui ralentit le groupe.`,

  "Résolution & retombées":
    `Selon le déroulé :

Preuves anti-Mastiggia (registre de Vittore, jetons, carcans) — options d'usage :
— Les remettre à Selianne Palhindile pour appuyer la loi d'abolition / le bal Palhindile.
— Les monnayer contre une faveur ou de l'or.
— Les utiliser contre le Roi : dénoncer à l'Œil Pourpre que les Mastiggia lui volent sa marchandise → le Tyrannœil les écrase.

Sort de Brynn : rachetée (se rapproche de Darn) / brisée / morte selon la protection offerte.
Sort des antagonistes : Vittore & Sélas capturés (mines d'infos) ou échappés (ennemis rancuniers).
Fil ouvert : le clan Ezbehar déporté à Nharivum, sous Mongar — amorce d'un futur arc « descente à la cité vampire ».`,
};

async function main() {
  const quest = await prisma.quest.findFirst({
    where: { title: QUEST_TITLE },
    include: { steps: true },
  });
  if (!quest) {
    console.log('Quête introuvable.');
    return;
  }
  let n = 0;
  for (const step of quest.steps) {
    const desc = DESCRIPTIONS[step.title];
    if (!desc) {
      console.log(`  (pas de nouvelle description pour « ${step.title} »)`);
      continue;
    }
    await prisma.questStep.update({ where: { id: step.id }, data: { description: desc } });
    n++;
    console.log(`  MAJ « ${step.title} »`);
  }
  console.log(`\n${n} péripéties enrichies.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
