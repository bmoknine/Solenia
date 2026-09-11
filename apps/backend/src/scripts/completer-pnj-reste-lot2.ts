import { PrismaClient, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

/** Reste du monde, lot 2. Lore existant conservé ; physique et voix ajoutés. */
type Fiche = { nom: string; sexe?: Sex; desc: string };
const RACE_NC = '<p><em>Note MJ : sa race n\'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>';

const LOT: Fiche[] = [
  {
    nom: 'Geani',
    desc: `
<p>Femme, 24 ans, nouvelle épouse du roi <strong>David IV</strong> de Gandorènne. Menue et très jeune au milieu d'une cour qui ne l'est pas ; elle se tient droite par effort visible.</p>
<p>Visage fin, teint clair, encore enfantin autour de la bouche. Cheveux blond vénitien relevés en coiffure de cour trop lourde pour elle. Yeux verts, souvent baissés en public et très directs quand ils ne le sont pas.</p>
<p><strong>Voix :</strong> claire et légère, d'une politesse appliquée qui trahit l'apprentissage récent. Débit lent et prudent en présence du roi, nettement plus vif et spirituel dès qu'il quitte la pièce. Ne dit jamais « mon époux » : elle dit « le roi », comme tout le monde.</p>
<p><strong>Rôle :</strong> nouvelle épouse du roi <strong>David IV</strong> de Gandorènne.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Hirvel Soran',
    desc: `
<p>Homme, 54 ans, corpulent. Lourd et lent, il s'installe et laisse venir ; robes luxueuses aux étoffes trop chargées pour le climat de Kalanos.</p>
<p>Visage gras et luisant, bajoues, teint olivâtre. Cheveux noirs teints, ramenés sur le crâne. Yeux noirs petits et mobiles, qui évaluent en permanence. Bagues à presque tous les doigts.</p>
<p><strong>Voix :</strong> onctueuse et traînante, avec des manières sournoises qui transparaissent dans les intonations avant les mots. Débit lent et sinueux, plein de compliments et de sous-entendus ; il pose ses conditions en ayant l'air de rendre service. Rit d'un petit rire humide après chacune de ses propres remarques.</p>
<p><strong>Rôle :</strong> principal financier de <strong>Kalanos</strong>, avec de nombreuses connexions chez les marchands d'autres cités.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Huit Nuits',
    desc: `
<p>Homme goliath au visage ascétique. Sec et long, immobile ; le froid s'attarde autour de ses mains et les flammes vacillent en sa présence.</p>
<p>Peau gris cendre striée de veines noires. Crâne rasé, tatouages funéraires sur le cuir chevelu.</p>
<p><strong>Voix :</strong> rauque et basse, presque soufflée, comme si l'air lui manquait toujours un peu. Débit lent et détaché, d'un calme absolu quel que soit le sujet. Une particularité que ses élèves redoutent : quand il prononce un nom de mort, un très léger écho la double, d'un demi-temps en retard.</p>
<p><strong>Rôle :</strong> maître nécromancien du <strong>Monastère des Nuits</strong>. École : <strong>Nécromancie</strong>. Dialogue avec la mort et les ombres.</p>
<p><strong>Capacités notables :</strong> FP 5 · PV 72. Sorts signatures : Animation des morts, Flétrissement, Parler avec les morts, Nuage mortel. « Poigne du dernier souffle » : 4d10 nécrotiques et réduit les PV max (JS Constitution DD 16, recharge 5-6). Résistance aux dégâts nécrotiques ; avantage aux JS contre la mort.</p>
`.trim(),
  },
  {
    nom: 'Ivano Tomasio',
    sexe: 'MAN',
    desc: `
<p>Homme, 19 ans, de la <strong>Famille Tomasio</strong>. Grand et dégingandé, encore en train de s'étoffer ; il ne sait pas quoi faire de ses mains dans les réceptions.</p>
<p>Visage long hérité d'<strong>Esebio</strong>, teint olivâtre, duvet de barbe mal assuré. Cheveux noirs épais et bouclés. Yeux marron foncé, vifs et curieux.</p>
<p><strong>Voix :</strong> encore mal assise, qui dérape dans l'aigu au mauvais moment et qu'il rattrape en toussant. Débit rapide et enthousiaste, avec un accent dolomicien plus marqué que celui de son père — il a grandi là-bas. S'arrête net au milieu d'une phrase dès que sa mère le regarde.</p>
<p><strong>Rôle :</strong> membre de la <strong>Famille Tomasio</strong> (comtes des Dolomites), au palais du comte de Brodnica.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Kaelen Voss',
    sexe: 'MAN',
    desc: `
<p>Homme humain, ~40 ans. Silhouette fine et athlétique, économe de ses gestes ; il ne fait jamais un pas de trop et se tient toujours à portée d'une sortie.</p>
<p>Cheveux noirs courts. Visage impassible, traits nets, rasé de près. <strong>Yeux gris métalliques</strong>, fixes et sans expression lisible.</p>
<p><strong>Voix :</strong> basse et parfaitement égale — d'où son surnom de « <strong>Voix Silencieuse</strong> » : elle ne dépasse jamais le volume strictement nécessaire, si bien que ses hommes doivent s'immobiliser pour l'entendre. Débit lent, phrases courtes, aucune répétition. N'a jamais élevé le ton de mémoire de garnison ; quand il est mécontent, il se contente de se taire.</p>
<p><strong>Rôle :</strong> commandant de la garnison de <strong>La Main du Silence</strong>. Méthodique, calculateur, loyal à la Main.</p>
<p><strong>Capacités notables :</strong> FP 7 · PV 105. Multiattaque ; lame silencieuse (+7, 1d8+4 + 2d6 poison), arbalète ; attaque sournoise +4d6, évasion, disparition tactique (invisibilité 1 tour, recharge 5-6).</p>
`.trim(),
  },
  {
    nom: 'Kerrhylon Fax',
    desc: `
<p>Homme drakéide, 43 ans. Haut et sec, la posture raide ; il porte des vêtements civils avec une gêne de militaire déguisé.</p>
<p>Écailles brun-rouge mates, ternies aux jointures. Cornes courtes, l'une ébréchée. Yeux verticaux d'un jaune pâle. Une cicatrice claire barre les écailles de la gorge.</p>
<p><strong>Voix :</strong> grondante et basse, avec le sifflement drakéide sur les sifflantes ; elle attire l'attention, ce qui est un handicap dans son métier et l'oblige à parler peu. Débit bref et rigide, en phrases de rapport. Ne s'adresse jamais le premier à un inconnu.</p>
<p><strong>Rôle :</strong> rang Tours 2 de la cellule de l'<strong>Œil Pourpre</strong> à Russolio.</p>
`.trim(),
  },
  {
    nom: 'Lauc Kinemor',
    desc: `
<p>Homme, 47 ans, membre de la famille royale <strong>Kinemor</strong>. Massif et empâté, le pas lourd ; il tient mal debout longtemps et le cache par des poses assises étudiées.</p>
<p>Visage large et coloré, double menton naissant. Cheveux blond cendré coupés court, dégarnis au front. Yeux bleu pâle, injectés. Doigts boudinés couverts de bagues.</p>
<p><strong>Voix :</strong> forte et pâteuse, avec l'accent pointu momoritanien un peu mâché. Débit lourd et péremptoire, il assène plus qu'il n'argumente et coupe la parole sans s'en rendre compte. Répète « évidemment » pour combler ce qu'il ne sait pas.</p>
<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Limor Kinemor',
    desc: `
<p>Homme, 38 ans, membre de la famille royale <strong>Kinemor</strong>. Mince et nerveux, incapable de rester en place ; il arpente les pièces en parlant.</p>
<p>Visage étroit et pâle, pommettes saillantes. Cheveux blond cendré coiffés en arrière. Yeux bleu pâle très mobiles. Une habitude de se ronger l'intérieur de la joue.</p>
<p><strong>Voix :</strong> haute et rapide, avec l'accent pointu momoritanien poussé jusqu'à l'affectation. Débit précipité, il termine les phrases des autres et se corrige en cours de route. Baisse la voix par réflexe dès qu'il prononce un nom de la famille régnante, même en privé.</p>
<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Lyris Elvaltis',
    desc: `
<p>Femme, 18 ans, fille cadette d'<strong>Aedran</strong>. Menue et un peu voûtée, toujours chargée : <strong>toujours entourée de parchemins</strong>, qu'elle porte en pile instable.</p>
<p>Cheveux châtain clair, mal attachés, mèches devant les yeux. Visage jeune et fin, taches d'encre récurrentes. Yeux noisette attentifs derrière des besicles qu'elle remonte sans cesse.</p>
<p><strong>Voix :</strong> claire et rapide, qui s'emballe dès qu'elle parle d'architecture ou d'histoire ancienne — elle devient alors difficile à suivre et s'en excuse trois phrases trop tard. Débit hésitant sur tout le reste, avec des « enfin, je veux dire » en cascade. Lit à mi-voix sans s'en apercevoir.</p>
<p><strong>Rôle :</strong> fille cadette d'Aedran Elvaltis, à <strong>Kalanos</strong>. Érudite passionnée d'architecture et d'histoire ancienne.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Lys Corven',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, ~35 ans. Sèche et souple, la carrure d'une éclaireuse ; elle se déplace sans bruit et se poste toujours là où la lumière ne va pas.</p>
<p>Cheveux roux en tresse. Visage anguleux marqué de <strong>cicatrices fines</strong>. Yeux verts, extrêmement mobiles.</p>
<p><strong>Voix :</strong> basse et brève, entraînée à ne pas porter au-delà de trois pas — réflexe d'éclaireuse qu'elle garde en salle de rapport. Débit rapide et dense, en informations compactées : direction, nombre, délai. Communique le plus souvent par gestes, et ne parle que si le geste ne suffit pas.</p>
<p><strong>Rôle :</strong> sergent — « Maîtresse des Éclaireurs » de <strong>La Main du Silence</strong>.</p>
<p><strong>Capacités notables :</strong> FP 5 · PV 68. Épée courte et arc court +7 ; attaque sournoise +3d6 ; camouflage naturel.</p>
`.trim(),
  },
  {
    nom: 'Maela Varek',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 54 ans, épouse d'<strong>Odran</strong>. Grande et droite, d'une <strong>grande beauté malgré l'âge</strong> ; elle traverse le hameau sans presser le pas.</p>
<p>Cheveux gris argent relevés en chignon. Visage aux traits fins conservés, peau claire finement ridée. <strong>Yeux verts perçants</strong>, qui ne lâchent pas un interlocuteur.</p>
<p><strong>Voix :</strong> posée et un peu basse, d'une douceur qui n'a rien de tendre. Débit lent, avec l'habitude de laisser un silence après une réponse qui l'a mécontentée — et c'est là que les gens se reprennent tout seuls. Elle <strong>repère immédiatement les mensonges</strong>, et le signale d'un seul mot : « Encore ? »</p>
<p><strong>Rôle :</strong> épouse d'Odran Varek, au <strong>Hameau de Valbrume</strong>.</p>
`.trim(),
  },
  {
    nom: 'Maeltor Elvaltis',
    desc: `
<p>Homme, 23 ans, fils aîné d'<strong>Aedran</strong>. Mince mais musclé, souple ; il s'assoit de travers et joue les nonchalants, mais ses mains sont couvertes d'éraflures de spéléologue.</p>
<p>Visage anguleux, teint hâlé. Cheveux noirs coupés court, une mèche rebelle. <strong>Regard vif</strong>, yeux noirs qui détaillent tout en ayant l'air de ne rien regarder.</p>
<p><strong>Voix :</strong> assurée et traînante, jouée sur un registre d'ennui poli qui ne le quitte jamais en public. Débit paresseux, ponctué de demi-sourires ; il répond à côté par principe. Le masque tombe quand on parle des <strong>ruines souterraines</strong> : la voix accélère et monte, et l'ambition affleure.</p>
<p><strong>Rôle :</strong> fils aîné d'Aedran Elvaltis, à <strong>Kalanos</strong>. Désinvolture cachant une ambition féroce. S'aventure dans les ruines souterraines.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Moite le juste',
    desc: `
<p>Homme humain, 61 ans. De taille moyenne, sec, la mise sobre pour un souverain ; il porte les mêmes robes simples au conseil qu'en audience publique.</p>
<p>Visage tanné et anguleux, barbe blanche taillée court. Cheveux gris sous un turban sans ornement. Yeux noirs très calmes, qui soutiennent sans défier. Mains sèches et croisées.</p>
<p><strong>Voix :</strong> posée et grave, avec les intonations chantantes du Sandarane. Débit très lent, avec de longs silences avant chaque sentence — on dit qu'il compte jusqu'à sept avant de juger. Ne rend jamais un arrêt sans avoir répété à voix haute les arguments des deux parties.</p>
<p><strong>Rôle :</strong> règne depuis <strong>Sandarane</strong>, la capitale. Siège au <strong>Cœur Vert</strong> du Sultanat.</p>
`.trim(),
  },
  {
    nom: 'Norima Kinemor',
    desc: `
<p>Femme, 52 ans, membre de la famille royale <strong>Kinemor</strong>. Grande et sèche, port rigide ; elle reste debout par principe pendant les audiences.</p>
<p>Visage long et anguleux, teint très pâle. Cheveux blond cendré striés de blanc, tirés en arrière sans une mèche libre. Yeux bleu pâle, glacés. Bouche mince, rarement détendue.</p>
<p><strong>Voix :</strong> sèche et coupante, l'accent pointu momoritanien porté comme une arme. Débit bref et impérieux, sans formule de politesse superflue ; elle interpelle les gens par leur fonction, jamais par leur nom. Ne pose pas de question : elle formule une attente.</p>
<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Nyssara Elvaltis',
    desc: `
<p>Femme, 42 ans. Élégante et mesurée, silhouette souple ; elle touche volontiers le bras de ses interlocuteurs, et ceux-ci s'en souviennent.</p>
<p><strong>Cheveux auburn</strong> relevés en couronne tressée. Visage régulier au teint clair, sourire chaleureux et constant. Yeux noisette attentifs, qui s'attardent un instant de trop. Médaillon de <strong>Ral Nagor</strong> au cou.</p>
<p><strong>Voix :</strong> chaude et enveloppante, avec la cadence apaisante des officiants. Débit lent et bienveillant, riche en formules de sollicitude derrière lesquelles se glissent des questions très précises. Termine ses phrases par « n'est-ce pas ? », qui obtient presque toujours un acquiescement dont on ne mesure pas la portée.</p>
<p><strong>Rôle :</strong> gère les affaires sociales et religieuses de <strong>Kalanos</strong>. Dévouée à <strong>Ral Nagor</strong>. Manipulatrice habile dans les cercles influents.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Odran Varek',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 58 ans, patriarche et chef du hameau. Dos légèrement voûté, mains cicatrisées. Tunique de laine brune, manteau de voyage, médaillon de <strong>Tal Alion</strong>.</p>
<p>Visage buriné, barbe grisonnante. Rides profondes au coin des yeux, de celles qu'on prend à scruter l'horizon et les gens.</p>
<p><strong>Voix :</strong> grave et un peu usée, sans autorité affichée — il ne hausse jamais le ton, et le hameau l'écoute quand même. Débit très lent, avec de longues pauses pendant lesquelles il réfléchit vraiment ; il laisse chacun aller au bout avant de répondre. Rend ses jugements en commençant toujours par « Voilà ce que j'ai compris », puis résume les deux versions avant de trancher.</p>
<p><strong>Rôle :</strong> patriarche et chef du <strong>Hameau de Valbrume</strong>. Pragmatique, protecteur, patient ; juge local des conflits mineurs.</p>
`.trim(),
  },
  {
    nom: 'Qualen Pilwicken',
    desc: `
<p>Homme gnome, 118 ans. Petit et sec, la posture cassante ; il se fait porter sur un siège surélevé pour siéger au Magisterium et n'en descend jamais devant témoin.</p>
<p>Visage dur et anguleux, rare chez un gnome. Cheveux blancs coupés au bol. Sourcils épais. Yeux noirs durs et fixes. Robes de magister trop grandes, brodées de sigles d'invocation.</p>
<p><strong>Voix :</strong> haut perchée et tranchante, qui porte de façon déplaisante et qu'on n'interrompt pas. Débit sec et rapide, sans une politesse ; il énonce des décisions, pas des propositions. Prononce les formules d'invocation dans un registre plus grave — beaucoup plus grave que sa gorge ne devrait le permettre.</p>
<p><strong>Rôle :</strong> archimage et représentant de <strong>Russolio</strong> au <strong>Magisterium</strong>. École d'invocation. Gère une ville lourdement armée, avec commerce d'esclaves drakonides.</p>
`.trim(),
  },
  {
    nom: 'Quatre Nuits',
    desc: `
<p>Homme goliath au <strong>regard doux</strong>. Grand et posé, gestes précis malgré des mains calleuses. Collier de pierres de lune qui vibrent quand il chante les formules d'envoûtement.</p>
<p>Stries dorées sur les pommettes.</p>
<p><strong>Voix :</strong> grave et posée, d'une chaleur qui met immédiatement à l'aise — et c'est là tout le danger. Débit lent et mélodieux, presque chanté sur les fins de phrase ; on se surprend à approuver avant d'avoir réfléchi. Quand il incante, la voix se stabilise sur une note unique tenue, et les pierres de lune du collier vibrent avec elle.</p>
<p><strong>Rôle :</strong> maître enchanteur du <strong>Monastère des Nuits</strong>. École : <strong>Enchantement</strong>. Sculpte volontés et émotions.</p>
<p><strong>Capacités notables :</strong> FP 5 · PV 46. Sorts signatures : Charme-personne, Sommeil, Immobilisation de personne, Suggestion. « Résonance des âmes » : charme ou apeure une cible (JS Sagesse DD 15, 1/jour). Immunité aux charmes non magiques.</p>
`.trim(),
  },
  {
    nom: 'Rhendom Kinemor',
    desc: `
<p>Homme, 61 ans, membre de la famille royale <strong>Kinemor</strong> du Saint-Empire Momoritanien. Grand et voûté, décharné ; il s'appuie sur une canne dont il n'a pas encore vraiment besoin.</p>
<p>Visage creusé, pommettes hautes, teint cireux. Cheveux blancs fins, ramenés en arrière. Yeux bleu pâle délavés, mi-clos. Longues mains veinées.</p>
<p><strong>Voix :</strong> faible et éraillée, avec l'accent pointu momoritanien devenu chuintant avec l'âge ; il faut se pencher, et personne n'ose demander qu'il répète. Débit très lent, entrecoupé de reprises de souffle. Se souvient de tout, et le rappelle avec une précision qui met les jeunes générations mal à l'aise.</p>
<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong> du Saint-Empire Momoritanien.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Sept Nuits',
    desc: `
<p>Femme goliathe aux <strong>proportions changeantes</strong> — parfois plus haute, parfois plus compacte selon l'heure du jour. Porte des outils alchimiques à la ceinture.</p>
<p>Stries vertes comme de la mousse sur roche. Doigts longs, ongles de pierre polie.</p>
<p><strong>Voix :</strong> son timbre change avec le reste — grave et caverneuse le matin, claire et presque juvénile en fin de journée, sans qu'elle paraisse s'en apercevoir. Débit régulier et didactique, ponctué de comparaisons matérielles : elle explique une idée par ce qu'elle deviendrait si on la chauffait. Ne se présente jamais deux fois de la même manière.</p>
<p><strong>Rôle :</strong> maîtresse transmutatrice du <strong>Monastère des Nuits</strong>. École : <strong>Transmutation</strong>. Altère matière et forme.</p>
<p><strong>Capacités notables :</strong> FP 5 · PV 50. Sorts signatures : Métamorphose, Hâte, Pierre en chair, Vol. « Reforge le vivant » : transforme un objet de 1 m³ en une autre matière non vivante (1/jour). Peut marcher sur les surfaces instables comme sur de la pierre plate.</p>
`.trim(),
  },
];

async function main() {
  let faits = 0;
  for (const f of LOT) {
    const pnj = await prisma.personOfInterest.findFirst({ where: { name: f.nom }, select: { id: true, description: true } });
    if (!pnj) { console.log(`⚠ introuvable : ${f.nom}`); continue; }
    if ((pnj.description ?? '').includes('<strong>Voix :</strong>')) { console.log(`· ${f.nom.padEnd(30)} déjà complété`); continue; }
    await prisma.personOfInterest.update({ where: { id: pnj.id }, data: { description: f.desc, ...(f.sexe ? { sex: f.sexe } : {}) } });
    console.log(`✓ ${f.nom.padEnd(30)} complété${f.sexe ? ` (sexe: ${f.sexe})` : ''}`);
    faits++;
  }
  console.log(`\n${faits} fiche(s) complétée(s) sur ${LOT.length}.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
