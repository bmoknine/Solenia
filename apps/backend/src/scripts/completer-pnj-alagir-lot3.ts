import { PrismaClient, type Sex } from '@prisma/client';

const prisma = new PrismaClient();

/** Alagir, lot 3/6. Lore existant conservé mot pour mot ; physique et voix ajoutés. */
type Fiche = { nom: string; sexe?: Sex; desc: string };

const LOT: Fiche[] = [
  {
    nom: 'Ikar Doven',
    desc: `
<p>Homme humain, 39 ans. Sec et dur, tout en nerfs sous l'armure ; il garde son casque le plus longtemps possible, y compris à l'intérieur.</p>
<p>Sous le casque pourpre, le visage est marqué par les brûlures — la joue et la tempe gauches ont fondu puis mal cicatrisé. Cheveux bruns rasés d'un côté. Le regard paraît étrangement vide, sans que ce soit de la bêtise.</p>
<p><strong>Voix :</strong> plate et sans relief, comme si la conviction avait été retirée des mots mais pas les mots eux-mêmes. Débit récitatif, il reprend le vocabulaire des officiers à la lettre — les slogans du Soleil Pourpre sortent de lui sans qu'il paraisse les penser. Sa voix ne retrouve un timbre normal que lorsqu'il parle de la Cinquième Roue, où il est né.</p>
<p><strong>Rôle :</strong> Centurion Pourpre. Né à la Cinquième Roue, ancien voleur repenti.</p>
<p><strong>Particularité :</strong> fanatique mais survivant, prêt à tout pour conserver son statut.</p>
`.trim(),
  },
  {
    nom: 'Isha Ka',
    sexe: 'WOMAN',
    desc: `
<p>Femme tieffeline, 43 ans, à la peau cendrée. Mince et souple, gestes lents et circulaires ; elle se déplace dans sa boutique sans jamais heurter un flacon.</p>
<p>Yeux dorés ; tatouages runiques sur la gorge ; bijoux d'os et anneaux serpentins. Cornes fines ramenées en arrière, ornées de fil d'argent.</p>
<p><strong>Voix :</strong> douce, légèrement sifflante, avec un traînement sur les « s » qui donne à chaque phrase un tour d'incantation. Débit très lent, beaucoup de silences ; elle laisse ses clients terminer leurs propres phrases à sa place. « <em>Chaque parfum a une intention, chaque poison une poésie.</em> »</p>
<p><strong>Rôle :</strong> tient <strong>Le Souffle d'Obsidienne</strong>.</p>
<p><strong>Particularité :</strong> son faucon translucide <strong>Voriel</strong> est un fragment de son pouvoir vital — si Voriel meurt, elle s'effondre.</p>
`.trim(),
  },
  {
    nom: 'Ismara Cilovard',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 25 ans, fille cadette <strong>Cilovard</strong>. Petite, traits délicats hérités de sa mère mais regard plus sincère. Robes pratiques aux couleurs neutres, peu de bijoux — une seule boucle d'oreille en lapis-lazuli.</p>
<p>Cheveux auburn portés en tresse lâche qui glisse souvent sur l'épaule quand elle penche la tête sur ses livres de comptes. Yeux verts légèrement cernés, taches d'encre fréquentes aux doigts et parfois sur la joue.</p>
<p><strong>Voix :</strong> claire et un peu jeune pour son rang, sans l'assurance travaillée du reste de sa famille. Débit rapide et précis sur les chiffres, hésitant dès qu'il faut donner un avis — elle commence alors ses phrases par « je me trompe peut-être ». Baisse les yeux en parlant, et les relève d'un coup quand elle dit enfin ce qu'elle pense vraiment.</p>
<p><strong>Rôle :</strong> chargée de la logistique et du transport d'or. Moins ambitieuse, plus lucide — la conscience discrète de la famille.</p>
<p><strong>Secret (MJ) :</strong> elle détient un registre chiffré prouvant un détournement de fonds au sein de sa propre Maison — le garder la ronge, le révéler la briserait.</p>
<p><strong>Capacités notables :</strong> CA 13 · PV 32 · Dague +3. Regard sincère (avantage en Persuasion avec le peuple) ; Marque du remords — ses pièces noircissent quand elle ment.</p>
`.trim(),
  },
  {
    nom: 'Jesa Tolvine',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, la cinquantaine, petite mais raide comme un piquet — elle impose par la seule intensité de son regard. Tenue de travail toujours propre, tablier de cuir épais, bottes solides.</p>
<p>Cheveux gris fer coupés court, sans fioritures ; yeux noirs tranchants ; une cicatrice en arc traverse son menton, éclat de roc reçu à vingt ans.</p>
<p><strong>Voix :</strong> sèche et coupante, calibrée pour porter par-dessus le bruit des maillets ; elle ne l'adoucit pas en intérieur. Débit bref, à l'impératif, sans bonjour ni au revoir. Le seul compliment qu'elle accorde est un « ça ira », et ses tailleurs de blocs s'en contentent.</p>
<p><strong>Rôle :</strong> contremaître à la taille de bloc, pour la <strong>Famille Tovalis</strong>. Exigeante, respectée.</p>
`.trim(),
  },
  {
    nom: 'Jillian Riverpipe',
    desc: `
<p>Femme, la quarantaine. Petite et vive, toujours en mouvement ; elle parle en marchant et fait tourner ses interlocuteurs autour d'une table sans qu'ils s'en aperçoivent.</p>
<p>Visage rond et mobile, fossettes marquées, teint clair semé de taches de rousseur. Cheveux roux foncé remontés à la va-vite et piqués d'un crayon. Yeux verts extrêmement rapides, qui relèvent tout.</p>
<p><strong>Voix :</strong> chaleureuse et enjouée, faite pour mettre à l'aise — c'est son principal outil de travail. Débit rapide et enveloppant, plein de « mon cher » et de rires placés au bon endroit ; elle pose trois questions anodines pour en glisser une quatrième qui compte. Quand la négociation devient sérieuse, le rire disparaît d'un coup et le débit ralentit de moitié.</p>
<p><strong>Rôle :</strong> courtière d'Alagir, pivot dans les cercles d'affaires et d'influence de la ville. Liée au <strong>Syndicat d'Alagir</strong> et à <strong>La Braise</strong>.</p>
<p><em>Note MJ : sa race n'est pas renseignée en fiche — la description reste compatible avec plusieurs.</em></p>
`.trim(),
  },
  {
    nom: 'Lady Serenya Palhindile',
    sexe: 'WOMAN',
    desc: `
<p>Femme haute elfe, 310 ans, matriarche <strong>Palhindile</strong>. Grande, d'une beauté hors du temps qui porte ses siècles comme une seconde nature. Toujours vêtue de blanc et d'argent, rapière fine et ouvragée à la ceinture.</p>
<p>Cheveux d'or blanc nattés avec des fils d'argent et des perles de verre coloré. Yeux vert clair aux pupilles en amande oblongue, regard d'une sérénité absolue qui peut en une fraction de seconde devenir d'acier. Peau de porcelaine aux veines légèrement irisées, traits d'une symétrie parfaite.</p>
<p><strong>Voix :</strong> limpide et musicale, d'une éloquence sans faille — trois siècles de médiation lui ont donné une diction que personne n'interrompt. Débit ample et régulier, avec des phrases longues qui ne se perdent jamais ; elle ne reprend jamais un mot. Quand elle veut clore un débat, elle ne hausse pas le ton : elle ralentit jusqu'au silence, et la salle se tait avec elle.</p>
<p><strong>Rôle :</strong> Chancelière d'Alagir. Calme, bienveillante.</p>
<p><strong>Secret (MJ) :</strong> elle consigne chaque nuit, depuis son balcon, les lumières qui bougent sur l'excavation. Sans le savoir, ses carnets tracent les itinéraires des convois nocturnes vers la <strong>Citadelle Rouge</strong>.</p>
<p><strong>Capacités notables :</strong> CA 15 · PV 56 · Rapière +5. Persuasion +8, Intuition +6, Religion +5. Aura de paix (alliés proches avantagés contre la peur) ; Verre protecteur 1/jour (Apaisement ou Zone de vérité).</p>
`.trim(),
  },
  {
    nom: 'Lady Velena Cilovard',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 55 ans, épouse de <strong>Garran Cilovard</strong>. Élancée, silhouette soignée, qui porte ses années avec une grâce distillée. Gestes lents et assurés ; robes de soie sobre, jamais criardes, toujours de qualité irréprochable.</p>
<p>Cheveux auburn soigneusement relevés en chignon, striés de fils blancs qui ressemblent à un choix esthétique plutôt qu'à un signe de l'âge. Yeux verts au regard doux et calculateur, fines rides aux commissures qui apparaissent lorsqu'elle sourit — ce qui est fréquent. Peau pâle.</p>
<p><strong>Voix :</strong> douce et enveloppante, d'une bienveillance parfaitement jouée ; elle demande des nouvelles de vos enfants par leur prénom. Débit lent et soigné, avec un petit rire de gorge placé avant les demandes, qui les fait passer pour des faveurs qu'on lui rend. Ne formule jamais une exigence : elle exprime une inquiétude.</p>
<p><strong>Rôle :</strong> dirige la <strong>Caisse des Richesses Cachées</strong>. Fine manipulatrice, elle crée des dettes morales sous couvert de générosité.</p>
<p><strong>Secret (MJ) :</strong> certains de ses registres s'écrivent seuls, en encre rouge vive.</p>
<p><strong>Capacités notables :</strong> CA 14 · PV 54 · Stylet +5. Charme du serpent (avantage en Tromperie contre nobles et prêtres) ; Comptabilité sacrée 1/jour (Détection de la magie).</p>
`.trim(),
  },
  {
    nom: 'Laguna Temper',
    sexe: 'WOMAN',
    desc: `
<p>Femme gnome, 158 ans, 84 cm. Menue et anguleuse, perchée sur un tabouret trop haut qu'elle ne quitte pratiquement jamais ; les pieds ne touchent pas le sol et ça ne la gêne pas.</p>
<p>Cheveux roux rasés côté gauche, le reste tombant en mèches inégales. Yeux noirs, très brillants. Visage pointu, nez fin, une pincée de poudre de cristal restée dans un sourcil.</p>
<p><strong>Voix :</strong> haut perchée et râpeuse, avec un petit claquement de langue entre les propositions. Débit rapide et sautillant, plein de parenthèses dont elle ne ressort pas toujours ; elle change d'idée en cours de phrase et garde les deux. Récite les montants dus d'une traite, sans respirer et sans se tromper d'un cuivre.</p>
<p><strong>Rôle :</strong> sorcière gnome (niveau 4), spécialiste de <strong>cristomancie</strong>. Renvoie vers l'atelier d'<strong>Amiro Léovine</strong> après la dette de <strong>Folduin</strong>.</p>
`.trim(),
  },
  {
    nom: 'Lierin Lorial',
    desc: `
<p>Homme, 57 ans. Grand et corpulent, port solennel ; il entre dans une pièce en dernier et s'y installe comme chez lui.</p>
<p>Visage large et soigné, rasé de près, teint clair de quelqu'un qui ne sort qu'en voiture. Cheveux gris coupés court et coiffés à la brosse. Yeux bleus froids, paupières lourdes. Une chevalière massive qu'il fait tourner quand on lui déplaît.</p>
<p><strong>Voix :</strong> ample et grave, posée sur un registre d'autorité tranquille ; il parle comme on énonce un règlement. Débit lent et solennel, avec des pauses appuyées avant les chiffres. Reprend systématiquement les erreurs de vocabulaire de ses interlocuteurs — « on dit <em>créance</em> » — avant de répondre au fond.</p>
<p><strong>Rôle :</strong> prévôt bancaire d'Alagir, influent dans le réseau financier de la cité. Dirige <strong>La Ligature Bancaire d'Alagir</strong>, avec <strong>Ery Seel</strong> pour bras droit.</p>
<p><em>Note MJ : sa race n'est pas renseignée en fiche.</em></p>
`.trim(),
  },
  {
    nom: 'Lior Palhindile',
    sexe: 'MAN',
    desc: `
<p>Homme demi-elfe, 24 ans, mage archiviste <strong>Palhindile</strong>. Jeune et mince, légèrement voûté sur les tables de travail. Robe d'archiviste bleu nuit un peu usée aux coudes.</p>
<p>Traits mélangés — oreilles très légèrement pointues, visage plus doux et expressif qu'un elfe pur. Cheveux brun-roux mi-longs, toujours légèrement ébouriffés comme s'il venait de les sortir d'un livre. Yeux d'un vert lumineux aux reflets elfiques. Lunettes rondes à monture de laiton fin perchées sur le nez. Doigts toujours tachés d'encre noire ou violette.</p>
<p><strong>Voix :</strong> jeune et claire, qui s'anime et accélère dès qu'il parle de vitraux ou de langues anciennes — il devient alors difficile à suivre et s'en excuse ensuite. Débit hésitant sur tout le reste, semé de « enfin, je veux dire » et de reprises. Lit à mi-voix quand il croit être seul.</p>
<p><strong>Rôle :</strong> spécialiste des vitraux anciens.</p>
<p><strong>Secret (MJ) :</strong> il a trouvé sous son atelier une dalle de verre gravée d'un plan oublié des souterrains d'Alagir — il n'ose dire à qui il mène.</p>
<p><strong>Capacités notables :</strong> CA 12 · PV 33 · Bâton +3. Sorts mineurs : Lumière, Prestidigitation, Détection de la magie. Niveaux 1–2 : Bouclier, Identification, Silence, Détection du mal et du bien. Archiviste du silence (avantage pour les langues anciennes).</p>
`.trim(),
  },
  {
    nom: 'Lira Morven',
    desc: `
<p>Femme humaine, 41 ans. Grande et solide, elle se tient toujours droite — une raideur de garde qui ne l'a pas quittée avec le poste. Armure polie sans ornement.</p>
<p>Visage sévère et régulier, mâchoire nette, cheveux noirs noués serré. Yeux gris qui soutiennent le regard trop longtemps. Une ride verticale entre les sourcils, creusée depuis un an.</p>
<p><strong>Voix :</strong> nette et ferme, habituée au commandement, avec la diction claire de quelqu'un qui donne des ordres qu'on ne doit pas faire répéter. Débit régulier, sans emphase. Depuis ce qu'elle a vu, elle s'interrompt parfois au milieu d'une phrase, regarde ailleurs, puis reprend exactement où elle s'était arrêtée.</p>
<p><strong>Rôle :</strong> <strong>Radius Ignis</strong> du <strong>Soleil Pourpre</strong>, ancienne capitaine de la Porte Pourpre. Connue pour sa droiture absolue. Classe : paladine déchue.</p>
<p><strong>Secret (MJ) :</strong> elle est hantée par ce qu'elle a vu du vrai visage du Roi.</p>
<p><strong>Capacités notables :</strong> Espadon du Serment Rouge +1, infligeant des brûlures éthériques.</p>
`.trim(),
  },
  {
    nom: 'Lirot',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 26 ans. Maigre et dégingandé, les épaules inégales à force de porter la canne de verrier du même côté.</p>
<p>Visage jeune et creusé, joues rougies par la chaleur du four. Cheveux châtains collés au front. Yeux marron fatigués, sourcils et cils roussis. Doigts tachés de suie, brûlures anciennes sur le dos des mains.</p>
<p><strong>Voix :</strong> voilée et un peu sifflante, abîmée par des années d'air chaud ; il tousse en fin de phrase. Débit timide et rapide, presque marmonné, comme s'il craignait de faire perdre du temps. S'excuse avant de servir, après avoir servi, et parfois entre les deux.</p>
<p><strong>Rôle :</strong> souffleur de verre et serveur.</p>
`.trim(),
  },
  {
    nom: 'Lord Calen Palhindile',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 62 ans, époux de <strong>Serenya</strong>. Grand mais légèrement voûté, comme plié par des décennies passées sur des parchemins. Porte presque toujours un livre ou un rouleau sous le bras. Vêtements riches dans leurs matières mais usés aux coudes et aux poignets par l'érudition quotidienne.</p>
<p>Cheveux blancs fins et doux, barbe soignée d'un blanc immaculé. Yeux bleus fanés mais curieux, lumineux dès qu'on évoque l'histoire ou la religion. Visage ridé avec bonhomie — rides de sourire plus que de souci.</p>
<p><strong>Voix :</strong> chaude et légèrement chevrotante, celle d'un conteur qui a longtemps enseigné. Débit digressif : il part sur une parenthèse historique au milieu d'une réponse et revient dix minutes plus tard, ravi, sans que personne ait pu l'arrêter. Cite toujours ses sources, y compris dans une conversation de couloir.</p>
<p><strong>Rôle :</strong> ancien ambassadeur à <strong>Huriya</strong> et au <strong>Saint-Empire</strong>. Érudit passionné d'histoire des religions.</p>
<p><strong>Secret (MJ) :</strong> il détient une correspondance chiffrée de son temps d'ambassadeur, prouvant qu'un traité d'Alagir a été monnayé — un levier qu'il refuse d'utiliser.</p>
<p><strong>Capacités notables :</strong> CA 13 · PV 42 · Bâton +4. Religion +6, Perspicacité +5, Persuasion +5. Savoir perdu (avantage en Histoire sur les traces de cultes anciens).</p>
`.trim(),
  },
  {
    nom: 'Lorian Cilovard',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 32 ans, fils aîné <strong>Cilovard</strong>. Taille moyenne, allure de voyageur aisé — ni trop mince ni trop épais, corps habitué aux traversées maritimes. Toujours soigné sans être ostentatoire ; bague de cachet gravée aux armoiries Cilovard à la main droite.</p>
<p>Cheveux bruns ondulés coiffés vers l'arrière, court bouc bien taillé qui vieillit légèrement son visage. Yeux noisette expressifs et rapides à évaluer son interlocuteur.</p>
<p><strong>Voix :</strong> assurée et agréable, un baryton de salon qu'il module selon l'interlocuteur — plus rond avec les marchands, plus sec avec les capitaines. Débit fluide et rapide, avec une habitude de reformuler la position adverse avant de la démonter. Glisse des mots de gandorenne et de dolomicien pour signaler qu'il a voyagé.</p>
<p><strong>Rôle :</strong> responsable des échanges extérieurs et du commerce maritime. Ambitieux, érudit en diplomatie économique.</p>
<p><strong>Secret (MJ) :</strong> après un traité avec <strong>Gandorènne</strong>, il a vu un reflet rouge dans l'encrier — manifestation du Roi observant la transaction.</p>
<p><strong>Capacités notables :</strong> CA 14 · PV 46 · Dague +4. Persuasion +6, Investigation +5, Intimidation +5.</p>
`.trim(),
  },
  {
    nom: 'Lorn',
    sexe: 'MAN',
    desc: `
<p>Homme humain, 48 ans. Colosse manchot — le bras droit sectionné au-dessus du coude, la manche repliée et épinglée avec soin. Épaules et nuque encore massives malgré les années de comptoir.</p>
<p>Visage large et fermé, nez épaté, crâne tondu. Barbe grise de trois jours. Yeux marron sans expression particulière. Plusieurs cicatrices blanches sur le cuir chevelu.</p>
<p><strong>Voix :</strong> grave et rare, elle sort rarement au-dessus du grognement ; il répond par monosyllabes et laisse les clients combler le vide. Débit lent, avec un temps d'arrêt avant chaque réponse, comme s'il vérifiait la question. Ne dit jamais « non » — il pose simplement le chiffon et regarde.</p>
<p><strong>Rôle :</strong> ex-soldat <strong>Tovalis</strong>, tient le comptoir de <strong>La Roue de Secours</strong>. Le nettoie d'une main, avec une rigueur maniaque.</p>
`.trim(),
  },
  {
    nom: 'Mada Lure',
    sexe: 'WOMAN',
    desc: `
<p>Femme humaine, 79 ans, vieille et ridée. Petite et tassée, le dos rond ; elle se déplace lentement et s'assoit dès qu'elle le peut, à la meilleure table de la salle.</p>
<p>Visage profondément ridé, joues creuses, bouche sans lèvres. Cheveux blancs rares, ramassés sous un fichu sombre. Yeux noirs enfoncés, d'une vivacité qui dément le reste. Une <strong>clé pendue au cou</strong>, qu'elle ne quitte jamais.</p>
<p><strong>Voix :</strong> éraillée et basse, avec un chuintement sur les sifflantes — il faut se pencher pour l'entendre, et c'est très exactement le but. Débit très lent, entrecoupé de pauses qu'elle laisse durer pour voir qui les comblera. Ne pose jamais de question directe : elle énonce un fait à moitié, et attend qu'on le complète.</p>
<p><strong>Rôle :</strong> entremetteuse entre syndicalistes, prêtres de <strong>Tal Odius</strong> et espions, à <strong>L'Auberge du Murmure</strong>.</p>
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
