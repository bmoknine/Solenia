import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updates: { id: string; name: string; description: string }[] = [

  // ─── CILOVARD ───────────────────────────────────────────────────────────────

  {
    id: 'd8e37ee1-afd3-4901-ba1b-74bc0479acd3',
    name: 'Merr Luth',
    description: `Nain trapu à la barbe noire tressée avec de fins anneaux d'argent. Yeux noisette perçants, peau tannée par les années passées derrière un comptoir. Mains larges et courtes aux doigts étonnamment précis. Tablier beige immaculé porté sur une chemise de lin bleu aux manches retroussées.
Nain au tablier propre, Le Poids Juste. Note chaque commande au gramme près.`,
  },
  {
    id: 'c885e82c-e64e-48e8-8136-5f76d4d4611b',
    name: 'Eldric Rigart',
    description: `Grand et mince pour son âge, traits fins et réguliers hérités d'une bonne lignée. Cheveux châtain clair coiffés avec soin vers l'arrière, yeux gris-bleu vifs et avides. Allure toujours élégante — pourpoint de velours marine, cape courte attachée sur l'épaule. Mains soignées, bague de famille à l'annulaire.
Jeune héritier Rigart. Discours au port sur l'alliance Cilovard (Partie 5). Fils de Dorian Rigart, vision commerce fluvial ouvert.`,
  },
  {
    id: '8c2eeaa5-9a2f-4d9f-8fa6-014fa6a70c0b',
    name: 'Folduin Xyrlana',
    description: `Homme d'une cinquantaine d'années au teint olivâtre, mâchoire carrée et front dégarni qu'une calotte noire dissimule avec peu de succès. Yeux bruns profonds enfoncés sous des sourcils broussailleux. Petite bouche habituellement pincée en une ligne prudente. Son pourpoint or et noir est toujours impeccablement boutonné jusqu'au col.
Clerc de Zitris et usurier. Échoppe Porte Pourpre, pourpoint or/noir, 300 Po dus à Laguna. Liens Cilovard et Palhindile.`,
  },
  {
    id: '67a5fa35-103d-4486-831e-078d56beedc9',
    name: 'Garran Cilovard',
    description: `Patriarche Cilovard, humain 58 ans. Silhouette imposante — large d'épaules, encore droit malgré l'âge. Cheveux gris acier coiffés en arrière avec une rigueur quasi militaire, sourcils épais encore sombres qui contrastent avec le reste. Visage taillé à la serpe, rides profondes aux commissures de la bouche et autour d'yeux gris clairs d'une fixité déconcertante. Une légère cicatrice verticale traverse son sourcil gauche. Vêtements toujours sombres et d'excellente coupe, canne à pommeau d'argent qu'il n'utilise pas pour marcher.
Directeur de la Couronne de Platine, ministre officieux des finances. Pragmatique, rigide, autoritaire. CA 15 · PV 68 · Canne-épée +6. Compétences : Persuasion +7, Tromperie +6, Intimidation +5. Trait : Sang-froid absolu (avantage peur/charme), Regard du créancier 1/jour (peur DD 14). Secret : a signé un contrat de garantie magique — en réalité un lien d'obéissance latent vers le Roi-Tyrannœil.`,
  },
  {
    id: 'f77d9ba9-30c8-4d94-b0c1-89420f643296',
    name: 'Lady Velena Cilovard',
    description: `Épouse de Garran Cilovard, humaine 55 ans. Femme élancée à la silhouette soignée, qui porte ses années avec une grâce distillée. Cheveux auburn soigneusement relevés en chignon, striés de fils blancs qui ressemblent à un choix esthétique plutôt qu'à un signe de l'âge. Yeux verts au regard doux et calculateur, fines rides aux commissures qui apparaissent lorsqu'elle sourit — ce qui est fréquent. Peau pâle, gestes lents et assurés. Robes de soie sobre, jamais criardes, toujours de qualité irréprochable.
Dirige la Caisse des Richesses Cachées. Fine manipulatrice, crée des dettes morales sous couvert de générosité. CA 14 · PV 54 · Stylet +5. Trait : Charme du serpent (avantage Tromperie contre nobles et prêtres), Comptabilité sacrée 1/jour (Détection de la magie). Secret : certains de ses registres s'écrivent seuls, en encre rouge vive.`,
  },
  {
    id: 'e945a71d-9224-4272-8f9a-c6a775c22110',
    name: 'Lorian Cilovard',
    description: `Fils aîné Cilovard, humain 32 ans. Taille moyenne, allure de voyageur aisé — ni trop mince ni trop épais, corps habitué aux traversées maritimes. Cheveux bruns ondulés coiffés vers l'arrière, court bouc bien taillé qui vieillit légèrement son visage. Yeux noisette expressifs et rapides à évaluer son interlocuteur. Toujours soigné sans être ostentatoire ; porte une bague de cachet gravée aux armoiries Cilovard à la main droite.
Responsable des échanges extérieurs et du commerce maritime. Ambitieux, érudit en diplomatie économique. CA 14 · PV 46 · Dague +4. Compétences : Persuasion +6, Investigation +5, Intimidation +5. Secret : après un traité avec Gandorènne, il a vu un reflet rouge dans l'encrier — manifestation du Roi observant la transaction.`,
  },
  {
    id: '5e356a69-f3d4-4d03-8046-3f7f89c3512f',
    name: 'Ismara Cilovard',
    description: `Fille cadette Cilovard, humaine 25 ans. Petite, traits délicats hérités de sa mère mais regard plus sincère. Cheveux auburn portés en tresse lâche qui glisse souvent sur l'épaule quand elle penche la tête sur ses livres de comptes. Yeux verts légèrement cernés, taches d'encre fréquentes aux doigts et parfois sur la joue. Robes pratiques aux couleurs neutres, peu de bijoux — une seule boucle d'oreille en lapis-lazuli.
Chargée de la logistique et du transport d'or. Moins ambitieuse, plus lucide — conscience discrète de la famille. CA 13 · PV 32 · Dague +3. Trait : Regard sincère (avantage Persuasion avec le peuple), Marque du remords (ses pièces noircissent quand elle ment). Secret : détient une tablette dorée portant le sceau d'Aesir, encore actif.`,
  },

  // ─── TOVALIS ────────────────────────────────────────────────────────────────

  {
    id: 'e785fe6c-da97-416c-95a6-4102791b6640',
    name: 'Derrik Holmar',
    description: `Homme trapu de la quarantaine, visage buriné par le soleil et la poussière de calcaire des carrières du Nord. Cheveux roux coupés très ras, barbe de quelques jours négligée. Yeux bleu-gris méfiants sous un front plissé. Bras épais, mains abîmées et calleuses. Une vieille entaille en biais sur l'avant-bras gauche — souvenir d'un accident de taille.
Contremaître Tovalis, carrières du Nord. Loyal, superstitieux.`,
  },
  {
    id: '71a8a898-169f-435b-bf0a-8c3933c60a8d',
    name: 'Jesa Tolvine',
    description: `Femme d'une cinquantaine d'années, petite mais raide comme un piquet, qui impose sa présence par la seule intensité de son regard. Cheveux gris fer coupés court, sans fioritures. Yeux noirs tranchants. Une cicatrice en arc traverse son menton — souvenir d'un éclat de roc reçu à vingt ans. Tenue de travail toujours propre, tablier de cuir épais, bottes solides.
Contremaître taille de bloc. Exigeante, respectée.`,
  },
  {
    id: '5f7057a8-b5e3-4947-b846-16f62dd43d39',
    name: 'Bord Amac',
    description: `Homme de la quarantaine, ventre généreux qui témoigne d'une vie de bonne chère et de tavernes. Teint rubicond des grands buveurs. Cheveux noirs clairsemés en désordre, moustache épaisse sous un nez cassé. Yeux marron toujours un peu rieurs. Mains calleuses, souvent une tache de goudron sur la paume ou le poignet. Veste de marinier élimée.
Contremaître transport fluvial. Bon vivant, corrompu par le Syndicat.`,
  },
  {
    id: '35c5cd56-05ab-4d10-9489-bf09f3c1d9cc',
    name: 'Tarn Vess',
    description: `Homme maigre de la cinquantaine, front haut et largement dégarni. Lunettes à monture de cuivre perchées sur un nez aquilin. Yeux marron calmes et méthodiques derrière les verres. Doigts longs et secs, presque toujours tachés d'encre noire. Tenue grise, chemise boutonnée jusqu'au col, fonctionnelle à l'extrême.
Contremaître entrepôts. Pragmatique, tient les comptes officieux.`,
  },
  {
    id: '148f0452-aa0f-42b1-83a4-23cb30cd0e18',
    name: 'Ordan Tovalis',
    description: `Homme de la quarantaine, carrure solide héritée des travailleurs de pierre mais avec la présence naturelle d'un orateur. Visage large à la mâchoire forte, nez légèrement aplati d'un vieux coup. Cheveux châtain foncé grisonnant aux tempes. Yeux marron foncé, voix portante, gestes amples qui prennent naturellement l'espace.
Porte-parole Tovalis. Protestation publique contre l'alliance Cilovard–Rigart sur l'estrade du port (Partie 5).`,
  },
  {
    id: '80891668-5ad8-47a2-ae29-1e6d79be3160',
    name: 'Cryta',
    description: `Demi-orc ~40 ans, peau verte, crocs légèrement proéminents, yeux jaunes perçants, cheveux noirs striés de gris coupés ras sur les côtés. Une cicatrice en diagonale marque la joue gauche. Corps trapu et musclé, mouvements lents et mesurés qui dissimulent une réactivité redoutable. Tenue de garde simple, hache à la ceinture.
Garde en entraînement avec Harl Denvar au Palazzo.`,
  },
  {
    id: 'b9a0b7ee-5455-466d-86c0-12363226b383',
    name: 'Maerin Tovalis',
    description: `Héritière Tovalis, humaine 27 ans. Grande et athlétique, le teint halé de quelqu'un qui passe ses journées sur les quais et les barges. Cheveux châtain foncé coupés aux épaules, souvent relevés en chignon pratique pour travailler. Yeux verts clairs, regard direct et sans détour. Mains légèrement calleuses, une entaille récente cicatrisée à l'index. Tenue pratique mais bien coupée, toujours une carte de navigation pliée dans la poche.
Gère les contrats de transport fluvial sur l'Artère Azur. Dispose d'une flotte de 12 barges et 4 entrepôts sous douane. Ambitieuse, vive, excellente oratrice. Cherche à moderniser et ouvrir des partenariats avec Huriya. Ignore les secrets de son père mais remarque les incohérences du Soleil Pourpre.`,
  },
  {
    id: 'd21e951b-fd8b-4c35-9e35-b3cddbbacd47',
    name: 'Velric Tovalis',
    description: `Fils cadet Tovalis, humain 20 ans. Mince, d'allure juvénile, il ne ressemble pas encore à son père imposant. Cheveux noirs en bataille, ombre de barbe irrégulière sur les joues. Yeux noirs vifs, regard souvent en dessous. Jointures récemment écorchées, bleu sur la pommette gauche. S'habille simplement — chemise ouverte, veste usée — mais porte des bijoux de pacotille en signe de rébellion discrète.
Rebelle, amateur de paris et combats illégaux. Parfois aperçu au Goulet Écarlate. Rumeur : contacts dans La Braise pour trafic de poudre de marbre (stimulant).`,
  },

  // ─── PALHINDILE ─────────────────────────────────────────────────────────────

  {
    id: 'dbbe28fc-23e4-4d1a-af4c-0e15291ee906',
    name: 'Nimra',
    description: `<p>Elfe androgyne à la silhouette longiligne, d'une beauté ambiguë qui rend les étiquettes inutiles. Cheveux blanc argenté tombant librement sur les épaules, yeux d'un violet pâle presque translucide qui changent de teinte selon l'angle de la lumière. Traits d'une finesse extrême, lèvres minces, oreilles effilées portant de minuscules anneaux de verre teinté. S'habille de gris et de blanc, toujours un bougeoir en main, les doigts légèrement noircis de cire.</p>
<p>La Verrière Fendue. Règle les bougies selon les reflets du vitrail.</p>`,
  },
  {
    id: '87d809bb-833e-4fa4-8dff-17e9cd7f3af3',
    name: 'Lady Serenya Palhindile',
    description: `Matriarche Palhindile, haute elfe 310 ans. Grande, d'une beauté hors du temps qui porte ses siècles comme une seconde nature. Cheveux d'or blanc nattés avec des fils d'argent et des perles de verre coloré. Yeux vert clair aux pupilles en amande oblongue, regard d'une sérénité absolue qui peut en une fraction de seconde devenir d'acier. Peau de porcelaine aux veines légèrement irisées, traits d'une symétrie parfaite. Toujours vêtue de blanc et d'argent, rapière fine et ouvragée à la ceinture.
Chancelière d'Alagir. Calme, bienveillante, éloquence sans faille. CA 15 · PV 56 · Rapière +5. Compétences : Persuasion +8, Intuition +6, Religion +5. Traits : Aura de paix (alliés proches avantagés contre la peur), Verre protecteur 1/jour (Apaisement ou Zone de vérité). Secret : note les réactions lumineuses des vitraux — cartographie sans le savoir l'énergie d'Aesir.`,
  },
  {
    id: '381eb3b5-c442-4fce-9388-e6df91d76f56',
    name: 'Lior Palhindile',
    description: `Mage archiviste Palhindile, demi-elfe 24 ans. Jeune, traits mélangés — oreilles très légèrement pointues, visage plus doux et expressif qu'un elfe pur. Cheveux brun-roux mi-longs, toujours légèrement ébouriffés comme s'il venait de les sortir d'un livre. Yeux d'un vert lumineux aux reflets elfiques. Lunettes rondes à monture de laiton fin perchées sur le nez. Doigts toujours tachés d'encre noire ou violette. Robe d'archiviste bleu nuit un peu usée aux coudes.
Spécialiste des vitraux anciens. CA 12 · PV 33 · Bâton +3. Sorts mineurs : Lumière, Prestidigitation, Détection de la magie. Sorts niv 1-2 : Bouclier, Identification, Silence, Détection du mal et du bien. Trait : Archiviste du silence (avantage pour langues anciennes). Secret : a trouvé sous son atelier une dalle transparente pulsant d'une lueur rouge — fragment du Temple d'Aesir.`,
  },
  {
    id: '0622d84c-e5c2-4c64-bac5-74479683daee',
    name: 'Lord Calen Palhindile',
    description: `Époux de Serenya, humain 62 ans. Grand mais légèrement voûté, comme plié par des décennies passées sur des parchemins. Cheveux blancs fins et doux, barbe soignée d'un blanc immaculé. Yeux bleus fanés mais curieux, lumineux dès qu'on évoque l'histoire ou la religion. Visage ridé avec bonhomie — rides de sourire plus que de souci. Porte presque toujours un livre ou un rouleau sous le bras. Vêtements riches dans leurs matières mais useés aux coudes et aux poignets par l'érudition quotidienne.
Ancien ambassadeur à Huriya et au Saint-Empire. Érudit passionné d'histoire des religions. CA 13 · PV 42 · Bâton +4. Compétences : Religion +6, Perspicacité +5, Persuasion +5. Trait : Savoir perdu (avantage Histoire sur traces de cultes anciens). Secret : détient un rouleau portant le glyphe d'Aesir sans en comprendre le sens.`,
  },
  {
    id: '41fa949e-a4a0-41b8-8c47-a3a6c080879f',
    name: 'Selianne Palhindile',
    description: `Héritière Palhindile, demi-elfe 29 ans. Silhouette élancée, grâce naturelle dans chaque geste. Cheveux auburn aux reflets cuivrés, légèrement ondulés, portés mi-longs avec une broche d'or discrète sur le côté. Yeux noisette dorés aux reflets elfiques, regard à la fois chaleureux et perçant — elle évalue son interlocuteur aussi vite qu'elle lui sourit. Mains aux doigts fins, légèrement tachées d'encre malgré les gants de soie fine qu'elle porte en audience.
Dirige la Cour des Ambassades et l'Académie des Médiateurs. Charismatique, diplomate idéale. CA 14 · PV 36 · Dague +4. Compétences : Persuasion +7, Intuition +6, Tromperie +4. Trait : Voix incorruptible 1/jour (dissipe Charme ou Suggestion). Secret : a intercepté une lettre mentionnant « la Lumière Fendue » — fragment du rituel d'Aesir.`,
  },

  // ─── VANGUARD ───────────────────────────────────────────────────────────────

  {
    id: '60ee9017-2f5a-45c6-90ae-e7f253db2093',
    name: 'Pelfort Vanguard',
    description: `Monarque de la Cité Pourpre depuis cinq ans, suite à une mort royale suspecte. Homme de taille moyenne, quarantaine bien tassée. Mâchoire forte, regard brun froid et calculateur qui ne s'éclaire jamais vraiment. Cheveux noirs soigneusement coiffés, barbe courte entretenue avec une précision royale. Corps entretenu, maintien militaire hérité d'une formation de chevalier. Toujours vêtu de pourpre sombre et d'or, jamais sans sa couronne en présence publique.
Centralise le pouvoir, réforme les impôts, surveille tout via le Soleil Pourpre.`,
  },
  {
    id: 'dc878db9-301f-4fbc-b3bb-63298432df54',
    name: 'Guetel Vanguard',
    description: `Épouse du roi Pelfort Vanguard. Reine d'Alagir. Femme belle de la trentaine, qui soigne son apparence avec l'application d'une ambassadrice. Cheveux châtain doré toujours relevés en couronne élaborée. Yeux gris-vert au regard impénétrable derrière un sourire diplomatique parfaitement maîtrisé. Traits délicats, teint pâle légèrement fardé. Robes de la cour toujours impeccables, bijoux choisis pour signifier sans éblouir.
Complice de Pelfort. Ambassadrice auprès des Duchés des Dolomites. Secret : canal de messagerie chiffrée avec Huriya ; rumeur d'ancien lien avec le Syndicat.`,
  },
  {
    id: 'd1e9e544-2b9c-453b-b111-190c32add1cb',
    name: 'Ékénon Tracx',
    description: `<p>Tieffelin à la peau d'un rouge sombre tirant vers le bordeaux, cornes noires recourbées vers l'arrière en arc élégant. Yeux jaunes à pupilles fendues, regard intense et peu confortable. Visage taillé et expressif, une fine cicatrice en travers du nez. Grand, bâti comme un soldat de métier — épaules larges, poignets épais. D'autres cicatrices courent sur le dos des mains et le long du cou. Armure de plates noire aux reflets mats, cape pourpre aux armoiries royales.</p>
<p>Capitaine et garde personnel du roi Pelfort Vanguard à Alagir.</p>`,
  },
  {
    id: '54f82a8e-b086-4414-bd1f-489455a0ad8f',
    name: 'Priel Vanguard',
    description: `Nourrisson aux joues rondes et roses, yeux noisette déjà vifs et éveillés. Fines mèches de cheveux noirs qui commencent à boucler légèrement. Toujours emmitouflé dans des draps brodés aux armoiries Vanguard — pourpre et or.
Héritier royal d'Alagir. Fils de Pelfort et Guetel Vanguard. Innocent mais peut servir de levier émotionnel dans les intrigues entourant le trône.`,
  },
];

async function main() {
  for (const u of updates) {
    await prisma.personOfInterest.update({
      where: { id: u.id },
      data: { description: u.description },
    });
    console.log(`✓ ${u.name}`);
  }
  console.log(`\n✅ ${updates.length} PNJ mis à jour.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
