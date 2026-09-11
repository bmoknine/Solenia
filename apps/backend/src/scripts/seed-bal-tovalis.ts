import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ALAGIR_CITY_ID = '6d39b2bc-6488-4763-9643-b57e9af59c03';
const PALAZZO_ID = '80349e8d-a048-4ded-9e45-2ed44d91915c';
const SALLE_BALLE_PALAZZO_ID = '3cce4b25-ed03-4615-9c07-009156e6c346';
const TOVALIS_ORG_ID = 'e6a42128-6fb4-4dea-bd11-2e34be47c513';

// PNJ nommés dans l'entrée (tous existants en BDD)
const PERSON_IDS = [
  'bcbef7a5-9109-44f2-a960-351ae35476db', // Daren Tovalis
  'b9a0b7ee-5455-466d-86c0-12363226b383', // Maerin Tovalis
  'd21e951b-fd8b-4c35-9e35-b3cddbbacd47', // Velric Tovalis
  '148f0452-aa0f-42b1-83a4-23cb30cd0e18', // Ordan Tovalis
  'bee18153-fe3c-4ffd-8e30-6e91eb31db5e', // Harl Denvar
  '7a98f51c-2382-4a3c-9972-d28bd933e25c', // Darn Fer-Vallée
  '80891668-5ad8-47a2-ae29-1e6d79be3160', // Cryta
  'f15655ae-460d-43a7-b970-147cae70e406', // Brynn Fer-Vallée
  'e785fe6c-da97-416c-95a6-4102791b6640', // Derrik Holmar
  '71a8a898-169f-435b-bf0a-8c3933c60a8d', // Jesa Tolvine
  '5f7057a8-b5e3-4947-b846-16f62dd43d39', // Bord Amac
  '35c5cd56-05ab-4d10-9489-bf09f3c1d9cc', // Tarn Vess
  '5e356a69-f3d4-4d03-8046-3f7f89c3512f', // Ismara Cilovard
  'e945a71d-9224-4272-8f9a-c6a775c22110', // Lorian Cilovard
  'd8e37ee1-afd3-4901-ba1b-74bc0479acd3', // Merr Luth
  '8c2eeaa5-9a2f-4d9f-8fa6-014fa6a70c0b', // Folduin Xyrlana
  '3404bc03-fafd-4973-a52a-7abe5cc45f7b', // Ilrune Ivelis
  '0622d84c-e5c2-4c64-bac5-74479683daee', // Lord Calen Palhindile
  'dbbe28fc-23e4-4d1a-af4c-0e15291ee906', // Nimra
  '41fa949e-a4a0-41b8-8c47-a3a6c080879f', // Selianne Palhindile
];

const CONTENT = `
<p><em>Soir 1 de la Fête de la Fondation — 1er jour du mois, an 907. Le Bal Tovalis, dit « le Bal de la Pierre ».</em></p>

<h3>Cadre</h3>
<p>Le <strong>Palazzo Khaz'Kanoon</strong> et sa grande salle de bal : un hall d'une cinquantaine de mètres en marbre blanc veiné de pourpre façon kintsugi, deux rangées de six piliers, d'immenses tentures et trois chandeliers gargantuesques aux lumières magiques. Au fond, un balcon surplombe une excavation illuminée plongeant vers les abîmes — la vitrine du pouvoir Tovalis. Faste robuste et un peu ostentatoire, vin fort, tambours et cordes graves. Chaleur en façade, rancœur juste dessous.</p>

<h3>Les hôtes — Maison Tovalis</h3>
<ul>
<li><strong>Daren Tovalis</strong> (patriarche, humain 54 ans) — large carrure, mains marquées par la pierre, ancien contremaître devenu politicien. Accueille avec de grandes claques dans le dos mais compte les absents du regard. <em>Détient un dossier secret prouvant que « le Roi n'est pas ce qu'il semble » ; de plus en plus nerveux à l'approche du bal royal.</em></li>
<li><strong>Maerin Tovalis</strong> (héritière, humaine 27 ans) — grande, athlétique, teint des quais, chignon pratique, une carte de navigation toujours en poche. <em>Vraie maîtresse de maison ce soir ; cherche des partenariats avec Huriya ; remarque les incohérences du Soleil Pourpre sans en connaître la cause.</em></li>
<li><strong>Velric Tovalis</strong> (cadet, humain 20 ans) — mince, cheveux noirs en bataille, bleu frais à la pommette, bijoux de pacotille. <em>S'ennuie, file vers les paris ; contacts dans La Braise, trafic de poudre de marbre.</em></li>
<li><strong>Ordan Tovalis</strong> (porte-parole, humain ~40 ans) — carrure de tailleur de pierre, mâchoire forte, voix qui porte. <em>Déjà en verve contre les Cilovard — c'est lui qui allumera la mèche du toast.</em></li>
</ul>

<h3>Entourage &amp; garde</h3>
<ul>
<li><strong>Harl Denvar</strong> (garde du corps de Daren, demi-orc 42 ans) — peau verte, deux crocs, bouc taillé, yeux jaunes, musculature zébrée de cicatrices. <em>Vétéran retraité du Soleil Pourpre : il espionne l'Ordre pour Daren, a entendu le salut codé « Rayon » et compile un dossier « Les Yeux dans la pierre » — accroche vers le fil du Roi et les yeux greffés.</em></li>
<li><strong>Darn Fer-Vallée</strong> (garde Tovalis, nain) — cheveux bruns, yeux verts. <em>Membre de la cellule de La Braise ; a mené les PJ à Daren. Escorte discrète du Palazzo.</em></li>
<li><strong>Cryta</strong> (garde, demi-orc ~40 ans) — peau verte, cicatrice diagonale, hache à la ceinture, réactivité redoutable sous des gestes lents. <em>En entraînement avec Harl, de faction près du balcon.</em></li>
<li><strong>Brynn Fer-Vallée</strong> (sœur de Darn, naine 28 ans) — trapue, visage ouvert, cicatrice en demi-lune sous l'œil droit. <em>Pas à sa place dans ce décor ; naïve, liée aux Rats des Fosses. Darn la surveille toute la soirée.</em></li>
</ul>

<h3>Contremaîtres Tovalis</h3>
<ul>
<li><strong>Derrik Holmar</strong> (carrières du Nord, roux ras, méfiant) — <em>loyal et superstitieux : jette du sel, touche le marbre avant de trinquer.</em></li>
<li><strong>Jesa Tolvine</strong> (taille de bloc, gris fer, cicatrice au menton) — <em>raide, exigeante, déteste le gaspillage du buffet.</em></li>
<li><strong>Bord Amac</strong> (fluvial, ventre généreux, teint rubicond) — <em>bon vivant corrompu par le Syndicat, fontaine à indiscrétions dès qu'il a bu.</em></li>
<li><strong>Tarn Vess</strong> (entrepôts, maigre, lunettes de cuivre) — <em>méthodique, tient les comptes officieux de la Maison.</em></li>
</ul>

<h3>Invités des autres Maisons</h3>
<ul>
<li><strong>Ismara Cilovard</strong> (cadette Cilovard, 25 ans) — tresse auburn, yeux verts cernés, une boucle en lapis-lazuli. <em>Envoyée en « geste d'apaisement », donc mal reçue. Sincère, conscience de sa famille ; ses pièces noircissent quand elle ment. Alliée potentielle (fil du Port).</em></li>
<li><strong>Lorian Cilovard</strong> (aîné Cilovard, 32 ans) — allure de voyageur aisé, bouc court, bague de cachet. <em>Responsable du commerce maritime : sa présence en pleine guerre du port est une provocation courtoise. A vu un reflet rouge dans son encrier — le Roi observant une transaction.</em></li>
<li><strong>Merr Luth</strong> (nain allié Cilovard, « Le Poids Juste ») — barbe tressée d'anneaux, tablier immaculé. <em>Marchand neutre respecté ; note tout au gramme près, dettes comprises. Bon canal de ragots comptables.</em></li>
<li><strong>Folduin Xyrlana</strong> (clerc de Zitris, usurier) — teint olivâtre, calotte noire, pourpoint or et noir. <em>Rôde entre les tables : plusieurs invités lui doivent de l'argent. Liens Cilovard et Palhindile.</em></li>
<li><strong>Ilrune Ivelis</strong> (délégué de Huriya, associé de Rigart &amp; fils) — vêtu à l'étrangère, anneaux à chaque doigt. <em>Invité par Maerin pour l'ouverture vers Huriya, mais associé à la maison de transport au cœur de l'affaire D'Illevas : sait peut-être des choses sur Eldric.</em></li>
<li><strong>Lord Calen Palhindile</strong> (époux de la Chancelière, 62 ans) — voûté par les parchemins, barbe blanche, toujours un livre sous le bras. <em>Ancien ambassadeur, érudit chaleureux et bavard.</em></li>
<li><strong>Nimra</strong> (elfe androgyne, La Verrière Fendue) — cheveux blanc argenté, yeux violet pâle changeants, bougeoir en main. <em>Observe plus qu'iel ne parle ; règle les bougies « selon les reflets » et manque de rien voir.</em></li>
<li><strong>Ékénon Tracx</strong> (capitaine et garde personnel du Roi, tieffelin) — peau rouge bordeaux, cornes noires en arc, armure de plates noire, cape pourpre aux armoiries royales. <em>Présent « par courtoisie royale » : en réalité les yeux du Château sur la fête. Sa présence refroidit les conversations.</em></li>
<li><strong>Selianne Palhindile</strong> (héritière Palhindile, demi-elfe 29 ans) — cheveux auburn cuivré, broche d'or, yeux noisette dorés, gants de soie. <em>Diplomate née, elle sonde les alliances avant sa loi et laisse filtrer son projet d'abolition.</em></li>
</ul>
<p><em>Absences remarquées :</em> Garran et Lady Velena Cilovard ne se sont pas déplacés — ils ont « envoyé les enfants ». Mépris, prudence ou calcul, chacun y lit ce qu'il veut.</p>

<h3>Figurants d'ambiance</h3>
<ul>
<li><strong>Le quatuor des Voix Graves</strong> — trois violes et un tambour de carrière, un air différent à chaque changement de plat.</li>
<li><strong>Maître Pellione, l'intendant tatillon</strong> — sec comme un cierge, il panique dès qu'un verre menace le marbre kintsugi.</li>
<li><strong>Dame Orselle Vant393, douairière à l'éventail</strong> — connaît généalogies et scandales de toute la salle, et les distribue trop haut.</li>
<li><strong>Le champion Bœuf-de-Pierre</strong> — ancien tailleur devenu colosse de fête, imbattable au bras-de-fer jusqu'au sixième verre.</li>
<li><strong>Frère Tomen, ascète de Tal Odius</strong> — venu bénir la salle, désapprouve le faste et refuse le vin.</li>
<li><strong>Les jumeaux Marlecq, nouveaux riches du fret</strong> — imitent tout le monde avec un temps de retard et rient trop fort.</li>
<li><strong>Sipha la Liseuse d'Ombres</strong> — diseuse de bonne aventure en alcôve, cartes de marbre poli, présages joliment vagues.</li>
<li><strong>Un marchand d'épices sandaranais</strong> — robes safran, parfum entêtant, « poudres du Sultanat » vendues à des nobles qui n'osent pas dire non.</li>
<li><strong>Le jeune cousin Elrec Tovalis</strong> — quinze ans, endimanché, renverse un plateau toutes les demi-heures.</li>
<li><strong>Un couple d'oiseaux-de-verre en cage</strong> — chanteurs exotiques dont la mélodie se calerait sur l'humeur de la salle.</li>
<li><strong>Maître Vossly, le sculpteur du portrait</strong> — artiste ombrageux en quête de commandes, commente son propre chef-d'œuvre.</li>
</ul>

<h3>Événements annexes (couleur, peu ou pas impactants)</h3>
<ol>
<li><strong>Le pari du balcon.</strong> Velric fait miser sur le temps que met une pièce à toucher un fond que personne n'entend jamais. Façon de tester les PJ.</li>
<li><strong>Bord Amac, trop causant.</strong> Éméché, il raconte que « les barges tournent moins rond depuis que les gens en pourpre inspectent les cales la nuit » — écho aux convois nocturnes.</li>
<li><strong>La superstition de Derrik.</strong> Il refuse de trinquer sans toucher le marbre et prévient que s'accouder au balcon des abîmes « ça appelle ».</li>
<li><strong>Le sel de la vieille Jesa.</strong> Elle passe un savon mémorable à un serveur qui jette un plateau à peine entamé — gêne mondaine parfaite.</li>
<li><strong>Brynn et la fourchette.</strong> Perdue devant six couverts ; un PJ qui l'aide sans la moquer se la met dans la poche (et elle en dit trop sur ses « amis » des Fosses).</li>
<li><strong>Poudre de marbre aux latrines.</strong> De jeunes nobles « prisent » le stimulant de Velric dans un salon à l'écart — croustillant, potentiellement compromettant.</li>
<li><strong>La danse imposée.</strong> L'étiquette pousse les hôtes de marque à ouvrir une danse : un PJ peut se retrouver en binôme forcé avec Ismara ou Selianne.</li>
<li><strong>Le portrait qui juge.</strong> Un domestique glisse que l'aïeul fondateur « avait fait murer un associé dans la Veine Hurlante » — légende de famille, frisson garanti.</li>
</ol>

<h3>Indices semés (MJ)</h3>
<ul>
<li><strong>Port / affaire D'Illevas</strong> — Ordan porte un toast provocateur ; Maerin confirme qu'« Eldric n'a plus signé de sa main depuis des mois ». Ilrune Ivelis, associé de Rigart &amp; fils, peut en dire davantage sans mesurer la portée.</li>
<li><strong>Palhindile / esclavage</strong> — Selianne laisse filtrer sa loi d'abolition ; on murmure qu'un négociant dolomicien (Mastiggia) s'y intéresse de trop près.</li>
<li><strong>Roi / sang-dragon</strong> — Daren évoque des convois nocturnes descendant vers les sous-sols de la Citadelle Rouge ; Harl relie ça au salut « Rayon » et à son dossier « Les Yeux dans la pierre ». Un agent de l'Œil Pourpre observe les PJ : ils sont repérés.</li>
</ul>
`.trim();

async function main() {
  const ekenon = await prisma.personOfInterest.findFirst({
    where: { id: { startsWith: 'd1e9e544' } },
    select: { id: true },
  });
  const personIds = [...PERSON_IDS];
  if (ekenon && !personIds.includes(ekenon.id)) personIds.push(ekenon.id);

  const lore = await prisma.lore.create({
    data: {
      title: 'Bal Tovalis — « Le Bal de la Pierre » (Fête de la Fondation, soir 1)',
      summary:
        "Soir 1 de la Fête de la Fondation : bal Tovalis au Palazzo Khaz'Kanoon. Invités, figurants et indices semés (Port, esclavage, Roi).",
      content: CONTENT,
      tags: ['Fête de la Fondation', 'Alagir', 'Tovalis', 'Politique'],
      dateInGame: '907-11-01',
      isForDM: true,
      cities: { create: [{ cityId: ALAGIR_CITY_ID }] },
      places: { create: [{ placeId: PALAZZO_ID }, { placeId: SALLE_BALLE_PALAZZO_ID }] },
      organisations: { create: [{ organisationId: TOVALIS_ORG_ID }] },
      persons: { create: personIds.map((personId) => ({ personId })) },
    },
    include: { _count: { select: { persons: true, places: true, cities: true, organisations: true } } },
  });

  console.log('Entrée de Lore créée :', lore.id);
  console.log('Liens :', lore._count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
