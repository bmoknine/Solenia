import { PrismaClient, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

/** Huriya, lot 2. Lore existant conservé ; physique et voix ajoutés. */
type Fiche = { nom: string; sexe?: Sex; desc: string };
const RACE_NC = '<p><em>Note MJ : sa race n\'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>';

const LOT: Fiche[] = [
  {
    nom: 'Lyrath Sorvane',
    desc: `
<p>Homme elfe de l'aube, d'apparence centenaire — soit environ six cents ans réels. Il se déplace toujours lentement et délibérément. Sa robe officielle est blanche, avec des liserés dans les couleurs de chaque royaume signataire brodés sur les manches — un choix vestimentaire symbolique qu'il renouvelle lors de chaque nouveau traité. Autour du cou, le <strong>Médaillon des Ententes</strong> : une pièce en alliage de sept métaux différents, un par royaume fondateur.</p>
<p>Peau d'un brun clair doré, cheveux blanc-argenté portés libres jusqu'aux épaules. Visage d'un homme dans la force de l'âge selon les standards elfiques : sans ride, mais avec dans les yeux — d'un vert forêt profond — une lassitude bienveillante accumulée sur des siècles de diplomatie.</p>
<p><strong>Voix :</strong> douce et posée, conçue pour calmer — c'est un instrument de médiation avant d'être une voix. Débit très lent et parfaitement régulier, avec des silences qui obligent les parties à se calmer d'elles-mêmes. Il n'emploie jamais la première personne dans un arbitrage : il dit « le Palais constate », « il apparaît que ».</p>
<p><strong>Rôle :</strong> Grand Médiateur du <strong>Palais des Ententes</strong>, plus haute autorité neutre de Huriya. Il ne prend jamais parti, n'exprime jamais d'opinion personnelle en public, et est réputé n'avoir jamais menti — ce qui, à son âge et à son poste, est soit un miracle, soit la preuve qu'il a simplement appris à ne jamais dire ce qu'il pense vraiment.</p>
`.trim(),
  },
  {
    nom: 'Lysa “Cendre-rose”',
    desc: `
<p>Femme humaine, âge apparent 25 ans. Élancée, à la peau pâle constellée de petites cicatrices fines, vestiges d'une vie rude. Elle porte souvent des robes simples mais ouvertes, dans des tons rouges fanés, soigneusement entretenues malgré la misère ambiante.</p>
<p>Cheveux roux sombres tombant en vagues désordonnées sur les épaules. Yeux gris, perçants, qui donnent l'impression qu'elle voit bien plus que ce qu'elle laisse paraître.</p>
<p><strong>Voix :</strong> basse et un peu traînante, avec une ironie sèche qui affleure sur les fins de phrase. Débit lent et économe — elle <strong>parle peu mais écoute beaucoup</strong>, et laisse volontiers un silence s'installer pour voir ce que l'autre y versera. Répond souvent par une question qui n'en est pas une.</p>
<p><strong>Personnalité :</strong> calme, ironique, rarement surprise. Elle a développé un talent certain pour retenir les secrets de ses clients… et pour les monnayer intelligemment.</p>
<p><strong>Rôle :</strong> informatrice discrète pour les PJ, à <strong>La Salamandre Savoureuse</strong>. Peut connaître les allées et venues du <strong>Syndicat</strong>, cache parfois des objets pour certains clients, et peut demander protection en échange d'informations sensibles.</p>
`.trim(),
  },
  {
    nom: 'Maddox Vharn',
    desc: `
<p>Homme, 54 ans. Trapu et large de torse, les bras épais d'un homme qui a frappé le métal avant de diriger ceux qui le frappent.</p>
<p>Visage rond et rougeaud, sourcils épais, favoris gris. Cheveux gris fer coupés ras. Yeux bleus vifs, plissés. Une brûlure ancienne en étoile au creux du poignet droit.</p>
<p><strong>Voix :</strong> puissante et sonore, calibrée pour dominer le bruit des presses ; il ne la baisse jamais, même en ville. Débit direct et bref, il tranche vite et n'aime pas revenir sur une décision. Ponctue ses phrases d'un « point final » qui vaut congé.</p>
<p><strong>Rôle :</strong> dirige la fonderie privée <strong>La Frappe Brillante</strong> à Huriya, frappe de monnaie pour les deux empires. <strong>Doran Kell</strong> est son assistant.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Melrilvaethor Quifaren',
    desc: `
<p>Femme demi-elfe, 62 ans (elle en paraît trente). Grande et athlétique, d'une souplesse de bretteuse ; elle se tient toujours de trois quarts, jamais de face.</p>
<p>Visage anguleux, pommettes hautes, teint olivâtre. Cheveux noirs coupés à la nuque, une mèche blanche sur la tempe gauche. Yeux gris-vert extrêmement mobiles, qui recensent une salle en une seconde. Oreilles à peine pointues, l'une percée de trois anneaux.</p>
<p><strong>Voix :</strong> chaude et engageante, un outil de recrutement avant tout — elle sait donner à un inconnu l'impression d'être déjà attendu. Débit fluide et flatteur, avec un rire facile, qui se referme d'un coup en phrases sèches et brèves dès que la conversation devient professionnelle. Retient et réutilise systématiquement les mots exacts de son interlocuteur.</p>
<p><strong>Rôle :</strong> agent et recruteuse.</p>
<p><strong>Capacités notables :</strong> PV 52 · CA 14. Œil du Conseil : avantage aux jets d'Intuition et de Perception. Dette de Sang : une cible marquée a désavantage contre elle. Rapière : +6, 1d8+4. Dague cachée : +6, 1d4+4. Action bonus : Désengagement.</p>
`.trim(),
  },
  {
    nom: 'Mirell “la Silencieuse”',
    desc: `
<p>Femme humaine, âge apparent 30 ans. Grande et fine, à la peau dorée ; elle se déplace avec une lenteur mesurée. Vêtements sobres, presque modestes pour son métier.</p>
<p>Traits doux. Cheveux noirs toujours attachés en une tresse serrée qui tombe dans son dos. Yeux ambrés, qui évitent souvent les regards directs.</p>
<p><strong>Voix :</strong> feutrée et basse, d'où son surnom — elle <strong>parle peu</strong>, mais quand elle le fait, ses mots sont toujours choisis avec soin. Débit lent, presque sans accent tonique, avec une articulation nette qui rend chaque phrase étrangement définitive. Ne prononce jamais le nom du Syndicat à voix haute.</p>
<p><strong>Personnalité :</strong> discrète, posée, presque effacée. Elle semble observer sans juger, ce qui la rend étrangement rassurante pour certains clients.</p>
<p><strong>Rôle :</strong> à <strong>La Salamandre Savoureuse</strong>. Contrainte de travailler pour le <strong>Syndicat</strong>, elle sert parfois de messagère involontaire.</p>
<p><strong>Secret (MJ) :</strong> elle pourrait demander l'aide des PJ pour fuir. Elle connaît un passage discret reliant l'étage à l'arrière de la taverne.</p>
`.trim(),
  },
  {
    nom: 'Naela Torfin',
    desc: `
<p>Femme humaine, trente-cinq ans, compacte et nerveuse, aux gestes précis et économes hérités d'une vie à travailler les métaux délicats. Tablier de cuir épais aux initiales « FTB » gravées, chemise à manches retroussées, lorgnon de précision souvent relevé sur le front.</p>
<p>Cheveux roux cuivré toujours attachés en tresse serrée, par sécurité ; visage fin semé de taches de rousseur, contrastant avec de petites brûlures presque imperceptibles sur les mains et les avant-bras ; yeux brun-roux vifs, pétillants d'intelligence pratique.</p>
<p><strong>Voix :</strong> claire et rapide, avec un tranchant qui apparaît dès qu'on met en doute son travail. Débit précis et technique, elle emploie le vocabulaire exact des coins et des alliages sans se demander si on la suit. Monte d'un ton et accélère si l'on compare son atelier aux fonderies royales — elle juge la comparaison « indécente et hors de propos ».</p>
<p><strong>Rôle :</strong> maîtresse de <strong>La Frappe Brillante</strong>, troisième génération des Torfin à tenir l'atelier. Directe et fière.</p>
`.trim(),
  },
  {
    nom: 'Osver Krann',
    desc: `
<p>Homme humain, cinquante ans, mince et voûté, au teint presque gris de quelqu'un qui travaille à la lumière artificielle depuis vingt ans. Vêtements d'excellente qualité, toujours sombres — gris, noir, marine — impeccablement tenus. Il porte des gants de travail en peau ultra-fine même pour recevoir des clients : protection contre les résidus, dit-il.</p>
<p>Crâne dégarni sur le dessus, frangé d'une couronne de cheveux blancs coupés court. Visage anguleux, presque cadavérique si ce n'était la vivacité des yeux gris acier. Ses mains sont ses attributs les plus remarquables : longues, fines, d'une précision de chirurgien, couvertes de légères taches chimiques indélébiles.</p>
<p><strong>Voix :</strong> sèche et feutrée, parfaitement neutre, sans la moindre curiosité audible — c'est son argument commercial autant que sa manière. Débit lent et net, phrases courtes, uniquement des faits, des délais et des prix. N'emploie jamais de nom propre en présence d'un tiers.</p>
<p><strong>Rôle :</strong> propriétaire du <strong>Creuset des Richesses</strong> et alchimiste-monnayeur de haut vol. Il ne pose jamais de questions sur l'origine des métaux qui lui sont confiés — c'est sa règle d'or. En contrepartie, ses honoraires sont parmi les plus élevés de Huriya, et il refuse tout client qui lui semble imprévisible ou susceptible de créer des problèmes.</p>
`.trim(),
  },
  {
    nom: 'Perla Sonne',
    desc: `
<p>Femme, 26 ans. Petite et menue, très droite, les mains toujours occupées par un dossier ou un plateau ; elle marche vite et sans bruit.</p>
<p>Visage rond et avenant, teint clair. Cheveux blonds coupés au carré, retenus par une barrette simple. Yeux bleus attentifs, qui vérifient deux fois. Une tache d'encre récurrente sur le majeur droit.</p>
<p><strong>Voix :</strong> claire et polie, d'une neutralité professionnelle bien tenue. Débit rapide et efficace, sans bavardage ; elle annonce, confirme, et se retire. Une particularité utile : elle répète mot pour mot les messages qu'on lui confie, y compris les intonations, ce qui en dit souvent plus que prévu.</p>
<p><strong>Rôle :</strong> assistante dans l'<strong>Alliance des Veines</strong> à Huriya.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Raskel “Langue-Cendre”',
    desc: `
<p>Homme humain, 41 ans. Mince et souple, d'une élégance de joueur ; il s'assoit toujours dos à un mur et près d'une seconde sortie.</p>
<p>Visage étroit et affable, teint pâle. Cheveux châtains ramenés en arrière, tempes dégarnies. Yeux verts très mobiles, un sourire toujours prêt. Doigts fins, tachés d'encre et de cendre — d'où le surnom.</p>
<p><strong>Voix :</strong> son arme principale. Chaude, persuasive, d'une souplesse remarquable : il change d'accent et de registre à volonté, et vous rend un mensonge plus confortable que la vérité. Débit fluide et enveloppant, avec un rire complice placé exactement où il faut. Quand il est acculé, la chaleur disparaît d'un coup et la voix devient plate et rapide.</p>
<p><strong>Rôle :</strong> chef de cellule du <strong>Syndicat</strong>, à <strong>La Salamandre Savoureuse</strong>.</p>
<p><strong>Capacités notables :</strong> PV 82 · CA 15. Sauvegardes DEX +7, CHA +6. Tromperie +7, Persuasion +7, Discrétion +7, Perception +4. Maître des Faux : avantage aux tests de contrefaçon, faux documents et sceaux. Ordre du Syndicat (recharge 5–6) : 2 alliés visibles peuvent se déplacer OU attaquer en réaction. Fuite Préparée : sous 30 PV, il peut Désengager et se déplacer sans provoquer d'attaque d'opportunité (1/jour). Multiattaque (rapière + dague). Rapière : +7, 1d8+5 perforant. Dague cachée : +7, 1d4+5. Sable aveuglant (1/jour) : cône de 4,5 m, CON DD 14 ou Aveuglé jusqu'à la fin du prochain tour.</p>
`.trim(),
  },
  {
    nom: 'Rhent « la Presse »',
    desc: `
<p>Homme humain, d'une trentaine d'années, de taille moyenne, avec une silhouette mince qui contraste avec la force de ses mains. Il ne porte jamais rien de distinctif : vêtements de travail neutres, sans bijou, sans insigne.</p>
<p>Visage ordinaire au point d'être mémorable pour ça — traits quelconques, teint neutre, cheveux brun terne coupés ras. C'est un homme que l'on oublie dans une foule. Ses yeux noisette sont néanmoins remarquables : ils analysent en permanence, calculent, mesurent. Ses doigts sont calleux et tachés d'une légère teinte grisâtre permanente — les résidus métalliques que même l'eau savonneuse n'efface jamais complètement.</p>
<p><strong>Voix :</strong> plate et volontairement inintéressante, sans accent identifiable — il a effacé sa voix comme le reste. Débit bref et détaché, saturé de <strong>codes et d'euphémismes</strong>, au point que même ses collègues ne savent pas son vrai nom. Ne prononce jamais un chiffre en clair : il donne un poids, et l'on convertit.</p>
<p><strong>Rôle :</strong> chef d'atelier de la <strong>fonderie clandestine du Conseil d'Acier</strong>. Son surnom vient de sa maîtrise des presses à coins, qu'il règle avec une précision d'horloger.</p>
`.trim(),
  },
  {
    nom: 'Sana Ivelis',
    desc: `
<p>Femme, 56 ans, épouse d'<strong>Aimon Ivelis</strong>. Grande et solide, port d'apparat ; elle se tient toujours une demi-longueur en avant de son mari dans les réceptions, et personne n'a jamais osé le lui faire remarquer.</p>
<p>Visage large et volontaire, mâchoire nette. Cheveux gris relevés en coiffure haute et complexe, tenue par des épingles d'or. Yeux bleus froids et évaluateurs — les seuls de la maison à ne pas être noisette.</p>
<p><strong>Voix :</strong> nette et portante, d'une autorité tranquille qui n'a pas besoin de monter. Débit posé, avec une habitude redoutable de laisser un silence après une question au lieu de la reformuler. Emploie « nous » pour parler de Huriya, jamais pour parler d'elle et d'Aimon.</p>
<p><strong>Rôle :</strong> épouse d'<strong>Aimon Ivelis</strong> ; co-dirige la cité libre de <strong>Huriya</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Ser Aric Lancelame',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 44 ans. Sec et large d'épaules, d'une musculature fonctionnelle entretenue par l'entraînement quotidien ; il se déplace toujours en garde basse, sans y penser.</p>
<p>Visage anguleux et hâlé, nez droit, mâchoire nette. Cheveux bruns coupés court, rasés sur les côtés. Yeux marron calmes et attentifs. Avant-bras marqués de fines cicatrices d'entraînement, jamais profondes.</p>
<p><strong>Voix :</strong> claire et ferme, portée sans crier, celle d'un instructeur qui doit se faire entendre d'une cour entière. Débit net et pédagogique, il décompose tout en trois temps et répète le troisième. Ne crie jamais sur un élève : il baisse la voix, et c'est bien pire.</p>
<p><strong>Rôle :</strong> Forgeron de la Justice — Maître d'Armes de la <strong>Garnison des écus d'or</strong>. Neutre bon.</p>
<p><strong>Capacités notables :</strong> PV 120 · CA 17. Octroie +1 CA à ses alliés proches et peut parer jusqu'à 1d10+4 dégâts par réaction.</p>
`.trim(),
  },
  {
    nom: 'Serget Halvorn',
    desc: `
<p>Homme nain, cinquante ans, court et massif, aux bras qui feraient rougir un mineur de profession. Uniforme de la Garnison modifié pour le travail — manteau court aux insignes de la Frappe, tablier de forge renforcé.</p>
<p>Barbe rousse tirant sur le gris, tressée en deux nattes maintenues par des anneaux de cuivre — tradition sur quatre générations de forgerons. Visage large et rougeaud par les années passées près des fourneaux, une cicatrice horizontale sur la joue gauche, métal en fusion, il y a quinze ans. Yeux vert bouteille toujours à moitié plissés, habitués à juger un alliage au premier coup d'œil.</p>
<p><strong>Voix :</strong> grondante et forte, avec le débit d'un homme qui n'a jamais appris à parler bas et n'en voit pas l'intérêt. Phrases courtes et catégoriques, aucune place pour le conditionnel. Devient carrément tonitruant sur deux sujets : les contrefacteurs et les comptes-rendus incomplets, qu'il déteste par-dessus tout.</p>
<p><strong>Rôle :</strong> Maître-Frappeur de la <strong>Fonderie de l'Écus d'Or</strong>, officier technique de la <strong>Garnison</strong> (Sergent-Major). D'une honnêteté maladive.</p>
`.trim(),
  },
  {
    nom: 'Sir Aldric de Valbourg',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 58 ans. Très grand et massif, la silhouette épaissie par trente ans d'armure lourde ; il occupe le centre d'une pièce sans avoir à s'y placer.</p>
<p>Visage large et buriné, nez cassé et remis. Cheveux gris fer coupés ras, barbe courte et drue. Yeux bleu acier, fixes. Une cicatrice épaisse part de la tempe droite et disparaît dans la barbe.</p>
<p><strong>Voix :</strong> énorme et grave, une voix de commandement qui traverse un champ de manœuvre — c'est sa <strong>Présence Autoritaire</strong> faite son. Débit martelé, syllabe par syllabe sur les ordres importants, sans jamais répéter. Le silence qu'il laisse après une question vaut réprimande.</p>
<p><strong>Rôle :</strong> Maître des Écus — Commandant Suprême de la <strong>Garnison des Écus d'Or</strong>. Loyal neutre. Vétéran de guerre, il commande la cohorte d'une main de fer.</p>
<p><strong>Capacités notables :</strong> PV 168 · CA 19.</p>
`.trim(),
  },
  {
    nom: 'Sir Gadwain Brise-fer',
    sexe: 'MAN',
    desc: `
<p>Homme humain, vétéran d'âge mûr, à la large carrure de porteur d'armure lourde. Port droit et solennel.</p>
<p>Visage carré buriné par les campagnes, cheveux poivre et sel coupés court, courte barbe soignée.</p>
<p><strong>Voix :</strong> grave et chaleureuse, avec une rondeur qui rassure — ses hommes disent qu'elle porte mieux qu'un bouclier. Débit posé et courtois, il vouvoie tout le monde, y compris les recrues. En combat, le registre change du tout au tout : trois mots, hurlés, et la ligne tient.</p>
<p><strong>Rôle :</strong> Gardien de l'Honneur — Capitaine de la Garde de la <strong>Garnison des écus d'or</strong>. Loyal bon. Bouclier vivant de ses alliés grâce à son trait <strong>Mur de Fer</strong> et sa capacité <strong>Indomptable</strong>.</p>
<p><strong>Capacités notables :</strong> PV 138 · CA 18.</p>
`.trim(),
  },
  {
    nom: 'Sorqa Drenval',
    desc: `
<p>Femme naine, d'une cinquantaine d'années, trapue et musclée, au port droit d'une femme habituée à porter une armure toute sa vie. Elle porte en permanence un tablier de cuir épais par-dessus une chemise à manches retroussées, des gants de travail glissés dans sa ceinture. Autour du cou, une plaque de métal gravée : l'insigne de son ancienne compagnie de mercenaires, les <strong>Marteaux d'Argent</strong>.</p>
<p>Teint cuivré, visage carré, pommettes hautes. Tresses noires striées de gris, serrées en deux nattes épaisses qui tombent sur les épaules. Avant-bras entièrement couverts de tatouages runiques bleu-noir — chaque rune représente un ennemi vaincu ou un serment honoré. Yeux brun-ambré perçants, rarement distraits.</p>
<p><strong>Voix :</strong> grave, posée, directe, sans une once d'emphase. Débit bref et définitif : elle <strong>ne brade rien et n'explique pas deux fois</strong>. Reconnaît instantanément un vrai combattant d'un touriste qui joue à l'aventurier — et le second s'entend répondre par un seul mot.</p>
<p><strong>Rôle :</strong> propriétaire de <strong>La Valkyrie Rayée</strong>.</p>
`.trim(),
  },
  {
    nom: 'Tobrin Mullimax',
    desc: `
<p>Homme halfelin, 51 ans. Petit et rond, la mise soignée d'un cadre qui tient à son rang ; gilet boutonné, montre à chaîne, chaussures cirées jusque sur les quais.</p>
<p>Visage rond et avenant, favoris châtains grisonnants. Cheveux bouclés coupés court. Yeux noisette vifs, avec le plissement permanent de quelqu'un qui calcule un tonnage. Doigts courts et soignés.</p>
<p><strong>Voix :</strong> claire et volubile, avec l'entrain commercial de la famille Mullimax. Débit rapide et enjôleur, riche en chiffres qu'il sort de mémoire et en anecdotes de trajet dont personne n'a besoin. Baisse la voix et se penche en avant pour les vraies affaires, réflexe si systématique qu'il le fait aussi pour commander à dîner.</p>
<p><strong>Rôle :</strong> cadre de la <strong>Compagnie des Voiliers d'Éther</strong> à Huriya, transport fluvial.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Vael Korshen',
    desc: `
<p>Homme, 37 ans. Taille moyenne, sec et souple, d'une discrétion physique travaillée ; il s'appuie aux murs plutôt qu'il ne s'y adosse, prêt à partir.</p>
<p>Visage maigre et fermé, mâchoire rasée de près. Cheveux noirs coupés court. Yeux gris froids, très peu expressifs. Une bague d'acier brut au pouce — la marque du <strong>Conseil</strong>, qu'il tourne machinalement.</p>
<p><strong>Voix :</strong> basse et unie, calibrée pour ne pas dépasser la table ; il parle en regardant ailleurs. Débit bref et sans chaleur, uniquement l'utile ; il ne salue pas et ne prend pas congé. Frappe trois fois du doigt sur le bois avant de conclure — le tic du Conseil d'Acier.</p>
<p><strong>Rôle :</strong> agent criminel du <strong>Conseil d'Acier</strong> opérant à Huriya, lié à la cellule locale.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Vaszar Molthein',
    desc: `
<p>Homme humain, d'une soixantaine d'années, grand et osseux, au dos légèrement voûté par des décennies passées à compter des colonnes de chiffres. Uniforme civil impérial — redingote gris ardoise aux boutons dorés, épaulettes sobres indiquant son rang — et un registre relié de cuir bordeaux en permanence à la main.</p>
<p>Visage long, joues creusées, teint jaunâtre d'un homme qui ne sort jamais beaucoup. Barbe grise taillée au millimètre et lunettes en demi-lune en permanence vissées sur le nez. Yeux d'un brun terne, qui évaluent immédiatement tout interlocuteur en termes de valeur et de menace.</p>
<p><strong>Voix :</strong> pointue et pincée, avec l'<strong>accent des hautes sphères momoritaniennes</strong> qu'il entretient soigneusement. Débit lent et d'une précision quasi chirurgicale dans le choix des mots ; il corrige les vôtres au passage. Ne sourit — et ne rit d'un petit rire bref — que lorsqu'il a obtenu ce qu'il voulait.</p>
<p><strong>Rôle :</strong> intendant impérial en charge de la <strong>Fonderie Royale Momoritanienne</strong> de Huriya.</p>
<p><strong>Secret (MJ) :</strong> imperméable à la corruption frontale, mais influençable par des arguments touchant à son avancement de carrière.</p>
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
