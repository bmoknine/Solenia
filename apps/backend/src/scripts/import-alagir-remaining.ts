/**
 * Import Alagir — sections restantes : quartiers, tavernes, POI, PNJ annexes, liens.
 * Idempotent : relançable sans doublons.
 */
import { PrismaClient, PlaceType } from '@prisma/client';

const prisma = new PrismaClient();

type Breed =
  | 'HUMAIN'
  | 'ELFE'
  | 'NAIN'
  | 'DEMI_ELFE'
  | 'DEMI_ORC'
  | 'GNOME'
  | 'TIEFFELIN'
  | 'HALFELIN'
  | 'OTHER';

const DEFAULT_STATS = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };

export async function importAlagirRemaining(cityId: string, cityX: number, cityY: number) {
  const orgIds = await loadOrgIds(cityId);
  const districtIds = await createDistricts(cityId);
  await createRemainingPlaces(cityId, cityX, cityY, districtIds, orgIds);
  await createTaverns(cityId, cityX, cityY, districtIds, orgIds);
  await createAdditionalNPCs(cityId, cityX, cityY, districtIds, orgIds);
  await linkExistingPlacesToDistricts(cityId, districtIds);
  await enrichExistingPlaces(cityId, districtIds);
  console.log('\n✅ Import Alagir (sections restantes) terminé');
}

// ─── Helpers ───────────────────────────────────────────────

async function loadOrgIds(cityId: string): Promise<Record<string, string>> {
  const orgs = await prisma.organisation.findMany({
    where: { cities: { some: { cityId } } },
    select: { id: true, name: true },
  });
  const map: Record<string, string> = {};
  for (const o of orgs) map[o.name] = o.id;
  return map;
}

async function ensureDistrict(
  cityId: string,
  data: {
    name: string;
    motto?: string;
    ambiance?: string;
    content?: string;
    rumors?: string;
    secret?: string;
  },
): Promise<string> {
  const existing = await prisma.district.findFirst({ where: { name: data.name, cityId } });
  if (existing) return existing.id;
  const d = await prisma.district.create({
    data: {
      name: data.name,
      motto: data.motto,
      ambiance: data.ambiance,
      content: data.content,
      rumors: data.rumors,
      secret: data.secret,
      cityId,
    },
  });
  console.log(`✅ Quartier : ${data.name}`);
  return d.id;
}

async function ensurePlace(
  cityId: string,
  cityX: number,
  cityY: number,
  data: {
    name: string;
    placeType: PlaceType;
    description: string;
    districtId?: string;
    orgs?: string[];
    orgIds: Record<string, string>;
  },
): Promise<string> {
  let place = await prisma.place.findFirst({ where: { name: data.name, cityId } });
  if (!place) {
    place = await prisma.place.create({
      data: {
        name: data.name,
        placeType: data.placeType,
        description: data.description,
        cityId,
        districtId: data.districtId,
        showOnMap: false,
      },
    });
    await prisma.position.create({ data: { x: cityX, y: cityY, placeId: place.id } }).catch(() => {});
    console.log(`✅ Lieu : ${data.name}`);
  } else if (data.districtId && !place.districtId) {
    await prisma.place.update({ where: { id: place.id }, data: { districtId: data.districtId } });
  }
  for (const orgName of data.orgs ?? []) {
    const oid = data.orgIds[orgName];
    if (oid) {
      await prisma.organisationPlace
        .create({ data: { organisationId: oid, placeId: place.id } })
        .catch(() => {});
    }
  }
  return place.id;
}

async function ensurePerson(
  cityId: string,
  cityX: number,
  cityY: number,
  data: {
    name: string;
    breed?: Breed;
    description: string;
    placeId?: string;
    districtId?: string;
    ca?: number | null;
    pv?: number | null;
    fp?: string | null;
    orgs?: string[];
    orgIds: Record<string, string>;
  },
): Promise<string> {
  let person = await prisma.personOfInterest.findFirst({ where: { name: data.name, cityId } });
  if (!person) {
    person = await prisma.personOfInterest.create({
      data: {
        name: data.name,
        breed: data.breed,
        description: data.description,
        cityId,
        placeId: data.placeId,
        districtId: data.districtId,
        ca: data.ca ?? null,
        pv: data.pv ?? null,
        fp: data.fp ?? null,
        showOnMap: false,
        ...DEFAULT_STATS,
      },
    });
    await prisma.position
      .create({ data: { x: cityX, y: cityY, personOfInterestId: person.id } })
      .catch(() => {});
    console.log(`✅ PNJ : ${data.name}`);
  } else {
    const updates: Record<string, string> = {};
    if (data.placeId && !person.placeId) updates.placeId = data.placeId;
    if (data.districtId && !person.districtId) updates.districtId = data.districtId;
    if (Object.keys(updates).length) {
      await prisma.personOfInterest.update({ where: { id: person.id }, data: updates });
    }
  }
  for (const orgName of data.orgs ?? []) {
    const oid = data.orgIds[orgName];
    if (oid) {
      await prisma.organisationMember
        .create({ data: { organisationId: oid, personId: person.id } })
        .catch(() => {});
    }
  }
  return person.id;
}

// ─── Quartiers ─────────────────────────────────────────────

async function createDistricts(cityId: string): Promise<Record<string, string>> {
  const districts: {
    key: string;
    name: string;
    motto?: string;
    ambiance?: string;
    content?: string;
    rumors?: string;
    secret?: string;
  }[] = [
    {
      key: 'jardins',
      name: 'Les Jardins des Âmes',
      motto: '« Les âmes poussent à même la pierre. »',
      ambiance:
        'Labyrinthe de ruelles étroites, maisons superposées, lanternes suspendues. Cœur populaire : artisans, dockers, Syndicat. Poussière de marbre rosée au couchant.',
      content:
        'Factions : Tovalis (contremaîtres), Syndicat (Faith), Soleil Pourpre patrouille rarement. Lieux : Marché des Mille Voix, Cour des Murs Rouges, Auberge du Murmure.',
      rumors:
        'Voix dans les conduits d\'eau (« âmes du jardin »). Agents du Roi disparus ; armures fondues dans un puits.',
      secret:
        'Sous la Cour des Murs Rouges : puits vers catacombes du Temple de Tal Aesir ; souffle de poussière noire (souvenirs minéraux).',
    },
    {
      key: 'chant',
      name: 'Le Chant de Tal Taris',
      motto: '« Là où l\'eau touche la pierre, les dieux marchandent leurs reflets. »',
      ambiance:
        'Quartier des docks sur l\'Artère Azurée. Entrepôts, tavernes, quais bondés. Sel, fumée, torches sur le fleuve la nuit.',
      content: 'Syndicat règne ; Cilovard sur les quais modernes. Conseil d\'Acier discret. Soleil Pourpre prélève un tribut.',
      rumors: 'Navire fantôme La Griffe du Roi. Faith et une entité aquatique sous la pleine lune.',
      secret:
        'Chambre noyée sous les Docks des Lunes : sanctuaire Tal Taris relié au Temple d\'Aesir.',
    },
    {
      key: 'chateau',
      name: 'Le Château de Verre (quartier)',
      motto: '« Le trône est une lentille. Il ne crée pas la lumière, il la déforme. »',
      ambiance:
        'Palais aux vitraux cyclopéens, reflets sur la ville. Escaliers trompeurs, miroirs vibrants.',
      content: 'Maison Vanguard, Soleil Pourpre, Œil Pourpre (secret). Audience, bals, vol de vitrail.',
      rumors: 'L\'air semble vous regarder dans certains couloirs.',
      secret:
        'Salle des Trois Cercles : reflets tracent la carte mentale d\'Alagir pour le Roi. Caves : Temple de Tal Aesir.',
    },
    {
      key: 'porte',
      name: 'La Porte Pourpre',
      motto: '« Ici, la pierre vaut moins que la promesse. »',
      ambiance:
        'Quartier des banques : pavés de marbre rose, enseignes dorées. Balance géante de platine au sol.',
      content: 'Cilovard dominent. Couronne de Platine pulse la nuit avec le cœur du Roi.',
      rumors: 'Pièces de platine qui vibrent ou changent de teinte.',
      secret: 'Comptoir de Résonance sous la Couronne : amplificateur psionique du Tyrannœil.',
    },
    {
      key: 'cinquieme',
      name: 'La Cinquième Roue',
      motto: '« Là où la pierre s\'arrête, les routes commencent. »',
      ambiance:
        'Entrepôts, ateliers, brouillard rougeâtre permanent. Domaine Tovalis et Convoyeurs du Pourpre.',
      content: 'Conseil d\'Acier : caches sous hangars. Hangar du Poids, carrières.',
      rumors: 'Chariot royal disparu avant inspection, coffre d\'armes « vivantes ».',
      secret: 'Faux mur vers le Bastion Gris (Conseil d\'Acier).',
    },
    {
      key: 'tentations',
      name: 'Le Quartier des Tentations',
      motto: '« Les murs enferment la vertu, les portes de l\'est la libèrent. »',
      ambiance:
        'Plaisirs, théâtres, cabarets magiques, tripots. Lumières colorées contre les murailles.',
      content: 'Syndicat contrôle chaque établissement. Mages Palehindile en couverture artistique.',
      rumors: 'Théâtre Le Miroir des Masques : clients sortent vidés de volonté.',
      secret: 'Salle invisible du Miroir des Masques : expériences psioniques de l\'Œil Pourpre.',
    },
    {
      key: 'zitris',
      name: 'Les Comptes de Zitris',
      motto: '« Là où la chance danse, la prudence compte. »',
      ambiance:
        'Change quotidien : pavés propres, auvents pourpre, carillon de clochettes à chaque transaction.',
      content:
        'Cilovard, Palehindile (Maison des Listes), Syndicat infiltré, Conseil d\'Acier observe le fer.',
      rumors: 'Faillites orchestrées. Société fantôme La Balance Rouge. Prêtre entend les chiffres.',
      secret:
        'Salle circulaire sous C.C.R.C. : autel Zitris/Aesir — nœud chance/désolation, alimente le réseau du Roi.',
    },
  ];

  const ids: Record<string, string> = {};
  for (const d of districts) {
    ids[d.key] = await ensureDistrict(cityId, d);
  }
  return ids;
}

// ─── Lieux & POI restants ───────────────────────────────────

async function createRemainingPlaces(
  cityId: string,
  cityX: number,
  cityY: number,
  d: Record<string, string>,
  orgIds: Record<string, string>,
) {
  const base = { cityId, cityX, cityY, orgIds };
  const places: Parameters<typeof ensurePlace>[3][] = [
    {
      name: 'Grand Temple de Tal Odius',
      placeType: 'AUTRE',
      districtId: d.jardins,
      orgs: ['Famille Tovalis'],
      description:
        'Basilique de marbre veiné, nef basse, colonnes « racines ». Clergé de Tal Odius, carriers Tovalis. Secret : dalle pivotante sous l\'autel vers crypte d\'alignement — pendule accélère quand l\'influence du Roi croît.',
    },
    {
      name: 'Oratoire de Ral Zitris',
      placeType: 'AUTRE',
      districtId: d.zitris,
      description:
        'Étage discret au-dessus de la Maison des Listes. Autels bas, dés rituels, balances votives. Dés taillés dans des éclats du Vitrail du Pacte — scintillent devant un serment parjure.',
    },
    {
      name: 'Rotonde des Reflets',
      placeType: 'AUTRE',
      districtId: d.jardins,
      orgs: ['Famille Palhindile'],
      description:
        'Salle circulaire de la Cour des Ambassades. Parois de verre captant la lune. À la pleine lune : glyphe d\'Aesir (balance fendue) brièvement visible.',
    },
    {
      name: 'Four « la Gueule d\'Aube »',
      placeType: 'AUTRE',
      districtId: d.chateau,
      orgs: ['Famille Palhindile'],
      description:
        'Principal four des Verreries Royales (Lior). Chante quand la pâte prend. Bâti sur faille reliée au Temple d\'Aesir : nourri d\'un serment, le vitrail correspondant devient vivant.',
    },
    {
      name: 'Cercle du Verre Clair',
      placeType: 'AUTRE',
      districtId: d.chateau,
      orgs: ['Famille Palhindile'],
      description:
        'Ordre moral et éducatif de Serenya. 23 membres : diplomates-mystiques, vitraux vivants. Rites de la Transparence — relais inconscient de Ral Aesir.',
    },
    {
      name: 'Hôtel des Pesées',
      placeType: 'AUTRE',
      districtId: d.zitris,
      orgs: ['Famille Cilovard'],
      description:
        'Inspecteurs, poinçons, litanies du poids. Pierre pourpre en crypte incline imperceptiblement les balances selon l\'influence occulte du Roi.',
    },
    {
      name: 'Maison des Listes',
      placeType: 'AUTRE',
      districtId: d.zitris,
      orgs: ['Famille Palhindile', 'Famille Cilovard'],
      description:
        'Babillard des taux, primes, taxes, valeur du marbre. Temple discret Ral Zitris au dernier étage. Chiffres parfois réécrits sous fragment de vitrail.',
    },
    {
      name: 'Marché des Voiles',
      placeType: 'AUTRE',
      districtId: d.chant,
      orgs: ["Le Syndicat d'Alagir"],
      description:
        'Hall couvert : cordages, caisses, promesses à voix basse. Dalles piégées transmettant sons à un grenier d\'espions.',
    },
    {
      name: 'Le Radeau du Diable',
      placeType: 'TAVERNE_AUBERGE',
      districtId: d.chant,
      orgs: ["Le Syndicat d'Alagir"],
      description:
        'Auberge flottante multi-niveaux. Navigateurs, espions, tueurs. Casier mural ouvert avec pièce ternie (Ismara) : carte partielle du Temple d\'Aesir.',
    },
    {
      name: 'Docks des Lunes',
      placeType: 'AUTRE',
      districtId: d.chant,
      orgs: ["Le Syndicat d'Alagir", 'Le Soleil Pourpre'],
      description:
        'Quai pour navires sans pavillon. Vagues chuchotantes la nuit. Chambre noyée : mini-sanctuaire Tal Taris ↔ Tal Aesir.',
    },
    {
      name: 'Entrepôts du Pourpre',
      placeType: 'AUTRE',
      districtId: d.cinquieme,
      orgs: ['Famille Tovalis', "Le Conseil d'Acier"],
      description:
        'Hangars, chariots, fumée. Tovalis et Conseil d\'Acier. Faux mur vers le Bastion Gris.',
    },
    {
      name: 'Arène des Éclats',
      placeType: 'AUTRE',
      districtId: d.tentations,
      orgs: ["Le Syndicat d'Alagir", 'Le Soleil Pourpre'],
      description:
        'Rotonde enterrée, gradins, éclats de verre dans le sable. Combats illégaux. Éclats absorbent larmes de sang — le Roi lit les souvenirs au Château.',
    },
    {
      name: 'Comptoir des Lunes',
      placeType: 'TAVERNE_AUBERGE',
      districtId: d.chant,
      orgs: ["Le Syndicat d'Alagir"],
      description:
        'Taverne banale en façade ; cave : cartes nautiques vivantes, coffres scellés. Planque Syndicat (Sarlis Nym). Sacs runiques résonnent avec coffres du palais.',
    },
    {
      name: 'Compagnie des Courtiers et Réviseurs de Change (C.C.R.C.)',
      placeType: 'AUTRE',
      districtId: d.zitris,
      orgs: ["Le Syndicat d'Alagir", 'Famille Cilovard'],
      description:
        'Bâtiment cyclopéen, statues de marchands aveugles. QG officiel du Syndicat sous couverture. Sous-sol : autel Zitris/Aesir, balances brisées.',
    },
    {
      name: 'Bureau des Scellés & Contreseings',
      placeType: 'AUTRE',
      districtId: d.zitris,
      orgs: ['Famille Cilovard'],
      description:
        'Cachets, sceaux, droit de signature. Sceau perdu d\'un roi précédent peut annuler un décret royal avec sang royal ou équivalent.',
    },
    {
      name: 'Cour des Murs Rouges',
      placeType: 'AUTRE',
      districtId: d.jardins,
      description:
        'Placette aux fresques de dieux effacés (symboles d\'Aesir). Puits muré vers galeries du Temple. Souvenirs minéraux.',
    },
    {
      name: 'Marché des Mille Voix',
      placeType: 'AUTRE',
      districtId: d.jardins,
      orgs: ["Le Syndicat d'Alagir"],
      description: 'Croisement couvert : tout ce qui échappe aux registres officiels.',
    },
    {
      name: 'Salle du Miroir Froid',
      placeType: 'AUTRE',
      districtId: d.porte,
      orgs: ['Famille Cilovard'],
      description:
        'Salon privé Cilovard. Murs de verre gris. Reflets transportent échos de voix jusqu\'au Château.',
    },
    {
      name: 'Dépôt des Serments Inachevés',
      placeType: 'AUTRE',
      districtId: d.chateau,
      orgs: ['Famille Palhindile'],
      description:
        'Sous la Chancellerie. Pactes brisés qui « pleurent ». Serment réactivé maudit le traître 1d4 jours.',
    },
    {
      name: 'Le Miroir des Masques',
      placeType: 'AUTRE',
      districtId: d.tentations,
      orgs: ["L'Œil Pourpre"],
      description:
        'Ancien théâtre. Salle invisible : clients sortent vidés de volonté. Expérimentations psioniques du Roi.',
    },
    {
      name: "L'Œil de Verre",
      placeType: 'AUTRE',
      districtId: d.chateau,
      orgs: ['Le Soleil Pourpre', "L'Œil Pourpre", 'Maison Vanguard'],
      description: 'Casernement royal du Soleil Pourpre au Château. Chambres d\'initiation à la Lumière totale.',
    },
    {
      name: 'Puits du Serment Inachevé',
      placeType: 'AUTRE',
      districtId: d.chateau,
      orgs: ['Famille Palhindile'],
      description:
        'Sous la Chancellerie. Nom chuchoté devient juridiquement contraignant 1 jour.',
    },
    {
      name: 'La Loutre SAOUL',
      placeType: 'TAVERNE_AUBERGE',
      districtId: d.chant,
      description:
        'Bastion d\'établissement (taverne & auberge), Bas-Quais. Niveaux 0–5 : de la ruine au joyau des quais. Trappe de contrebande, réputation, réseau d\'informateurs. Table d\'événements D8 (querelles, inspections, etc.).',
    },
    {
      name: 'Larmes de Ral Zitris',
      placeType: 'AUTRE',
      districtId: d.zitris,
      orgs: ["La Ligature Bancaire d'Alagir"],
      description:
        'Banque du culte Ral Zitris. Obligations de rançon, dépôts judiciaires. Dir. : Prêtre-auditeur Yovan Kelep.',
    },
    {
      name: "Banque du Dragon d'Or",
      placeType: 'AUTRE',
      districtId: d.zitris,
      orgs: ["La Ligature Bancaire d'Alagir"],
      description:
        'Escompte et lettres de crédit longue portée (Huriya, Levant). Dir. : Saphira Tel-Olem.',
    },
  ];

  for (const p of places) {
    await ensurePlace(cityId, cityX, cityY, { ...base, ...p });
  }
}

// ─── Tavernes ──────────────────────────────────────────────

async function createTaverns(
  cityId: string,
  cityX: number,
  cityY: number,
  d: Record<string, string>,
  orgIds: Record<string, string>,
) {
  const base = { cityId, cityX, cityY, orgIds };

  type Tavern = {
    place: { name: string; description: string; districtId: string; orgs?: string[] };
    staff: { name: string; breed?: Breed; description: string; ca?: number; pv?: number; fp?: string; orgs?: string[] }[];
  };

  const taverns: Tavern[] = [
    {
      place: {
        name: 'Le Calepin Ébréché',
        districtId: d.zitris,
        orgs: ['Famille Palhindile', "Le Syndicat d'Alagir"],
        description:
          'Cantine des scribes, Comptes de Zitris. Encre, cire, feuillets collés aux murs. Tourte à l\'encre, vin gris, café à la plume. Registre comptable signé d\'un nom inexistant.',
      },
      staff: [
        {
          name: 'Hilden Drosh',
          breed: 'HUMAIN',
          description: 'Patron nerveux, crâne luisant, plume derrière l\'oreille. Cherche qui a écrit un document qui n\'existe pas.',
          ca: 11,
          pv: 18,
          fp: '1/4',
        },
      ],
    },
    {
      place: {
        name: 'La Roue de Secours',
        districtId: d.cinquieme,
        orgs: ['Famille Tovalis'],
        description:
          'Auberge des convoyeurs. Bière rouge à la poussière sucrée, cour pour chariots. Chariot royal disparu avant inspection.',
      },
      staff: [
        {
          name: 'Mada Rusk',
          breed: 'HUMAIN',
          description: 'Patronne trapue, cheveux blancs tressés, voix de cor de chasse. Tatouages de routes.',
          ca: 12,
          pv: 30,
          fp: '1/2',
        },
        {
          name: 'Lorn',
          breed: 'HUMAIN',
          description: 'Colosse manchot, ex-soldat Tovalis. Nettoie le comptoir d\'une main avec rigueur maniaque.',
          ca: 14,
          pv: 45,
          fp: '2',
        },
      ],
    },
    {
      place: {
        name: "Les Vapeurs d'Olena",
        districtId: d.tentations,
        orgs: ['Famille Cilovard'],
        description:
          'Bains et suites, Tentations. Mosaïques turquoise, brumes, jeu La Balance. Bassins changeant à la pleine lune — œil sous la surface.',
      },
      staff: [
        {
          name: 'Madame Solinne',
          breed: 'DEMI_ELFE',
          description: 'Demi-elfe aux voiles blancs, yeux verts hypnotiques. Maîtresse des bains.',
          ca: 13,
          pv: 35,
          fp: '2',
        },
      ],
    },
    {
      place: {
        name: 'Le Marteau Courtois',
        districtId: d.cinquieme,
        orgs: ["Le Conseil d'Acier"],
        description:
          'Taverne-forge du Conseil d\'Acier. Marteau sacré : trois coups lient l\'âme 30 jours. Ragoût de braise, bière Poing de Fer.',
      },
      staff: [], // Boros & Tessa déjà en base — liés ci-dessous
    },
    {
      place: {
        name: 'La Verrière Fendue',
        districtId: d.chateau,
        orgs: ['Famille Palhindile'],
        description:
          'Terrasse face au Château. Tarte de marbre, vin Larme du Verre. Fissure projetant parfois la vraie forme du Roi.',
      },
      staff: [
        {
          name: 'Maître Elar Vain',
          breed: 'HUMAIN',
          description: 'Violoniste-serveur en habit noir.',
          ca: 12,
          pv: 22,
          fp: '1/2',
        },
      ],
    },
    {
      place: {
        name: 'Le Poids Juste',
        districtId: d.porte,
        orgs: ['Famille Cilovard'],
        description:
          'Taverne sobre, balances au plafond. Bière Juste Mesure. Pièces changeant de poids après minuit (monnaie enchantée du Roi).',
      },
      staff: [
        {
          name: 'Grena Dov',
          breed: 'HUMAIN',
          description: 'Patronne robuste, cheveux gris tressés, regard perçant.',
          ca: 12,
          pv: 28,
          fp: '1/2',
        },
      ],
    },
    {
      place: {
        name: 'La Flamme Sage',
        districtId: d.chant,
        orgs: ["Le Conseil d'Acier", 'Famille Palhindile'],
        description:
          'Entrepôt d\'artistes. Feu ne s\'éteint pas : vert et grésille si mensonge. Vin Feu d\'Azur, spectacle pyromagique.',
      },
      staff: [
        {
          name: 'Lirot',
          breed: 'HUMAIN',
          description: 'Souffleur de verre et serveur, doigts tachés de suie.',
          ca: 11,
          pv: 20,
          fp: '1/4',
        },
      ],
    },
    {
      place: {
        name: 'La Vigne Noire',
        districtId: d.tentations,
        orgs: ["Le Syndicat d'Alagir", "L'Œil Pourpre"],
        description:
          'Salle de jeu, masques dorés. Vin le Serment. Masques absorbent émotions des perdants pour l\'Œil Pourpre.',
      },
      staff: [
        {
          name: 'Dame Arinthe',
          breed: 'HUMAIN',
          description: 'Maîtresse des lieux, beauté statuaire, yeux trop fixes. Robes de velours noir.',
          ca: 14,
          pv: 40,
          fp: '3',
          orgs: ["Le Syndicat d'Alagir"],
        },
      ],
    },
    {
      place: {
        name: 'Le Radeau du Percé',
        districtId: d.chant,
        orgs: ["Le Syndicat d'Alagir"],
        description:
          'Barge à trois ponts. Rhum des Profondeurs. Coffre noir sous la coque : noms de capitaines morts dont les navires accostent encore.',
      },
      staff: [
        {
          name: 'Capitaine Norven',
          breed: 'HUMAIN',
          description: 'Vieux marin maigre, barbe tressée, habit impeccable.',
          ca: 13,
          pv: 32,
          fp: '2',
          orgs: ["Le Syndicat d'Alagir"],
        },
      ],
    },
    {
      place: {
        name: "L'Auberge du Murmure",
        districtId: d.jardins,
        orgs: ['Famille Tovalis', "Le Syndicat d'Alagir"],
        description:
          'Bois sombre, verre coloré dans les murs. Poutre de noms gravés qui s\'effacent à la mort. Thé aux épices de pierre.',
      },
      staff: [
        {
          name: 'Mada Lure',
          breed: 'HUMAIN',
          description: 'Vieille patronne ridée, clé au cou. Entremetteuse entre syndicalistes, prêtres Tal Odius et espions.',
          ca: 11,
          pv: 18,
          fp: '1/4',
          orgs: ["Le Syndicat d'Alagir"],
        },
      ],
    },
  ];

  for (const t of taverns) {
    const placeId = await ensurePlace(cityId, cityX, cityY, {
      ...base,
      name: t.place.name,
      placeType: 'TAVERNE_AUBERGE',
      description: t.place.description,
      districtId: t.place.districtId,
      orgs: t.place.orgs,
    });

    for (const s of t.staff) {
      await ensurePerson(cityId, cityX, cityY, {
        ...base,
        ...s,
        placeId,
        districtId: t.place.districtId,
      });
    }

    // Lier PNJ existants aux tavernes où ils travaillent
    if (t.place.name === 'Le Marteau Courtois') {
      for (const name of ['Boros Varn', 'Tessa Kaorn']) {
        const p = await prisma.personOfInterest.findFirst({ where: { name, cityId } });
        if (p && !p.placeId) {
          await prisma.personOfInterest.update({ where: { id: p.id }, data: { placeId, districtId: d.cinquieme } });
        }
      }
    }
    if (t.place.name === 'La Flamme Sage') {
      const tessa = await prisma.personOfInterest.findFirst({ where: { name: 'Tessa Kaorn', cityId } });
      // Tessa supervise depuis le balcon — on garde Marteau comme lieu principal
      if (tessa) {
        await prisma.organisationMember
          .create({ data: { organisationId: orgIds["Le Conseil d'Acier"]!, personId: tessa.id } })
          .catch(() => {});
      }
    }
  }
}

// ─── PNJ annexes ───────────────────────────────────────────

async function createAdditionalNPCs(
  cityId: string,
  cityX: number,
  cityY: number,
  d: Record<string, string>,
  orgIds: Record<string, string>,
) {
  const base = { cityId, cityX, cityY, orgIds };

  const arena = await prisma.place.findFirst({
    where: {
      cityId,
      OR: [{ name: { contains: 'Arène', mode: 'insensitive' } }, { name: { contains: 'Goulet', mode: 'insensitive' } }],
    },
  });
  const templeOdius = await prisma.place.findFirst({
    where: { cityId, name: { contains: 'Tal Odius', mode: 'insensitive' } },
  });
  const comptoir = await prisma.place.findFirst({
    where: { cityId, name: { contains: 'Comptoir des Lunes', mode: 'insensitive' } },
  });

  const npcs: Parameters<typeof ensurePerson>[3][] = [
    {
      name: 'Marja la Cicatrice',
      breed: 'HUMAIN',
      description:
        'Maîtresse d\'arène. CA 15 · PV 40 · Couteau +6. Intimidation +7. Enregistre tous les gages d\'honneur. Secret : spectacle et chantage.',
      ca: 15,
      pv: 40,
      fp: '3',
      placeId: arena?.id,
      districtId: d.tentations,
      orgs: ["Le Syndicat d'Alagir"],
    },
    {
      name: 'Abbesse Serel',
      breed: 'HUMAIN',
      description:
        'Abbesse du Grand Temple (Ral & Tal Olena / Tal Odius). CA 13 · PV 32. Religion +6, Médecine +5. Fragment de vitrail « vivant ».',
      ca: 13,
      pv: 32,
      fp: '2',
      placeId: templeOdius?.id,
      districtId: d.jardins,
      orgs: [],
    },
    {
      name: 'Prêtre déchu Voren Kahl',
      breed: 'HUMAIN',
      description:
        'Prêtre déchu NM. CA 13 · PV 44. Infestation, Silence, Bannissement. Motiv : répandre la Désolation de Tal Aesir. Espère devenir un œil vivant du dieu.',
      ca: 13,
      pv: 44,
      fp: '4',
      orgs: ["L'Œil Pourpre"],
    },
    {
      name: 'Sarlis Nym',
      breed: 'GNOME',
      description: 'Cambiste nocturne, tient le Comptoir des Lunes (planque Syndicat). Cartes nautiques vivantes en cave.',
      ca: 12,
      pv: 26,
      fp: '2',
      placeId: comptoir?.id,
      districtId: d.chant,
      orgs: ["Le Syndicat d'Alagir"],
    },
    {
      name: 'Derrik Holmar',
      breed: 'HUMAIN',
      description: 'Contremaître Tovalis, carrières du Nord. Loyal, superstitieux.',
      ca: 13,
      pv: 38,
      fp: '2',
      districtId: d.cinquieme,
      orgs: ['Famille Tovalis'],
    },
    {
      name: 'Jesa Tolvine',
      breed: 'HUMAIN',
      description: 'Contremaître taille de bloc. Exigeante, respectée.',
      ca: 12,
      pv: 34,
      fp: '2',
      districtId: d.cinquieme,
      orgs: ['Famille Tovalis'],
    },
    {
      name: 'Bord Amac',
      breed: 'HUMAIN',
      description: 'Contremaître transport fluvial. Bon vivant, corrompu par le Syndicat.',
      ca: 11,
      pv: 28,
      fp: '1',
      districtId: d.chant,
      orgs: ['Famille Tovalis', "Le Syndicat d'Alagir"],
    },
    {
      name: 'Tarn Vess',
      breed: 'HUMAIN',
      description: 'Contremaître entrepôts. Pragmatique, tient les comptes officieux.',
      ca: 11,
      pv: 26,
      fp: '1',
      districtId: d.cinquieme,
      orgs: ['Famille Tovalis'],
    },
    {
      name: 'Maître Verel',
      breed: 'HUMAIN',
      description: 'Croupier masqué de La Vigne Noire. Voix douce et dangereuse.',
      ca: 13,
      pv: 36,
      fp: '3',
      orgs: ["Le Syndicat d'Alagir", "L'Œil Pourpre"],
    },
    {
      name: 'Merr Luth',
      breed: 'NAIN',
      description: 'Nain au tablier propre, Le Poids Juste. Note chaque commande au gramme près.',
      ca: 11,
      pv: 24,
      fp: '1/4',
      orgs: ['Famille Cilovard'],
    },
    {
      name: 'Nimra',
      breed: 'ELFE',
      description: 'Elfe androgyne, La Verrière Fendue. Règle les bougies selon les reflets du vitrail.',
      ca: 12,
      pv: 22,
      fp: '1/2',
      orgs: ['Famille Palhindile'],
    },
    {
      name: 'Dame Arinthe',
      breed: 'HUMAIN',
      description: 'Déjà créée via taverne si import précédent — skip par ensure.',
      ca: 14,
      pv: 40,
      fp: '3',
    },
  ];

  for (const n of npcs) {
    if (n.name === 'Dame Arinthe') continue;
    await ensurePerson(cityId, cityX, cityY, { ...base, ...n });
  }

  // Enrichir descriptions PNJ existants (Guetel nom complet, etc.)
  const guetel = await prisma.personOfInterest.findFirst({ where: { name: 'Guetel', cityId } });
  if (guetel && !guetel.description?.includes('Reine')) {
    await prisma.personOfInterest.update({
      where: { id: guetel.id },
      data: {
        name: 'Guetel Vanguard',
        description:
          (guetel.description ?? '') +
          ' Reine d\'Alagir, complice de Pelfort. Ambassadrice auprès des Duchés des Dolomites. Secret : canal de messagerie chiffrée avec Huriya ; rumeur d\'ancien lien avec le Syndicat.',
      },
    });
    console.log('🔗 Guetel → Guetel Vanguard (enrichi)');
  }
}

// ─── Lier lieux existants aux quartiers ────────────────────

async function linkExistingPlacesToDistricts(cityId: string, d: Record<string, string>) {
  const links: { placeName: string; districtKey: string }[] = [
    { placeName: 'Château de Verre', districtKey: 'chateau' },
    { placeName: 'Géodes Pourprées', districtKey: 'cinquieme' },
    { placeName: 'Arène du Goulet Écarlate', districtKey: 'tentations' },
    { placeName: 'Temple de Tal Aesir (scellé)', districtKey: 'chateau' },
    { placeName: 'Citadelle Rouge', districtKey: 'cinquieme' },
    { placeName: 'Chambres de la Lumière Totale', districtKey: 'chateau' },
    { placeName: "Chancellerie d'Alagir", districtKey: 'chateau' },
    { placeName: 'Manoir des Trois Carrières', districtKey: 'cinquieme' },
    { placeName: 'Couronne de Platine', districtKey: 'porte' },
    { placeName: 'Caisse des Richesses Cachées (C.C.R.C.)', districtKey: 'zitris' },
    { placeName: 'Carrière Écarlate', districtKey: 'cinquieme' },
    { placeName: 'La Place Sombre', districtKey: 'zitris' },
    { placeName: 'Bastion Gris', districtKey: 'cinquieme' },
    { placeName: 'Cour des Ambassades', districtKey: 'chateau' },
    { placeName: 'Verreries Royales', districtKey: 'chateau' },
    { placeName: 'La Garde-Fente', districtKey: 'porte' },
    { placeName: 'Hangar du Poids', districtKey: 'cinquieme' },
    { placeName: 'Grand Temple de Ral & Tal Olena', districtKey: 'jardins' },
    { placeName: 'Académie des Médiateurs', districtKey: 'chateau' },
    { placeName: 'Les Runes de Verre', districtKey: 'chateau' },
    { placeName: "L'Œil d'Étain", districtKey: 'zitris' },
    { placeName: "Le Souffle d'Obsidienne", districtKey: 'tentations' },
    { placeName: "L'Herbe & le Sablier", districtKey: 'jardins' },
    { placeName: 'Le Cabinet du Silence', districtKey: 'porte' },
  ];

  for (const { placeName, districtKey } of links) {
    const place = await prisma.place.findFirst({ where: { name: placeName, cityId } });
    const districtId = d[districtKey];
    if (place && districtId && !place.districtId) {
      await prisma.place.update({ where: { id: place.id }, data: { districtId } });
    }
  }
  console.log('🔗 Lieux existants rattachés aux quartiers');
}

async function enrichExistingPlaces(cityId: string, d: Record<string, string>) {
  // Arène Goulet = alias narratif de Arène des Éclats
  const goulet = await prisma.place.findFirst({
    where: { cityId, name: { contains: 'Goulet', mode: 'insensitive' } },
  });
  const eclats = await prisma.place.findFirst({
    where: { cityId, name: 'Arène des Éclats' },
  });
  if (goulet && eclats && goulet.id !== eclats.id) {
    await prisma.place.update({
      where: { id: goulet.id },
      data: {
        description:
          (goulet.description ?? '') +
          ' Alias courant : Arène des Éclats. Éclats de verre dans le sable absorbent les larmes de sang pour le Roi.',
        districtId: goulet.districtId ?? d.tentations,
      },
    });
  } else if (goulet && !eclats) {
    await prisma.place.update({
      where: { id: goulet.id },
      data: {
        name: 'Arène du Goulet Écarlate (Arène des Éclats)',
        districtId: goulet.districtId ?? d.tentations,
      },
    });
  }
}

const CITY_ID = '6d39b2bc-6488-4763-9643-b57e9af59c03';

async function runStandalone() {
  const pos = await prisma.position.findFirst({ where: { cityId: CITY_ID } });
  await importAlagirRemaining(CITY_ID, pos?.x ?? 0, pos?.y ?? 0);
}

const isMain = process.argv[1]?.includes('import-alagir-remaining');
if (isMain) {
  runStandalone()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
