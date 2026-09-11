import { PrismaClient, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

/** Alagir, lot 4/6. Lore existant conservé mot pour mot ; physique et voix ajoutés. */
type Fiche = { nom: string; sexe?: Sex; desc: string };

const LOT: Fiche[] = [
  {
    nom: 'Mada Rusk',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 63 ans, trapue. Large et solidement plantée, avant-bras de rouleuse de tonneaux ; elle traverse sa salle en ligne droite et les clients s'écartent.</p>
<p>Cheveux blancs tressés en deux nattes épaisses. Visage carré, tanné, sillonné de rides horizontales. Yeux gris délavés. Des <strong>tatouages de routes</strong> courent sur la peau des bras et du cou — chaque trait une étape qu'elle a faite.</p>
<p><strong>Voix :</strong> une <strong>voix de cor de chasse</strong> — énorme, cuivrée, qui couvre la salle entière sans qu'elle force. Débit franc et direct, phrases courtes, aucun détour ; elle annonce l'addition du même ton qu'un départ de convoi. Rit d'un seul coup, très fort, puis s'arrête net.</p>
<p><strong>Rôle :</strong> patronne et tenancière de <strong>La Roue de Secours</strong>.</p>
`.trim(),
  },
  {
    nom: 'Madame Solinne',
    sexe: 'WOMAN',
    desc: `
<p>Femme demi-elfe, 68 ans (elle en paraît quarante). Silhouette ample et fluide sous les voiles blancs, démarche lente et nonchalante dans la vapeur des bains.</p>
<p>Traits adoucis par l'hérédité elfique, peau claire et lisse, cheveux blond cendré relevés en désordre étudié. <strong>Yeux verts hypnotiques</strong>, à la fixité un peu trop longue. Toujours drapée de voiles blancs, jamais tout à fait fermés.</p>
<p><strong>Voix :</strong> feutrée et chaude, à peine plus forte que le bruit de l'eau — on l'entend pourtant parfaitement, ce qui n'a jamais été expliqué. Débit très lent, chaque phrase étirée, avec des fins suspendues qui invitent à répondre. Ne dit jamais « vous » : elle dit « mon cœur », à tout le monde, du premier échange.</p>
<p><strong>Rôle :</strong> maîtresse des bains, aux <strong>Vapeurs d'Olena</strong>.</p>
`.trim(),
  },
  {
    nom: 'Maerin Tovalis',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 27 ans, héritière <strong>Tovalis</strong>. Grande et athlétique, le teint hâlé de quelqu'un qui passe ses journées sur les quais et les barges. Mains légèrement calleuses, une entaille récente cicatrisée à l'index. Tenue pratique mais bien coupée, toujours une carte de navigation pliée dans la poche.</p>
<p>Cheveux châtain foncé coupés aux épaules, souvent relevés en chignon pratique pour travailler. Yeux verts clairs, regard direct et sans détour.</p>
<p><strong>Voix :</strong> claire et projetée, une excellente oratrice qui sait se faire entendre d'un quai à l'autre sans crier. Débit vif et structuré — elle annonce combien de points elle va faire, puis les fait. Coupe court aux formules de politesse d'un « venons-en au fret » qui a fait sa réputation.</p>
<p><strong>Rôle :</strong> gère les contrats de transport fluvial sur l'<strong>Artère Azur</strong>. Dispose d'une flotte de 12 barges et 4 entrepôts sous douane. Ambitieuse et vive, elle cherche à moderniser et à ouvrir des partenariats avec <strong>Huriya</strong>.</p>
<p><strong>Secret (MJ) :</strong> elle ignore les secrets de son père, mais remarque les incohérences du <strong>Soleil Pourpre</strong>.</p>
`.trim(),
  },
  {
    nom: 'Marcheto Spazi',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 45 ans, sculpteur dolomitcien. Solide et large de mains, épaules inégales à force de frapper du même côté ; poussière de marbre incrustée jusque dans les plis du cou.</p>
<p>Visage carré, barbe noire courte et mal égalisée, cheveux bouclés poivre et sel attachés en catogan. Yeux noirs très mobiles, qui détaillent les visages comme s'il cherchait le bloc dedans. Ongles cassés, paumes blanches de poudre.</p>
<p><strong>Voix :</strong> sonore et généreuse, avec un accent dolomitcien chantant qu'il ne modère pas dans les salons. Débit passionné et coupé de gestes ; il se lève pour expliquer. Baisse d'un coup à un murmure pour parler prix, et sourit en le faisant.</p>
<p><strong>Rôle :</strong> présent à la soirée mondaine chez <strong>Regalio Regani</strong> — quête d'infiltration de <strong>Harl Denvar</strong> (Partie 5).</p>
`.trim(),
  },
  {
    nom: 'Marja la Cicatrice',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 44 ans. Râblée et puissante, la démarche chaloupée d'une ancienne combattante d'arène ; elle se tient toujours au bord du sable, jamais dessus.</p>
<p>Visage dur, pommettes hautes, cheveux noirs rasés sur les côtés. La <strong>cicatrice</strong> qui lui vaut son nom part de l'oreille gauche et traverse la joue jusqu'au coin de la bouche, tirant son sourire vers le haut en permanence. Yeux noirs, sourcils épais.</p>
<p><strong>Voix :</strong> puissante et éraillée, dressée à couvrir une foule qui hurle ; elle annonce les combats sans avoir besoin de crier. Débit rythmé, presque scandé, avec un goût du suspense sur le dernier mot. En privé, elle tombe à un filet de voix très calme — et c'est là qu'on a peur.</p>
<p><strong>Rôle :</strong> maîtresse de l'<strong>Arène du Goulet Écarlate</strong>, pour le <strong>Syndicat d'Alagir</strong>. Enregistre tous les gages d'honneur.</p>
<p><strong>Secret (MJ) :</strong> spectacle et chantage.</p>
<p><strong>Capacités notables :</strong> CA 15 · PV 40 · Couteau +6. Intimidation +7.</p>
`.trim(),
  },
  {
    nom: 'Mava Roen',
    sexe: 'WOMAN',
    desc: `
<p>Femme gnome, 112 ans. Menue et compacte, parfaitement immobile derrière son guichet ; on ne la voit jamais ni entrer ni sortir de la Place Sombre.</p>
<p>Visage rond et sans expression, teint clair. Cheveux gris-bleu coupés au carré, impeccablement réguliers. Yeux gris très pâles derrière des besicles rectangulaires. Manchettes noires pour protéger les poignets de l'encre.</p>
<p><strong>Voix :</strong> basse et neutre, volontairement inintéressante — elle a fait de la banalité un outil de discrétion. Débit régulier et bref, uniquement des faits et des numéros ; elle ne prononce jamais le nom d'un déposant à voix haute, même seule dans la salle. Termine chaque échange par « c'est noté », qui vaut acquittement.</p>
<p><strong>Rôle :</strong> directrice de place de la <strong>Caisse des Richesses Cachées</strong> (C.C.R.C.), Place Sombre. Prudente, secrète et très efficace dans la gestion des coffres individuels anonymisés.</p>
`.trim(),
  },
  {
    nom: 'Maître Alyenra Verth',
    desc: `
<p>Elfe, apparence d'une trentaine d'années pour un âge bien supérieur. Longiligne et très droit de maintien, les mains toujours visibles et posées à plat. Robe à motifs de vitraux, gants de soie runique jamais ôtés.</p>
<p>Teint pâle, presque translucide. Cheveux lilas lisses, séparés au milieu et tombant sous l'épaule. Yeux couleur opale, dont l'iris semble tourner lentement selon la lumière. Traits d'une régularité sans chaleur.</p>
<p><strong>Voix :</strong> lente, d'une diction parfaite, chaque syllabe détachée comme si elle était gravée. Débit posé et sans hésitation, avec une <strong>ironie feutrée</strong> qui ne se signale par aucun changement de ton — on ne comprend la pique qu'une phrase plus tard. « <em>Une rune mal tracée, c'est comme une promesse mal tenue : ça explose toujours au mauvais moment.</em> »</p>
<p><strong>Rôle :</strong> tient <strong>Les Runes de Verre</strong>. Garde le <strong>Fragment du Vitrail Brisé</strong> derrière un sort de miroir inversé.</p>
<p><em>Note MJ : son genre n'est pas établi en fiche — la description reste neutre.</em></p>
`.trim(),
  },
  {
    nom: 'Maître Elar Vain',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 52 ans. Grand et très mince, d'une maigreur élégante ; il porte l'habit noir de service avec une raideur de soliste.</p>
<p>Visage long et pâle, joues creuses, cheveux noirs plaqués en arrière et grisonnants aux tempes. Yeux sombres et cernés. Une marque rouge permanente sous la mâchoire gauche, à l'endroit du violon.</p>
<p><strong>Voix :</strong> parlée, elle est terne et quasi inexistante — il répond par un murmure et préfère s'exprimer par l'archet. Débit minimal : « Monsieur », « Madame », « Tout de suite ». En revanche il fredonne en permanence, très bas, la ligne mélodique de ce qu'il jouera ensuite ; les habitués savent au fredonnement quel morceau vient.</p>
<p><strong>Rôle :</strong> violoniste-serveur à <strong>La Verrière Fendue</strong>.</p>
`.trim(),
  },
  {
    nom: 'Maître Ulric Brumel',
    desc: `
<p>Homme demi-orc, la soixantaine, maigre et légèrement voûté — le dos plié par vingt ans de registres. Mains longues, doigts tachés d'encre jusqu'aux cuticules. Costume sombre en laine dolomicienne, gilet boutonné jusqu'au col, cachet de cire suspendu à une chaîne plate ; il sent la cire d'abeille et le vieux cuir.</p>
<p>Peau pâle, grise de poussière de papier ; cheveux gris peignés avec une raie d'une rectitude militaire, favoris minutieusement taillés ; yeux châtains myopes et plissés, petites lunettes rondes à monture d'étain qu'il essuie sans cesse.</p>
<p><strong>Voix :</strong> ténue et courtoise, un peu nasale, sans la moindre trace du grondement qu'on attend d'un demi-orc — et il en joue, car on le sous-estime. Débit lent et scrupuleux, il mesure chaque mot et se reprend pour préciser une date ou un numéro de liasse. S'excuse avant de contredire, puis contredit avec une exactitude implacable.</p>
<p><strong>Rôle :</strong> secrétaire particulier et archiviste de la maison <strong>Rigart</strong>, bras droit d'<strong>Eldric Rigart</strong> pour la paperasse, les contrats fluviaux et la correspondance avec les <strong>Cilovard</strong>. N'a jamais mis les pieds sur un ponton sans escorte.</p>
<p><strong>Personnalité :</strong> bureaucrate jusqu'au bout des doigts — poli, méthodique, prudent. Évite les quais, les disputes et tout ce qui ressemble à une aventure ; connaît les numéros de liasse par cœur. Loyal envers Eldric, mais infiniment plus à l'aise avec un registre qu'avec une épée.</p>
`.trim(),
  },
  {
    nom: 'Maître Verel',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 48 ans. De taille moyenne, très mince, d'une immobilité de statue derrière sa table ; seules ses mains bougent, et elles ne s'arrêtent jamais.</p>
<p>Le visage est dissimulé par un <strong>masque</strong> de laque noire couvrant le haut jusqu'à la lèvre supérieure. On ne voit que la bouche, mince et pâle, et le menton rasé. Cheveux châtains ramenés en catogan. Mains fines et très soignées, ongles polis.</p>
<p><strong>Voix :</strong> <strong>douce et dangereuse</strong> — un timbre bas, presque affectueux, qui ne change pas d'un souffle qu'il annonce un gain ou une ruine. Débit lent et régulier, cadencé sur le rythme des cartes qu'il distribue. Appelle chaque joueur « l'ami », et ceux qui l'entendent le dire deux fois dans la même phrase quittent la table.</p>
<p><strong>Rôle :</strong> croupier masqué de <strong>La Vigne Noire</strong>, pour le <strong>Syndicat d'Alagir</strong> — et relais de <strong>L'Œil Pourpre</strong>.</p>
`.trim(),
  },
  {
    nom: 'Merr Luth',
    sexe: 'MAN',
    desc: `
<p>Homme nain, 97 ans, trapu. Mains larges et courtes aux doigts étonnamment précis. Tablier beige immaculé porté sur une chemise de lin bleu aux manches retroussées.</p>
<p>Barbe noire tressée avec de fins anneaux d'argent. Yeux noisette perçants, peau tannée par les années passées derrière un comptoir.</p>
<p><strong>Voix :</strong> grave et nette, avec une articulation de commerçant qui répète les commandes pour éviter les litiges. Débit méthodique, il énonce toujours poids, prix et total dans cet ordre, sans jamais en sauter un. S'interrompt au milieu d'une phrase pour corriger un chiffre, puis reprend au même mot.</p>
<p><strong>Rôle :</strong> tient <strong>Le Poids Juste</strong> pour la <strong>Famille Cilovard</strong>. Note chaque commande au gramme près.</p>
`.trim(),
  },
  {
    nom: 'Mirdobas Filan',
    desc: `
<p>Homme humain, 54 ans. Mince et de taille moyenne, d'une immobilité déconcertante ; il garde les mains croisées devant lui et ne gesticule jamais en parlant.</p>
<p>Visage étroit et lisse, presque sans rides pour son âge. Cheveux noirs coupés court, tempes grisonnantes. Yeux gris très clairs, d'une fixité qui ne cille pas assez — ceux qui l'ont soutenue longtemps disent ensuite avoir oublié pourquoi ils regardaient.</p>
<p><strong>Voix :</strong> son arme. Douce, basse, d'une chaleur bienveillante parfaitement calibrée — <strong>elle instille des idées qui semblent naître dans l'esprit même de ses victimes</strong>. Débit lent et régulier, presque berçant, avec des répétitions discrètes qui reviennent trois phrases plus loin sans qu'on s'en aperçoive. Il ne donne jamais d'ordre : il formule une question dont la réponse est l'ordre.</p>
<p><strong>Rôle :</strong> <strong>Radius Ignis</strong> du <strong>Soleil Pourpre</strong> et officier de liaison avec <strong>L'Œil Pourpre</strong>. Spécialiste du contrôle mental, de l'effacement de mémoire et de la réécriture de personnalité. Réunion secrète chez <strong>Regalio Regani</strong> (9 juin 887) : préparatifs de la Crypte Rubis, cadence des écailles, canalistes d'aplanissement émotionnel, surveillance des quais Arrezo. Ses interlocuteurs le nomment le plus souvent « Radius Ignis Mirdobas ».</p>
<p><strong>Capacités notables :</strong> Présence Altérante, Maître des Esprits, Voile de l'Oubli, Frappe Psychique, Injection d'Idée, Fragmentation de l'Esprit, Effacement de Personnalité.</p>
`.trim(),
  },
  {
    nom: 'Narboki Runrock',
    sexe: 'MAN',
    desc: `
<p>Homme nain, 88 ans. Large et bedonnant, la carrure tassée par des décennies penchées sur des fourneaux ; il s'essuie les mains sur son tablier toutes les deux minutes.</p>
<p>Visage rouge et luisant, barbe rousse tressée en trois nattes courtes, retenues par des anneaux de cuivre. Yeux marron chafouins, qui regardent toujours un peu à côté. Sourcils brûlés d'un seul côté.</p>
<p><strong>Voix :</strong> râpeuse et volubile, portée par le souffle court d'un homme qui parle en travaillant. Débit précipité et flatteur devant les maîtres de maison, franchement gouailleur dès qu'ils ont le dos tourné. Baisse la voix et regarde les issues quand il évoque un prix — c'est le moment où il ment.</p>
<p><strong>Rôle :</strong> cuisinier du manoir <strong>Regani</strong>. Peut aider à infiltrer la soirée — moyennant finance, et sans garantie : il est peu fiable.</p>
`.trim(),
  },
  {
    nom: 'Nerios Vozin',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 51 ans. Grand et famélique, le dos creusé, les vêtements flottants de quelqu'un qui a beaucoup maigri récemment. Se tient près des sorties.</p>
<p>Visage émacié, joues creuses, teint cireux. Cheveux bruns filasse coupés inégalement, sans doute par lui-même. Yeux noisette fiévreux, très cernés. Brûlures d'acide anciennes sur le dos des deux mains.</p>
<p><strong>Voix :</strong> basse et rapide, hachée, comme s'il parlait toujours contre la montre. Débit haletant : il enchaîne les propositions sans respirer puis s'arrête net au milieu d'une phrase pour écouter la rue. Ne prononce plus le nom de <strong>Zenos Virion</strong> — il dit « l'autre », ou « celui d'avant ».</p>
<p><strong>Rôle :</strong> alchimiste recherché, alias <strong>Zenos Virion</strong> — piste de cristomancie pour <strong>Elerÿna</strong>.</p>
`.trim(),
  },
  {
    nom: 'Nimra',
    sexe: 'OTHER',
    desc: `
<p>Elfe androgyne, à la silhouette longiligne, d'une beauté ambiguë qui rend les étiquettes inutiles. S'habille de gris et de blanc, toujours un bougeoir en main, les doigts légèrement noircis de cire.</p>
<p>Cheveux blanc argenté tombant librement sur les épaules, yeux d'un violet pâle presque translucide qui changent de teinte selon l'angle de la lumière. Traits d'une finesse extrême, lèvres minces, oreilles effilées portant de minuscules anneaux de verre teinté.</p>
<p><strong>Voix :</strong> d'un registre indéfinissable, ni grave ni aiguë, si égale qu'on ne saurait la décrire une fois sorti — comme le reste. Débit très lent et murmuré, avec de longues pauses pendant lesquelles Nimra ajuste une bougie plutôt que de répondre. Ne s'adresse jamais à quelqu'un par son nom, ni par un titre.</p>
<p><strong>Rôle :</strong> à <strong>La Verrière Fendue</strong>, pour la <strong>Famille Palhindile</strong>. Règle les bougies selon les reflets du vitrail.</p>
`.trim(),
  },
  {
    nom: 'Ordan Tovalis',
    desc: `
<p>Homme humain, la quarantaine, à la carrure solide héritée des travailleurs de pierre mais avec la présence naturelle d'un orateur. Gestes amples qui prennent naturellement l'espace.</p>
<p>Visage large à la mâchoire forte, nez légèrement aplati d'un vieux coup ; cheveux châtain foncé grisonnant aux tempes ; yeux marron foncé.</p>
<p><strong>Voix :</strong> portante et grave, une voix de tribune qui accroche une foule de trois cents personnes sans estrade. Débit rythmé par la respiration, avec des répétitions en fin de phrase qui appellent l'adhésion — il sait exactement où placer un silence pour que la place le remplisse. Passe du registre soutenu au parler des carrières en une phrase, selon qui il veut rallier.</p>
<p><strong>Rôle :</strong> porte-parole <strong>Tovalis</strong>. Protestation publique contre l'alliance Cilovard–Rigart sur l'estrade du port (Partie 5).</p>
`.trim(),
  },
  {
    nom: 'Pelfort Vanguard',
    desc: `
<p>Homme humain, la quarantaine bien tassée, de taille moyenne, au corps entretenu et au maintien militaire hérité d'une formation de chevalier. Toujours vêtu de pourpre sombre et d'or, jamais sans sa couronne en public.</p>
<p>Mâchoire forte ; regard brun froid et calculateur qui ne s'éclaire jamais vraiment ; cheveux noirs soigneusement coiffés, barbe courte entretenue avec une précision royale.</p>
<p><strong>Voix :</strong> grave, ample et parfaitement maîtrisée, celle d'un souverain qui a appris à porter jusqu'au fond d'une salle du trône. Débit lent et solennel, avec des pauses royales que nul n'ose combler. Un détail que peu relèvent : il ne reprend jamais son souffle au milieu d'une phrase, si longue soit-elle — et certaines le sont beaucoup trop pour un homme.</p>
<p><strong>Rôle :</strong> monarque de la Cité Pourpre depuis cinq ans (mort royale suspecte). Centralise le pouvoir, réforme les impôts, surveille tout via le <strong>Soleil Pourpre</strong>. Tête de réseau de <strong>L'Œil Pourpre</strong>.</p>
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
