import { PrismaClient, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

/** Fin de Huriya + Brodnica lot 1. Lore existant conservé ; physique et voix ajoutés. */
type Fiche = { nom: string; sexe?: Sex; desc: string };
const RACE_NC = '<p><em>Note MJ : sa race n\'est pas renseignée en fiche — la description reste neutre sur ce point.</em></p>';

const LOT: Fiche[] = [
  // ── Huriya, fin ───────────────────────────────────────────────────
  {
    nom: 'Vessna Kholt',
    desc: `
<p>Femme, 45 ans. Grande et large d'épaules, d'une présence physique dont elle joue ; elle reste debout pendant que ses interlocuteurs s'assoient.</p>
<p>Visage dur et carré, teint mat, cheveux noirs coupés très court. Yeux noirs sans chaleur. Une cicatrice verticale à la lèvre inférieure. Mains couvertes de bagues lourdes, portées comme des poings américains.</p>
<p><strong>Voix :</strong> grave et râpeuse, avec une lenteur d'intimidation parfaitement maîtrisée. Débit très lent, une phrase à la fois, chaque silence laissé ouvert pour que l'autre s'y enfonce. Ne menace jamais explicitement : elle décrit des conséquences au présent de l'indicatif, comme si elles avaient déjà eu lieu.</p>
<p><strong>Rôle :</strong> cadre supérieure de l'<strong>Alliance des Veines</strong> à Huriya, organisation criminelle.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Volodar Ivelis',
    desc: `
<p>Homme, 48 ans, membre de la famille dirigeante <strong>Ivelis</strong>. Corpulent et pesant, le geste rare ; il s'installe dans un fauteuil pour la soirée entière.</p>
<p>Visage empâté, mâchoire lourde héritée d'Aimon. Cheveux châtains clairsemés, ramenés en travers. Yeux noisette perçants — le regard des Ivelis, sous des paupières tombantes. Teint coloré.</p>
<p><strong>Voix :</strong> grasse et lente, légèrement essoufflée ; il ménage son souffle et laisse traîner les fins de phrase. Débit indolent, plein de sous-entendus et de demi-mots, comme s'il en savait toujours plus qu'il n'en dit — ce qui est parfois vrai. Rit d'un souffle nasal, sans ouvrir la bouche.</p>
<p><strong>Rôle :</strong> membre de la famille dirigeante <strong>Ivelis</strong> de Huriya.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Vraxx Aurodent',
    desc: `
<p>Homme drakéide, soixante ans, à l'ascendance dorée évidente. Stature impressionnante même pour un drakéide — plus d'un mètre quatre-vingt-dix, large d'épaules, une présence qui remplit une pièce. Vêtements de marchand de haute qualité, bordeaux et bronze, sans ostentation ; montre à gousset en or massif frappée à l'effigie familiale toujours en vue.</p>
<p>Écailles d'or pâle tirant sur le bronze, cornes courtes recourbées vers l'arrière. Yeux verticaux d'un ambre profond, au regard d'une acuité redoutable ; visage marqué par les années — écailles plus ternes autour des yeux, quelques-unes ébréchées.</p>
<p><strong>Voix :</strong> profonde et résonnante, avec le grondement de poitrine caractéristique des drakéides dorés ; elle porte sans qu'il élève le ton. Débit lent et d'une courtoisie absolue, chaque phrase soigneusement tournée — et d'une inflexibilité totale dès qu'il s'agit de prix ou d'honneur commercial. Cite de mémoire les chiffres d'une transaction vieille de dix ans sans consulter un registre.</p>
<p><strong>Rôle :</strong> patriarche de la famille <strong>Aurodent</strong> et directeur général de <strong>La Monnaie du Dragon</strong>. Mémoire photographique des noms, des chiffres et des visages.</p>
`.trim(),
  },
  {
    nom: 'Vyn Keller',
    desc: `
<p>Homme humain, rond, environ 1,70 m, au visage nerveux et souvent crispé. Tunique brune, pantalon gris. Se déplace rapidement entre les tables.</p>
<p>Cheveux blancs très longs et ondulés, rasés sur le côté gauche, lui donnant une allure singulière ; yeux bleus toujours en mouvement, qui surveillent la salle avec inquiétude ; peau bronzée et rugueuse, marquée par des années de travail ingrat.</p>
<p><strong>Voix :</strong> hachée et trop rapide, qui monte dans l'aigu dès qu'on lui pose une question précise. Débit fuyant : il commence trois réponses et n'en finit aucune, coupe court par un « faut que j'y aille » et s'éclipse. Baisse instantanément d'un ton dès qu'<strong>Aegeard</strong> entre dans la salle.</p>
<p><strong>Rôle :</strong> homme de main du <strong>Syndicat</strong>, subordonné d'<strong>Aegeard Blanks</strong> à <strong>La Salamandre Savoureuse</strong>. Il évite les regards trop insistants et obéit au moindre signe — il sait trop de choses et fait tout pour ne jamais trop en dire.</p>
`.trim(),
  },
  // ── Brodnica ──────────────────────────────────────────────────────
  {
    nom: 'Afa NoirMarée',
    desc: `
<p>Femme génasi de terre, 64 ans. Basse et massive, d'une densité inhabituelle ; les planchers craquent sous elle et elle ne s'en excuse plus.</p>
<p>Peau brun-gris veinée de filons de quartz qui affleurent aux pommettes et au dos des mains. Cheveux tressés serré, couleur de racine. Yeux entièrement noirs, sans sclère. Une poussière minérale se dépose là où elle s'assoit longtemps.</p>
<p><strong>Voix :</strong> très basse et caverneuse, avec une résonance de fond de puits qu'on sent dans le sternum autant qu'on l'entend. Débit extrêmement lent, de longues pauses entre les propositions ; ses étudiants ont appris à ne pas combler les silences. Ne répète jamais une consigne — mais la donne toujours deux fois d'affilée la première fois.</p>
<p><strong>Rôle :</strong> professeure à la <strong>Nécrole</strong> de Brodnica.</p>
`.trim(),
  },
  {
    nom: 'Aner Elurra',
    desc: `
<p>Homme drakéide, 29 ans, fils du roi <strong>Tonur Elurra</strong> et d'<strong>Erlea Gerlaria</strong>. Grand et élancé pour un drakéide, plus coureur que lutteur ; il bouge vite et se tient rarement immobile.</p>
<p>Écailles gris-bleu ardoise virant au blanc sur la gorge — la livrée des Elurra. Cornes fines et droites, ramenées en arrière, l'une limée à la pointe. Yeux verticaux d'un bleu glacier, hérités de sa mère.</p>
<p><strong>Voix :</strong> claire et tendue, avec le sifflement léger que donnent les crocs sur les sifflantes. Débit rapide et impatient ; il termine les phrases des autres, surtout celles de sa sœur. Depuis la captivité de son frère, sa voix se casse chaque fois qu'il prononce le nom d'<strong>Ornolf</strong> — et il l'évite.</p>
<p><strong>Rôle :</strong> fils du roi Tonur Elurra et d'Erlea Gerlaria.</p>
`.trim(),
  },
  {
    nom: 'Asdis Elurra',
    desc: `
<p>Femme drakéide, 26 ans, fille du roi <strong>Tonur Elurra</strong> et d'<strong>Erlea Gerlaria</strong>. Taille moyenne, compacte et solidement charpentée ; posture très droite, épaules basses.</p>
<p>Écailles gris-bleu ardoise virant au blanc sur la gorge — la livrée des Elurra. Cornes courtes et épaisses, ornées d'anneaux de cuivre. Yeux verticaux d'un bleu glacier. Une écaille manquante à la tempe droite, jamais repoussée.</p>
<p><strong>Voix :</strong> grave et posée pour son âge, avec une lenteur qui contraste avec celle de son frère. Débit mesuré, elle pèse chaque phrase et n'élève jamais le ton — ce qui la fait écouter dans une salle où tout le monde crie. Répète la dernière proposition de son interlocuteur avant de répondre, réflexe appris à la cour.</p>
<p><strong>Rôle :</strong> fille du roi Tonur Elurra et d'Erlea Gerlaria.</p>
`.trim(),
  },
  {
    nom: 'Ayas Sarwens',
    desc: `
<p>Homme, 67 ans. Grand et squelettique, les vêtements flottants ; il se déplace lentement, d'un pas silencieux, et surgit là où on ne l'attendait pas.</p>
<p>Visage émacié à l'extrême, pommettes saillantes, peau parcheminée. Crâne entièrement chauve, veiné de bleu aux tempes. Yeux enfoncés d'un gris presque blanc, aux pupilles très rétrécies. Ongles longs et jaunis, ambre foncé.</p>
<p><strong>Voix :</strong> ténue et sifflante, comme filtrée par une gorge sèche ; elle ne porte pas, et pourtant on l'entend depuis le fond de l'amphithéâtre. Débit lent et didactique, chaque terme technique articulé avec un plaisir visible. Marque un temps d'arrêt avant les mots « mort », « cadavre » et « âme », comme s'il les savourait.</p>
<p><strong>Rôle :</strong> directeur de l'école de nécromancie clandestine — la <strong>Nécrole</strong> — sous Brodnica. Niveau 12.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Belina Tomasio',
    desc: `
<p>Femme, 44 ans, épouse d'<strong>Esebio Tomasio</strong>. Petite et menue, tenue de cour impeccable ; elle se tient très droite et légèrement en retrait de son mari, position qu'elle a choisie.</p>
<p>Visage fin aux traits réguliers, teint clair, poudré. Cheveux châtain foncé relevés en chignon bas. Yeux marron très attentifs, qui font le tour d'une réception en une passe. Bouche petite, sourire de convenance.</p>
<p><strong>Voix :</strong> douce et parfaitement modulée, d'une amabilité de représentation ; elle demande des nouvelles avec une précision qui trahit un carnet tenu à jour. Débit fluide et sans aspérité, riche en formules. Quand elle veut transmettre quelque chose de sérieux, elle passe au dolomicien — que peu de gens à Brodnica comprennent.</p>
<p><strong>Rôle :</strong> épouse d'<strong>Esebio Tomasio</strong>, au palais du comte.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Erlea Gerlaria',
    desc: `
<p>Femme drakéide, morte à 58 ans, épouse du roi <strong>Tonur Elurra</strong>. Elle était grande et sèche, d'un maintien rigide que trois enfants n'ont jamais assoupli.</p>
<p>Écailles blanc-gris pâle nuancées de bleu aux jointures, livrée des <strong>Gerlaria</strong>. Cornes longues et effilées, portées nues. Yeux verticaux d'un bleu glacier — ceux qu'elle a transmis à ses trois enfants.</p>
<p><strong>Voix :</strong> claire et coupante, sans chaleur, avec une articulation d'une netteté redoutable. Débit bref et définitif ; elle ne se répétait pas et ne s'expliquait pas. À la cour de Brodnica, on dit encore d'une décision sans appel qu'« elle est dite à la Gerlaria ».</p>
<p><strong>Rôle :</strong> épouse du roi Tonur Elurra. <em>Décédée.</em> Fille d'<strong>Ornulf</strong> et d'<strong>Eydis Gerlaria</strong>.</p>
`.trim(),
  },
  {
    nom: 'Esebio Tomasio',
    desc: `
<p>Homme, 51 ans. Grand et mince, très soigné, la mise d'un diplomate en poste à l'étranger qui tient à ne pas se fondre.</p>
<p>Visage long, teint olivâtre, barbe noire taillée en pointe. Cheveux noirs gominés, grisonnants aux tempes. Yeux marron foncé, mi-clos, à l'expression perpétuellement amusée. Bagues discrètes, parfum reconnaissable.</p>
<p><strong>Voix :</strong> veloutée et posée, avec un accent dolomicien qu'il entretient comme une carte de visite. Débit lent et onctueux, très riche en formules de politesse derrière lesquelles il ne dit rien ; il peut parler dix minutes sans s'engager. Passe à un débit sec et rapide dans les deux seules situations où il est sincère : l'argent et sa femme.</p>
<p><strong>Rôle :</strong> représentant du gouvernement des <strong>Duchés des Dolomites</strong> à Brodnica. Réside au palais du comte.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'ForteGriffe',
    desc: `
<p>Homme drakéide, 35 ans. Colossal et couturé, la masse d'un barbare qui a survécu à tout ; il se place systématiquement entre <strong>Snakha</strong> et la porte.</p>
<p>Écailles vert sombre, ternies et éclatées par endroits. Cornes épaisses, la gauche brisée à mi-longueur. Yeux verticaux jaunes. Les griffes des deux mains sont anormalement longues et entretenues — d'où son nom.</p>
<p><strong>Voix :</strong> un grondement de gorge plus qu'une voix, très grave, qui vibre dans les tables. Débit minimal : il grogne l'assentiment, gronde le refus, et ne prononce que rarement des mots entiers. Quand il parle vraiment, l'auditoire se tait — c'est déjà arrivé trois fois.</p>
<p><strong>Rôle :</strong> garde du corps barbare de <strong>Snakha</strong> à Brodnica.</p>
`.trim(),
  },
  {
    nom: 'Fulrad Longue-Rivière',
    desc: `
<p>Homme, 55 ans. Grand et bedonnant, l'allure bonhomme d'un notable de province ; il pose volontiers la main sur l'épaule de ses interlocuteurs.</p>
<p>Visage rond et coloré, favoris blancs fournis. Cheveux blancs clairsemés. Yeux bleus rieurs, qui ne rient pas toujours en même temps que la bouche. Gilet à chaîne de montre, doigts boudinés.</p>
<p><strong>Voix :</strong> ronde et cordiale, montée sur un registre de bonne compagnie ; il rit fort et souvent, à commencer par ses propres plaisanteries. Débit généreux, plein de digressions champêtres qui font oublier la question qu'on lui avait posée — méthode, pas distraction. Le rire s'éteint d'un coup quand on parle de comptes.</p>
<p><strong>Rôle :</strong> directeur de la cellule de la <strong>Chambre de Commerce Clandestine et Honnête</strong> (C.C.C.H) à Brodnica.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Gilly FortPied',
    desc: `
<p>Homme, 38 ans. Petit et râblé, toujours en mouvement ; il arpente les entrepôts d'un pas rapide, tablette sous le bras.</p>
<p>Visage carré et hâlé, mâchoire volontaire. Cheveux bruns coupés ras. Yeux gris, directs. Des mains larges et abîmées, et des bottes toujours crottées, y compris au bureau.</p>
<p><strong>Voix :</strong> forte et brusque, habituée aux quais ; elle contraste avec les manières feutrées de son directeur. Débit rapide et sans détour, il annonce les mauvaises nouvelles en premier. Jure abondamment, sauf devant <strong>Fulrad</strong>, où il s'arrête au milieu du mot.</p>
<p><strong>Rôle :</strong> responsable opérationnel de la <strong>C.C.C.H</strong> à Brodnica.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Immiq Ammi',
    desc: `
<p>Homme tieffelin, 52 ans. Longiligne et anguleux, le dos droit ; il enseigne debout et immobile, les mains derrière le dos.</p>
<p>Peau gris-violet, cornes en spirale serrée collées au crâne. Visage étroit, pommettes tranchantes. Yeux entièrement noirs sans pupille visible. Queue fine qu'il enroule autour de sa cheville pendant les cours — son seul tic.</p>
<p><strong>Voix :</strong> douce et curieusement chaleureuse, qui déconcerte au vu du sujet enseigné ; il parle de dissection comme d'autres de jardinage. Débit calme et régulier, avec de petites plaisanteries sèches glissées sans changer de ton. Appelle tous ses étudiants « mon enfant », y compris les plus âgés.</p>
<p><strong>Rôle :</strong> professeur à la <strong>Nécrole</strong> de Brodnica.</p>
`.trim(),
  },
  {
    nom: 'Malriho Uzuth',
    desc: `
<p>Homme drow, 214 ans. Mince et de taille moyenne, d'une élégance froide ; il ne fait jamais un geste inutile et supporte mal la lumière des amphithéâtres.</p>
<p>Peau d'un gris-noir profond, cheveux blancs coupés à la nuque. Visage fin aux traits acérés, oreilles très effilées. Yeux rouge sombre, plissés en permanence. Une brûlure ancienne au dos de la main gauche, en forme de rune.</p>
<p><strong>Voix :</strong> basse et soyeuse, d'une politesse glacée qui rend les remarques les plus dures impossibles à relever. Débit lent, parfaitement articulé, avec un léger accent des Profondeurs sur les r. Ne hausse jamais le ton ; il descend d'un demi-ton, et l'amphithéâtre se fige.</p>
<p><strong>Rôle :</strong> professeur à la <strong>Nécrole</strong> de Brodnica.</p>
`.trim(),
  },
  {
    nom: 'Norgac Delsarane',
    desc: `
<p>Homme, 49 ans. Taille moyenne, empâté par le bureau, épaules rondes ; il porte toujours trop de dossiers pour ses bras.</p>
<p>Visage rond et fatigué, cernes marqués. Cheveux châtains clairsemés et mal peignés. Yeux noisette résignés derrière des besicles de travers. Encre sur le poignet de chemise, invariablement.</p>
<p><strong>Voix :</strong> nasale et lasse, qui traîne sur les fins de phrase comme s'il s'excusait d'exister. Débit monocorde et procédural — il récite des articles de règlement avec l'entrain d'un homme qui les a tous essayés. S'anime d'un coup, et devient étonnamment précis et véhément, dès qu'on met en cause la ville elle-même.</p>
<p><strong>Rôle :</strong> responsable administratif de la ville de <strong>Brodnica</strong>.</p>
${RACE_NC}
`.trim(),
  },
  {
    nom: 'Ornolf Elurra',
    desc: `
<p>Homme drakéide, 32 ans, fils du roi <strong>Tonur Elurra</strong>. Large et puissamment bâti, l'aîné de la fratrie — mais la captivité l'a creusé : les écailles flottent sur les épaules.</p>
<p>Écailles gris-bleu ardoise virant au blanc sur la gorge, livrée des Elurra, ternies et sales. Cornes épaisses, sciées à ras — mutilation délibérée de ses geôliers. Yeux verticaux d'un bleu glacier, les seuls à n'avoir rien perdu.</p>
<p><strong>Voix :</strong> éraillée et basse, abîmée par la soif et le silence ; elle s'éteint après quelques phrases et il doit attendre pour reprendre. Débit lent, entrecoupé, avec de longues pauses où il rassemble ses mots. Ne dit jamais « quand je sortirai » — il dit « si ».</p>
<p><strong>Rôle :</strong> fils du roi Tonur Elurra, actuellement <strong>captif</strong>.</p>
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
