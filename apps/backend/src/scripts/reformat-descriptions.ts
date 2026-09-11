import { PrismaClient, Breed } from '@prisma/client';
const prisma = new PrismaClient();

type Upd = { id: string; name: string; description: string; breed?: Breed };

const UPDATES: Upd[] = [
  {
    id: '4168e798-427a-474b-bb0c-cd5b07258f43',
    name: "Adeptus de l'Effacement",
    description:
      "Humain d'apparence quelconque, au visage volontairement oubliable — on ne se souvient jamais de ses traits (c'est le principe même de sa formation).\n\nSoldat mental mineur formé par Mirdobas Filan.\nFrappe psychique : +6, portée 18 m, 3d6 psychique.\nSorts : Charme-personne, Dissonant Whispers, Suggestion, Modify Memory.\nCapacités : Visage oubliable, Discipline mentale.",
  },
  {
    id: '7decf0c5-b84f-4a4b-b666-c9d820a104dc',
    name: 'Aegeard Blanks',
    description:
      "Homme humain, costaud (environ 1,70 m). Visage rond marqué par les excès ; cheveux blonds courts et bouclés, très courte barbe en van dyke soigneusement entretenue ; yeux dorés vifs et méfiants qui observent sans cesse la salle ; peau blanche et rugueuse. Tunique ample bleu foncé, pantalon marron pratique et taché.\nManie : parle peu, sert vite et n'oublie jamais un visage — on dit qu'il sait qui appartient au Syndicat… et qui n'y survivra pas longtemps.\n\nLogisticien du Syndicat.\nTraits — Solide comme le Comptoir : résistance aux dégâts contondants ; Coup de Pression : une créature touchée a désavantage à sa prochaine attaque.\nActions — Gourdin de taverne : +6, 1d8+3 ; Projection : test de FOR opposé → à terre.",
  },
  {
    id: '8bea76f4-b502-41cc-91f4-69c86a4e4965',
    name: 'Arienna Zandris',
    description:
      "Femme, petite et énergique. Cheveux noirs relevés en chignon.\n\nFigure influente du commerce local, spécialisée dans les ornements en pierre précieuse.",
  },
  {
    id: '5f7057a8-b5e3-4947-b846-16f62dd43d39',
    name: 'Bord Amac',
    description:
      "Homme humain, la quarantaine, au ventre généreux qui témoigne d'une vie de bonne chère et de tavernes. Teint rubicond des grands buveurs ; cheveux noirs clairsemés en désordre ; moustache épaisse sous un nez cassé ; yeux marron toujours un peu rieurs. Mains calleuses, souvent une tache de goudron sur la paume ou le poignet ; veste de marinier élimée.\n\nContremaître transport fluvial. Bon vivant, corrompu par le Syndicat.",
  },
  {
    id: '0b636012-fa99-47bc-9147-8b8db7a4f6e9',
    name: 'Capitaine Norven',
    description:
      "Homme humain, vieux marin, maigre. Barbe tressée ; habit impeccable malgré l'âge.\n\nCapitaine de navire.",
  },
  {
    id: 'b5122e37-4f00-4169-8d83-031c7d3981f5',
    name: 'Cinq Nuits',
    description:
      "Goliathe imposante. Peau striée de noir et blanc en damier — on jurerait que le motif change quand on détourne le regard. Cheveux longs tressés de rubans de soie sombre ; sourire rare et déroutant.\nManie : ses pas ne font presque aucun bruit.\n\nÉcole : Illusion.\nMaîtresse illusionniste : tisse mirages et mensonges sensoriels. Sorts signatures — Image silencieuse, Image majeure, Invisibilité, Mirage. « Manteau des mille reflets » : copie illusoire d'elle-même qui peut agir 1 round (recharge 5-6). Avantage aux JS pour dissiper ses illusions.",
  },
  {
    id: '036cc087-0782-4d13-8cf5-f489d0b0839f',
    name: 'Dame Arinthe',
    description:
      "Femme humaine, d'une beauté statuaire. Yeux trop fixes, qui mettent mal à l'aise. Robes de velours noir.\n\nMaîtresse des lieux.",
  },
  {
    id: '2495d2ec-400b-43e6-a7bb-f465fe08d81d',
    name: 'Darven Krest',
    description:
      "Homme, à la peau sombre et aux cheveux ras.\n\nEfficacité militaire et loyauté sans faille envers l'Empire ; maintient l'ordre dans les quartiers populaires.",
  },
  {
    id: 'e785fe6c-da97-416c-95a6-4102791b6640',
    name: 'Derrik Holmar',
    description:
      "Homme humain, la quarantaine, trapu. Visage buriné par le soleil et la poussière de calcaire des carrières du Nord ; cheveux roux coupés très ras, barbe de quelques jours négligée ; yeux bleu-gris méfiants sous un front plissé. Bras épais, mains abîmées et calleuses ; une vieille entaille en biais sur l'avant-bras gauche (accident de taille).\n\nContremaître Tovalis, carrières du Nord. Loyal, superstitieux.",
  },
  {
    id: '56b8619e-f374-44f2-9c1f-38066674cde1',
    name: 'Donna Ilaria Mastiggia',
    description:
      "Femme humaine, la cinquantaine, aristocrate dolomicienne à l'élégance glaçante. Cheveux noirs striés d'argent pris dans une résille de perles d'ambre ; voix douce, sourire commercial permanent. Robes de velours sombre, éventail d'os gravé.\n\nMatriarche du comptoir Mastiggia d'Alagir (Larmes d'Ambre) et visage respectable de la maison : elle gère la traite d'esclaves *légale* (autorisée à Alagir, dans les Dolomites et en Gandorenne), connaît chaque clause de la loi et ne se salit jamais les mains. Les « exportations spéciales » — la revente aux vampires — elle préfère les ignorer et les laisse à Vittore. Membre du clan Izotzargi, ligne « Chaînes du Sang ».",
  },
  {
    id: '9a7b6933-5dc5-4e0b-87a1-cf3ac490f268',
    name: 'Dorian Hale',
    description:
      "Homme humain, chauve, aux traits sévères. Yeux bleu pâle. Manteau noir d'inquisiteur.\n\nFrère Dorian Hale — agent inquisitorial. Sorts DD 14 : thaumaturgie, guidance ; zone de vérité, détection des pensées ; suggestion 1/j.",
  },
  {
    id: 'c885e82c-e64e-48e8-8136-5f76d4d4611b',
    name: 'Eldric Rigart',
    description:
      "Homme humain, jeune héritier ; grand et mince pour son âge. Traits fins et réguliers hérités d'une bonne lignée ; cheveux châtain clair coiffés avec soin vers l'arrière ; yeux gris-bleu vifs et avides. Allure toujours élégante — pourpoint de velours marine, cape courte sur l'épaule ; mains soignées, bague de famille à l'annulaire.\n\nHéritier Rigart. Discours au port sur l'alliance Cilovard (Partie 5). Fils de Dorian Rigart, vision d'un commerce fluvial ouvert.",
  },
  {
    id: '4c40a684-0bce-4fd8-b6bb-83b58709b421',
    name: 'Elivara Tanis',
    description:
      "Femme, grande et imposante. Cheveux argentés ; voix douce mais ferme.\n\nConscience spirituelle de Kalanos, médiatrice entre les factions.",
  },
  {
    id: '8c2eeaa5-9a2f-4d9f-8fa6-014fa6a70c0b',
    name: 'Folduin Xyrlana',
    description:
      "Homme humain, la cinquantaine, au teint olivâtre. Mâchoire carrée, front dégarni qu'une calotte noire dissimule avec peu de succès ; yeux bruns profonds enfoncés sous des sourcils broussailleux ; petite bouche habituellement pincée en une ligne prudente. Pourpoint or et noir toujours impeccablement boutonné jusqu'au col.\n\nClerc de Zitris et usurier. Échoppe Porte Pourpre. Doit 300 Po à Laguna. Liens Cilovard et Palhindile.",
  },
  {
    id: '3fd5bad4-7fd4-4c2e-9843-4b3e84867301',
    name: 'Grena Dov',
    description:
      "Femme humaine, robuste. Cheveux gris tressés ; regard perçant.\n\nPatronne (tenancière).",
  },
  {
    id: 'dc878db9-301f-4fbc-b3bb-63298432df54',
    name: 'Guetel Vanguard',
    breed: 'HUMAIN',
    description:
      "Femme humaine, la trentaine, belle et soignée avec l'application d'une ambassadrice. Cheveux châtain doré toujours relevés en couronne élaborée ; yeux gris-vert au regard impénétrable derrière un sourire diplomatique parfaitement maîtrisé ; traits délicats, teint pâle légèrement fardé. Robes de cour impeccables, bijoux choisis pour signifier sans éblouir.\n\nÉpouse du roi Pelfort Vanguard, reine d'Alagir. Complice de Pelfort ; ambassadrice auprès des Duchés des Dolomites. Secret : canal de messagerie chiffrée avec Huriya ; rumeur d'ancien lien avec le Syndicat.",
  },
  {
    id: '5e18a870-5f4f-4065-b766-2a6c6c0691e4',
    name: 'Hirvel Soran',
    description:
      "Homme, corpulent, aux manières sournoises. Robes luxueuses.\n\nPrincipal financier de Kalanos ; nombreuses connexions avec les marchands d'autres cités.",
  },
  {
    id: '3a3880bc-3274-4229-a6e5-08dc14789e11',
    name: 'Ikar Doven',
    description:
      "Homme humain. Sous son casque pourpre, le visage est marqué par les brûlures et le regard paraît étrangement vide.\nParticularité : fanatique mais survivant, prêt à tout pour conserver son statut.\n\nCenturion Pourpre. Né à la Cinquième Roue, ancien voleur repenti.",
  },
  {
    id: '41bd801c-d53a-4ec3-9aed-c4032372297a',
    name: 'Isha Ka',
    description:
      "Tieffeline, à la peau cendrée. Yeux dorés ; tatouages runiques sur la gorge ; bijoux d'os et anneaux serpentins. Voix douce, légèrement sifflante : « Chaque parfum a une intention, chaque poison une poésie. »\nParticularité : son faucon translucide Voriel est un fragment de son pouvoir vital — si Voriel meurt, elle s'effondre.",
  },
  {
    id: '71a8a898-169f-435b-bf0a-8c3933c60a8d',
    name: 'Jesa Tolvine',
    description:
      "Femme humaine, la cinquantaine, petite mais raide comme un piquet — elle impose par la seule intensité de son regard. Cheveux gris fer coupés court, sans fioritures ; yeux noirs tranchants ; une cicatrice en arc traverse son menton (éclat de roc reçu à vingt ans). Tenue de travail toujours propre, tablier de cuir épais, bottes solides.\n\nContremaître taille de bloc. Exigeante, respectée.",
  },
  {
    id: '6a5b7b66-69da-4d52-ae5c-429c06c4e922',
    name: 'Mada Lure',
    description:
      "Femme humaine, vieille et ridée. Une clé pendue au cou.\n\nEntremetteuse entre syndicalistes, prêtres de Tal Odius et espions.",
  },
  {
    id: '9c4db771-dbb1-4418-8c62-9d2e81e2290f',
    name: 'Mada Rusk',
    description:
      "Femme humaine, trapue. Cheveux blancs tressés ; voix de cor de chasse ; tatouages de routes sur la peau.\n\nPatronne (tenancière).",
  },
  {
    id: '2b1aab71-b65d-4ff1-b3cd-fbb968ed1411',
    name: 'Maître Ulric Brumel',
    description:
      "<p>Demi-orc d'une soixantaine d'années, maigre et légèrement voûté — le dos plié par vingt ans de registres. Peau pâle, grise de poussière de papier ; cheveux gris peignés avec une raie d'une rectitude militaire, favoris minutieusement taillés ; yeux châtains myopes et plissés, petites lunettes rondes à monture d'étain qu'il essuie sans cesse. Mains longues, doigts tachés d'encre jusqu'aux cuticules. Costume sombre en laine dolomicienne, gilet boutonné jusqu'au col, cachet de cire suspendu à une chaîne plate ; sent la cire d'abeille et le vieux cuir.</p><p>Secrétaire particulier et archiviste de la maison Rigart, bras droit d'Eldric Rigart pour la paperasse, les contrats fluviaux et la correspondance avec les Cilovard. N'a jamais mis les pieds sur un ponton sans escorte.</p><p>Personnalité — bureaucrate jusqu'au bout des doigts : poli, méthodique, prudent. Évite les quais, les disputes et tout ce qui ressemble à une aventure ; mesure chaque mot, connaît les numéros de liasse par cœur. Loyal envers Eldric, mais infiniment plus à l'aise avec un registre qu'avec une épée.</p>",
  },
  {
    id: 'ad6c6045-a171-4de7-9126-f8be53be760f',
    name: 'Naela Torfin',
    description:
      "Femme humaine, trente-cinq ans, compacte et nerveuse, aux gestes précis et économes hérités d'une vie à travailler les métaux délicats. Cheveux roux cuivré toujours attachés en tresse serrée (sécurité) ; visage fin semé de taches de rousseur, contrastant avec de petites brûlures presque imperceptibles sur les mains et les avant-bras ; yeux brun-roux vifs, pétillants d'intelligence pratique. Tablier de cuir épais aux initiales « FTB » gravées, chemise à manches retroussées, lorgnon de précision souvent relevé sur le front.\nManie : directe et fière, légèrement susceptible sur la taille de son atelier comparée aux fonderies royales (« indécente et hors de propos »).\n\nMaîtresse de La Frappe Brillante, troisième génération des Torfin à tenir l'atelier.",
  },
  {
    id: '148f0452-aa0f-42b1-83a4-23cb30cd0e18',
    name: 'Ordan Tovalis',
    description:
      "Homme humain, la quarantaine, à la carrure solide héritée des travailleurs de pierre mais avec la présence naturelle d'un orateur. Visage large à la mâchoire forte, nez légèrement aplati d'un vieux coup ; cheveux châtain foncé grisonnant aux tempes ; yeux marron foncé. Voix portante, gestes amples qui prennent naturellement l'espace.\n\nPorte-parole Tovalis. Protestation publique contre l'alliance Cilovard–Rigart sur l'estrade du port (Partie 5).",
  },
  {
    id: '60ee9017-2f5a-45c6-90ae-e7f253db2093',
    name: 'Pelfort Vanguard',
    breed: 'HUMAIN',
    description:
      "Homme humain, la quarantaine bien tassée, de taille moyenne, au corps entretenu et au maintien militaire hérité d'une formation de chevalier. Mâchoire forte ; regard brun froid et calculateur qui ne s'éclaire jamais vraiment ; cheveux noirs soigneusement coiffés, barbe courte entretenue avec une précision royale. Toujours vêtu de pourpre sombre et d'or, jamais sans sa couronne en public.\n\nMonarque de la Cité Pourpre depuis cinq ans (mort royale suspecte). Centralise le pouvoir, réforme les impôts, surveille tout via le Soleil Pourpre.",
  },
  {
    id: '54f82a8e-b086-4414-bd1f-489455a0ad8f',
    name: 'Priel Vanguard',
    description:
      "Humain, nourrisson. Joues rondes et roses ; yeux noisette déjà vifs et éveillés ; fines mèches de cheveux noirs qui commencent à boucler. Toujours emmitouflé dans des draps brodés aux armoiries Vanguard — pourpre et or.\n\nHéritier royal d'Alagir, fils de Pelfort et Guetel Vanguard. Innocent, mais peut servir de levier émotionnel dans les intrigues du trône.",
  },
  {
    id: '2f92433f-2dcb-4066-b792-27f69e99c84f',
    name: 'Serget Halvorn',
    description:
      "Nain de cinquante ans, court et massif, aux bras qui feraient rougir un mineur de profession. Barbe rousse tirant sur le gris, tressée en deux nattes maintenues par des anneaux de cuivre (tradition sur quatre générations de forgerons) ; visage large et rougeaud par les années passées près des fourneaux, une cicatrice horizontale sur la joue gauche (métal en fusion, il y a quinze ans) ; yeux vert bouteille toujours à moitié plissés, habitués à juger un alliage au premier coup d'œil. Uniforme de la Garnison modifié pour le travail — manteau court aux insignes de la Frappe, tablier de forge renforcé.\nManie : d'une honnêteté maladive, il déteste par-dessus tout les contrefacteurs et les comptes-rendus incomplets.\n\nMaître-Frappeur de la Fonderie de l'Écus d'Or, officier technique de la Garnison (Sergent-Major).",
  },
  {
    id: '62eb8859-aecc-4577-9674-feae24ddf538',
    name: 'Sesk Orlo',
    description:
      "Homme humain, la quarantaine, sec et nerveux. Cheveux gras noués en catogan ; cicatrices de couteau aux avant-bras ; sourire de fouine à qui il manque deux dents.\nManie : sent l'égout et l'eau-de-vie.\n\nChef du Fretin. Beau-parleur : il a « adopté » Brynn Fer-Vallée en lui offrant une fausse famille, pour mieux l'utiliser comme passeuse — puis l'a bouclée quand elle a compris la nature du fret. Vénal, il a vendu son âme (et Brynn) pour le contrat Mastiggia ; lâche dès qu'on le domine.\n\n=== Bandit capitaine (FP 2) ===\nCA 15 · PV 65 · Init +3\nMultiattaque : 2 cimeterres (+5, 1d6+3 tranchant) + 1 dague (+5, 1d4+3).\nParade : +2 CA en réaction contre une attaque de mêlée qu'il voit venir.",
  },
  {
    id: '558617f8-a75f-41f8-b9d9-0720d71e7754',
    name: 'Sir Gadwain Brise-fer',
    description:
      "Homme humain, vétéran d'âge mûr, à la large carrure de porteur d'armure lourde. Visage carré buriné par les campagnes, cheveux poivre et sel coupés court, courte barbe soignée ; port droit et solennel.\n\nGardien de l'Honneur — Capitaine de la Garde. Loyal bon. Bouclier vivant de ses alliés grâce à son trait Mur de Fer et sa capacité Indomptable.",
  },
  {
    id: '2fe07498-32d6-42d5-bddb-4ac24ef2d003',
    name: 'Sélas Vharkorn',
    description:
      "Homme (émissaire vampire), à la silhouette longue et pâle. Peau translucide veinée de gris ; yeux d'un rouge éteint ; vêtements d'un autre siècle impeccablement tenus. Voix douce et lente ; odeur de terre froide.\n\nÉmissaire de la cité vampire souterraine de Nharivum, creusée sous Mongar. Il achète des « têtes » vivantes pour la Faim et les galeries sans soleil — cheptel (réserve de sang) et main-d'œuvre. Diplomate glacial : il ne se bat pas, il marchande, et si l'affaire tourne mal il fuit pour prévenir les siens (une fuite réussie = la cité vampire se met sur ses gardes). C'est « la troisième personne » présente au point de transfert, escorté d'un Vampirien.",
  },
  {
    id: '35c5cd56-05ab-4d10-9489-bf09f3c1d9cc',
    name: 'Tarn Vess',
    description:
      "Homme humain, la cinquantaine, maigre, au front haut et largement dégarni. Lunettes à monture de cuivre perchées sur un nez aquilin ; yeux marron calmes et méthodiques derrière les verres ; doigts longs et secs, presque toujours tachés d'encre noire. Tenue grise, chemise boutonnée jusqu'au col, fonctionnelle à l'extrême.\n\nContremaître entrepôts. Pragmatique, tient les comptes officieux.",
  },
  {
    id: 'a53690fb-61a0-4d05-b05b-9eefc5b0f213',
    name: 'Tharim Dastren',
    description:
      "Homme robuste, aux mains calleuses. Barbe rousse.\n\nExpert du sous-sol, fidèle allié des Elvaltis, parfois en désaccord avec leur gestion.",
  },
  {
    id: 'c73f7e66-4bad-41b9-89ec-f16db2d8ee91',
    name: 'Trois Nuits',
    description:
      "Goliathe, élancée pour son peuple. Stries argentées en spirale autour des tempes ; yeux violets constamment mi-clos.\nParticularité : tient un bâton creux rempli de sable d'étoile qui s'écoule au rythme de ses visions.\n\nÉcole : Divination.\nMaître devin : lit les fils du possible. Sorts signatures — Détection de la magie, Clairvoyance, Scrutation. « Éclat de futur » : impose désavantage à une attaque qu'elle a entrevue (réaction, 3/j). Vision passive des mensonges à 9 m.",
  },
  {
    id: '2237610a-899b-4f8b-8c6c-0ad0b7f50fba',
    name: 'Une Nuit',
    description:
      "Goliathe, trapue. Stries d'ardoise bleutée sur les bras et les joues ; cheveux rasés en crête ; yeux laiteux sans pupille visible. Robe de laine noire bordée de fil d'argent, gantelet de pierre gravé de glyphes protecteurs.\n\nÉcole : Abjuration.\nMaître abjurateur : tisser et défaire les barrières magiques. Sorts signatures — Bouclier, Contresort, Protection contre les armes, Globe d'invulnérabilité (1/j). Réaction « Mur de runes » : annule un sort ciblant un allié à 9 m (recharge après repos court).",
  },
  {
    id: '5df0c961-2f3e-47be-86bd-105ca79c5f5f',
    name: 'Vampirien — escorte de Nharivum',
    description:
      "Spawn de vampire (escorte de chasse de l'émissaire de Nharivum), à la silhouette décharnée. Visage émacié, crocs proéminents, ongles noircis en serres, peau grise tendue sur les os.\nManie : se déplace par saccades trop rapides.\n\n=== Vampirien / spawn de vampire (FP 5) ===\nCA 15 · PV 82 · Vitesse 9 m, escalade d'araignée (surfaces et plafonds).\nMultiattaque : 2 attaques (griffes ou morsure).\nGriffes : +6, 2d4+3 tranchant ; au lieu des dégâts, agrippe (évasion DD 13).\nMorsure (cible agrippée, entravée ou consentante) : +6, 1d6+3 perforant + 3d6 nécrotique ; PV max de la cible réduits d'autant, le vampirien récupère ces PV.\nRégénération : 10 PV au début de son tour (sauf dégâts radiants ou eau courante au tour précédent).\nRésistances : nécrotique ; contondant/perforant/tranchant des armes non magiques.\nFaiblesses vampiriques : lumière du soleil (dégâts + désavantage), dégâts radiants et eau courante bloquent la régénération ; un pieu dans le cœur d'un vampirien à terre le tue.",
  },
  {
    id: '9ef5f994-4e2a-4f0f-b443-cac13adf50db',
    name: 'Vittore Mastiggia',
    description:
      "Homme humain, la trentaine, mince et tiré à quatre épingles. Cheveux noirs gominés, fine moustache ; sourire de marchand qui n'atteint jamais les yeux gris. Bague-sceau du clan Izotzargi à une chaîne, gants toujours immaculés.\n\nCadet ambitieux de la famille Mastiggia et cerveau de la combine : détourner discrètement des esclaves déjà « traités » par l'Œil Pourpre (la filière du Roi) pour les revendre à prix d'or à la cité vampire souterraine de Nharivum, sous Mongar. Se croit intouchable ; négocie toujours, ne se bat qu'acculé (rapière +4, 1d8+2). Secret dangereux : il vole la marchandise du Tyrannœil — s'il est exposé, le Roi l'écrasera avant les tribunaux. C'est lui, le représentant Mastiggia présent au point de transfert du Fretin.",
  },
  {
    id: '616401be-fdef-45c9-bf7d-81a7039544f5',
    name: 'Vraxx Aurodent',
    description:
      "Drakéide de soixante ans, à l'ascendance dorée évidente : écailles d'or pâle tirant sur le bronze, cornes courtes recourbées vers l'arrière. Stature impressionnante même pour un drakéide — plus d'un mètre quatre-vingt-dix, large d'épaules, une présence qui remplit une pièce. Yeux verticaux d'un ambre profond, au regard d'une acuité redoutable ; visage marqué par les années (écailles plus ternes autour des yeux, quelques-unes ébréchées). Vêtements de marchand de haute qualité, bordeaux et bronze, sans ostentation.\nManie : montre à gousset en or massif frappée à l'effigie familiale toujours en vue ; mémoire photographique des noms, chiffres et visages ; courtoisie absolue mais inflexibilité totale sur les prix et l'honneur commercial.\n\nPatriarche de la famille Aurodent et directeur général de La Monnaie du Dragon.",
  },
  {
    id: 'd45b4ef2-160c-4676-bdf4-cefd20ae05b3',
    name: 'Vyn Keller',
    description:
      "Homme humain, rond (environ 1,70 m), au visage nerveux et souvent crispé. Cheveux blancs très longs et ondulés, rasés sur le côté gauche, lui donnant une allure singulière ; yeux bleus toujours en mouvement, qui surveillent la salle avec inquiétude ; peau bronzée et rugueuse (années de travail ingrat). Tunique brune, pantalon gris.\nManie : se déplace rapidement entre les tables, évite les regards trop insistants et obéit au moindre signe d'Aegeard — il sait trop de choses et fait tout pour ne jamais trop en dire.\n\nHomme de main du Syndicat, subordonné d'Aegeard Blanks.",
  },
];

async function main() {
  let n = 0;
  for (const u of UPDATES) {
    await prisma.personOfInterest.update({
      where: { id: u.id },
      data: { description: u.description, ...(u.breed ? { breed: u.breed } : {}) },
    });
    n++;
    console.log(`  ✓ ${u.name}${u.breed ? ` (breed=${u.breed})` : ''}`);
  }
  console.log(`\n${n} descriptions reformatées.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
