import { PrismaClient, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

/** Reste du monde, lot 1. Lore existant conservé ; physique et voix ajoutés. */
type Fiche = { nom: string; sexe?: Sex; desc: string };
const RACE_NC = '<p><em>Note MJ : sa race n\'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>';

const LOT: Fiche[] = [
  {
    nom: 'Aedran Elvaltis',
    desc: `
<p>Homme, 45 ans, gouverneur de Kalanos. Imposant — grand et large, une carrure que la charge n'a pas encore alourdie ; il occupe le haut bout de la table sans discuter.</p>
<p>Cheveux noirs grisonnants, coupés court et coiffés en arrière. Visage carré, mâchoire forte, teint mat. Yeux noirs attentifs, froids. Une bague de fonction à l'index droit.</p>
<p><strong>Voix :</strong> grave et posée, avec l'autorité tranquille d'un administrateur qui n'a pas besoin de rappeler son rang. Débit lent et pragmatique, sans fioriture diplomatique : il énonce ce qui est possible, puis ce qui ne l'est pas. Répète le mot « ordre » plus souvent qu'il ne le croit.</p>
<p><strong>Rôle :</strong> gouverneur de <strong>Kalanos</strong>. Diplomate pragmatique contrôlant strictement les carrières, soucieux de l'ordre impérial.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Akara du clan Thrahak',
    desc: `
<p>Femme naine, 73 ans. Trapue et sèche, musculature de cavalière ; les jambes arquées par des décennies de selle.</p>
<p>Visage anguleux, tanné par le vent des hauts plateaux. Cheveux roux sombre tressés en une natte unique, très serrée. Yeux gris acier. Une marque au fer, discrète, à l'intérieur du poignet gauche.</p>
<p><strong>Voix :</strong> rauque et brève, avec l'accent guttural du clan Thrahak sur les gutturales. Débit économe, en phrases de rapport ; elle donne l'information et se tait. Ne dit jamais « oui » — elle hoche une fois, sèchement.</p>
<p><strong>Rôle :</strong> naine du <strong>clan Thrahak</strong>, rang Cavalier 2 de la cellule de l'<strong>Œil Pourpre</strong> à Iserna.</p>
`.trim(),
  },
  {
    nom: 'Alménia Kinemor',
    desc: `
<p>Femme, 34 ans, membre de la famille royale <strong>Kinemor</strong>. Grande et mince, maintien de cour momoritanien — épaules effacées, menton haut.</p>
<p>Visage allongé, teint très clair, sourcils fins. Cheveux blond cendré relevés en coiffure haute. Yeux bleu pâle, distants. Peu de bijoux, mais tous de grande valeur.</p>
<p><strong>Voix :</strong> claire et froide, avec l'accent pointu des hautes sphères momoritaniennes. Débit lent et articulé, riche en formules d'étiquette derrière lesquelles elle ne s'engage jamais. Marque une pause avant de prononcer un nom roturier, comme si elle vérifiait qu'il existe.</p>
<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Alym',
    desc: `
<p>Homme humain, 58 ans. De taille moyenne, sec et droit, la mise soignée d'un souverain qui règne par l'administration plus que par l'épée.</p>
<p>Visage anguleux au teint hâlé, barbe noire courte striée de blanc. Cheveux noirs sous le turban d'apparat. Yeux noirs, patients. Mains fines, ongles soignés.</p>
<p><strong>Voix :</strong> posée et musicale, avec les intonations chantantes du Sandarane. Débit lent et imagé — il répond volontiers par une maxime ou une comparaison, et laisse à l'interlocuteur le soin de conclure. Ne dit jamais « non » directement : il dit « pas encore, si les dieux le veulent ».</p>
<p><strong>Rôle :</strong> famille régnante du <strong>Sultanat de Sandarane</strong> depuis plus de 400 ans. Siège à Sandarane.</p>
`.trim(),
  },
  {
    nom: 'Arienna Zandris',
    desc: `
<p>Femme, 41 ans, petite et énergique. Toujours en mouvement dans son échoppe, elle manipule ses pierres en parlant sans jamais en faire tomber une.</p>
<p>Cheveux noirs relevés en chignon, quelques mèches échappées. Visage rond et mobile, teint mat. Yeux noirs très vifs, qu'elle plisse pour évaluer une taille. Loupe de joaillier suspendue au cou.</p>
<p><strong>Voix :</strong> vive et haut perchée, avec un débit d'enchère — rapide, rythmé, qui ne laisse pas le temps de réfléchir au prix. Elle passe d'un sujet à l'autre en gardant la même intensité. Baisse d'un ton et ralentit pour parler d'une pierre qu'elle aime vraiment, et là, on écoute.</p>
<p><strong>Rôle :</strong> figure influente du commerce local de <strong>Kalanos</strong>, spécialisée dans les ornements en pierre précieuse.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Aurore Grandpont',
    desc: `
<p>Femme humaine, 31 ans. Taille moyenne, silhouette quelconque, vêtements de ville ternes ; elle a l'allure exacte de trois cents autres personnes à Russolio, ce qui fait sa valeur.</p>
<p>Visage ordinaire et avenant, teint clair. Cheveux châtains attachés simplement. Yeux gris, attentifs. Aucun signe distinctif, aucun bijou.</p>
<p><strong>Voix :</strong> moyenne en tout — ni grave ni aiguë, sans accent identifiable, d'un volume parfaitement banal. Débit naturel et bavard, celui d'une voisine ; elle pose des questions ordinaires et retient toutes les réponses. Ne répète jamais un nom entendu : elle l'écrit, plus tard, ailleurs.</p>
<p><strong>Rôle :</strong> pion de la cellule de l'<strong>Œil Pourpre</strong> à Russolio.</p>
`.trim(),
  },
  {
    nom: 'Bilbron Nucklestamp',
    sexe: 'MAN',
    desc: `
<p>Homme, 91 ans, archimage. Petit et voûté, presque escamoté dans des robes trop grandes ; il lévite de quelques centimètres quand il est distrait, sans s'en apercevoir.</p>
<p>Visage étroit et ridé, nez long. Barbe blanche et fine, nouée en trois endroits. Sourcils broussailleux. Yeux noirs perçants, disproportionnés dans un si petit visage. Doigts constamment en mouvement, comme s'ils traçaient des runes.</p>
<p><strong>Voix :</strong> haute et sèche, avec un timbre cassant qui porte mal mais qu'on n'ose pas faire répéter. Débit rapide et impatient, saturé de termes techniques et d'apartés ; il répond souvent à la question qu'on aurait dû poser. S'interrompt pour se corriger lui-même à voix haute, puis reprend.</p>
<p><strong>Rôle :</strong> archimage.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Boddynock Folkor',
    desc: `
<p>Homme gnome, 78 ans. Petit et rond, l'air inoffensif ; il s'assoit dans les tavernes d'Iserna et y reste des heures sans que personne le remarque.</p>
<p>Visage poupin, joues rouges, nez bulbeux. Cheveux blancs en couronne, oreilles décollées. Yeux bleus rieurs, qui ne perdent rien d'une salle.</p>
<p><strong>Voix :</strong> chantante et volubile, d'une jovialité qui désarme ; il raconte des anecdotes interminables que personne n'écoute jusqu'au bout — et c'est le but, car il écoute pendant ce temps. Débit rapide, plein de digressions. Ne pose jamais de question directe.</p>
<p><strong>Rôle :</strong> pion de la cellule de l'<strong>Œil Pourpre</strong> à Iserna.</p>
`.trim(),
  },
  {
    nom: 'Calison Kinemor',
    desc: `
<p>Homme, 29 ans, membre de la famille royale <strong>Kinemor</strong>. Grand et svelte, allure d'escrimeur de salon ; il s'appuie volontiers aux cheminées en posant.</p>
<p>Visage fin et pâle, mâchoire délicate. Cheveux blond cendré ondulés, portés mi-longs. Yeux bleu pâle, paupières lourdes. Une moustache fine qu'il retouche souvent.</p>
<p><strong>Voix :</strong> claire et traînante, avec l'accent pointu des hautes sphères momoritaniennes qu'il exagère par pose. Débit nonchalant, semé d'esprit et de piques ; il parle de tout avec le même détachement amusé. Le ton se brise net, sec et bref, dès qu'il est réellement contrarié.</p>
<p><strong>Rôle :</strong> membre de la famille royale <strong>Kinemor</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Cinq Nuits',
    desc: `
<p>Femme goliathe, imposante. Haute et charpentée, elle domine l'assemblée du Monastère — et pourtant <strong>ses pas ne font presque aucun bruit</strong>.</p>
<p>Peau striée de noir et blanc en damier — on jurerait que le motif change quand on détourne le regard. Cheveux longs tressés de rubans de soie sombre. Sourire rare et déroutant.</p>
<p><strong>Voix :</strong> grave et veloutée, avec une particularité que ses élèves redoutent : elle semble venir d'un autre endroit de la pièce que celui où elle se tient, et l'on se retourne. Débit lent et suspendu, avec des silences pendant lesquels on n'est plus certain qu'elle ait parlé. Ne dit jamais deux fois la même phrase de la même manière.</p>
<p><strong>Rôle :</strong> maîtresse illusionniste du <strong>Monastère des Nuits</strong>. École : <strong>Illusion</strong>. Tisse mirages et mensonges sensoriels.</p>
<p><strong>Capacités notables :</strong> FP 6 · PV 58. Sorts signatures : Image silencieuse, Image majeure, Invisibilité, Mirage. « Manteau des mille reflets » : copie illusoire d'elle-même qui peut agir 1 round (recharge 5-6). Avantage aux JS pour dissiper ses illusions.</p>
`.trim(),
  },
  {
    nom: 'Crampernap Scheppen',
    desc: `
<p>Homme gnome, 64 ans. Menu et sec, le dos rond ; il se faufile dans les ruelles de Russolio avec une aisance que sa démarche traînante ne laisse pas deviner.</p>
<p>Visage étroit et fripé, menton en galoche. Cheveux gris hirsutes sous un bonnet de laine qu'il ne quitte jamais. Yeux marron fuyants, jamais fixés plus d'un instant.</p>
<p><strong>Voix :</strong> nasillarde et geignarde, celle d'un homme qui se plaint par métier ; on cesse vite de l'écouter, et c'est exactement ce qu'il veut. Débit lent et plaintif, avec une manie de répéter la fin de ses propres phrases. Change brusquement de registre — net, bas, rapide — quand il transmet.</p>
<p><strong>Rôle :</strong> pion de la cellule de l'<strong>Œil Pourpre</strong> à Russolio.</p>
`.trim(),
  },
  {
    nom: 'Cumpen Horcus',
    desc: `
<p>Homme gnome, 82 ans. Petit et maigre, agité ; il ne tient pas en place et manipule constamment un objet — une pièce, une clé, un caillou.</p>
<p>Visage en lame, pommettes hautes, teint gris. Cheveux poivre et sel en bataille. Yeux verts très clairs, exorbités, qui donnent une impression de folie contrôlée. Un sourire de travers.</p>
<p><strong>Voix :</strong> aiguë et saccadée, avec des ruptures de ton imprévisibles qui déstabilisent ses interlocuteurs. Débit décousu en apparence — il saute d'un sujet à l'autre — mais chaque digression ramène à l'information qu'il cherchait. Rit à contretemps.</p>
<p><strong>Rôle :</strong> rang Fou 2 de la cellule de l'<strong>Œil Pourpre</strong> à Iserna.</p>
`.trim(),
  },
  {
    nom: 'Darven Krest',
    desc: `
<p>Homme, 39 ans. Solide et carré, port militaire impeccable ; il garde les mains dans le dos et les pieds écartés, même au repos.</p>
<p>Peau sombre, cheveux ras. Visage large, mâchoire nette, sans barbe. Yeux noirs, directs et impassibles. Une cicatrice courte au-dessus du sourcil droit.</p>
<p><strong>Voix :</strong> forte et sèche, dressée au commandement en rue ; elle claque plus qu'elle ne porte. Débit bref, en ordres numérotés, aucune place pour la discussion. Ne dit jamais « je pense » : il dit « le règlement prévoit ».</p>
<p><strong>Rôle :</strong> maintient l'ordre dans les quartiers populaires de <strong>Kalanos</strong>. Efficacité militaire et loyauté sans faille envers l'Empire.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'David IV',
    desc: `
<p>Homme humain, 52 ans. Grand et massif, la carrure encore martiale sous les habits d'apparat ; il se déplace lentement et n'attend jamais personne.</p>
<p>Visage large et dur, mâchoire lourde. Cheveux noirs grisonnants coupés court, barbe taillée au carré. Yeux bruns froids, immobiles. Une couronne fine, portée bas sur le front.</p>
<p><strong>Voix :</strong> grave et tonnante, celle d'un homme qui n'a jamais eu à demander deux fois. Débit lent et catégorique, sans nuance ni conditionnel ; il tranche et passe à la suite. Ne prononce jamais le nom du <strong>Saint-Empire Momoritanien</strong> — il dit « l'autre rive ».</p>
<p><strong>Rôle :</strong> dirige <strong>Gandorènne</strong> d'une main de fer. Royaume fondé il y a 100 ans par David III. Actuellement en guerre froide avec le Saint-Empire Momoritanien.</p>
`.trim(),
  },
  {
    nom: 'Deux Nuits',
    desc: `
<p>Homme goliath, massif. Une odeur d'ozone et de cendre froide l'entoure après chaque incantation.</p>
<p>Peau grise striée de veines noires comme de la fumée figée. Barbe tressée de cordes de cuir, anneaux d'os aux poignets.</p>
<p><strong>Voix :</strong> caverneuse et profonde, avec une résonance métallique qui s'installe dans la pièce quelques secondes après qu'il a cessé de parler. Débit lourd et scandé, presque liturgique ; il détache les syllabes des noms qu'il invoque. Quand il conjure, la voix se dédouble brièvement — un ton plus bas par-dessous.</p>
<p><strong>Rôle :</strong> maître conjurateur du <strong>Monastère des Nuits</strong>. École : <strong>Conjuration</strong>. Appelle créatures et objets d'autres plans.</p>
<p><strong>Capacités notables :</strong> FP 4 · PV 48. Sorts signatures : Invoquer des animaux, Nuage nauséabond, Porte dimensionnelle. « Appel du seuil » : invoque 1 élémentaire mineur obéissant 1 h (1/jour).</p>
`.trim(),
  },
  {
    nom: 'Dorian Hale',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 46 ans. Grand et sec, très droit ; le manteau noir d'inquisiteur tombe sans un pli, et il ne s'assoit qu'après y avoir été invité deux fois.</p>
<p>Chauve, le crâne pâle et net. Traits sévères, joues creuses, lèvres minces. <strong>Yeux bleu pâle</strong>, fixes, qui ne cillent presque pas.</p>
<p><strong>Voix :</strong> claire et froide, d'une neutralité d'interrogatoire ; elle ne change pas qu'il salue ou qu'il accuse. Débit lent et méthodique, avec une pause après chaque question — toujours plus longue que nécessaire, pour laisser le silence travailler. Répète votre réponse mot pour mot avant de passer à la suivante.</p>
<p><strong>Rôle :</strong> Frère Dorian Hale, agent inquisitorial de <strong>La Main du Silence</strong>.</p>
<p><strong>Capacités notables :</strong> FP 5 · PV 72. Sorts DD 14 : thaumaturgie, guidance ; zone de vérité, détection des pensées ; suggestion 1/jour.</p>
`.trim(),
  },
  {
    nom: 'Drogan Kharvek — Le Porte-Faille',
    desc: `
<p>Homme humain, 44 ans. Gigantesque et noueux, bâti pour la hache à deux mains ; couvert de peaux et de plaques dépareillées prises sur des vaincus.</p>
<p>Visage taillé à la serpe, tanné par les steppes. Crâne rasé sur les côtés, longue mèche noire tressée d'anneaux de fer. Barbe noire fourchue. Yeux noirs enfoncés, injectés. Le nez et les arcades plusieurs fois refaits par des coups.</p>
<p><strong>Voix :</strong> énorme et râpeuse, une voix de chef de guerre qui traverse un camp entier ; il ne parle qu'en criant à moitié. Débit martelé, en formules brèves et répétées que ses guerriers reprennent en chœur. En rage, elle descend d'une octave et devient un grondement que les chevaux entendent avant les hommes.</p>
<p><strong>Rôle :</strong> chef de guerre des <strong>Beor Khan</strong>.</p>
<p><strong>Capacités notables :</strong> PV 145 · bonus de maîtrise +4. Brise-Faille : +9 (2d12+5 tranchant). Attaque brutale : si la cible est déjà blessée, +2d6 dégâts. Rage du Porte-Faille : résistance aux dégâts physiques non magiques. Présence Dominante : ennemis à 6 m, JS SAG DD 15 ou effrayés 1 tour. Chef de Guerre : alliés à 9 m, +2 dégâts en mêlée.</p>
`.trim(),
  },
  {
    nom: 'Elira Varek',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 22 ans, fille cadette. Mince et vive, encore un peu gauche ; elle se déplace par à-coups, s'arrête net quand quelque chose l'intrigue.</p>
<p>Cheveux noirs très longs, souvent mal attachés. Yeux noisette grands et mobiles. Visage fin, encore juvénile, une tache d'encre fréquente sur la joue.</p>
<p><strong>Voix :</strong> claire et rapide, qui monte quand elle s'enthousiasme — c'est-à-dire souvent. Débit en avalanche de questions : elle en pose trois avant d'écouter la réponse à la première, et revient ensuite à chacune dans l'ordre. Baisse la voix et articule lentement quand elle a compris quelque chose que les adultes n'ont pas.</p>
<p><strong>Rôle :</strong> fille cadette de la <strong>Famille Varek</strong>, au <strong>Hameau de Valbrume</strong>. Intelligence et curiosité remarquées.</p>
`.trim(),
  },
  {
    nom: 'Elivara Tanis',
    desc: `
<p>Femme, 57 ans, grande et imposante. Port ample et calme ; elle entre lentement dans une pièce et la tension y baisse d'un cran.</p>
<p>Cheveux argentés portés longs et libres. Visage large aux traits apaisés, teint clair. Yeux gris limpides, d'une attention totale. Mains ouvertes, toujours visibles.</p>
<p><strong>Voix :</strong> <strong>douce mais ferme</strong>, d'une chaleur sans complaisance ; elle ne s'élève jamais et n'a jamais eu besoin de le faire. Débit lent et posé, avec des silences qu'elle laisse aux autres pour qu'ils s'entendent parler. Reformule systématiquement la position de chacun avant de proposer la sienne — l'outil qui fait d'elle une médiatrice.</p>
<p><strong>Rôle :</strong> conscience spirituelle de <strong>Kalanos</strong>, médiatrice entre les factions.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Ennio Tomasio',
    desc: `
<p>Bébé, quelques mois. Emmailloté dans les langes brodés aux armes des <strong>Tomasio</strong>.</p>
<p>Joues rondes, duvet brun sur le crâne, yeux encore d'un bleu indécis.</p>
<p><strong>Voix :</strong> celle d'un nourrisson — babils, gargouillis et hurlements. Les nourrices du palais du comte notent qu'il pleure rarement la nuit, mais sans relâche dès qu'on le sort du palais.</p>
<p><strong>Rôle :</strong> enfant de la <strong>Famille Tomasio</strong> (comtes des Dolomites).</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Frouse Fiddlefen',
    desc: `
<p>Homme gnome, 71 ans. Petit et trapu pour un gnome, les épaules rondes ; il porte toujours un instrument sous le bras et propose de jouer avant qu'on le lui demande.</p>
<p>Visage rond et jovial, nez rouge. Cheveux bruns bouclés semés de gris, favoris fournis. Yeux marron pétillants. Doigts courts et agiles.</p>
<p><strong>Voix :</strong> chaleureuse et chantante, avec une tendance à glisser dans le fredonnement en milieu de phrase. Débit enjoué et digressif ; il transforme chaque réponse en anecdote et chaque anecdote en chanson. Sous le bavardage, il n'a jamais répondu à une seule question précise.</p>
<p><strong>Rôle :</strong> pion de la cellule de l'<strong>Œil Pourpre</strong> à Iserna.</p>
`.trim(),
  },
  {
    nom: 'Garrik Varek',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 30 ans, fils aîné. Immense gaillard, épaules larges, tablier de cuir ; il se baisse par réflexe sous les portes du hameau.</p>
<p>Cheveux châtains courts. Visage large et franc, hâlé, barbe de quelques jours. Yeux noisette calmes. Mains énormes, brûlées par la forge aux doigts.</p>
<p><strong>Voix :</strong> grave et lente, avec un fond de timidité qui surprend chez un homme de cette taille. Débit hésitant en société, franchement volubile au travail, où il commente chaque geste à voix haute. Rit d'un rire énorme, qu'il coupe net en se rappelant qu'on l'écoute.</p>
<p><strong>Rôle :</strong> fils aîné de la <strong>Famille Varek</strong>, au <strong>Hameau de Valbrume</strong>.</p>
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
