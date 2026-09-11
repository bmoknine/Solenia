import { PrismaClient, type Breed, type Sex, type Membership } from '@prisma/client';

const prisma = new PrismaClient();

const ALAGIR = '6d39b2bc-6488-4763-9643-b57e9af59c03';
const CINQUIEME_ROUE = '99a96ae0-ce96-4898-9015-4b7cfddb44b0';
const CELL_ID = 'b4c8c6a8-d147-4f42-b12b-74adc397469f'; // « Le Conseil d'Acier » (cellule d'Alagir)
const INTL_ID = '892a08f5'; // Conseil d'Acier international (préfixe)
const CELL_NAME = "Conseil d'Acier — Cellule d'Alagir";

const PLACES = {
  bastion: 'e445a4a2-d1e3-4547-8dd7-4c9faf3e7463', // Bastion Gris
  marteau: 'd8ee7264-dfaa-4851-81dc-d94e529ad548', // Le Marteau Courtois
  entrepots: 'c79aa2b9-2f0a-4aca-a7a2-e8f3a301c6d7', // Entrepôts du Pourpre
  hangar: 'c7279c93-060a-4b73-906a-4353b2ce1f15', // Hangar du Poids
  loutre: '57210a91-4e46-40ee-9e76-a6abd07189b1', // La Loutre SAOUL
};

const CELL_DESC = `
<p>Cellule d'Alagir du <strong>Conseil d'Acier</strong>, organisation criminelle internationale. Siège : le <strong>Bastion Gris</strong>, forteresse souterraine sous la Cinquième Roue, qu'on rejoint par un faux mur des Entrepôts du Pourpre.</p>
<p>Credo : « <em>La pression forge les forts.</em> » Chaque nuit, les membres frappent trois fois un mur d'acier — « par la pression, la forme et le silence ».</p>
<p><strong>Trois domaines.</strong> Les <strong>dettes</strong> : le Grand Registre tient les créances des Maisons Cilovard, Tovalis et Palhindile. Les <strong>marchés illégaux</strong> : armes de contrebande sorties du Marteau Courtois, convois nocturnes passant par les Entrepôts du Pourpre. Les <strong>mercenaires</strong> : les « Marteaux », une trentaine d'hommes cantonnés au Hangar du Poids.</p>
<p><strong>Emprise.</strong> La Cinquième Roue lui appartient de fait, et sa collecte de « contribution à la tranquillité » descend jusqu'aux Bas-Quais — La Loutre SAOUL comprise.</p>
<p><strong>Rivalités.</strong> Le Syndicat d'Alagir sur les marchés, l'Œil Pourpre sur les convois, et une hostilité froide avec le Soleil Pourpre — dont une partie des Marteaux a été chassée.</p>
`.trim();

type Fig = {
  name: string;
  breed: Breed;
  sex: Sex;
  membership: Membership;
  fp: string;
  pv: number;
  ca: number;
  stats: [number, number, number, number, number, number]; // STR DEX CON INT WIS CHA
  placeId?: string;
  description: string;
};

const FIGURES: Fig[] = [
  {
    name: 'Rany Mullimax',
    breed: 'HUMAIN', sex: 'MAN', membership: 'CRIMINALITE',
    fp: '7', pv: 95, ca: 16, stats: [15, 12, 16, 16, 15, 17],
    placeId: PLACES.bastion,
    description: `
<p>Homme humain, 57 ans. Massif sans être gras, épaules de forgeron sous une redingote grise impeccable ; il se déplace lentement, comme s'il pesait chaque pas.</p>
<p>Visage large et grêlé, mâchoire lourde, cheveux gris fer coupés ras. Yeux gris pâle qui ne cillent presque jamais. Voix basse et posée, qui ne monte jamais — c'est le silence qui suit qui fait peur.</p>
<p>Porte au pouce un anneau d'acier brut qu'il fait tourner en réfléchissant. Ne tend jamais la main le premier. Frappe trois fois du poing sur la table pour clore une discussion.</p>
<p><strong>Rôle :</strong> chef de la cellule d'Alagir, dit « <strong>le Magistrat de Fer</strong> » parce qu'il rend ses arbitrages comme des sentences. Il ne négocie pas : il fixe des échéances. Dettes, marchés illégaux et mercenaires du quartier passent par lui.</p>
<p><strong>Secret (MJ) :</strong> il a racheté sur ses fonds propres une part des créances Tovalis, à l'insu du Conseil international. Si l'affaire s'évente, c'est sa tête qui roule avant celle des Maisons.</p>
`.trim(),
  },
  {
    name: 'Tessa Kaorn',
    breed: 'GNOME', sex: 'WOMAN', membership: 'CRIMINALITE',
    fp: '5', pv: 42, ca: 13, stats: [8, 16, 12, 16, 15, 13],
    placeId: PLACES.bastion,
    description: `
<p>Femme gnome, 74 ans. Menue et sèche, elle se tient très droite sur des chaises toujours trop grandes ; gestes économes, jamais un mouvement de trop.</p>
<p>Cheveux blanc-gris tirés en chignon serré, visage étroit aux pommettes hautes, yeux noirs sans éclat. Un sourire bref, strictement professionnel.</p>
<p>Tient un carnet minuscule qu'elle referme d'un claquement sec. Emploie toujours le conditionnel pour annoncer une mauvaise nouvelle.</p>
<p><strong>Rôle :</strong> coordinatrice des opérations de la cellule. Spécialiste des « réorganisations » : elle décide qui reste et qui disparaît. Calme, méthodique, jamais émotionnelle.</p>
<p><strong>Secret (MJ) :</strong> elle tient un double registre des « réorganisations » — noms, commanditaires, montants. C'est sa seule assurance-vie face à Rany Mullimax.</p>
`.trim(),
  },
  {
    name: 'Wilherm Cadenet',
    breed: 'HUMAIN', sex: 'MAN', membership: 'CRIMINALITE',
    fp: '2', pv: 38, ca: 12, stats: [8, 10, 11, 18, 16, 11],
    placeId: PLACES.bastion,
    description: `
<p>Homme humain, 63 ans. Petit et voûté, presque frêle, engoncé dans des lainages superposés — il a toujours froid dans les caves du Bastion Gris.</p>
<p>Crâne dégarni tacheté, favoris blancs, lunettes à double foyer cerclées d'acier. Yeux myopes qui se plissent pour tout, doigts jaunis d'encre.</p>
<p>N'a pas quitté le Bastion Gris depuis onze ans. Récite les montants de mémoire avant de vérifier, et ne se trompe pas. Appelle chaque débiteur par son numéro de folio, jamais par son nom.</p>
<p><strong>Rôle :</strong> gardien du <strong>Grand Registre</strong>, où sont consignées toutes les créances du Conseil sur Alagir. Les trois grandes Maisons y figurent : <strong>Tovalis</strong> la plus lourde (avances sur l'exploitation des carrières), <strong>Cilovard</strong> une dette moyenne contractée pour couvrir un revers maritime, <strong>Palhindile</strong> la plus petite mais la plus honteuse — empruntée en secret par un proche de la Chancelière.</p>
<p><strong>Secret (MJ) :</strong> deux folios ont été arrachés du Registre. Il sait qui les a pris et se tait — parce que cette personne paie pour son silence.</p>
`.trim(),
  },
  {
    name: 'Lysanne Orfe',
    breed: 'HUMAIN', sex: 'WOMAN', membership: 'CRIMINALITE',
    fp: '3', pv: 45, ca: 14, stats: [10, 15, 12, 15, 14, 18],
    description: `
<p>Femme humaine, 36 ans. Grande, silhouette élancée tenue par un maintien de danseuse ; elle traverse une salle sans jamais bousculer personne.</p>
<p>Cheveux noirs relevés en couronne, teint clair, yeux noisette très mobiles qui inventorient une pièce en une seule passe. Sourire aimable, parfaitement calibré.</p>
<p>Porte des gants gris perle qu'elle n'ôte jamais, même à table. Offre systématiquement un compliment avant une mauvaise nouvelle. Ne boit que de l'eau.</p>
<p><strong>Rôle :</strong> le visage présentable du Conseil. Officiellement « courtière en obligations », elle circule dans les salons, les bals et les conseils d'administration. C'est elle qui rappelle les échéances aux Maisons — avec des mots si polis que la menace n'est jamais prononcée. <strong>Présente au Bal Tovalis (Soir 1).</strong></p>
<p><strong>Secret (MJ) :</strong> elle constitue son propre dossier sur Rany Mullimax. Elle ne veut pas sa place : elle veut pouvoir le vendre au Conseil international le jour où il déraillera.</p>
`.trim(),
  },
  {
    name: 'Odon Pince',
    breed: 'DEMI_ORC', sex: 'MAN', membership: 'CRIMINALITE',
    fp: '3', pv: 60, ca: 15, stats: [17, 12, 16, 10, 12, 12],
    placeId: PLACES.loutre,
    description: `
<p>Homme demi-orc, 41 ans. Trapu et large, cou épais, mains disproportionnées ; il occupe un pas de porte sans avoir besoin de le bloquer.</p>
<p>Crâne rasé, arcade fendue mal recousue, petites défenses inférieures limées à ras. Yeux marron étonnamment doux, qui donnent envie de le croire.</p>
<p>Frappe trois fois le comptoir avant de parler — d'où son surnom de « <strong>Trois-Coups</strong> ». S'excuse toujours du dérangement. Caresse le bois des meubles comme s'il les évaluait.</p>
<p><strong>Rôle :</strong> collecteur des Bas-Quais. C'est lui qui vient à <strong>La Loutre SAOUL</strong> réclamer la « contribution à la tranquillité » : <strong>30 po par mois</strong>, doublée au deuxième retard, et « on ne répond plus de rien » au troisième. Il prévient une fois. Une seule.</p>
<p><strong>Secret (MJ) :</strong> il déteste ce travail et arrondit les échéances à la baisse quand personne ne vérifie. Un établissement qui le traite en homme plutôt qu'en menace peut en faire un informateur — mais Tessa Kaorn le soupçonne déjà.</p>
`.trim(),
  },
  {
    name: 'Hulda Brasefer',
    breed: 'NAIN', sex: 'WOMAN', membership: 'CRIMINALITE',
    fp: '4', pv: 75, ca: 16, stats: [18, 11, 17, 12, 14, 10],
    placeId: PLACES.marteau,
    description: `
<p>Femme naine, 118 ans. Charpentée, avant-bras énormes constellés de brûlures anciennes ; elle se tient jambes écartées, comme prête à encaisser un coup.</p>
<p>Visage rougeaud et carré, sourcils roux broussailleux, tresse grise nouée de fil d'acier. Un œil laiteux, brûlé par une projection de métal.</p>
<p>Rit fort et souvent, y compris aux mauvaises nouvelles. Goûte le métal du bout de la langue pour en juger. Refuse de forger après minuit, et ne s'en explique jamais.</p>
<p><strong>Rôle :</strong> tient la forge du <strong>Marteau Courtois</strong>. Officiellement outillage et ferrures ; en pratique, armes de contrebande et pièces impossibles à tracer. Gardienne du marteau sacré — trois coups sur l'enclume lient un serment pour trente jours.</p>
<p><strong>Secret (MJ) :</strong> c'est elle qui garde le coffre d'« armes vivantes » dont bruisse le quartier. Elle refuse de les vendre : elle les a forgées, et elle sait ce qu'elles réclament en retour.</p>
`.trim(),
  },
  {
    name: 'Capitaine Sorne Vask',
    breed: 'DEMI_ORC', sex: 'MAN', membership: 'MILITAIRE',
    fp: '6', pv: 105, ca: 17, stats: [18, 14, 17, 12, 13, 13],
    placeId: PLACES.hangar,
    description: `
<p>Homme demi-orc, 44 ans. Sec et nerveux pour un demi-orc, tout en tendons ; démarche de soldat, épaules basses.</p>
<p>Peau gris-vert, mâchoire longue, cheveux noirs attachés court. Une cicatrice de garrot lui barre la gorge — il parle bas, la voix raclée.</p>
<p>Compte à voix basse avant d'agir. Entretient ses armes en public, comme une démonstration. Ne s'assoit jamais dos à une porte.</p>
<p><strong>Rôle :</strong> capitaine des « <strong>Marteaux</strong> », le bras armé de la cellule — une trentaine d'hommes cantonnés au <strong>Hangar du Poids</strong>. Escortes, intimidations, et tout ce que le Soleil Pourpre n'a pas le droit de faire.</p>
<p><strong>Secret (MJ) :</strong> il a servi dans le Soleil Pourpre et en a été chassé ; la moitié de ses hommes aussi. Il ne cherche pas la guerre avec la garde — il attend l'occasion de l'humilier.</p>
`.trim(),
  },
  {
    name: 'Orane Ferrand',
    breed: 'HUMAIN', sex: 'WOMAN', membership: 'CRIMINALITE',
    fp: '3', pv: 48, ca: 14, stats: [11, 16, 13, 14, 13, 13],
    placeId: PLACES.entrepots,
    description: `
<p>Femme humaine, 32 ans. Mince et rapide, toujours en tenue de route ; elle se déplace comme quelqu'un qui a un chariot à rattraper.</p>
<p>Cheveux châtains coupés à la nuque, visage anguleux et hâlé, yeux verts cernés d'une fatigue chronique. Parle vite, coupe la parole sans s'en apercevoir.</p>
<p>Mâche des graines de fenouil pour tenir éveillée. Note tout sur son avant-bras au crayon gras. Connaît par cœur les horaires des rondes.</p>
<p><strong>Rôle :</strong> elle règle les convois nocturnes qui transitent par les <strong>Entrepôts du Pourpre</strong>. Le Conseil prend sa part sur tout ce qui bouge — y compris sur les « chargements » de la filière d'esclaves des Mastiggia.</p>
<p><strong>Secret (MJ) :</strong> elle vend en douce les horaires du Conseil à l'Œil Pourpre. Pas pour l'argent : l'Œil Pourpre tient son frère.</p>
`.trim(),
  },
];

const LOUTRE_MARKER = 'contribution à la tranquillité';
const LOUTRE_APPEND =
  "\n\nSous la coupe du Conseil d'Acier : Odon Pince « Trois-Coups » vient chaque mois réclamer la « contribution à la tranquillité » (30 po, doublée au deuxième retard).";

async function main() {
  const log: string[] = [];

  // ── Partie 1 — Structure ────────────────────────────────────────────
  const intl = await prisma.organisation.findFirst({ where: { id: { startsWith: INTL_ID } }, select: { id: true, name: true } });
  if (!intl) throw new Error('Conseil d\'Acier international introuvable.');

  await prisma.organisation.update({
    where: { id: CELL_ID },
    data: { name: CELL_NAME, description: CELL_DESC, organisationType: 'CELLULE', membership: 'CRIMINALITE', parentOrganisationId: intl.id },
  });
  log.push(`Cellule renommée « ${CELL_NAME} » et rattachée à « ${intl.name} ».`);

  // Syndicat et Œil Pourpre redeviennent des entités indépendantes
  const detached = await prisma.organisation.updateMany({
    where: { parentOrganisationId: intl.id, name: { in: ['Syndicat', 'Œil Pourpre'] } },
    data: { parentOrganisationId: null },
  });
  log.push(`Détachées du Conseil (entités propres) : ${detached.count}.`);

  // ── Partie 2 — Les figures ──────────────────────────────────────────
  for (const f of FIGURES) {
    const [STR, DEX, CON, INT, WIS, CHA] = f.stats;
    const data = {
      description: f.description,
      breed: f.breed, sex: f.sex, membership: f.membership,
      fp: f.fp, pv: f.pv, ca: f.ca,
      STR, DEX, CON, INT, WIS, CHA,
      cityId: ALAGIR,
      districtId: f.placeId === PLACES.loutre ? undefined : CINQUIEME_ROUE,
      placeId: f.placeId ?? null,
      showOnMap: false,
    };

    const existing = await prisma.personOfInterest.findFirst({ where: { name: f.name }, select: { id: true } });
    let personId: string;
    if (existing) {
      await prisma.personOfInterest.update({ where: { id: existing.id }, data });
      personId = existing.id;
      log.push(`  ↻ ${f.name} (mis à jour)`);
    } else {
      const created = await prisma.personOfInterest.create({ data: { name: f.name, ...data }, select: { id: true } });
      personId = created.id;
      log.push(`  + ${f.name} (créé)`);
    }

    const link = await prisma.organisationMember.findFirst({ where: { organisationId: CELL_ID, personId } });
    if (!link) await prisma.organisationMember.create({ data: { organisationId: CELL_ID, personId } });
  }

  // ── Partie 3 — Emprise (lieux) ──────────────────────────────────────
  for (const placeId of [PLACES.hangar, PLACES.loutre]) {
    const exists = await prisma.organisationPlace.findFirst({ where: { organisationId: CELL_ID, placeId } });
    if (!exists) await prisma.organisationPlace.create({ data: { organisationId: CELL_ID, placeId } });
  }
  const loutre = await prisma.place.findUnique({ where: { id: PLACES.loutre }, select: { description: true } });
  if (loutre && !(loutre.description ?? '').includes(LOUTRE_MARKER)) {
    await prisma.place.update({ where: { id: PLACES.loutre }, data: { description: (loutre.description ?? '') + LOUTRE_APPEND } });
    log.push('La Loutre SAOUL : mention de la taxe de protection ajoutée.');
  }
  const nbPlaces = await prisma.organisationPlace.count({ where: { organisationId: CELL_ID } });
  log.push(`Lieux rattachés à la cellule : ${nbPlaces}.`);

  const nbMembres = await prisma.organisationMember.count({ where: { organisationId: CELL_ID } });
  log.push(`Membres de la cellule : ${nbMembres}.`);

  console.log('\n===== RÉSUMÉ =====');
  log.forEach((l) => console.log(l));
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
