import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const FRETIN_ORG_ID = '291ad184-e668-4377-ae5e-12163dad8604';
const MASTIGGIA_ORG_ID = 'fe58dae6-3224-4b2e-8b45-4cd12cbbd83d';
const OEIL_POURPRE_ORG_ID = '26e34441-4c27-4be0-948c-342e42221c41';
const ALAGIR_CITY_ID = '6d39b2bc-6488-4763-9643-b57e9af59c03';
const MONGAR_CITY_ID = 'ce3fb962-bb73-47f4-8e12-656c0af3f4a1';
const BRYNN_ID = 'f15655ae-460d-43a7-b970-147cae70e406';
const DARN_ID = '7a98f51c-2382-4a3c-9972-d28bd933e25c';
const GESOUTO_ID = 'fa0063c9-958b-461c-b5ee-42fb880375bc';
const BAL_TOVALIS_LORE_ID = '4080bdec-9d9f-4db6-860e-2dadd833265e';

async function main() {
  // ───────── 1) Renommage de la bande : Les Rats des Fosses -> Le Fretin ─────────
  const fretinDesc = `<p>Petite bande de passeurs et contrebandiers opérant depuis les égouts d'Alagir, au niveau de la Porte Basse — repaire dans une alcôve désaffectée accessible par une grille descellée derrière le marché aux bestiaux. Une douzaine de membres à la petite semaine : poudre de marbre, alcool de contrebande, armes non déclarées. « Ni idéologie ni allégeance : juste de l'or et la survie. »</p>
<p>Depuis peu, ils ont décroché un « gros contrat » qui les dépasse : servir de passeurs à un <strong>fret humain</strong> pour le compte des <strong>Mastiggia</strong> — des esclaves acheminés par les égouts jusqu'à un point de transfert, revendus à une cité vampire souterraine. Le chef, <strong>Sesk Orlo</strong>, y a vu la fortune ; la bande, elle, ne mesure pas dans quoi elle a mis les pieds. C'est ce contrat qui a causé la perte de <strong>Brynn Fer-Vallée</strong>, bouclée pour avoir compris la nature de la cargaison.</p>`;
  await prisma.organisation.update({ where: { id: FRETIN_ORG_ID }, data: { name: 'Le Fretin', description: fretinDesc } });
  console.log('Org renommée -> Le Fretin');

  // ───────── 2) Correction des références "Rats des Fosses" ─────────
  const brynn = await prisma.personOfInterest.findUniqueOrThrow({ where: { id: BRYNN_ID }, select: { description: true } });
  const brynnNew = brynn.description!
    .replaceAll('aux <strong>Rats des Fosses</strong>', 'au <strong>Fretin</strong>')
    .replaceAll('aux Rats des Fosses', 'au Fretin')
    .replaceAll('Rats des Fosses', 'Fretin');
  await prisma.personOfInterest.update({ where: { id: BRYNN_ID }, data: { description: brynnNew } });
  console.log('Fiche Brynn mise à jour');

  const bal = await prisma.lore.findUniqueOrThrow({ where: { id: BAL_TOVALIS_LORE_ID }, select: { content: true } });
  await prisma.lore.update({ where: { id: BAL_TOVALIS_LORE_ID }, data: { content: bal.content.replaceAll('aux Rats des Fosses', 'au Fretin').replaceAll('Rats des Fosses', 'Fretin') } });
  console.log('Lore Bal Tovalis mise à jour');

  // ───────── 3) Création des PNJ ─────────
  const ilaria = await prisma.personOfInterest.create({
    data: {
      name: 'Donna Ilaria Mastiggia',
      breed: 'HUMAIN', sex: 'WOMAN', membership: 'MARCHAND',
      STR: 9, DEX: 11, CON: 10, INT: 15, WIS: 14, CHA: 17,
      cityId: ALAGIR_CITY_ID, showOnMap: false, isForDM: false,
      description: `Matriarche du comptoir Mastiggia d'Alagir (Larmes d'Ambre), aristocrate dolomicienne d'une cinquantaine d'années à l'élégance glaçante. Cheveux noirs striés d'argent pris dans une résille de perles d'ambre, robes de velours sombre, éventail d'os gravé. Voix douce, sourire commercial permanent.\n\nElle est le visage respectable de la maison : elle gère la traite d'esclaves *légale* (autorisée à Alagir, dans les Dolomites et en Gandorenne), connaît chaque clause de la loi et ne se salit jamais les mains. Les « exportations spéciales » — la revente aux vampires — elle préfère les ignorer officiellement et les laisse à Vittore. Membre du clan Izotzargi, ligne « Chaînes du Sang ».`,
    },
  });

  const vittore = await prisma.personOfInterest.create({
    data: {
      name: 'Vittore Mastiggia',
      breed: 'HUMAIN', sex: 'MAN', membership: 'CRIMINALITE',
      STR: 10, DEX: 14, CON: 12, INT: 16, WIS: 12, CHA: 16,
      pv: 27, ca: 13, fp: '1',
      cityId: ALAGIR_CITY_ID, showOnMap: false, isForDM: false,
      description: `Cadet ambitieux de la famille Mastiggia, la trentaine, mince et tiré à quatre épingles. Cheveux noirs gominés, fine moustache, sourire de marchand qui n'atteint jamais les yeux gris. Bague-sceau du clan Izotzargi à une chaîne, gants toujours immaculés.\n\nC'est le cerveau de la combine : détourner discrètement des esclaves déjà « traités » par l'Œil Pourpre (la filière du Roi) pour les revendre à prix d'or à la cité vampire souterraine de Nharivum, sous Mongar. Se croit intouchable. Négocie toujours, ne se bat qu'acculé (rapière +4, 1d8+2). Secret dangereux : il vole la marchandise du Tyrannœil — s'il est exposé, le Roi l'écrasera avant les tribunaux.\n\nC'est lui, le représentant Mastiggia présent au point de transfert du Fretin.`,
    },
  });

  const sesk = await prisma.personOfInterest.create({
    data: {
      name: 'Sesk Orlo',
      breed: 'HUMAIN', sex: 'MAN', membership: 'CRIMINALITE',
      STR: 15, DEX: 16, CON: 14, INT: 14, WIS: 11, CHA: 14,
      pv: 65, ca: 15, fp: '2',
      cityId: ALAGIR_CITY_ID, showOnMap: false, isForDM: false,
      description: `Chef du Fretin. Homme sec et nerveux d'une quarantaine d'années, cheveux gras noués en catogan, cicatrices de couteau aux avant-bras, sourire de fouine à qui il manque deux dents. Sent l'égout et l'eau-de-vie.\n\nBeau-parleur : il a « adopté » Brynn Fer-Vallée en lui offrant une fausse famille, pour mieux l'utiliser comme passeuse — puis l'a bouclée quand elle a compris la nature du fret. Vénal, il a vendu son âme (et Brynn) pour le contrat Mastiggia ; lâche dès qu'on le domine.\n\n=== Bandit capitaine (FP 2) ===\nCA 15 · PV 65 · Init +3\nMultiattaque : 2 cimeterres (+5, 1d6+3 tranchant) + 1 dague (+5, 1d4+3).\nParade : +2 CA en réaction contre une attaque de mêlée qu'il voit venir.`,
    },
  });

  const emissaire = await prisma.personOfInterest.create({
    data: {
      name: 'Sélas Vharkorn',
      breed: null, sex: 'MAN', membership: 'CRIMINALITE',
      STR: 12, DEX: 15, CON: 12, INT: 16, WIS: 14, CHA: 18,
      cityId: MONGAR_CITY_ID, showOnMap: false, isForDM: false,
      description: `Émissaire de la cité vampire souterraine de Nharivum, creusée sous Mongar. Silhouette longue et pâle, peau translucide veinée de gris, yeux d'un rouge éteint, vêtements d'un autre siècle impeccablement tenus. Voix douce et lente, odeur de terre froide.\n\nIl achète des « têtes » vivantes pour la Faim et les galeries sans soleil de Nharivum — cheptel (réserve de sang) et main-d'œuvre. Diplomate glacial : il ne se bat pas, il marchande, et si l'affaire tourne mal il fuit pour prévenir les siens (une fuite réussie = la cité vampire se met sur ses gardes). C'est « la troisième personne » présente au point de transfert, escorté d'un Vampirien.`,
    },
  });

  const vampirien = await prisma.personOfInterest.create({
    data: {
      name: 'Vampirien — escorte de Nharivum',
      breed: null, sex: null, membership: null,
      STR: 16, DEX: 16, CON: 16, INT: 11, WIS: 10, CHA: 12,
      pv: 82, ca: 15, fp: '5',
      cityId: MONGAR_CITY_ID, showOnMap: false, isForDM: false,
      description: `Spawn de vampire servant d'escorte de chasse à l'émissaire de Nharivum. Visage émacié, crocs proéminents, ongles noircis en serres, peau grise tendue sur les os ; se déplace par saccades trop rapides.\n\n=== Vampirien / spawn de vampire (FP 5) ===\nCA 15 · PV 82 · Vitesse 9 m, escalade d'araignée (surfaces et plafonds).\nMultiattaque : 2 attaques (griffes ou morsure).\nGriffes : +6, 2d4+3 tranchant ; au lieu des dégâts, agrippe (évasion DD 13).\nMorsure (cible agrippée, entravée ou consentante) : +6, 1d6+3 perforant + 3d6 nécrotique ; PV max de la cible réduits d'autant, le vampirien récupère ces PV.\nRégénération : 10 PV au début de son tour s'il a au moins 1 PV et n'a pas subi de dégâts radiants ni d'eau courante au tour précédent.\nRésistances : nécrotique ; contondant/perforant/tranchant des armes non magiques.\nFaiblesses vampiriques : lumière du soleil (dégâts + désavantage aux attaques et jets de caractéristique en plein jour), dégâts radiants et eau courante bloquent la régénération ; un pieu dans le cœur d'un vampirien à terre le tue.`,
    },
  });

  console.log('PNJ créés :', { ilaria: ilaria.id, vittore: vittore.id, sesk: sesk.id, emissaire: emissaire.id, vampirien: vampirien.id });

  // ───────── 4) Rattachements aux organisations ─────────
  await prisma.organisationMember.createMany({
    data: [
      { organisationId: MASTIGGIA_ORG_ID, personId: ilaria.id },
      { organisationId: MASTIGGIA_ORG_ID, personId: vittore.id },
      { organisationId: MASTIGGIA_ORG_ID, personId: GESOUTO_ID }, // rattache Gesouto s'il ne l'est pas déjà
      { organisationId: FRETIN_ORG_ID, personId: sesk.id },
    ],
    skipDuplicates: true,
  });
  console.log('Rattachements orgs faits');

  // ───────── 5) Quête (onglet Campagne) ─────────
  await prisma.quest.create({
    data: {
      title: 'Le Fretin — libérer Brynn Fer-Vallée',
      description:
        "Darn Fer-Vallée supplie les PJ de récupérer sa sœur Brynn, retenue par sa propre bande, le Fretin, dans les égouts de la Porte Basse (grille derrière le marché aux bestiaux). Il ignore pourquoi.",
      status: 'A_FAIRE',
      notes:
        "Sur place, les PJ découvrent la vérité : le Fretin sert de passeur aux Mastiggia pour un trafic d'esclaves revendus à une cité vampire souterraine (Nharivum, sous Mongar). Ils tombent sur une transaction à trois — Fretin + Mastiggia (Vittore) + émissaire vampire (Sélas Vharkorn) et son Vampirien. Combat final : Vampirien FP 5 x1, Bandit capitaine (Sesk Orlo) FP 2 x1, Malfrat FP 1/2 x6. Twist : une partie du clan Ezbehar a été déportée par ce circuit à Nharivum comme nourriture et main-d'œuvre. Les Mastiggia détournent des esclaves de l'Œil Pourpre — secret explosif contre le Roi.",
      order: 4,
    },
  });
  console.log('Quête créée');

  // ───────── 6) Lore récap (MJ) ─────────
  const loreContent = `
<p><em>Side-quest — pont entre la pègre de rue et l'intrigue Mastiggia / esclavage. Peut se jouer avant ou en parallèle de la Fête de la Fondation.</em></p>

<h3>Accroche</h3>
<p><strong>Darn Fer-Vallée</strong> vient trouver les PJ, blême : sa sœur <strong>Brynn</strong> n'est pas rentrée, retenue « en bas » par sa propre bande, <strong>le Fretin</strong>. Il croit à une dette ou une punition de contrebande — il ignore la vérité. Il ne peut pas y aller (garde Tovalis, trop identifiable, trop à cran) et confie l'extraction aux PJ : grille descellée derrière le marché aux bestiaux, Porte Basse.</p>

<h3>La vérité (découverte sur place)</h3>
<p>Le Fretin a décroché un « gros contrat » : passer par les égouts un <strong>fret humain</strong> pour les <strong>Mastiggia</strong>. Brynn a compris que les caisses contenaient des gens ; on l'a bouclée le temps que « le client décide » — la faire taire, ou l'ajouter à la cargaison. Sa captivité et la marchandise sont le même secret.</p>

<h3>La combine Mastiggia</h3>
<p>Les Mastiggia sont des marchands d'esclaves <strong>légaux</strong> (la traite est autorisée à Alagir, dans les Dolomites et en Gandorenne) : les prendre à vendre des esclaves n'est pas un crime. Leur vraie combine, elle, est illégale et explosive : <strong>Vittore Mastiggia</strong> détourne des esclaves déjà « traités » par l'<strong>Œil Pourpre</strong> (la filière du Roi) et les revend à prix d'or à une <strong>cité vampire souterraine, Nharivum, sous Mongar</strong>, comme nourriture et main-d'œuvre.</p>
<p>Ce qui est réellement compromettant : vendre des gens à des vampires comme bétail ; et surtout <strong>voler la marchandise de l'Œil Pourpre</strong> — les Mastiggia trahissent secrètement le Tyrannœil.</p>

<h3>Twist — le clan Ezbehar</h3>
<p>Une partie du <strong>clan Ezbehar</strong> a été déportée par ce circuit jusqu'à Nharivum : les uns comme cheptel (réserve de sang), les autres comme main-d'œuvre dans les galeries sans soleil. Le « membre du clan Ezbehar » exhibé au grand jour par les Mastiggia n'est que la vitrine ; le gros du clan a disparu sous terre. Accroche vers un futur arc « descendre à Mongar / cité vampire ».</p>

<h3>La transaction à trois (scène pivot)</h3>
<p>Les PJ tombent sur un échange tripartite en cours dans la salle du fond du repaire :</p>
<ul>
<li><strong>Le Fretin</strong> — le passeur (Sesk Orlo + hommes de main).</li>
<li><strong>Les Mastiggia</strong> — Vittore, qui vend et empoche.</li>
<li><strong>L'acheteur vampire</strong> — Sélas Vharkorn, émissaire de Nharivum, escorté d'un Vampirien qui inspecte le « cheptel ».</li>
</ul>

<h3>Combat final</h3>
<ul>
<li><strong>Vampirien</strong> (FP 5) x1 — l'escorte, vraie menace. Faiblesse : soleil / dégâts radiants / eau courante (bloquent la régénération).</li>
<li><strong>Bandit capitaine</strong> (FP 2) x1 — Sesk Orlo, chef du Fretin.</li>
<li><strong>Malfrat</strong> (FP 1/2) x6 — hommes de main (peuvent fuir/se rendre si Sesk tombe).</li>
</ul>
<p><strong>Vittore ne se bat pas</strong> : il négocie (« marchandise légale dans les Dolomites, vous n'avez aucune juridiction ») ou s'éclipse — à rattraper = preuve vivante. <strong>Sélas fuit</strong> vers Mongar s'il le peut = Nharivum est prévenue.</p>

<h3>Enjeux d'exfiltration</h3>
<ul>
<li>Sortir le cheptel affaibli sans que l'émissaire file prévenir la cité vampire.</li>
<li>Émerger au grand jour attire le guet — et peut-être l'<strong>Œil Pourpre</strong>, qui reconnaîtrait « sa » marchandise détournée : les Mastiggia ne sont pas les seuls à ne pas vouloir de témoins.</li>
</ul>

<h3>Récompenses &amp; fils ouverts</h3>
<ul>
<li><strong>Preuves</strong> (registre de Vittore, jetons) : faire tomber les Mastiggia moralement (loi de Selianne / bal Palhindile), ou les balancer au Roi pour qu'il les écrase.</li>
<li><strong>Le clan Ezbehar &amp; Nharivum</strong> : lead vers Mongar et la cité vampire (arc futur).</li>
<li><strong>Brynn</strong> : de complice inconsciente à témoin à charge ; sa relation avec Darn se répare (ou pas).</li>
<li><strong>Sésk / Vittore / Sélas</strong> capturés = mines d'infos ; échappés = adversaires rancuniers.</li>
</ul>
`.trim();

  const lore = await prisma.lore.create({
    data: {
      title: 'Side-quest — Le Fretin : libérer Brynn (trafic Mastiggia / vampires de Nharivum)',
      summary:
        "Sauvetage de Brynn dans les égouts du Fretin ; découverte du trafic d'esclaves Mastiggia revendus à la cité vampire de Nharivum (sous Mongar), et de la déportation du clan Ezbehar.",
      content: loreContent,
      tags: ['Alagir', 'Mastiggia', 'Le Fretin', 'Side-quest', 'Œil Pourpre'],
      isForDM: true,
      cities: { create: [{ cityId: ALAGIR_CITY_ID }, { cityId: MONGAR_CITY_ID }] },
      organisations: { create: [{ organisationId: FRETIN_ORG_ID }, { organisationId: MASTIGGIA_ORG_ID }, { organisationId: OEIL_POURPRE_ORG_ID }] },
      persons: {
        create: [BRYNN_ID, DARN_ID, GESOUTO_ID, ilaria.id, vittore.id, sesk.id, emissaire.id, vampirien.id].map((personId) => ({ personId })),
      },
    },
    include: { _count: { select: { persons: true, organisations: true, cities: true } } },
  });
  console.log('Lore récap créée :', lore.id, lore._count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
