import { PrismaClient, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

/** Fin d'Alagir + Huriya lot 1. Lore existant conservé ; physique et voix ajoutés. */
type Fiche = { nom: string; sexe?: Sex; desc: string };

const RACE_NC = '<p><em>Note MJ : sa race n\'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>';

const LOT: Fiche[] = [
  {
    nom: 'Ékénon Tracx',
    desc: `
<p>Homme tieffelin, 41 ans. Grand, bâti comme un soldat de métier — épaules larges, poignets épais. Armure de plates noire aux reflets mats, cape pourpre aux armoiries royales.</p>
<p>Peau d'un rouge sombre tirant vers le bordeaux, cornes noires recourbées vers l'arrière en arc élégant. Yeux jaunes à pupilles fendues, regard intense et peu confortable. Visage taillé et expressif, une fine cicatrice en travers du nez. D'autres cicatrices courent sur le dos des mains et le long du cou.</p>
<p><strong>Voix :</strong> grave et sonore, avec une résonance de gorge très tieffeline qui met les interlocuteurs mal à l'aise sans qu'ils sachent pourquoi. Débit net et militaire, phrases courtes à l'impératif, aucun mot perdu. Ne s'adresse jamais au Roi autrement qu'en titre complet, y compris en privé — et note ceux qui s'en dispensent.</p>
<p><strong>Rôle :</strong> capitaine et garde personnel du roi <strong>Pelfort Vanguard</strong> à Alagir.</p>
`.trim(),
  },
  {
    nom: 'Aegeard Blanks',
    desc: `
<p>Homme humain, costaud, environ 1,70 m. Tunique ample bleu foncé, pantalon marron pratique et taché.</p>
<p>Visage rond marqué par les excès ; cheveux blonds courts et bouclés, très courte barbe en van dyke soigneusement entretenue ; yeux dorés vifs et méfiants qui observent sans cesse la salle ; peau blanche et rugueuse.</p>
<p><strong>Voix :</strong> grave et éraillée, et surtout très rare — il <strong>parle peu</strong>, répond par un mot ou un grognement, et laisse les clients meubler. Débit lent quand il s'y met, sans jamais monter le ton même pour séparer une bagarre : il pose seulement les mains à plat sur le comptoir. Salue les habitués d'un seul mot, toujours leur prénom, jamais rien d'autre.</p>
<p><strong>Rôle :</strong> logisticien du <strong>Syndicat</strong>, sert à <strong>La Salamandre Savoureuse</strong>. Sert vite et n'oublie jamais un visage — on dit qu'il sait qui appartient au Syndicat… et qui n'y survivra pas longtemps.</p>
<p><strong>Capacités notables :</strong> PV 60 · CA 14. Solide comme le Comptoir : résistance aux dégâts contondants. Coup de Pression : une créature touchée a désavantage à sa prochaine attaque. Gourdin de taverne : +6, 1d8+3. Projection : test de FOR opposé → à terre.</p>
`.trim(),
  },
  {
    nom: 'Aimon Ivelis',
    desc: `
<p>Homme, 61 ans, chef de la famille <strong>Ivelis</strong>. Grand et large, le ventre pris dans une ceinture d'apparat ; il s'appuie des deux mains sur les accoudoirs pour se lever, et ne s'en cache pas.</p>
<p>Visage massif et rougeaud, mâchoire lourde. Cheveux gris-blanc épais rejetés en arrière, barbe courte taillée au carré. Yeux noisette perçants sous des paupières lourdes — le regard des Ivelis, que ses cinq enfants ont tous hérité.</p>
<p><strong>Voix :</strong> tonnante et chaleureuse en public, faite pour les banquets et les proclamations ; elle emplit une salle du trône sans effort. Débit ample, généreux en formules et en rires, avec l'art de faire passer une décision pour une faveur. En comité restreint, elle tombe d'une octave et devient sèche, coupante — et c'est la vraie.</p>
<p><strong>Rôle :</strong> chef de la famille <strong>Ivelis</strong>, famille dirigeante de <strong>Huriya</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Akkar Ivelis',
    desc: `
<p>Homme, 34 ans, fils de la famille <strong>Ivelis</strong>. Solide et bien découplé, entretenu par la chasse et l'escrime de cour ; il se tient jambes légèrement écartées, comme s'il attendait un assaut.</p>
<p>Visage large hérité de son père, mâchoire nette, teint hâlé. Cheveux châtain foncé coupés court. Yeux noisette perçants — le regard des Ivelis. Nez cassé une fois, remis correctement.</p>
<p><strong>Voix :</strong> forte et sûre d'elle, habituée à être écoutée sans avoir eu à le mériter. Débit rapide et impatient, il interrompt volontiers et termine les phrases des autres. Quand son père est présent, le volume baisse de moitié et le débit se fait prudent.</p>
<p><strong>Rôle :</strong> fils de la famille <strong>Ivelis</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Aldren Voss',
    desc: `
<p>Homme humain, 65 ans, Grand Prêtre du temple de <strong>Ral Ibris</strong> à Huriya. De stature imposante malgré l'âge — épaules larges, port de tête droit, démarche lente et assurée. Il porte les robes cérémonielles du culte — blanc cassé, broderies argentées de balances et de nœuds de contrat — et tient en permanence une balance miniature en argent, symbole de sa fonction.</p>
<p>Visage carré, traits fermes, rides profondes autour des yeux et aux commissures des lèvres — les rides d'un homme qui a passé sa vie à écouter et à peser. Cheveux blancs coupés très court, barbe en collier bien taillée. Ses yeux sont remarquables : d'un bleu gris délavé, d'une placidité absolue. Ils ne jugent pas — ils enregistrent. Il maintient le contact visuel légèrement plus longtemps que la normale, ce qui met certains visiteurs mal à l'aise.</p>
<p><strong>Voix :</strong> basse et bien timbrée, conçue pour les grands espaces — elle porte jusqu'au fond du Grand Temple sans qu'il ait à forcer. Débit lent et pondéré, avec une pause avant chaque conclusion, comme s'il laissait le plateau de la balance s'immobiliser. Ne hausse jamais le ton et ne reprend jamais un mot : ce qu'il a dit est dit.</p>
<p><strong>Rôle :</strong> Grand Prêtre du <strong>culte de Ral Ibris</strong>. Incorruptible — non par vertu extrême, mais parce qu'il considère la corruption comme une forme de rupture de contrat avec l'univers lui-même.</p>
`.trim(),
  },
  {
    nom: 'Barros Mullimax',
    desc: `
<p>Homme halfelin, la quarantaine, propriétaire de <strong>La Grenouille Royale</strong>. Petit et rond, avec l'énergie débordante d'un gamin de dix ans malgré ses tempes qui commencent à grisonner. Mains petites mais habiles, souvent colorées par les herbes et les extraits qu'il manipule — ce jour-là peut-être jaune safran, demain violet betterave. Tablier blanc moucheté de taches multicolores sur une chemise rayée, bretelles et pantoufles de velours vert.</p>
<p>Visage rond et expressif — joues rebondies, nez en trompette, yeux noisette pétillants toujours à moitié plissés par le sourire. Favoris bruns soigneusement taillés en virgule de chaque côté du visage. Cheveux bouclés brun-roux toujours légèrement en désordre, comme s'il avait oublié de se coiffer après sa dernière expérience alchimique.</p>
<p><strong>Voix :</strong> nasillarde et chaleureuse, montée d'un cran au-dessus du confortable, et qui ne s'arrête jamais très longtemps. Débit en cascade, ponctué de digressions enthousiastes et de « oh mais alors, dans ce cas… » ; il est incapable de laisser un client repartir sans lui avoir recommandé au moins trois autres produits. Chantonne entre deux clients sans s'en rendre compte.</p>
<p><strong>Rôle :</strong> propriétaire de <strong>La Grenouille Royale</strong>.</p>
`.trim(),
  },
  {
    nom: "Brakk «l'Enclume»",
    desc: `
<p>Homme demi-orc, 38 ans. Bâti comme le billot dont il porte le nom : court sur pattes, épais, le cou disparu dans les épaules. Se déplace peu et lentement, sauf sur le sable.</p>
<p>Peau vert-gris épaisse et grêlée, crâne rasé. Défenses inférieures larges, l'une cassée en biseau. Arcades saillantes, sourcils quasi absents à force de coupures. Oreilles en chou-fleur, nez inexistant.</p>
<p><strong>Voix :</strong> caverneuse et pâteuse — les mâchoires ont trop encaissé pour articuler proprement, et il mange la moitié des consonnes. Débit très lent, trois ou quatre mots à la fois, avec de longues respirations entre. Rit d'un seul son, bas et bref, quand quelque chose lui plaît vraiment.</p>
<p><strong>Rôle :</strong> combattant de l'arène clandestine du <strong>Monocle du Diable</strong> à Huriya.</p>
<p><em>Note MJ : doublon probable de la fiche « Brakk “l'Enclume” » (guillemets différents) — même personnage.</em></p>
`.trim(),
  },
  {
    nom: 'Brakk “l’Enclume”',
    desc: `
<p>Homme demi-orc, 38 ans, Maître de l'Arène. Bâti comme le billot dont il porte le nom : court sur pattes, épais, le cou disparu dans les épaules.</p>
<p>Peau vert-gris épaisse et grêlée, crâne rasé. Défenses inférieures larges, l'une cassée en biseau. Arcades saillantes, oreilles en chou-fleur.</p>
<p><strong>Voix :</strong> caverneuse et pâteuse, les consonnes à moitié mangées par des mâchoires trop souvent recousues. Débit très lent, trois ou quatre mots à la fois. Quand il annonce un combat, il ne dit que deux noms et un chiffre.</p>
<p><strong>Rôle :</strong> Maître de l'Arène.</p>
<p><strong>Capacités notables :</strong> PV 95 · CA 15. Implacable : quand Brakk tombe à 0 PV, il reste à 1 PV (1/jour). Seigneur de l'Arène : avantage aux attaques dans l'arène. Multiattaque (2 attaques). Marteau d'arène : +7, 1d10+4 contondant. Projection brutale : test de FOR opposé, la cible est projetée et à terre.</p>
<p><em>Note MJ : doublon probable de la fiche « Brakk «l'Enclume» » — même personnage.</em></p>
`.trim(),
  },
  {
    nom: 'Dame Elara Brumetaille',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 57 ans. Grande et mince, maintien de cour irréprochable ; elle reste debout plus longtemps que ses interlocuteurs et les laisse s'asseoir en premier.</p>
<p>Visage fin et pâle, pommettes hautes, peu de rides pour son âge. Cheveux gris argenté relevés en torsade stricte. Yeux bleu clair, attentifs, d'une amabilité constante. Aucun bijou visible sauf une broche aux armes des Écus.</p>
<p><strong>Voix :</strong> douce, cultivée, d'une clarté parfaite — elle articule chaque mot comme si l'interlocuteur risquait d'en manquer un, ce qui est précisément l'effet recherché. Débit lent et enveloppant, avec des reprises légères qui reformulent vos propres arguments dans ses termes à elle. À la fin d'un entretien, on est souvent convaincu d'avoir eu l'idée soi-même.</p>
<p><strong>Rôle :</strong> Protectrice des Écus — Conseillère Émérite de la <strong>Garnison des écus d'or</strong>. Loyale neutre. Manipulatrice subtile dotée d'une lecture sociale hors pair et de sorts d'influence (<em>Suggestion</em>, <em>Modification de mémoire</em>).</p>
<p><strong>Capacités notables :</strong> PV 95 · CA 15.</p>
`.trim(),
  },
  {
    nom: 'Delmira Soss',
    desc: `
<p>Femme humaine, d'une quarantaine d'années bien sonnées, solide et directe, aux mains calleuses d'une artisane qui n'a jamais cessé de travailler de ses doigts malgré son rang. Tenue de travail de qualité — chemise de lin crème, gilet de cuir brun aux nombreuses poches, tablier de forge replié à la ceinture lorsqu'elle reçoit des visiteurs. Un insigne en or frappé à la fleur de lys de Gandorenne épinglé sur son revers.</p>
<p>Cheveux châtains coupés court, profil net avec un nez légèrement cassé — souvenir d'un accident de forge dans sa jeunesse — et des yeux verts d'une franchise presque intimidante.</p>
<p><strong>Voix :</strong> ample et assurée, dressée à couvrir le vacarme des marteaux ; elle garde ce volume en réunion et ne s'en excuse pas. Débit franc et rapide, sans détour ni diplomatie — elle dit ce qu'elle pense d'une pièce mal frappée devant celui qui l'a frappée. Se durcit d'un coup, sèche et brève, dès qu'on prononce le mot « Momoritanie ».</p>
<p><strong>Rôle :</strong> Maître-Frappeur en chef de la <strong>Fonderie Royale de Gandorenne</strong> à Huriya. Appréciée pour son efficacité et sa loyauté envers le Royaume.</p>
<p><strong>Secret (MJ) :</strong> elle nourrit une certaine amertume envers la <strong>Momoritanie</strong>, dont la fonderie rivale bénéficie selon elle d'un traitement de faveur de la part de la <strong>Garnison</strong>.</p>
`.trim(),
  },
  {
    nom: 'Doran Kell',
    desc: `
<p>Homme, 29 ans. Maigre et nerveux, les épaules en avant ; il porte toujours quelque chose, et trotte pour suivre le pas de son maître.</p>
<p>Visage jeune et anguleux, semé de petites cicatrices d'étincelles. Cheveux noirs coupés court et inégaux, roussis d'un côté. Yeux marron attentifs, cernés. Avant-bras marqués de brûlures de fonderie à divers stades.</p>
<p><strong>Voix :</strong> jeune et un peu haute, qui part dans l'aigu quand il est pressé — c'est-à-dire souvent. Débit rapide et déférent, il répète les consignes à voix haute pour être sûr de les avoir. Commence presque toutes ses phrases par « Maître Vharn dit que… ».</p>
<p><strong>Rôle :</strong> assistant de <strong>Maddox Vharn</strong> à la fonderie <strong>La Frappe Brillante</strong> de Huriya.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Ernil Sultaasar',
    desc: `
<p>Homme elfe des bois, 167 ans, costaud — inhabituellement charpenté pour un elfe, épaules épaisses et avant-bras de lutteur.</p>
<p>Visage carré, mâchoire forte, peau hâlée. Cheveux bruns bouclés retenus en arrière par un lacet de cuir. Yeux bruns calculateurs, qui balayent la salle par cycles réguliers. Oreilles effilées, l'une entaillée en haut.</p>
<p><strong>Voix :</strong> basse et rare — il <strong>parle peu</strong>, et jamais le premier. Débit lent, réponses d'un ou deux mots, avec un temps d'attente avant chaque réponse pendant lequel il vous regarde. Quand il veut vraiment quelque chose, il ne le demande pas : il répète votre propre phrase, en enlevant un mot.</p>
<p><strong>Rôle :</strong> tient le <strong>Monocle du Diable</strong> à Huriya. Voit tout, parle peu.</p>
`.trim(),
  },
  {
    nom: 'Essel Vaanmyr',
    desc: `
<p>Femme haute elfe, d'apparence indéfinissable — entre deux cents et quatre cents ans selon les rumeurs. Grande et fine, elle se déplace avec une lenteur délibérée qui donne l'impression qu'elle glisse plutôt qu'elle ne marche. Robes sombres à broderies géométriques, une bague à chaque main, chacune gravée d'une formule différente. Doigts invariablement tachés d'encre violette.</p>
<p>Peau d'un blanc nacré légèrement bleuté à la lumière du soir. Cheveux d'un noir d'encre relevés en un chignon architectural maintenu par deux plumes de corbeau réelles. Visage allongé, traits fins, nez légèrement busqué ; oreilles effilées dépassant à peine de la coiffure. Yeux d'un gris très pâle, presque argenté — ils donnent parfois l'impression de voir à travers les gens plutôt qu'en eux.</p>
<p><strong>Voix :</strong> ténue et parfaitement posée, d'un calme qui ne varie jamais ; elle <strong>parle peu</strong> et sourit rarement. Débit très lent, avec de longs silences qu'elle n'éprouve aucun besoin de combler — elle écoute avec une attention totale qui peut mettre ses interlocuteurs mal à l'aise. Ne pose jamais deux fois la même question : si on élude, elle attend.</p>
<p><strong>Rôle :</strong> propriétaire de <strong>La Plume du Corbeau</strong>.</p>
`.trim(),
  },
  {
    nom: 'Galya Ivelis',
    desc: `
<p>Femme, 27 ans, fille de la famille <strong>Ivelis</strong>. Grande et mince, port très droit appris en salle d'audience ; elle garde les mains croisées devant elle en public.</p>
<p>Visage allongé, pommettes hautes, teint clair. Cheveux châtain clair tressés en couronne. Yeux noisette perçants — le regard des Ivelis, qu'elle a appris à adoucir volontairement.</p>
<p><strong>Voix :</strong> claire et bien placée, d'une politesse qui ne se relâche jamais tout à fait. Débit mesuré, elle réfléchit visiblement avant de répondre et n'improvise pas. Sa seule fantaisie : un rire bref et franc, qui la surprend elle-même et qu'elle réprime aussitôt.</p>
<p><strong>Rôle :</strong> fille de la famille <strong>Ivelis</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Ilrune Ivelis',
    desc: `
<p>Homme, 31 ans, fils de la famille <strong>Ivelis</strong>. Taille moyenne, mince, mise soignée de négociant plutôt que de prince ; il voyage plus qu'il ne siège.</p>
<p>Visage fin, barbe courte entretenue. Cheveux châtain foncé coiffés en arrière. Yeux noisette perçants — le regard des Ivelis. Deux rides verticales déjà installées entre les sourcils.</p>
<p><strong>Voix :</strong> posée et agréable, celle d'un homme qui a appris à conclure des affaires loin de chez lui. Débit fluide et pragmatique, riche en chiffres et en échéances, sans emphase de cour. Emploie « nous » pour la compagnie et « la famille » pour les Ivelis — jamais l'inverse.</p>
<p><strong>Rôle :</strong> fils de la famille <strong>Ivelis</strong>, associé à la compagnie de transport <strong>Rigart &amp; fils</strong> (fondée par le père d'Illevas).</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Ilseva Dawnthread',
    desc: `
<p>Femme humaine, d'une quarantaine d'années, au visage qui semble plus vieux et plus jeune à la fois selon l'angle où on la regarde. Robes flottantes aux teintes de nuit — bleu nuit, violet sombre, gris perle — avec des broderies de fil argenté représentant des constellations. Autour du cou, un pendentif en verre soufflé contenant un liquide laiteux qui change de couleur selon l'humeur.</p>
<p>Sa caractéristique la plus frappante : des cheveux d'un blanc pur, épais et ondulés, qui lui tombent aux épaules — blancs depuis ses vingt ans, dit-on, après un incident dont elle ne parle jamais. Visage ovale, peau légèrement mate avec de fins traits autour des yeux. Ces yeux sont d'un bleu-gris trouble, semblables à un ciel de brume — ils ont cette qualité troublante de regarder légèrement au-dessus de l'interlocuteur, comme si elle voyait quelque chose que les autres ne voient pas. Lèvres fines, souvent esquissant un sourire énigmatique.</p>
<p><strong>Voix :</strong> douce et sans hâte, avec un léger décalage qui donne l'impression qu'elle répond à la question précédente. Débit très lent : elle prend son temps, laisse des silences, et <strong>finit souvent ses phrases par une question en retour</strong>. Ne dit jamais « je ne sais pas » — elle dit « pas encore ».</p>
<p><strong>Rôle :</strong> propriétaire de <strong>La Prophétie</strong>.</p>
`.trim(),
  },
  {
    nom: 'Keerla Ivelis',
    desc: `
<p>Femme, 23 ans, fille de la famille <strong>Ivelis</strong>. Petite et vive, incapable de rester assise ; elle joue avec ses bagues, ses manches, tout ce qui passe.</p>
<p>Visage rond, encore enfantin, semé de taches de rousseur. Cheveux roux foncé coupés court, indisciplinés. Yeux noisette perçants — le regard des Ivelis, qui détonne dans un visage aussi jeune.</p>
<p><strong>Voix :</strong> haute et rapide, montée d'un cran quand elle s'enthousiasme, c'est-à-dire constamment. Débit en avalanche, elle enchaîne trois sujets sans respirer et rit au milieu de ses propres phrases. Baisse brutalement d'un ton et articule très lentement quand elle veut être prise au sérieux — ce qui marche, et l'étonne encore.</p>
<p><strong>Rôle :</strong> fille de la famille <strong>Ivelis</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Lady Lyra Astrebois',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 36 ans. Grande et fine, d'une maigreur sèche ; épaules et dos très développés par l'arc, ce qui déséquilibre sa silhouette au premier regard.</p>
<p>Visage étroit et hâlé, pommettes marquées. Cheveux blond foncé tressés serré et enroulés à l'arrière. Yeux gris-vert d'une acuité remarquable, plissés en permanence par des années à juger des distances. Deux doigts de la main droite marqués d'une corne épaisse.</p>
<p><strong>Voix :</strong> claire et sèche, projetée haut pour passer par-dessus une ligne d'archers. Débit bref et cadencé, en commandements de trois syllabes — « Encochez », « Tendez », « Lâchez » — qu'elle emploie aussi, par habitude, hors du champ de tir. Ne parle jamais pendant qu'elle vise, et lève simplement deux doigts pour qu'on se taise.</p>
<p><strong>Rôle :</strong> Archer d'Élite — Capitaine des Archers de la <strong>Garnison des écus d'or</strong>. Neutre.</p>
<p><strong>Capacités notables :</strong> PV 102 · CA 17. Œil du Faucon : ignore le demi-couvert. Volée Coordonnée : amplifie ses archers.</p>
`.trim(),
  },
];

async function main() {
  let faits = 0;
  for (const f of LOT) {
    const pnj = await prisma.personOfInterest.findFirst({ where: { name: f.nom }, select: { id: true, description: true } });
    if (!pnj) { console.log(`⚠ introuvable : ${f.nom}`); continue; }
    if ((pnj.description ?? '').includes('<strong>Voix :</strong>')) { console.log(`· ${f.nom.padEnd(28)} déjà complété`); continue; }
    await prisma.personOfInterest.update({ where: { id: pnj.id }, data: { description: f.desc, ...(f.sexe ? { sex: f.sexe } : {}) } });
    console.log(`✓ ${f.nom.padEnd(28)} complété${f.sexe ? ` (sexe: ${f.sexe})` : ''}`);
    faits++;
  }
  console.log(`\n${faits} fiche(s) complétée(s) sur ${LOT.length}.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
