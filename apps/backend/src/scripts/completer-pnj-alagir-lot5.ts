import { PrismaClient, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

/** Alagir, lot 5/5. Lore existant conservé mot pour mot ; physique et voix ajoutés. */
type Fiche = { nom: string; sexe?: Sex; desc: string };

const LOT: Fiche[] = [
  {
    nom: 'Pellin Droun',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 46 ans. Épais et voûté, la carrure d'un ancien docker que le bureau a empâté sans l'affaiblir ; il garde les mains dans le dos en marchant sur les quais.</p>
<p>Visage lourd et grêlé, nez épaté, cheveux noirs ras et clairsemés. Yeux marron mi-clos, qui ne regardent jamais un chargement en face mais ne ratent rien. Crochet de docker passé à la ceinture, dont il ne se sert plus.</p>
<p><strong>Voix :</strong> rauque et basse, abîmée par vingt ans de cris sur les pontons ; elle ne remonte plus. Débit lent et las, comme si chaque phrase lui coûtait ; il laisse traîner la dernière syllabe. Ne dit jamais « interdit » : il dit « pas ce soir », et personne n'insiste.</p>
<p><strong>Rôle :</strong> intendant du port pour le <strong>Syndicat d'Alagir</strong>. Ancien docker passé du côté obscur, il surveille les marchandises illégales. Aucun navire ne quitte Alagir la nuit sans son sceau secret.</p>
`.trim(),
  },
  {
    nom: 'Priel Vanguard',
    sexe: 'MAN',
    desc: `
<p>Humain, nourrisson. Toujours emmitouflé dans des draps brodés aux armoiries Vanguard — pourpre et or.</p>
<p>Joues rondes et roses ; yeux noisette déjà vifs et éveillés ; fines mèches de cheveux noirs qui commencent à boucler.</p>
<p><strong>Voix :</strong> celle d'un nourrisson — gazouillis, rires en cascade, et des cris d'une puissance qui traverse trois salles du Château de Verre. Les nourrices notent une particularité dont personne ne parle : il se tait instantanément, et pour de bon, dès que son père entre dans la pièce.</p>
<p><strong>Rôle :</strong> héritier royal d'Alagir, fils de <strong>Pelfort</strong> et <strong>Guetel Vanguard</strong>. Innocent, mais peut servir de levier émotionnel dans les intrigues du trône.</p>
`.trim(),
  },
  {
    nom: 'Regalio Regani',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 43 ans, nobliau dolomitcien de 3<sup>e</sup> ordre. De taille moyenne et un peu mou, épaules rondes que la coupe de ses vestes tente de corriger.</p>
<p>Visage poupin et poudré, joues rasées de trop près. Cheveux bruns bouclés soigneusement arrangés, déjà clairsemés au sommet. Yeux marron toujours en quête d'approbation. Trop de bagues.</p>
<p><strong>Voix :</strong> haute et flagorneuse, d'un enthousiasme permanent qui fatigue au bout de dix minutes. Débit rapide et flatteur, saturé de superlatifs ; il rit avant ses propres traits d'esprit. Le timbre se brise d'un demi-ton quand il s'adresse à quelqu'un de l'<strong>Œil Pourpre</strong> — un tic que ses invités prennent pour de la déférence mondaine.</p>
<p><strong>Rôle :</strong> couverture artistique et officier de liaison entre l'<strong>Œil Pourpre</strong> et les Duchés. Hôte de <strong>Marcheto Spazi</strong>.</p>
`.trim(),
  },
  {
    nom: "Risa d'Olven",
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 38 ans. Sèche et musclée, épaules carrées ; elle porte le casque de carrière même pour traverser un bureau.</p>
<p>Visage anguleux couvert d'une poussière pourpre qui ne part jamais complètement des plis. Cheveux noirs tressés serré sous le casque. Yeux gris clair, très pâles dans un visage sale. Une main gauche à laquelle il manque l'auriculaire.</p>
<p><strong>Voix :</strong> forte et brève, calibrée pour les galeries où l'écho brouille tout — elle répète systématiquement chaque consigne deux fois, réflexe de sécurité. Débit sec, sans adjectifs. Se tait complètement et lève la main quand elle veut écouter la roche, et tout le monde se tait avec elle.</p>
<p><strong>Rôle :</strong> maîtresse-carrière des <strong>Géodes Pourprées</strong> — galeries en cloche, dômes naturels scintillants. Rumeurs de xorns aperçus dans les profondeurs : elle a renforcé la sécurité des accès.</p>
`.trim(),
  },
  {
    nom: 'Sahi "Lame-Cramoisie"',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 40 ans. Athlétique et compacte, la démarche économe d'une officière de terrain ; elle ne s'assoit qu'en fin de rapport.</p>
<p>Visage carré et hâlé, cheveux auburn coupés court et rasés sur la nuque. Yeux marron directs. Une longue cicatrice claire le long de l'avant-bras droit, qu'elle ne cache pas. Armure d'ordonnance impeccablement entretenue.</p>
<p><strong>Voix :</strong> claire et tranchante, projetée sans effort, faite pour les ordres brefs en rue étroite. Débit rapide et structuré, en points numérotés ; elle répète l'essentiel à la fin. Une seule inflexion la trahit : elle ralentit et cherche ses mots dès qu'on lui demande <em>pourquoi</em> un ordre a été donné.</p>
<p><strong>Rôle :</strong> commandante opérationnelle du <strong>Soleil Pourpre</strong>. Spécialiste des manœuvres urbaines, de la protection de convois et des fouilles discrètes. Casernes : <strong>La Garde-Fente</strong> (Porte Pourpre).</p>
<p><strong>Secret (MJ) :</strong> loyale à ce qu'elle croit être un pouvoir légitime, elle est inconsciente de la manipulation occulte du <strong>Roi-Tyrannœil</strong>.</p>
`.trim(),
  },
  {
    nom: 'Salome Lirn',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 81 ans, ridée. Petite et sèche, pliée en avant ; elle se déplace de comptoir en étagère en s'appuyant sur les meubles.</p>
<p>Visage profondément ridé, longue natte argentée ramenée sur l'épaule. Lunettes rondes toujours sales, qu'elle ne nettoie jamais. Yeux bleus délavés derrière les verres troubles. Mains tachées de vert et de brun.</p>
<p><strong>Voix :</strong> fluette et chevrotante, qui s'éteint en fin de phrase. Parle lentement, très lentement, avec de longues pauses pendant lesquelles elle regarde un bocal plutôt que son client. Répond souvent à côté de la question, puis, trois minutes plus tard, exactement à la question. « <em>Chaque feuille connaît une époque, chaque graine se souvient d'un visage.</em> »</p>
<p><strong>Rôle :</strong> tient <strong>L'Herbe &amp; le Sablier</strong>. Son chat à deux queues, <strong>Khem</strong>, dort sur le comptoir.</p>
<p><strong>Secret (MJ) :</strong> elle garde sous le plancher une racine vivante de l'<strong>Arbre de Tal Odius</strong>.</p>
`.trim(),
  },
  {
    nom: 'Saphira Tel-Olem',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 44 ans. Grande et mince, maintien rigide, mains gantées de cuir fin ; elle ne quitte jamais sa cape de voyage à l'intérieur.</p>
<p>Visage allongé au teint mat, pommettes hautes. Cheveux noirs tirés en une tresse unique très serrée. Yeux noirs et fixes. Une cicatrice de brûlure en écaille sur le dos de la main droite, qu'elle laisse parfois voir volontairement.</p>
<p><strong>Voix :</strong> grave et posée, avec une pointe d'accent du Levant sur les voyelles. Débit lent et mesuré, jamais pressé, même quand la salle l'est ; elle laisse un silence complet avant d'annoncer un taux. Ne répète jamais un chiffre : on note, ou on renonce.</p>
<p><strong>Rôle :</strong> dragonnière et directrice de la <strong>Banque du Dragon d'Or</strong>. Spécialiste de l'escompte et des lettres de crédit à longue portée — routes de <strong>Huriya</strong> et des cités du Levant.</p>
`.trim(),
  },
  {
    nom: 'Sarlis Nym',
    desc: `
<p>Gnome, 91 ans. Petit et rond, perché sur un tabouret à vis derrière un comptoir étroit ; travaille de nuit et dort le jour, ce qui se voit.</p>
<p>Visage bouffi et pâle, cerné jusqu'aux pommettes. Cheveux blancs en couronne autour d'un crâne dégarni. Yeux verts extrêmement rapides, qui comptent les pièces avant que la main ne les pose. Une loupe d'horloger vissée en permanence à l'œil gauche.</p>
<p><strong>Voix :</strong> nasillarde et feutrée, adaptée aux transactions qu'on ne veut pas voir répétées ; elle ne dépasse jamais la largeur du comptoir. Débit haché de chiffres, ponctué de petits claquements de langue à chaque conversion. Ne dit jamais le nom d'une devise étrangère à voix haute : il l'écrit à l'envers sur une ardoise et l'efface.</p>
<p><strong>Rôle :</strong> cambiste nocturne, tient le <strong>Comptoir des Lunes</strong> — planque du <strong>Syndicat</strong>. Cartes nautiques vivantes en cave.</p>
<p><em>Note MJ : son genre n'est pas établi en fiche — la description reste neutre.</em></p>
`.trim(),
  },
  {
    nom: 'Selianne Palhindile',
    sexe: 'WOMAN',
    desc: `
<p>Femme demi-elfe, 29 ans, héritière <strong>Palhindile</strong>. Silhouette élancée, grâce naturelle dans chaque geste. Mains aux doigts fins, légèrement tachées d'encre malgré les gants de soie fine qu'elle porte en audience.</p>
<p>Cheveux auburn aux reflets cuivrés, légèrement ondulés, portés mi-longs avec une broche d'or discrète sur le côté. Yeux noisette dorés aux reflets elfiques, regard à la fois chaleureux et perçant — elle évalue son interlocuteur aussi vite qu'elle lui sourit.</p>
<p><strong>Voix :</strong> chaude et claire, d'une souplesse remarquable : elle s'aligne instinctivement sur le registre de son interlocuteur, plus rapide avec les marchands, plus feutrée avec les prêtres. Débit fluide, jamais pris en défaut, avec l'habitude de reformuler la position adverse mieux que son auteur avant d'y répondre — sa signature de médiatrice. Rit d'un rire bref et franc, jamais de complaisance.</p>
<p><strong>Rôle :</strong> dirige la <strong>Cour des Ambassades</strong> et l'<strong>Académie des Médiateurs</strong>. Charismatique, diplomate idéale.</p>
<p><strong>Secret (MJ) :</strong> elle a intercepté une lettre compromettante liant une Maison rivale à un complot contre sa mère la Chancelière — elle ne sait pas encore comment s'en servir.</p>
<p><strong>Capacités notables :</strong> CA 14 · PV 36 · Dague +4. Persuasion +7, Intuition +6, Tromperie +4. Voix incorruptible 1/jour (dissipe Charme ou Suggestion).</p>
`.trim(),
  },
  {
    nom: 'Sesk Orlo',
    desc: `
<p>Homme humain, la quarantaine, sec et nerveux. Toujours en mouvement, à se gratter l'avant-bras ou à vérifier ses poches.</p>
<p>Cheveux gras noués en catogan ; cicatrices de couteau aux avant-bras ; sourire de fouine à qui il manque deux dents. Il sent l'égout et l'eau-de-vie.</p>
<p><strong>Voix :</strong> aiguë et volubile, avec un rire sifflant qui ponctue ses propres mensonges. Débit de camelot — il parle vite, beaucoup, et colle un surnom affectueux à tout le monde dès la deuxième phrase. Dès qu'on le domine, le débit s'effondre : il bafouille, répète « attends, attends » et négocie.</p>
<p><strong>Rôle :</strong> chef du <strong>Fretin</strong>. Beau-parleur, il a « adopté » <strong>Brynn Fer-Vallée</strong> en lui offrant une fausse famille, pour mieux l'utiliser comme passeuse — puis l'a bouclée quand elle a compris la nature du fret.</p>
<p><strong>Secret (MJ) :</strong> vénal, il a vendu son âme (et Brynn) pour le contrat <strong>Mastiggia</strong> ; lâche dès qu'on le domine.</p>
<p><strong>Capacités notables :</strong> bandit capitaine (FP 2). CA 15 · PV 65 · Init +3. Multiattaque : 2 cimeterres (+5, 1d6+3 tranchant) + 1 dague (+5, 1d4+3). Parade : +2 CA en réaction contre une attaque de mêlée qu'il voit venir.</p>
`.trim(),
  },
  {
    nom: 'Tarn Vess',
    sexe: 'MAN',
    desc: `
<p>Homme humain, la cinquantaine, maigre. Doigts longs et secs, presque toujours tachés d'encre noire. Tenue grise, chemise boutonnée jusqu'au col, fonctionnelle à l'extrême.</p>
<p>Front haut et largement dégarni. Lunettes à monture de cuivre perchées sur un nez aquilin ; yeux marron calmes et méthodiques derrière les verres.</p>
<p><strong>Voix :</strong> unie et sans relief, celle d'un homme qui énonce des inventaires depuis trente ans. Débit lent et parfaitement régulier, sans jamais une inflexion — il annonce un manquant du même ton qu'un arrivage. Ne répond à une question qu'après avoir fini d'écrire la ligne en cours.</p>
<p><strong>Rôle :</strong> contremaître des entrepôts <strong>Tovalis</strong>. Pragmatique, il tient les comptes officieux.</p>
`.trim(),
  },
  {
    nom: 'Torv Arkhammar',
    sexe: 'MAN',
    desc: `
<p>Homme nain, 121 ans. Massif et sanglé dans un harnais de carrier, épaules énormes ; il descend encore lui-même dans la fosse chaque matin.</p>
<p>Visage large couvert d'une poussière cramoisie incrustée dans chaque ride. Barbe rousse virant au gris, tressée en une natte unique glissée sous le harnais. Yeux bleus vifs, très clairs dans ce visage rouge. Un masque de toile pendu au cou.</p>
<p><strong>Voix :</strong> tonnante et enrouée, qui porte d'un bord à l'autre de la fosse ; il tousse sec entre les phrases — la poussière cramoisie, qu'il connaît mieux que personne. Débit direct et imagé, plein de comparaisons de carrière. Compte à rebours à voix haute avant chaque tir, et personne ne parle pendant.</p>
<p><strong>Rôle :</strong> maître-carrier de la <strong>Carrière Écarlate</strong> — carrière à ciel ouvert, veines compactes. Gère les risques de glissements et la « <strong>poussière cramoisie</strong> » (inhalation : sauvegarde de Constitution DD 12 ou désavantage en Perception pendant 1 h).</p>
`.trim(),
  },
  {
    nom: 'Veda Karom',
    desc: `
<p>Humain, la trentaine. Taille moyenne, mince, vêtu de couleurs ternes choisies pour ne pas se remarquer ; s'assoit toujours dos au mur et face à la porte.</p>
<p>Visage ordinaire, volontairement quelconque, barbe de trois jours. Cheveux châtains ni courts ni longs. Yeux gris attentifs, qui font le tour de la salle avant de se poser. Une brûlure ronde à l'intérieur du poignet gauche — la marque de <strong>La Braise</strong>, dissimulée sous la manche.</p>
<p><strong>Voix :</strong> basse et tranquille, réglée juste sous le brouhaha d'une salle commune pour qu'on ne l'entende pas d'une table à l'autre. Débit calme et bref, sans jamais un nom propre inutile ; les personnes et les lieux sont désignés par des périphrases. Change de sujet sans transition dès qu'un serveur approche.</p>
<p><strong>Rôle :</strong> contact de <strong>La Braise</strong>. Donne rendez-vous à <strong>La Roue de Secours</strong> ; met <strong>Harl Denvar</strong> en relation avec les PJ (Partie 5).</p>
<p><em>Note MJ : son genre n'est pas établi en fiche — la description reste neutre.</em></p>
`.trim(),
  },
  {
    nom: 'Velric Tovalis',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 20 ans, fils cadet <strong>Tovalis</strong>. Mince, d'allure juvénile, il ne ressemble pas encore à son père imposant. S'habille simplement — chemise ouverte, veste usée — mais porte des bijoux de pacotille en signe de rébellion discrète.</p>
<p>Cheveux noirs en bataille, ombre de barbe irrégulière sur les joues. Yeux noirs vifs, regard souvent en dessous. Jointures récemment écorchées, bleu sur la pommette gauche.</p>
<p><strong>Voix :</strong> jeune et cassante, qui monte trop vite dans l'aigu quand on le contredit. Débit précipité et agressif en public, où il en fait trop ; nettement plus posé et presque timide quand il n'y a qu'un interlocuteur. Ponctue ses phrases de « ouais, ouais » pour couper court aux conseils.</p>
<p><strong>Rôle :</strong> rebelle, amateur de paris et de combats illégaux. Parfois aperçu au <strong>Goulet Écarlate</strong>.</p>
<p><strong>Secret (MJ) :</strong> rumeur — il aurait des contacts dans <strong>La Braise</strong> pour du trafic de poudre de marbre (stimulant).</p>
`.trim(),
  },
  {
    nom: 'Virion Omalee',
    sexe: 'MAN',
    desc: `
<p>Homme elfe, 214 ans. Grand et décharné, épaules tombantes, mains très longues — la même silhouette qu'<strong>Amiro Léovine</strong>, et pour cause.</p>
<p>Traits fins et tirés, peau grise, cheveux blancs coupés net à l'épaule. Yeux d'un bleu très pâle traversés d'éclats cristallins.</p>
<p><strong>Voix :</strong> sèche et précise, sans chaleur, le débit posé d'un précepteur. Appelle ses interlocuteurs par leur nom complet.</p>
<p><strong>Rôle :</strong> véritable nom d'<strong>Amiro Léovine</strong> (initiales V.O.). Précepteur d'<strong>Elerÿna</strong>, cristomancien.</p>
<p><em>Note MJ : doublon de la fiche « Amiro Léovine » — même personne sous son vrai nom.</em></p>
`.trim(),
  },
  {
    nom: 'Vittore Mastiggia',
    desc: `
<p>Homme humain, la trentaine, mince et tiré à quatre épingles. Gants toujours immaculés, bague-sceau du clan <strong>Izotzargi</strong> à une chaîne.</p>
<p>Cheveux noirs gominés, fine moustache ; sourire de marchand qui n'atteint jamais les yeux gris.</p>
<p><strong>Voix :</strong> huilée et agréable, avec un accent dolomicien léger qu'il accentue ou gomme selon l'interlocuteur. Débit fluide et enjôleur, saturé d'euphémismes commerciaux ; il négocie même quand il n'y a rien à négocier. Dès qu'il est acculé, le timbre monte d'un cran et le débit double — c'est le seul moment où on l'entend vraiment.</p>
<p><strong>Rôle :</strong> cadet ambitieux de la famille <strong>Mastiggia</strong> et cerveau de la combine : détourner discrètement des esclaves déjà « traités » par l'<strong>Œil Pourpre</strong> (la filière du Roi) pour les revendre à prix d'or à la cité vampire souterraine de <strong>Nharivum</strong>, sous Mongar. Se croit intouchable ; négocie toujours, ne se bat qu'acculé (rapière +4, 1d8+2). C'est lui, le représentant Mastiggia présent au point de transfert du <strong>Fretin</strong>. <strong>Bal Tovalis (Soir 1)</strong> : présent comme émissaire de la maison Mastiggia, sous les dehors d'un marchand dolomicien venu « nouer des contrats ».</p>
<p><strong>Secret (MJ) :</strong> il vole la marchandise du Tyrannœil — s'il est exposé, le Roi l'écrasera avant les tribunaux.</p>
`.trim(),
  },
  {
    nom: 'Yovan Kelep',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 55 ans. Grand et osseux, très droit, les mains jointes sur le ventre ; il se tient debout pendant les entretiens et ne s'assoit que pour écrire.</p>
<p>Visage long et sévère, joues creuses, tonsure nette au sommet du crâne. Cheveux poivre et sel coupés ras sur les côtés. Yeux gris froids sous des sourcils rares. Une balance miniature en argent pendue au cou, insigne de <strong>Ral Zitris</strong>.</p>
<p><strong>Voix :</strong> claire et sentencieuse, portée par une diction d'officiant ; chaque phrase sonne comme une lecture de texte. Débit lent et solennel, avec une pause avant chaque somme, qu'il énonce jusqu'au dernier cuivre — l'exactitude est chez lui un acte de dévotion. Termine tout entretien par « la balance retient », qui vaut signature.</p>
<p><strong>Rôle :</strong> prêtre-auditeur des <strong>Larmes de Ral Zitris</strong>, banque vouée au dieu-compteur (aspect « contrition par l'exactitude »). Spécialiste des obligations de rançon et des dépôts judiciaires.</p>
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
