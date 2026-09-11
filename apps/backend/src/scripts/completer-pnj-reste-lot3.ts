import { PrismaClient, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

/** Reste du monde, lot 3. Lore existant conservé intégralement ; physique et voix ajoutés. */
type Fiche = { nom: string; sexe?: Sex; desc: string };
const RACE_NC = '<p><em>Note MJ : sa race n\'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>';

const LOT: Fiche[] = [
  {
    nom: 'Old Ashka',
    desc: `
<p>Homme humain très âgé. Petit et tassé, assis presque en permanence près du <strong>Cercle des Braises</strong>, un bâton d'histoire encoché à chaque récit conté posé sur les genoux.</p>
<p>Visage buriné, creusé de rides profondes. <strong>Yeux d'un blanc laiteux</strong> depuis « une vision qui l'a brûlé ». Cheveux blancs rares, tressés de lanières.</p>
<p><strong>Voix :</strong> rauque et posée, usée par des décennies de fumée et de récits ; elle s'éraille sur les longues phrases et il boit entre deux contes. Débit très lent, cadencé sur les coups de son bâton d'histoire, avec des silences que l'auditoire a appris à ne pas combler. Quand il conte, la voix change complètement : elle s'affermit, prend un timbre de jeune homme, et redevient vieille à la dernière phrase.</p>
<p><strong>Répertoire de récits</strong> (contre un récit du visiteur, ou parfois gratuitement s'il apprécie l'interlocuteur) :</p>
<p><strong>Le Cavalier du Ciel</strong> — Vaskar Skoren dressa un pégase blessé tombé du ciel et devint l'éclaireur ailé de la tribu. Il tomba en défendant les steppes contre les légions de Zarak Solara, qui fit tanner la dépouille de sa monture en cape, trophée d'humiliation. <em>Révèle l'origine et l'importance de la cape conservée dans le tertre des Ombre.</em></p>
<p><strong>La Faille qui a Tenu</strong> — Kaddar Kharvek, premier « Porte-Faille », tint seul une brèche une nuit entière face aux morts-vivants de Zarak Solara pour couvrir l'évacuation des siens ; au matin, ni corps ni arme, seulement la faille refermée. <em>Explique le poids du titre que porte aujourd'hui Drogan Kharvek.</em></p>
<p><strong>Le Serment Rompu</strong> — un jeune guerrier promit à Ral Odius de ne jamais tirer sur un ennemi désarmé en échange d'un vent favorable ; le jour où il rompit son serment par orgueil, le vent dispersa son camp. <em>Conte moral sur la valeur d'une parole donnée aux Beor Khan.</em></p>
<p><strong>Les Huit qui Comptent leurs Nuits</strong> — il y a longtemps, huit moines encapuchonnés venus des montagnes du nord traversèrent les terres du clan sans un mot, sinon des chiffres en guise de noms. Le dernier, portant un froid qu'aucun feu ne réchauffait, s'arrêta longuement devant les tentes des morts avant de repartir. Depuis ce jour, dit-on, une des huit voies s'est brisée et un neuvième marche seul, sans titre, sans cercle pour l'accueillir. <em>(Ashka ignore tout lien avec un PJ éventuel — pur hasard troublant à exploiter si Neuf Nuits l'entend.)</em></p>
<p><strong>Le Chant de la Terre Vivante</strong> — mythe fondateur : Tal Odius rêva des montagnes, Ral Odius du ciel qui les frôle, et de leur rêve commun naquirent les plaines. Ral Alion y sema la vie sauvage, et Tal Brahnera jura de garder la paix entre eux tant que les Beor Khan chanteraient leur nom au Cercle des Braises. <em>Pure couleur spirituelle, sans enjeu mécanique.</em></p>
<p><strong>Autres articles</strong> (contre récit ou troc) : amulette d'os gravée « porte-voix des ancêtres » (cosmétique, avantage RP en négociation avec les Beor Khan) — 10 po ou un récit ; petite pierre runique (souvenir, sans effet mécanique) — 3 po ; rumeurs et informations sur la région (le tertre, la Main du Silence, Zarak Solara) — gratuit s'il apprécie l'interlocuteur.</p>
`.trim(),
  },
  {
    nom: 'Sheli Doxe',
    desc: `
<p>Homme, 52 ans. Corpulent et jovial, la poignée de main facile ; il traverse le port en saluant tout le monde par son prénom.</p>
<p>Visage rond et rougi par le vent marin, favoris épais. Cheveux châtains clairsemés. Yeux bleus rieurs, cernés de rides de sourire. Écharpe de fonction portée de travers.</p>
<p><strong>Voix :</strong> forte et cordiale, réglée pour les quais et les discours d'inauguration. Débit généreux et bavard, riche en anecdotes portuaires ; il promet volontiers, et se souvient rarement d'avoir promis. Baisse d'un ton et devient évasif dès qu'on parle des cargaisons qui n'apparaissent sur aucun registre.</p>
<p><strong>Rôle :</strong> maire de la ville portuaire de <strong>Karni</strong>, dans le <strong>Dominion de L'Antre</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Six Nuits',
    desc: `
<p>Homme goliath, cagneux. Mains toujours chaudes ; l'air tremble légèrement à ses côtés.</p>
<p>Stries rouges comme des coulées de lave sur la pierre grise de sa peau. Crâne partiellement rasé, cicatrices de brûlures anciennes.</p>
<p><strong>Voix :</strong> claquante et sèche, avec un grain de braise qui craque ; elle porte très loin et fait sursauter dans un couloir. Débit brusque, par salves courtes, avec des montées de volume imprévisibles. Quand il incante, chaque syllabe s'accompagne d'un souffle d'air chaud que l'on sent à trois pas.</p>
<p><strong>Rôle :</strong> maître évocateur du <strong>Monastère des Nuits</strong>. École : <strong>Évocation</strong>. Déchaîne feu, foudre et force brute.</p>
<p><strong>Capacités notables :</strong> FP 5 · PV 55. Sorts signatures : Boule de feu, Éclair, Mur de feu. « Frappe tellurique » : ligne de 18 m, 6d6 dégâts de force (JS Dextérité pour moitié, recharge 5-6). Résistance aux dégâts de feu et de foudre.</p>
`.trim(),
  },
  {
    nom: 'Skorri Elurra',
    sexe: 'MAN',
    desc: `
<p>Homme drakéide, 61 ans, de la maison <strong>Elurra</strong>. Massif et légèrement voûté, la carrure d'un guerrier que l'âge a tassé sans l'amoindrir.</p>
<p>Écailles gris-bleu ardoise, la livrée des Elurra, ternies et grêlées par les années. Cornes épaisses striées de fêlures anciennes, cerclées d'argent. Yeux verticaux d'un bleu glacier délavé.</p>
<p><strong>Voix :</strong> profonde et râpeuse, avec le sifflement drakéide accentué par l'âge. Débit lent et pesant, économe ; il ne parle qu'après que tout le monde a fini. Ponctue ses interventions d'un claquement de griffes sur l'accoudoir, tic que la cour de Brodnica a appris à redouter.</p>
<p><strong>Rôle :</strong> membre de la maison <strong>Elurra</strong>, à Brodnica.</p>
`.trim(),
  },
  {
    nom: 'Snakha',
    desc: `
<p>Homme, 48 ans. Grand et sec, d'une raideur de prédateur au repos ; il s'assoit très en arrière et laisse <strong>ForteGriffe</strong> occuper l'espace devant lui.</p>
<p>Visage anguleux et creusé, teint gris. Cheveux noirs plaqués en arrière, tempes rasées. Yeux noirs sans fond, très peu expressifs. Une longue cicatrice fine court de l'oreille droite à la clavicule.</p>
<p><strong>Voix :</strong> douce et basse, presque courtoise, d'une amabilité qui ne varie jamais — y compris pour ordonner une exécution. Débit lent, avec de longues pauses pendant lesquelles il vous regarde sans ciller. Ne répète jamais une proposition : il la fait une fois, puis parle d'autre chose.</p>
<p><strong>Rôle :</strong> représentant du <strong>Conseil d'Acier</strong> pour l'île de l'Antre et chef local du <strong>Syndicat</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Sylvae Irithiel — La Voix des Collines',
    desc: `
<p>Femme humaine, 63 ans, grande druide des <strong>Beor Khan</strong>. Grande et sèche, noueuse comme une racine ; elle marche pieds nus sur les steppes par tous les temps.</p>
<p>Visage tanné et anguleux, pommettes hautes. Cheveux gris-blond emmêlés de brindilles et de lanières de cuir. Yeux verts très clairs, presque translucides. Peau des mains craquelée, teintée de terre.</p>
<p><strong>Voix :</strong> ample et grave, avec une résonance étrange qui semble venir du sol autant que de sa gorge — d'où son titre. Débit lent et scandé, très proche du chant ; elle module la hauteur en fin de phrase comme on module un appel. Sous forme animale, elle conserve ce phrasé : le croassement du corbeau suit la même cadence à trois temps.</p>
<p><strong>Rôle :</strong> grande druide des <strong>Beor Khan</strong>.</p>
<p><strong>Capacités notables :</strong> PV 110 · CA 15. DD des sorts 17, attaque magique +9. Sorts : Guidance, Fouet d'épines, Druidcraft (à volonté) ; Croissance d'épines, Appel de la foudre, Croissance végétale (3/jour) ; Mur de pierre, Communion avec la nature (1/jour). Bâton des Collines : +6 (1d8+2 contondant + 1d8 nature). Voix de la Terre : terrain difficile pour les ennemis à 9 m. Souffle des Steppes : alliés à 9 m, +3 m de déplacement. Perception Tellurique : détecte vibrations et mouvements jusqu'à 18 m.</p>
`.trim(),
  },
  {
    nom: 'Symma Turen',
    desc: `
<p>Femme gnome, 134 ans. Menue et très droite, perchée sur un siège rehaussé au Magisterium ; elle croise les mains et ne bouge pratiquement pas de toute une séance.</p>
<p>Visage fin et lisse pour son âge, teint clair. Cheveux blancs coupés au carré, impeccables. Yeux mauves pâles, d'une attention totale. Bagues d'enchanteur à trois doigts.</p>
<p><strong>Voix :</strong> claire et mélodieuse, d'une douceur qui met immédiatement à l'aise — et c'est précisément son école. Débit lent et régulier, avec une cadence berçante sur les fins de phrase ; les débats qu'elle préside s'apaisent sans que personne sache pourquoi. Ne hausse jamais le ton : elle ralentit, et l'assemblée se cale sur elle.</p>
<p><strong>Rôle :</strong> archimage et représentante d'<strong>Iserna</strong> au <strong>Magisterium</strong> des Duchés des Dolomites. École d'enchantement.</p>
`.trim(),
  },
  {
    nom: 'Sélas Vharkorn',
    desc: `
<p>Homme (émissaire vampire), à la silhouette longue et pâle. Très mince, d'une immobilité parfaite entre deux gestes ; vêtements d'un autre siècle impeccablement tenus. Une odeur de terre froide l'accompagne.</p>
<p>Peau translucide veinée de gris ; yeux d'un rouge éteint ; traits fins et figés.</p>
<p><strong>Voix :</strong> <strong>douce et lente</strong>, d'une courtoisie surannée, avec des tournures de phrase tombées en désuétude depuis deux siècles. Débit très étale, sans respiration audible — il n'en a pas besoin, et cela finit par se remarquer. Ne hausse jamais le ton ; quand la négociation se dégrade, il se contente de cesser de parler.</p>
<p><strong>Rôle :</strong> émissaire de la cité vampire souterraine de <strong>Nharivum</strong>, creusée sous <strong>Mongar</strong>. Il achète des « têtes » vivantes pour la Faim et les galeries sans soleil — cheptel (réserve de sang) et main-d'œuvre. Diplomate glacial : il ne se bat pas, il marchande, et si l'affaire tourne mal il fuit pour prévenir les siens (une fuite réussie = la cité vampire se met sur ses gardes). C'est « la troisième personne » présente au point de transfert, escorté d'un <strong>Vampirien</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: "Taral de l'Est",
    desc: `
<p>Homme, 36 ans, guerrier de niveau 9. Grand et massif, la carrure d'un porteur d'armure ; il se place systématiquement entre les jumelles et la porte, sans qu'on le lui demande.</p>
<p>Visage large et impassible, teint mat, mâchoire carrée. Cheveux noirs coupés ras. Yeux noirs, attentifs. Un tatouage tribal de l'Est court sur la nuque, en partie caché par le col.</p>
<p><strong>Voix :</strong> grave et rare, avec un accent de l'Est marqué sur les voyelles. Débit bref et strictement utilitaire : il annonce, prévient, et se tait. Parle aux jumelles avec une douceur que personne d'autre ne lui connaît.</p>
<p><strong>Rôle :</strong> garde du corps personnel des jumelles <strong>Vanessa</strong> et <strong>Vanda Tomasio</strong> à Brodnica.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: "Tarek l'Échangeur",
    desc: `
<p>Homme humain d'âge moyen (~45 ans). Sec et vif, toujours debout à côté de son étal ; sacoche en bandoulière, il ne se sépare jamais de sa balance de troc.</p>
<p>Teint tanné par le vent, moustache tressée de perles d'os. Manteau rapiécé de mille tissus différents pris en échange au fil des routes. Yeux marron rapides, qui évaluent un visiteur avant qu'il ait posé sa charge.</p>
<p><strong>Voix :</strong> claire et chantante, rodée aux marchés de trois pays ; il change d'accent selon la provenance de son client, et en est très fier. Débit rapide et enjôleur, ponctué de proverbes de route dont il invente la moitié. Répète toujours l'offre de l'autre à voix haute avant de contre-proposer — pour lui laisser le temps d'entendre à quel point elle était basse.</p>
<p><strong>Inventaire</strong> (prix indicatifs en po — il préfère très largement l'échange en nature) : ration de voyage (7 jours) 3 po ; outre d'eau renforcée 2 po ; corde en crin tressé (15 m) 4 po ; carte des steppes du nord, annotée à la main, 15 po ; silex enchanté (allume un feu même sous la pluie, usage illimité) 25 po ; amulette porte-bonheur beor khan (cosmétique) 8 po ; fiole de teinture de guerre (peinture rituelle, cosmétique) 5 po ; petit couteau d'os gravé 6 po.</p>
`.trim(),
  },
  {
    nom: 'Taripica Kinemor',
    desc: `
<p>Femme, 41 ans, membre de la famille royale <strong>Kinemor</strong> du Saint-Empire Momoritanien. Petite et ronde, d'une vivacité qui tranche avec la raideur familiale.</p>
<p>Visage plein, teint clair, fossettes. Cheveux blond cendré bouclés, difficilement disciplinés malgré les épingles. Yeux bleu pâle, rieurs. Beaucoup de bijoux, portés sans logique.</p>
<p><strong>Voix :</strong> claire et volubile, avec l'accent pointu momoritanien qu'elle escamote quand elle s'emporte. Débit rapide et bavard, elle rit beaucoup et parle de tout le monde — c'est la seule Kinemor dont on apprenne quelque chose. Baisse d'un ton pour les confidences, ce qui lui arrive plusieurs fois par heure.</p>
<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong> du Saint-Empire Momoritanien.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Tenabis Kinemor',
    desc: `
<p>Homme, 35 ans, membre de la famille royale <strong>Kinemor</strong>. Grand et mince, le maintien d'un homme d'armes plus que d'un courtisan ; il porte l'épée de cour comme s'il s'en servait.</p>
<p>Visage anguleux, teint clair, cicatrice fine au menton. Cheveux blond cendré coupés court. Yeux bleu pâle, directs.</p>
<p><strong>Voix :</strong> nette et ferme, avec l'accent pointu momoritanien tempéré par des années de garnison. Débit bref et concret, il déteste les circonlocutions de cour et le montre. Coupe court aux compliments d'un « au fait » qui a fait sa réputation et lui a coûté deux alliances.</p>
<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Tharim Dastren',
    desc: `
<p>Homme robuste, 47 ans, aux <strong>mains calleuses</strong>. Large et solide, le pas lourd des hommes du sous-sol ; il s'assoit sur le bord des chaises, prêt à se relever.</p>
<p>Visage large, buriné, teint rouge. <strong>Barbe rousse</strong> fournie et mal égalisée. Cheveux roux grisonnants coupés court. Yeux gris-bleu francs, plissés par l'habitude de la lampe.</p>
<p><strong>Voix :</strong> forte et rocailleuse, calibrée pour les galeries ; il la garde telle quelle dans les salons, au grand dam des Elvaltis. Débit direct et sans détour, il dit ce qu'il pense de leur gestion à ceux qui la font. Marque un temps et se frotte la nuque avant de contredire — signal que tout Kalanos a appris à reconnaître.</p>
<p><strong>Rôle :</strong> expert du sous-sol de <strong>Kalanos</strong>, fidèle allié des <strong>Elvaltis</strong>, parfois en désaccord avec leur gestion.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Tonur Elurra',
    desc: `
<p>Homme drakéide, 58 ans, <strong>17<sup>e</sup> du nom</strong>. Haut et puissant, la stature d'un roi drakonien ; il se tient très droit, et le trône de Brodnica a été taillé pour cette posture.</p>
<p>Écailles gris-bleu ardoise virant au blanc sur la gorge — la livrée des Elurra. Cornes longues et épaisses, cerclées d'or à la base. Yeux verticaux d'un bleu glacier. Une écaille manquante au front, remplacée par une plaque d'or sertie.</p>
<p><strong>Voix :</strong> profonde et grondante, avec la résonance de poitrine des grands drakéides ; elle emplit la salle du trône sans qu'il élève le ton. Débit lent et solennel, chaque phrase construite comme une sentence. Depuis la capture d'<strong>Ornolf</strong>, il s'interrompt parfois au milieu d'une audience, reste silencieux plusieurs secondes, puis reprend exactement où il en était.</p>
<p><strong>Rôle :</strong> roi drakonien de <strong>Brodnica</strong>. Le trône se transmet de père en fils, chacun prenant le nom de Tonur. Fils de <strong>Teit Elurra</strong> et <strong>Drifa Mendia</strong> ; époux d'<strong>Erlea Gerlaria</strong> (décédée) ; père d'<strong>Ornolf</strong>, <strong>Aner</strong> et <strong>Asdis</strong>.</p>
`.trim(),
  },
  {
    nom: 'Triosz',
    desc: `
<p>Homme, 33 ans. Mince et long, d'une souplesse silencieuse ; il occupe les toits et les encoignures, et on ne le voit jamais entrer dans une pièce.</p>
<p>Visage étroit et blême, pommettes saillantes, joues creuses. Cheveux blond très pâle coupés court. Yeux gris presque incolores, qui ne clignent pas assez. Doigts longs, une callosité nette à l'index droit.</p>
<p><strong>Voix :</strong> basse et étonnamment neutre, sans accent et sans grain — celle de quelqu'un qui a pris l'habitude de ne pas être mémorisé. Débit minimal : il répond par un mot, souvent « oui ». Ne prononce jamais le nom d'une cible ; il désigne par un chiffre.</p>
<p><strong>Rôle :</strong> sniper et assassin attitré pour éliminer les problèmes du <strong>Conseil d'Acier</strong> à Brodnica.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Trois Nuits',
    desc: `
<p>Femme goliathe, élancée pour son peuple. Elle tient un bâton creux rempli de sable d'étoile qui s'écoule au rythme de ses visions.</p>
<p>Stries argentées en spirale autour des tempes ; yeux violets constamment mi-clos.</p>
<p><strong>Voix :</strong> ténue et légèrement décalée, comme si elle répondait à une question posée un instant plus tard — ce qui, chez une devineresse, n'est peut-être pas une figure de style. Débit lent, entrecoupé de pauses où le sable s'écoule seul. Emploie systématiquement le futur pour parler du présent.</p>
<p><strong>Rôle :</strong> maîtresse devineresse du <strong>Monastère des Nuits</strong>. École : <strong>Divination</strong>. Lit les fils du possible.</p>
<p><strong>Capacités notables :</strong> FP 4 · PV 44. Sorts signatures : Détection de la magie, Clairvoyance, Scrutation. « Éclat de futur » : impose un désavantage à une attaque qu'elle a entrevue (réaction, 3/jour). Vision passive des mensonges à 9 m.</p>
`.trim(),
  },
  {
    nom: 'Une Nuit',
    desc: `
<p>Femme goliathe, trapue. Robe de laine noire bordée de fil d'argent, gantelet de pierre gravé de glyphes protecteurs.</p>
<p>Stries d'ardoise bleutée sur les bras et les joues ; cheveux rasés en crête ; yeux laiteux sans pupille visible.</p>
<p><strong>Voix :</strong> grave et nette, avec une netteté d'articulation qui rappelle la formule plus que la conversation. Débit régulier et sans ornement, elle énonce ses conditions avant ses réponses. Quand elle contre un sort, le mot qu'elle prononce sonne une demi-seconde après que l'effet s'est produit.</p>
<p><strong>Rôle :</strong> maîtresse abjuratrice du <strong>Monastère des Nuits</strong>. École : <strong>Abjuration</strong>. Tisse et défait les barrières magiques.</p>
<p><strong>Capacités notables :</strong> FP 4 · PV 52. Sorts signatures : Bouclier, Contresort, Protection contre les armes, Globe d'invulnérabilité (1/jour). Réaction « Mur de runes » : annule un sort ciblant un allié à 9 m (recharge après un repos court).</p>
`.trim(),
  },
  {
    nom: 'Vampirien — escorte de Nharivum',
    desc: `
<p>Spawn de vampire (escorte de chasse de l'émissaire de <strong>Nharivum</strong>), à la silhouette décharnée. <strong>Se déplace par saccades trop rapides</strong>, et reste parfaitement immobile entre deux.</p>
<p>Visage émacié, crocs proéminents, ongles noircis en serres, peau grise tendue sur les os.</p>
<p><strong>Voix :</strong> à peine une voix — un souffle rauque et sifflant entre les crocs, sans articulation véritable. Il ne parle pas : il siffle pour avertir, gronde pour menacer, et se tait sur ordre de <strong>Sélas Vharkorn</strong>. Ceux qui l'ont entendu émettre un son proche d'un mot n'ont pas survécu pour le confirmer.</p>
<p><strong>Capacités notables :</strong> vampirien / spawn de vampire (FP 5). CA 15 · PV 82 · Vitesse 9 m, escalade d'araignée (surfaces et plafonds). Multiattaque : 2 attaques (griffes ou morsure). Griffes : +6, 2d4+3 tranchant ; au lieu des dégâts, agrippe (évasion DD 13). Morsure (cible agrippée, entravée ou consentante) : +6, 1d6+3 perforant + 3d6 nécrotique ; les PV max de la cible sont réduits d'autant, et le vampirien récupère ces PV. Régénération : 10 PV au début de son tour (sauf dégâts radiants ou eau courante au tour précédent). Résistances : nécrotique ; contondant, perforant et tranchant des armes non magiques. Faiblesses : lumière du soleil (dégâts + désavantage), dégâts radiants et eau courante bloquent la régénération ; un pieu dans le cœur d'un vampirien à terre le tue.</p>
`.trim(),
  },
  {
    nom: 'Vanda Tomasio',
    desc: `
<p>Femme, 21 ans, jumelle de <strong>Vanessa Tomasio</strong>, fille d'<strong>Esebio</strong> et <strong>Belina</strong>. Mince et élancée, exactement la même silhouette que sa sœur ; elle se tient toujours à sa gauche.</p>
<p>Visage long et fin, teint olivâtre, cheveux noirs bouclés portés relevés. Yeux marron foncé. Le seul signe qui la distingue de sa jumelle : un grain de beauté sous l'œil droit — et elle le couvre volontiers.</p>
<p><strong>Voix :</strong> douce et posée, plus grave que celle de sa sœur d'un demi-ton, différence que seul leur père entend à coup sûr. Débit lent et réfléchi ; elle laisse Vanessa lancer les conversations et intervient pour conclure. Les deux sœurs terminent régulièrement les phrases l'une de l'autre, et en jouent devant les étrangers.</p>
<p><strong>Rôle :</strong> fille d'Esebio et Belina Tomasio, à Brodnica. Gardée par <strong>Taral de l'Est</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Vanessa Tomasio',
    desc: `
<p>Femme, 21 ans, jumelle de <strong>Vanda Tomasio</strong>, fille d'<strong>Esebio</strong> et <strong>Belina</strong>. Mince et élancée, exactement la même silhouette que sa sœur ; elle se tient toujours à sa droite.</p>
<p>Visage long et fin, teint olivâtre, cheveux noirs bouclés portés relevés. Yeux marron foncé. Aucun grain de beauté sous l'œil droit — c'est ainsi qu'on les distingue, quand elles le permettent.</p>
<p><strong>Voix :</strong> claire et vive, un demi-ton au-dessus de celle de sa jumelle. Débit rapide et enjoué, c'est elle qui aborde et qui charme ; elle pose les questions que sa sœur écoute. Les deux terminent régulièrement les phrases l'une de l'autre, et en jouent devant les étrangers.</p>
<p><strong>Rôle :</strong> fille d'Esebio et Belina Tomasio, à Brodnica. Gardée par <strong>Taral de l'Est</strong>.</p>
${RACE_NC}
`.trim(),
  },
];

async function main() {
  let faits = 0;
  for (const f of LOT) {
    const pnj = await prisma.personOfInterest.findFirst({ where: { name: f.nom }, select: { id: true, description: true } });
    if (!pnj) { console.log(`⚠ introuvable : ${f.nom}`); continue; }
    if ((pnj.description ?? '').includes('<strong>Voix :</strong>')) { console.log(`· ${f.nom.padEnd(34)} déjà complété`); continue; }
    await prisma.personOfInterest.update({ where: { id: pnj.id }, data: { description: f.desc, ...(f.sexe ? { sex: f.sexe } : {}) } });
    console.log(`✓ ${f.nom.padEnd(34)} complété${f.sexe ? ` (sexe: ${f.sexe})` : ''}`);
    faits++;
  }
  console.log(`\n${faits} fiche(s) complétée(s) sur ${LOT.length}.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
