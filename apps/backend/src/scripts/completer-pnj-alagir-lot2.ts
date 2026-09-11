import { PrismaClient, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

/** Alagir, lot 2/6. Lore existant conservé mot pour mot ; physique et voix ajoutés. */
type Fiche = { nom: string; sexe?: Sex; desc: string };

const LOT: Fiche[] = [
  {
    nom: 'Brynn Fer-Vallée',
    desc: `
<p>Femme naine, 28 ans, sœur cadette de <strong>Darn Fer-Vallée</strong>. Trapue et robuste, les mains calleuses de quelqu'un qui travaille dur.</p>
<p>Un visage ouvert et expressif qui trahit chaque émotion avant même qu'elle parle. Cheveux brun foncé coupés court en désordre, yeux noisette grands et francs. Une cicatrice en demi-lune sous l'œil droit — elle dit que c'est un accident, ses anciens compagnons disaient autrement.</p>
<p><strong>Voix :</strong> claire et un peu trop forte, avec le rire facile de quelqu'un qui veut que ça se passe bien. Débit rapide et enthousiaste quand elle est en confiance, coupé net dès qu'on la met en cause — elle se tait alors complètement plutôt que de se défendre. Appelle tout le monde par un diminutif au bout de dix minutes.</p>
<p><strong>Rôle :</strong> Brynn est naïve de la belle sorte — elle croit facilement aux gens, voit le meilleur en eux bien plus longtemps qu'elle ne devrait, et déteste l'idée que quelqu'un puisse la manipuler délibérément. Cette confiance lui a valu de mauvaises fréquentations à répétition : des gens qui lui ont fait miroiter de l'amitié, de l'appartenance, un but, avant de se servir d'elle comme intermédiaire ou de faire peser les risques sur ses épaules.</p>
<p>C'est ainsi qu'elle s'est retrouvée mêlée au <strong>Fretin</strong>, un groupe de bandits et contrebandiers dont la planque est dans les égouts sous la Porte Basse d'Alagir. Elle croyait rejoindre des gens dans le besoin qui s'entraidaient ; elle sert surtout de passeur et de couverture sans en mesurer pleinement les conséquences.</p>
<p><strong>Secret (MJ) :</strong> Darn le sait, et ça l'inquiète plus qu'il ne le montre. Leurs relations sont tendues — il essaie de la prévenir, elle entend des reproches et se braque. Mais elle n'est pas perdue : quelqu'un de patient qui lui parle honnêtement pourrait l'atteindre.</p>
`.trim(),
  },
  {
    nom: 'Cryta',
    desc: `
<p>Demi-orc, ~40 ans. Corps trapu et musclé, mouvements lents et mesurés qui dissimulent une réactivité redoutable. Tenue de garde simple, hache à la ceinture.</p>
<p>Peau verte, crocs légèrement proéminents, yeux jaunes perçants, cheveux noirs striés de gris coupés ras sur les côtés. Une cicatrice en diagonale marque la joue gauche.</p>
<p><strong>Voix :</strong> basse et rauque, économe, avec de longs silences entre les phrases que personne n'ose combler. Débit très lent — chaque mot semble pesé avant d'être lâché. Ne salue pas ; incline la tête. Quand elle corrige un élève à l'entraînement, elle ne dit qu'un mot : le nom du défaut.</p>
<p><strong>Rôle :</strong> garde en entraînement avec <strong>Harl Denvar</strong> au Palazzo, pour la <strong>Famille Tovalis</strong>.</p>
`.trim(),
  },
  {
    nom: 'Derrik Holmar',
    sexe: 'MAN',
    desc: `
<p>Homme humain, la quarantaine, trapu. Bras épais, mains abîmées et calleuses ; une vieille entaille en biais sur l'avant-bras gauche, accident de taille.</p>
<p>Visage buriné par le soleil et la poussière de calcaire des carrières du Nord ; cheveux roux coupés très ras, barbe de quelques jours négligée ; yeux bleu-gris méfiants sous un front plissé.</p>
<p><strong>Voix :</strong> forte et râpeuse, la gorge irritée en permanence par la poussière de pierre ; il s'éclaircit la voix toutes les trois phrases. Débit lent et méfiant, avec une manie de répéter la question qu'on lui pose avant d'y répondre. Touche du bois avant d'annoncer un tonnage.</p>
<p><strong>Rôle :</strong> contremaître <strong>Tovalis</strong> des carrières du Nord. Loyal, superstitieux.</p>
`.trim(),
  },
  {
    nom: 'Edrik Luneclaire',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 44 ans. De taille moyenne et parfaitement quelconque de silhouette — une neutralité qui paraît entretenue. Manteau de voyage gris, sans insigne.</p>
<p>Visage fermé, aux traits réguliers et sans signe distinctif. Cheveux châtains coupés court, joues rasées de frais quelle que soit l'étape. Yeux noisette qui ne s'attardent jamais plus d'une seconde au même endroit.</p>
<p><strong>Voix :</strong> unie, sans timbre remarquable, et surtout très rare — il peut traverser une soirée entière sans dire dix mots. Débit lent quand il s'y résout, chaque phrase construite d'avance et prononcée une seule fois. Ses interlocuteurs se surprennent à retenir leur souffle pendant les silences.</p>
<p><strong>Rôle :</strong> messager et juge itinérant du <strong>Conseil d'Acier</strong>. Porte les ordres du Vrai Conseil d'une ville à l'autre. Parle rarement, mais ses mots ont force de loi.</p>
<p><strong>Secret (MJ) :</strong> rumeur — il serait en contact avec le « <strong>Commissaire Inconnu</strong> », figure du Conseil suprême.</p>
`.trim(),
  },
  {
    nom: 'Eldric Rigart',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 23 ans, jeune héritier ; grand et mince pour son âge. Allure toujours élégante — pourpoint de velours marine, cape courte sur l'épaule ; mains soignées, bague de famille à l'annulaire.</p>
<p>Traits fins et réguliers hérités d'une bonne lignée ; cheveux châtain clair coiffés avec soin vers l'arrière ; yeux gris-bleu vifs et avides.</p>
<p><strong>Voix :</strong> jeune et bien placée, celle d'un garçon à qui on a payé des leçons de diction. Débit rapide et enthousiaste dès qu'il parle commerce, il s'emballe et enchaîne les projets sans reprendre son souffle. Depuis sa captivité, elle se casse au milieu des phrases et il regarde la porte avant de répondre.</p>
<p><strong>Rôle :</strong> héritier <strong>Rigart</strong>, fils de <strong>Dorian Rigart</strong>. Discours au port sur l'alliance Cilovard (Partie 5). Vision d'un commerce fluvial ouvert.</p>
`.trim(),
  },
  {
    nom: 'Elerÿna Solanmir',
    sexe: 'WOMAN',
    desc: `
<p>Femme elfe sylvestre, 1,73 m. Élancée et droite, d'une légèreté de mouvement typiquement elfique.</p>
<p>Peau beige clair, cheveux roux. <strong>Yeux de dragon orange</strong>, trait de sa lignée draconique.</p>
<p><strong>Voix :</strong> claire et posée, avec une chaleur naturelle qui désarme ; elle monte d'un cran et se charge d'un grondement bas quand la colère la prend ou qu'elle lance un sort. Débit élégant, phrases construites, héritage des leçons d'<strong>Amiro Léovine</strong> — dont elle a gardé la manie d'appeler les gens par leur nom complet.</p>
<p><strong>Rôle :</strong> <strong>personnage joueur</strong> — lignée draconique Valdris. Quête du laboratoire d'<strong>Amiro Léovine</strong> (Partie 5).</p>
<p><em>Note MJ : doublon de la fiche PJ « Elerÿna », qui porte la feuille de personnage complète.</em></p>
`.trim(),
  },
  {
    nom: 'Ery Seel',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 39 ans. Petit et menu, épaules étroites, toujours penché sur un registre ; il se déplace le long des murs.</p>
<p>Visage étroit et pâle, cheveux bruns plaqués avec soin. Yeux noirs vifs derrière des lunettes sans monture. Doigts tachés d'encre jusqu'à la deuxième phalange, ongles coupés au carré.</p>
<p><strong>Voix :</strong> ténue et polie, à peine au-dessus du murmure — il faut souvent lui faire répéter, ce qu'il fait sans impatience. Débit précis et rapide sur les chiffres, hésitant dès qu'il s'agit d'une opinion. Termine ses phrases par « si je puis me permettre », même quand on ne lui demandait rien.</p>
<p><strong>Rôle :</strong> greffier en chef de la <strong>Ligature Bancaire d'Alagir</strong>, bras droit de <strong>Lierin Lorial</strong>. Méticuleux et discret, il tient les registres officiels du cartel bancaire.</p>
`.trim(),
  },
  {
    nom: 'Faith',
    desc: `
<p>Femme, la trentaine. Grande et sèche, d'une maigreur nerveuse ; elle occupe un fauteuil de travers, une jambe par-dessus l'accoudoir, et personne ne s'y trompe sur qui commande la pièce.</p>
<p>Visage anguleux, pommettes marquées, teint mat. Cheveux noirs coupés court et inégaux, comme faits au couteau. Yeux sombres, très fixes, avec un pli d'amusement permanent au coin. Plusieurs anneaux fins à l'oreille gauche, un par année de règne dit-on.</p>
<p><strong>Voix :</strong> grave pour une femme, traînante, avec une pointe d'ironie qui ne la quitte jamais — elle donne un ordre du même ton qu'une plaisanterie, et c'est à l'interlocuteur de deviner. Débit lent et nonchalant, ponctué de silences pendant lesquels elle vous regarde sans ciller. Ne dit jamais le nom de quelqu'un qu'elle s'apprête à faire disparaître.</p>
<p><strong>Rôle :</strong> meneuse de l'organisation criminelle du <strong>Syndicat d'Alagir</strong>, et liée à <strong>La Braise</strong>.</p>
<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste volontairement compatible avec plusieurs.</em></p>
`.trim(),
  },
  {
    nom: 'Folduin Xyrlana (mort)',
    sexe: 'MAN',
    desc: `
<p>Homme humain, la cinquantaine, au teint olivâtre. De corpulence moyenne, un peu tassé, le pourpoint or et noir toujours impeccablement boutonné jusqu'au col.</p>
<p>Mâchoire carrée, front dégarni qu'une calotte noire dissimulait avec peu de succès ; yeux bruns profonds enfoncés sous des sourcils broussailleux ; petite bouche habituellement pincée en une ligne prudente.</p>
<p><strong>Voix :</strong> nasillarde et prudente, toujours un demi-ton trop bas, comme s'il craignait d'être entendu d'à côté — ce qui était le cas. Débit haché, plein de conditionnels et de formules de réserve ; il ne terminait jamais une phrase engageante. Répétait « bien entendu, bien entendu » en cherchant une échappatoire.</p>
<p><strong>Rôle :</strong> clerc de <strong>Zitris</strong> et usurier, échoppe de la Porte Pourpre. Devait 300 po à <strong>Laguna</strong>. Liens <strong>Cilovard</strong> et <strong>Palhindile</strong>. <em>Décédé.</em></p>
`.trim(),
  },
  {
    nom: 'Garran Cilovard',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 58 ans, patriarche <strong>Cilovard</strong>. Silhouette imposante — large d'épaules, encore droit malgré l'âge. Vêtements toujours sombres et d'excellente coupe, canne à pommeau d'argent qu'il n'utilise pas pour marcher.</p>
<p>Visage taillé à la serpe, rides profondes aux commissures de la bouche et autour d'yeux gris clairs d'une fixité déconcertante. Cheveux gris acier coiffés en arrière avec une rigueur quasi militaire, sourcils épais encore sombres qui contrastent avec le reste. Une légère cicatrice verticale traverse son sourcil gauche.</p>
<p><strong>Voix :</strong> profonde et froide, parfaitement maîtrisée, sans la moindre inflexion superflue — il n'élève jamais le ton, y compris pour menacer. Débit lent et articulé, avec une pause avant les sommes et les noms de famille, comme pour en souligner le poids. Ne répond jamais immédiatement : il laisse toujours passer deux secondes.</p>
<p><strong>Rôle :</strong> directeur de la <strong>Couronne de Platine</strong>, ministre officieux des finances. Pragmatique, rigide, autoritaire.</p>
<p><strong>Secret (MJ) :</strong> il a signé un contrat de garantie magique — en réalité un lien d'obéissance latent vers le <strong>Roi-Tyrannœil</strong>.</p>
<p><strong>Capacités notables :</strong> CA 15 · PV 68 · Canne-épée +6. Persuasion +7, Tromperie +6, Intimidation +5. Sang-froid absolu (avantage contre peur et charme) ; Regard du créancier 1/jour (peur, DD 14).</p>
`.trim(),
  },
  {
    nom: 'Gesouto Mastiggia',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 61 ans, aristocrate dolomitcien. Corpulent et lent, le pas lourd ; il s'appuie sur les meubles en traversant une pièce.</p>
<p>Visage large et gras, teint olivâtre, bajoues naissantes. Cheveux noirs teints, ramenés en arrière et luisants. Yeux noirs, petits, presque enfouis. Bagues à trois doigts de chaque main.</p>
<p><strong>Voix :</strong> grasse et sonore, avec un fort accent dolomitcien qu'il n'a jamais cherché à perdre — il le cultive, c'est sa signature. Débit lent et gourmand, il savoure ses propres phrases et attend qu'on rie de ses traits d'esprit. S'essouffle au bout de trois phrases et reprend son souffle bruyamment.</p>
<p><strong>Rôle :</strong> domaine de la Porte Pourpre. Ligne « <strong>Chaînes du Sang</strong> », clan <strong>Izotzargi</strong> (Partie 5).</p>
`.trim(),
  },
  {
    nom: 'Grena Dov',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 52 ans, robuste. Large d'épaules et solidement plantée derrière son comptoir, avant-bras nus quelle que soit la saison.</p>
<p>Cheveux gris tressés en une natte unique ramenée sur l'épaule ; regard perçant, yeux marron qui évaluent un client avant qu'il ait ouvert la bouche. Visage large, mâchoire volontaire, quelques rides de rire qui démentent le reste.</p>
<p><strong>Voix :</strong> ample et rauque, qui couvre la salle sans effort et coupe court aux disputes. Débit sec, phrases courtes, aucune politesse inutile. Tutoie tout le monde d'emblée, et vouvoie exactement ceux qu'elle méprise.</p>
<p><strong>Rôle :</strong> patronne et tenancière du <strong>Poids Juste</strong>.</p>
`.trim(),
  },
  {
    nom: 'Guetel Vanguard',
    desc: `
<p>Femme humaine, la trentaine, belle et soignée avec l'application d'une ambassadrice. Silhouette élancée, maintien de cour irréprochable ; robes impeccables, bijoux choisis pour signifier sans éblouir.</p>
<p>Cheveux châtain doré toujours relevés en couronne élaborée ; yeux gris-vert au regard impénétrable derrière un sourire diplomatique parfaitement maîtrisé ; traits délicats, teint pâle légèrement fardé.</p>
<p><strong>Voix :</strong> mélodieuse et posée, d'une amabilité si constante qu'elle en devient illisible — rien dans le timbre ne distingue un compliment d'un refus. Débit fluide, jamais pris en défaut, avec le léger allongement des fins de phrase qu'on apprend dans les cours étrangères. Change imperceptiblement d'accent selon l'ambassadeur qu'elle reçoit.</p>
<p><strong>Rôle :</strong> épouse du roi <strong>Pelfort Vanguard</strong>, reine d'Alagir. Complice de Pelfort ; ambassadrice auprès des Duchés des Dolomites.</p>
<p><strong>Secret (MJ) :</strong> canal de messagerie chiffrée avec <strong>Huriya</strong> ; rumeur d'un ancien lien avec le <strong>Syndicat</strong>.</p>
`.trim(),
  },
  {
    nom: 'Gundath',
    desc: `
<p>Homme goliath, 37 ans. Immense et large, deux mètres et des poussières, la cage thoracique d'un homme qui vit de son souffle. Se tient toujours un peu voûté sous les plafonds d'Alagir, faits pour d'autres.</p>
<p>Peau gris-bleu marbrée des motifs claniques goliaths, crâne chauve et tatoué de lignes verticales qui descendent sur la nuque. Yeux clairs, presque blancs. Mâchoire large, dents très régulières.</p>
<p><strong>Voix :</strong> son instrument et sa raison d'être. Basse profonde, d'une puissance qui fait vibrer les verres sur les tables — et surtout, il pratique le <strong>chant polyphonique</strong> : il tient deux notes à la fois, un bourdon grave dans la gorge et une mélodie sifflée au-dessus, si bien qu'on cherche du regard le second chanteur. En parlant, le débit est lent et grave, presque solennel ; il fait des phrases courtes, et laisse toujours résonner la dernière syllabe.</p>
<p><strong>Rôle :</strong> barde goliath spécialisé dans le chant polyphonique.</p>
`.trim(),
  },
  {
    nom: 'Harl Denvar',
    desc: `
<p>Homme demi-orc, 42 ans. Musculature saillante, visible sur les avant-bras et par l'entrebâillement de sa chemise, zébrée par des années de bataille. Chemise bouffante blanche, pantalon marron.</p>
<p>Peau verte, visage carré avec deux crocs proéminents, entourés d'une petite moustache et d'un bouc finement taillés. Yeux jaune perçant. Dégradé militaire s'achevant par des cheveux plus longs sur le dessus, plaqués en arrière, noirs striés de gris. Porte les marques d'un duel dans les carrières.</p>
<p><strong>Voix :</strong> grave et posée, avec le calme d'un vétéran qui n'a plus rien à prouver ; elle ne monte que sur le terrain d'entraînement, et alors elle claque. Débit mesuré, il écoute plus qu'il ne parle et laisse volontiers un silence s'installer pour voir ce que l'autre y mettra — réflexe d'espion autant que de garde du corps.</p>
<p><strong>Rôle :</strong> confident et garde du corps de <strong>Daren Tovalis</strong>. Vétéran du <strong>Soleil Pourpre</strong> à la retraite.</p>
<p><strong>Secret (MJ) :</strong> il espionne discrètement les réunions du Soleil Pourpre pour Daren. A entendu des officiers employer « <strong>Rayon</strong> » comme salut codé, et compile un dossier secret intitulé « <em>Les Yeux dans la pierre</em> ». Partie 5 : test de garde de l'écaille ; quête d'infiltration de la soirée Regalio/Marcheto ; récompense de La Loutre SAOUL.</p>
`.trim(),
  },
  {
    nom: 'Hilden Drosh',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 47 ans. Petit et rond, les épaules perpétuellement remontées ; il sursaute quand la porte de la boutique s'ouvre.</p>
<p>Crâne luisant et dégarni, quelques mèches ramenées en travers. Visage rouge et moite, bajoues tremblotantes. Yeux marron inquiets qui vont sans arrêt de l'interlocuteur à l'entrée. Une plume derrière l'oreille, toujours la même, et de l'encre sur la tempe à force de la remettre.</p>
<p><strong>Voix :</strong> haut perchée et pressée, qui déraille dans l'aigu dès qu'il s'énerve. Débit en cascade, il pose trois questions avant d'écouter la réponse à la première. Répète « c'est cela, c'est cela » en se frottant les mains.</p>
<p><strong>Rôle :</strong> patron du <strong>Calepin Ébréché</strong>. Cherche qui a écrit un document qui n'existe pas.</p>
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
