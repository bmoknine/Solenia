import { PrismaClient } from '@prisma/client';
import { importAlagirRemaining } from './import-alagir-remaining';

const prisma = new PrismaClient();
const CITY_ID = '6d39b2bc-6488-4763-9643-b57e9af59c03';

// Coordonnées de la ville pour les positions par défaut
let CITY_X = 0;
let CITY_Y = 0;

async function main() {
  // Récupérer la position de la ville
  const cityPos = await prisma.position.findFirst({ where: { cityId: CITY_ID } });
  if (cityPos) { CITY_X = cityPos.x; CITY_Y = cityPos.y; }

  await fixDuplicate();
  const orgIds = await createOrganisations();
  await createNPCs(orgIds);
  await createPlaces(orgIds);
  await createMagicShopsAndCuriosities();
  await linkExistingNPCs(orgIds);
  await importAlagirRemaining(CITY_ID, CITY_X, CITY_Y);

  console.log('\n✅ Import Alagir terminé avec succès');
}

// ─────────────────────────────────────────
// 1. SUPPRESSION DOUBLON
// ─────────────────────────────────────────
async function fixDuplicate() {
  // "Ekénon Tracx" (sans accent sur le É) est un doublon
  const dup = await prisma.personOfInterest.findFirst({
    where: { name: 'Ekénon Tracx', cityId: CITY_ID },
  });
  if (dup) {
    await prisma.position.deleteMany({ where: { personOfInterestId: dup.id } });
    await prisma.organisationMember.deleteMany({ where: { personId: dup.id } });
    await prisma.personOfInterest.delete({ where: { id: dup.id } });
    console.log('🗑  Doublon "Ekénon Tracx" supprimé');
  } else {
    console.log('ℹ️  Pas de doublon détecté');
  }
}

// ─────────────────────────────────────────
// 2. ORGANISATIONS
// ─────────────────────────────────────────
async function createOrganisations(): Promise<Record<string, string>> {
  const orgsData = [
    {
      name: 'Maison Vanguard',
      orgType: 'PRINCIPAL' as const,
      membership: 'POLITIC' as const,
      desc: "Famille royale régnante d'Alagir. Alignement : Loyal Mauvais (dissimulé). Symbole : vitrail rouge à trois cercles. Siège : Château de Verre. Le Roi Pelfort est en réalité un Tyrannœil polymorphe cherchant à réveiller le Temple de Tal Aesir.",
    },
    {
      name: 'Famille Tovalis',
      orgType: 'PRINCIPAL' as const,
      membership: 'MARCHAND' as const,
      desc: "Maison marchande dominant les carrières de marbre pourpre, guildes de tailleurs, maçons et transporteurs. Devise : \"Par le poids et la veine.\" Siège : Manoir des Trois Carrières. Alignement : Neutre — durs mais justes.",
    },
    {
      name: 'Famille Palhindile',
      orgType: 'PRINCIPAL' as const,
      membership: 'POLITIC' as const,
      desc: "Famille diplomatique dirigeant la Chancellerie d'Alagir. Spécialistes du verre et de la médiation. Symbole : vitrail-colombe fissuré de pourpre. Alignement : Bon Neutre. Entretiennent sans le savoir des rituels oubliés d'Aesir.",
    },
    {
      name: 'Famille Cilovard',
      orgType: 'PRINCIPAL' as const,
      membership: 'MARCHAND' as const,
      desc: "Maison bancaire contrôlant la Couronne de Platine et la Caisse des Richesses Cachées. Symbole : balance dorée asymétrique. Alignement : Loyal Mauvais. Liés malgré eux au Roi-Tyrannœil via un contrat magique.",
    },
    {
      name: 'Le Soleil Pourpre',
      orgType: 'PRINCIPAL' as const,
      membership: 'MILITAIRE' as const,
      desc: "Force armée officielle d'Alagir — milice, garnison, école mercenaire. Devise : \"La lumière ne juge pas, elle brûle.\" Façade légale de l'Œil Pourpre. Siège : Citadelle Rouge.",
    },
    {
      name: "L'Œil Pourpre",
      orgType: 'CELLULE' as const,
      membership: 'CRIMINALITE' as const,
      desc: "Organisation secrète du Roi-Tyrannœil. Noyaute administration et Soleil Pourpre. Réseau d'espions, de prêtres et d'agents financiers voués aux desseins du Tyrannœil.",
    },
    {
      name: "Le Syndicat d'Alagir",
      orgType: 'CELLULE' as const,
      membership: 'CRIMINALITE' as const,
      desc: "Cellule locale du Syndicat international — voleurs et contrebandiers. Siège : La Place Sombre (port). Dirigé par Faith la Grise. Contrôle la contrebande sur l'Artère Azurée.",
    },
    {
      name: "Le Conseil d'Acier",
      orgType: 'CELLULE' as const,
      membership: 'CRIMINALITE' as const,
      desc: "Organisation criminelle internationale. Siège : Bastion Gris (sous la Cinquième Roue). Chef local : Rany Mullimax « Magistrat de Fer ». Contrôle dettes, marchés illégaux, mercenaires. Credo : \"La pression forge les forts.\"",
    },
    {
      name: "La Ligature Bancaire d'Alagir",
      orgType: 'PRINCIPAL' as const,
      membership: 'MARCHAND' as const,
      desc: "Cartel légal bancaire coordonné par Lierin Lorial (haut-elfe, prévôt bancaire). Membres : Couronne de Platine, C.C.R.C., Larmes de Ral Zitris, Banque du Dragon d'Or. Harmonise les taux et l'assurance des caravanes.",
    },
    {
      name: 'La Braise',
      orgType: 'CELLULE' as const,
      membership: 'CRIMINALITE' as const,
      desc: "Cellule activiste et réseau d'incendiaires liés au Syndicat. Sabotage sélectif pour forcer des renégociations sociales. Dirigée en sous-main par Faith, opérations terrain par Jillian Riverpipe.",
    },
  ];

  const orgIds: Record<string, string> = {};
  for (const o of orgsData) {
    const existing = await prisma.organisation.findFirst({ where: { name: o.name } });
    if (existing) {
      orgIds[o.name] = existing.id;
      // S'assurer que la ville est liée
      const link = await prisma.organisationCity.findFirst({
        where: { organisationId: existing.id, cityId: CITY_ID },
      });
      if (!link) {
        await prisma.organisationCity.create({
          data: { organisationId: existing.id, cityId: CITY_ID },
        });
      }
      console.log(`ℹ️  Org déjà existante : ${o.name}`);
      continue;
    }
    const created = await prisma.organisation.create({
      data: {
        name: o.name,
        organisationType: o.orgType,
        membership: o.membership,
        description: o.desc,
      },
    });
    orgIds[o.name] = created.id;
    await prisma.organisationCity.create({ data: { organisationId: created.id, cityId: CITY_ID } });
    console.log(`✅ Org créée : ${o.name}`);
  }
  return orgIds;
}

// ─────────────────────────────────────────
// 3. NOUVEAUX PNJ
// ─────────────────────────────────────────
type Breed =
  | 'HUMAIN'
  | 'ELFE'
  | 'NAIN'
  | 'DEMI_ELFE'
  | 'DEMI_ORC'
  | 'GNOME'
  | 'TIEFFELIN'
  | 'DRAKEIDE'
  | 'OTHER';
type Alignment =
  | 'LOYAL_BON'
  | 'NEUTRE_BON'
  | 'CHAOTIQUE_BON'
  | 'LOYAL_NEUTRE'
  | 'VRAI_NEUTRE'
  | 'CHAOTIQUE_NEUTRE'
  | 'LOYAL_MAUVAIS'
  | 'NEUTRE_MAUVAIS'
  | 'CHAOTIQUE_MAUVAIS';

interface NpcData {
  name: string;
  breed: Breed;
  alignment: Alignment; // stored in description
  ca: number | null;
  pv: number | null;
  fp: number | string | null;
  orgs: string[];
  desc: string;
  STR?: number;
  DEX?: number;
  CON?: number;
  INT?: number;
  WIS?: number;
  CHA?: number;
}

async function createNPCs(orgIds: Record<string, string>) {
  const npcs: NpcData[] = [
    // ── Famille Tovalis ──
    {
      name: 'Daren Tovalis',
      breed: 'HUMAIN',
      alignment: 'VRAI_NEUTRE',
      ca: 13,
      pv: 72,
      fp: 5,
      orgs: ['Famille Tovalis'],
      desc: "Patriarche de la Maison Tovalis, humain 54 ans. Ancien contremaître devenu politicien. Large carrure, mains marquées par la pierre. Fin stratège économique, siège au Conseil Restreint. Contrôle 3 000 travailleurs, 8 carrières principales. Secret : a découvert un document prouvant que le Roi n'est pas ce qu'il semble. Motivation : préserver l'équilibre d'Alagir. « Tout se paie, même la loyauté. »",
    },
    {
      name: 'Maerin Tovalis',
      breed: 'HUMAIN',
      alignment: 'VRAI_NEUTRE',
      ca: 12,
      pv: 38,
      fp: 2,
      orgs: ['Famille Tovalis'],
      desc: "Héritière Tovalis, humaine 27 ans. Gère les contrats de transport fluvial sur l'Artère Azur. Dispose d'une flotte de 12 barges et 4 entrepôts sous douane. Ambitieuse, vive, excellente oratrice. Cherche à moderniser et ouvrir des partenariats avec Huriya. Ignore les secrets de son père mais remarque les incohérences du Soleil Pourpre.",
    },
    {
      name: 'Velric Tovalis',
      breed: 'HUMAIN',
      alignment: 'CHAOTIQUE_NEUTRE',
      ca: 11,
      pv: 24,
      fp: 1,
      orgs: ['Famille Tovalis', 'La Braise'],
      desc: "Fils cadet Tovalis, humain 20 ans. Rebelle, amateur de paris et combats illégaux. Parfois aperçu au Goulet Écarlate. Rumeur : contacts dans La Braise pour trafic de poudre de marbre (stimulant).",
    },
    {
      name: 'Harl Denvar',
      breed: 'DEMI_ORC',
      alignment: 'LOYAL_NEUTRE',
      ca: 15,
      pv: 85,
      fp: 5,
      orgs: ['Famille Tovalis'],
      desc: "Confident et garde du corps de Daren Tovalis, demi-orc 42 ans. Vétéran du Soleil Pourpre à la retraite. Porte les marques d'un duel dans les carrières. Secret : espionne discrètement les réunions du Soleil Pourpre pour Daren. A entendu des officiers employer « Rayon » comme salut codé. Compile un dossier secret intitulé « Les Yeux dans la pierre ».",
    },
    // ── Famille Palhindile ──
    {
      name: 'Lady Serenya Palhindile',
      breed: 'ELFE',
      alignment: 'NEUTRE_BON',
      ca: 15,
      pv: 56,
      fp: 7,
      orgs: ['Famille Palhindile'],
      desc: "Matriarche Palhindile, haute elfe 310 ans. Chancelière d'Alagir. Calme, bienveillante, éloquence sans faille. CA 15 · PV 56 · Rapière +5. Compétences : Persuasion +8, Intuition +6, Religion +5. Traits : Aura de paix (alliés proches avantagés contre la peur), Verre protecteur 1/jour (Apaisement ou Zone de vérité). Secret : note les réactions lumineuses des vitraux — cartographie sans le savoir l'énergie d'Aesir.",
    },
    {
      name: 'Lord Calen Palhindile',
      breed: 'HUMAIN',
      alignment: 'NEUTRE_BON',
      ca: 13,
      pv: 42,
      fp: 5,
      orgs: ['Famille Palhindile'],
      desc: "Époux de Serenya, humain 62 ans. Ancien ambassadeur à Huriya et au Saint-Empire. Érudit passionné d'histoire des religions. CA 13 · PV 42 · Bâton +4. Compétences : Religion +6, Perspicacité +5, Persuasion +5. Trait : Savoir perdu (avantage Histoire sur traces de cultes anciens). Secret : détient un rouleau portant le glyphe d'Aesir sans en comprendre le sens.",
    },
    {
      name: 'Selianne Palhindile',
      breed: 'DEMI_ELFE',
      alignment: 'LOYAL_BON',
      ca: 14,
      pv: 36,
      fp: 4,
      orgs: ['Famille Palhindile'],
      desc: "Héritière Palhindile, demi-elfe 29 ans. Dirige la Cour des Ambassades et l'Académie des Médiateurs. Charismatique, diplomate idéale. CA 14 · PV 36 · Dague +4. Compétences : Persuasion +7, Intuition +6, Tromperie +4. Trait : Voix incorruptible 1/jour (dissipe Charme ou Suggestion). Secret : a intercepté une lettre mentionnant « la Lumière Fendue » — fragment du rituel d'Aesir.",
    },
    {
      name: 'Lior Palhindile',
      breed: 'DEMI_ELFE',
      alignment: 'NEUTRE_BON',
      ca: 12,
      pv: 33,
      fp: 3,
      orgs: ['Famille Palhindile'],
      desc: "Mage archiviste Palhindile, demi-elfe 24 ans. Spécialiste des vitraux anciens. CA 12 · PV 33 · Bâton +3. Sorts mineurs : Lumière, Prestidigitation, Détection de la magie. Sorts niv 1-2 : Bouclier, Identification, Silence, Détection du mal et du bien. Trait : Archiviste du silence (avantage pour langues anciennes). Secret : a trouvé sous son atelier une dalle transparente pulsant d'une lueur rouge — fragment du Temple d'Aesir.",
    },
    // ── Famille Cilovard ──
    {
      name: 'Garran Cilovard',
      breed: 'HUMAIN',
      alignment: 'LOYAL_MAUVAIS',
      ca: 15,
      pv: 68,
      fp: 6,
      orgs: ['Famille Cilovard', "La Ligature Bancaire d'Alagir"],
      desc: "Patriarche Cilovard, humain 58 ans. Directeur de la Couronne de Platine, ministre officieux des finances. Pragmatique, rigide, autoritaire. CA 15 · PV 68 · Canne-épée +6. Compétences : Persuasion +7, Tromperie +6, Intimidation +5. Trait : Sang-froid absolu (avantage peur/charme), Regard du créancier 1/jour (peur DD 14). Secret : a signé un contrat de garantie magique — en réalité un lien d'obéissance latent vers le Roi-Tyrannœil.",
    },
    {
      name: 'Lady Velena Cilovard',
      breed: 'HUMAIN',
      alignment: 'LOYAL_MAUVAIS',
      ca: 14,
      pv: 54,
      fp: 5,
      orgs: ['Famille Cilovard'],
      desc: "Épouse de Garran Cilovard, humaine 55 ans. Dirige la Caisse des Richesses Cachées. Fine manipulatrice, crée des dettes morales sous couvert de générosité. CA 14 · PV 54 · Stylet +5. Trait : Charme du serpent (avantage Tromperie contre nobles et prêtres), Comptabilité sacrée 1/jour (Détection de la magie). Secret : certains de ses registres s'écrivent seuls, en encre rouge vive.",
    },
    {
      name: 'Lorian Cilovard',
      breed: 'HUMAIN',
      alignment: 'LOYAL_MAUVAIS',
      ca: 14,
      pv: 46,
      fp: 4,
      orgs: ['Famille Cilovard'],
      desc: "Fils aîné Cilovard, humain 32 ans. Responsable des échanges extérieurs et du commerce maritime. Ambitieux, érudit en diplomatie économique. CA 14 · PV 46 · Dague +4. Compétences : Persuasion +6, Investigation +5, Intimidation +5. Secret : après un traité avec Gandorènne, il a vu un reflet rouge dans l'encrier — manifestation du Roi observant la transaction.",
    },
    {
      name: 'Ismara Cilovard',
      breed: 'HUMAIN',
      alignment: 'NEUTRE_MAUVAIS',
      ca: 13,
      pv: 32,
      fp: 3,
      orgs: ['Famille Cilovard'],
      desc: "Fille cadette Cilovard, humaine 25 ans. Chargée de la logistique et du transport d'or. Moins ambitieuse, plus lucide — conscience discrète de la famille. CA 13 · PV 32 · Dague +3. Trait : Regard sincère (avantage Persuasion avec le peuple), Marque du remords (ses pièces noircissent quand elle ment). Secret : détient une tablette dorée portant le sceau d'Aesir, encore actif.",
    },
    // ── Le Soleil Pourpre ──
    {
      name: 'Sahi "Lame-Cramoisie"',
      breed: 'HUMAIN',
      alignment: 'LOYAL_NEUTRE',
      ca: 16,
      pv: 95,
      fp: 6,
      orgs: ['Le Soleil Pourpre'],
      desc: "Commandante opérationnelle du Soleil Pourpre. Humaine. Loyale à ce qu'elle croit être un pouvoir légitime, inconsciente de la manipulation occulte du Roi-Tyrannœil. Spécialiste des manœuvres urbaines, protection de convois et fouilles discrètes. Casernes : La Garde-Fente (Porte Pourpre).",
    },
    // ── Le Syndicat ──
    {
      name: '"Le Voileur"',
      breed: 'OTHER',
      alignment: 'CHAOTIQUE_MAUVAIS',
      ca: 15,
      pv: 65,
      fp: 5,
      orgs: ["Le Syndicat d'Alagir"],
      desc: "Assassin fantôme du Syndicat d'Alagir. Identité et race inconnues. Tue sans jamais se montrer. Son corps serait couvert de glyphes d'ombre. Surnommés « Ombres de Sable » avec les autres assassins du Syndicat.",
    },
    {
      name: 'Pellin Droun',
      breed: 'HUMAIN',
      alignment: 'NEUTRE_MAUVAIS',
      ca: 11,
      pv: 28,
      fp: 2,
      orgs: ["Le Syndicat d'Alagir"],
      desc: "Intendant du port pour le Syndicat d'Alagir. Ancien docker passé du côté obscur. Surveille les marchandises illégales. Aucun navire ne quitte Alagir la nuit sans son sceau secret.",
    },
    // ── Le Conseil d'Acier ──
    {
      name: 'Tessa Kaorn',
      breed: 'GNOME',
      alignment: 'LOYAL_MAUVAIS',
      ca: 13,
      pv: 42,
      fp: 5,
      orgs: ["Le Conseil d'Acier"],
      desc: "Coordinatrice des opérations du Conseil d'Acier à Alagir. Gnome cruelle et méthodique. Spécialiste des « réorganisations » : décide qui vit et qui disparaît. Calme et précise, jamais émotionnelle.",
    },
    {
      name: 'Boros Varn',
      breed: 'DEMI_ORC',
      alignment: 'LOYAL_MAUVAIS',
      ca: 17,
      pv: 110,
      fp: 7,
      orgs: ["Le Conseil d'Acier"],
      desc: "Commandant de terrain du Conseil d'Acier. Demi-orc loyal au-delà du raisonnable. Exécuteur principal des sentences du Conseil. Redoutable combattant, fanatiquement discipliné.",
    },
    {
      name: 'Edrik Luneclaire',
      breed: 'HUMAIN',
      alignment: 'LOYAL_NEUTRE',
      ca: 12,
      pv: 35,
      fp: 4,
      orgs: ["Le Conseil d'Acier"],
      desc: "Messager et juge itinérant du Conseil d'Acier. Porte les ordres du Vrai Conseil d'une ville à l'autre. Parle rarement mais ses mots ont force de loi. Rumeur : serait en contact avec le « Commissaire Inconnu », figure du Conseil suprême.",
    },
    // ── Ligature Bancaire ──
    {
      name: 'Ery Seel',
      breed: 'HUMAIN',
      alignment: 'LOYAL_NEUTRE',
      ca: 11,
      pv: 22,
      fp: 2,
      orgs: ["La Ligature Bancaire d'Alagir"],
      desc: "Greffier en chef de la Ligature Bancaire d'Alagir, bras droit de Lierin Lorial. Humain méticuleux et discret. Tient les registres officiels du cartel bancaire.",
    },
    {
      name: 'Mava Roen',
      breed: 'GNOME',
      alignment: 'VRAI_NEUTRE',
      ca: 11,
      pv: 18,
      fp: 2,
      orgs: ["La Ligature Bancaire d'Alagir"],
      desc: "Directrice de place de la Caisse des Richesses Cachées (C.C.R.C.), Place Sombre. Gnome prudente, secrète et très efficace dans la gestion des coffres individuels anonymisés.",
    },
    {
      name: 'Yovan Kelep',
      breed: 'HUMAIN',
      alignment: 'LOYAL_NEUTRE',
      ca: 12,
      pv: 30,
      fp: 3,
      orgs: ["La Ligature Bancaire d'Alagir"],
      desc: "Prêtre-auditeur des Larmes de Ral Zitris. Banque vouée au dieu-compteur Ral Zitris (aspect « contrition par l'exactitude »). Spécialiste des obligations de rançon et dépôts judiciaires.",
    },
    {
      name: 'Saphira Tel-Olem',
      breed: 'HUMAIN',
      alignment: 'VRAI_NEUTRE',
      ca: 12,
      pv: 35,
      fp: 3,
      orgs: ["La Ligature Bancaire d'Alagir"],
      desc: "Dragonnière humaine, directrice de la Banque du Dragon d'Or. Spécialiste de l'escompte et des lettres de crédit à longue portée (routes de Huriya et des cités du Levant).",
    },
    {
      name: 'Baronne Alna Vis',
      breed: 'HUMAIN',
      alignment: 'LOYAL_MAUVAIS',
      ca: 13,
      pv: 44,
      fp: 4,
      orgs: ["La Ligature Bancaire d'Alagir", 'Famille Cilovard'],
      desc: "Baronne comptable, directrice de la Couronne de Platine. Gère le capital-risque, les dotations nobiliaires et les grands travaux. Très proche des Cilovard.",
    },
    // ── Carriers ──
    {
      name: 'Torv Arkhammar',
      breed: 'NAIN',
      alignment: 'VRAI_NEUTRE',
      ca: 14,
      pv: 52,
      fp: 4,
      orgs: ['Famille Tovalis'],
      desc: "Maître-carrier nain de la Carrière Écarlate (carrière à ciel ouvert, veines compactes). Gère les risques de glissements et la « poussière cramoisie » (inhalation : Sauvegarde Con DD 12 ou Désavantage Perception 1 h).",
    },
    {
      name: "Risa d'Olven",
      breed: 'HUMAIN',
      alignment: 'VRAI_NEUTRE',
      ca: 12,
      pv: 38,
      fp: 3,
      orgs: ['Famille Tovalis'],
      desc: "Maîtresse-carrière des Géodes Pourprées. Galeries en cloche, dômes naturels scintillants. Rumeurs de xorns aperçus dans les profondeurs — a renforcé la sécurité des accès.",
    },
    // ── Vanguard (famille) ──
    {
      name: 'Priel Vanguard',
      breed: 'HUMAIN',
      alignment: 'LOYAL_BON',
      ca: null,
      pv: null,
      fp: null,
      orgs: ['Maison Vanguard'],
      desc: "Nourrisson, héritier royal d'Alagir. Fils de Pelfort et Guetel Vanguard. Innocent mais peut servir de levier émotionnel dans les intrigues entourant le trône.",
    },
  ];

  for (const npc of npcs) {
    const existing = await prisma.personOfInterest.findFirst({
      where: { name: npc.name, cityId: CITY_ID },
    });
    if (existing) {
      console.log(`ℹ️  PNJ déjà existant : ${npc.name}`);
      continue;
    }

    const created = await prisma.personOfInterest.create({
      data: {
        name: npc.name,
        breed: npc.breed,
        ca: npc.ca,
        pv: npc.pv,
        fp: npc.fp != null ? String(npc.fp) : null,
        description: npc.desc,
        cityId: CITY_ID,
        showOnMap: false,
        STR: npc.STR ?? 10,
        DEX: npc.DEX ?? 10,
        CON: npc.CON ?? 10,
        INT: npc.INT ?? 10,
        WIS: npc.WIS ?? 10,
        CHA: npc.CHA ?? 10,
      },
    });

    // Liens organisations
    for (const orgName of npc.orgs) {
      const orgId = orgIds[orgName];
      if (orgId) {
        await prisma.organisationMember
          .create({ data: { organisationId: orgId, personId: created.id } })
          .catch(() => {});
      }
    }

    // Position par défaut (ville)
    await prisma.position
      .create({ data: { x: CITY_X, y: CITY_Y, personOfInterestId: created.id } })
      .catch(() => {});

    console.log(`✅ PNJ créé : ${npc.name}`);
  }
}

// ─────────────────────────────────────────
// 4. NOUVEAUX LIEUX
// ─────────────────────────────────────────
async function createPlaces(orgIds: Record<string, string>) {
  const places = [
    {
      name: "Chancellerie d'Alagir",
      type: 'AUTRE' as const,
      desc: "Cœur administratif et diplomatique de la cité. Gère traités, arbitrages et alliances commerciales. 142 employés dont 24 médiateurs. Chaque traité est scellé par un vitrail miniature — tradition qui réveille subtilement la magie dormante d'Aesir. Siège de la Famille Palhindile.",
      orgs: ['Famille Palhindile'],
    },
    {
      name: 'Manoir des Trois Carrières',
      type: 'AUTRE' as const,
      desc: "Siège de la Famille Tovalis, au flanc ouest des Monts Rouges. Bâtisse robuste en marbre pourpre veiné. Centre de décision de toutes les guildes minières et de transport d'Alagir.",
      orgs: ['Famille Tovalis'],
    },
    {
      name: 'Couronne de Platine',
      type: 'AUTRE' as const,
      desc: "Banque d'État d'Alagir, principal pilier du Trésor Royal. Dirigée par Garran Cilovard. Frappe des monnaies, financement des infrastructures, dette publique. Sous-sol : le Comptoir de Résonance — amplificateur psionique du Roi-Tyrannœil à l'insu des employés.",
      orgs: ['Famille Cilovard', "La Ligature Bancaire d'Alagir"],
    },
    {
      name: 'Caisse des Richesses Cachées (C.C.R.C.)',
      type: 'AUTRE' as const,
      desc: "Institution semi-religieuse fondée par Velena Cilovard. Coffres individuels à secret, salles de comptes anonymisées. Siège : Place Sombre. Offre des fonds de charité aux temples en échange de faveurs. Certains registres s'écrivent parfois seuls, en encre rouge.",
      orgs: ['Famille Cilovard', "La Ligature Bancaire d'Alagir"],
    },
    {
      name: 'Carrière Écarlate',
      type: 'AUTRE' as const,
      desc: "Carrière à ciel ouvert dans les Monts Rouges. Veines de marbre compactes de couleur écarlate vif. Maître-carrier : Torv Arkhammar. Risques : glissements, poussière cramoisie (Sauvegarde Con DD 12 ou Désavantage Perception 1 h).",
      orgs: ['Famille Tovalis'],
    },
    {
      name: 'La Place Sombre',
      type: 'AUTRE' as const,
      desc: "Quartier du port, dans le Chant de Tal Taris. Siège local du Syndicat d'Alagir et de la C.C.R.C. Zone contrôlée par Faith la Grise la nuit. Aucun navire ne quitte Alagir sans le sceau secret du Syndicat.",
      orgs: ["Le Syndicat d'Alagir"],
    },
    {
      name: 'Bastion Gris',
      type: 'DONJON_CAVERNE' as const,
      desc: "Forteresse souterraine dissimulée sous la Cinquième Roue. Siège du Conseil d'Acier à Alagir. Un rituel nocturne y est pratiqué chaque nuit : les membres frappent trois fois un mur d'acier, jurant « par la pression, la forme et le silence ».",
      orgs: ["Le Conseil d'Acier"],
    },
    {
      name: 'Cour des Ambassades',
      type: 'AUTRE' as const,
      desc: "Quartier neutre entouré de verreries et jardins. Accueille les envoyés du Saint-Empire, de Gandorènne et d'Huriya. Salle de négociation circulaire : La Rotonde des Reflets. À certaines pleines lunes, les murs en verre reflètent le glyphe d'Aesir.",
      orgs: ['Famille Palhindile'],
    },
    {
      name: 'Verreries Royales',
      type: 'AUTRE' as const,
      desc: "Ateliers d'art sacré produisant les vitraux officiels, sceaux de verre diplomatiques et orbes de lumière. Conservent des moules et formules alchimiques centenaires. Le principal four, « la Gueule d'Aube », est bâti sur une faille de pouvoir reliée au Temple d'Aesir.",
      orgs: ['Famille Palhindile'],
    },
    {
      name: 'La Garde-Fente',
      type: 'AUTRE' as const,
      desc: "Caserne principale du Soleil Pourpre dans la Porte Pourpre. Point de commandement des patrouilles de la ville haute. Quartier général de la Commandante Sahi « Lame-Cramoisie ».",
      orgs: ['Le Soleil Pourpre'],
    },
    {
      name: 'Hangar du Poids',
      type: 'AUTRE' as const,
      desc: "Entrepôt et lieu de réunion hebdomadaire du Conseil des Contremaîtres Tovalis, sur la Cinquième Roue. Sert à la répartition des tâches, sécurité des galeries et discipline ouvrière.",
      orgs: ['Famille Tovalis'],
    },
    {
      name: 'Grand Temple de Ral & Tal Olena',
      type: 'AUTRE' as const,
      desc: "Temple principal d'Alagir dans la Ville Haute. Dédié à Tal Odius (terre, cycle, justice) et Tal Olena (paix, beauté, harmonie). Mêle marbre blanc et vitraux dorés. Un chanoine siège au Conseil Restreint de la ville.",
      orgs: [],
    },
    {
      name: 'Académie des Médiateurs',
      type: 'AUTRE' as const,
      desc: "École diplomatique Palhindile formant médiateurs, orateurs et traducteurs. L'art de la négociation s'y enseigne comme un sacerdoce. Officially educational, it secretly trains diplomate-mystiques qui croient en la résonance des serments.",
      orgs: ['Famille Palhindile'],
    },
  ];

  for (const p of places) {
    const existing = await prisma.place.findFirst({ where: { name: p.name, cityId: CITY_ID } });
    if (existing) {
      console.log(`ℹ️  Lieu déjà existant : ${p.name}`);
      continue;
    }

    const created = await prisma.place.create({
      data: {
        name: p.name,
        placeType: p.type,
        description: p.desc,
        cityId: CITY_ID,
        showOnMap: false,
      },
    });

    // Position
    await prisma.position
      .create({ data: { x: CITY_X, y: CITY_Y, placeId: created.id } })
      .catch(() => {});

    // Liens organisations
    for (const orgName of p.orgs) {
      const orgId = orgIds[orgName];
      if (orgId) {
        await prisma.organisationPlace
          .create({ data: { placeId: created.id, organisationId: orgId } })
          .catch(() => {});
      }
    }

    console.log(`✅ Lieu créé : ${p.name}`);
  }
}

// ─────────────────────────────────────────
// 5. MAGASINS DE MAGIE & CURIOSITÉS
// ─────────────────────────────────────────
async function createMagicShopsAndCuriosities() {
  type PlaceType = 'MAGASIN_MAGIE' | 'HERBORISTE_APOTHICAIRE';

  const shops: {
    placeName: string;
    placeType: PlaceType;
    placeDesc: string;
    owner: {
      name: string;
      breed: Breed;
      desc: string;
      ca?: number;
      pv?: number;
      fp?: string;
    };
  }[] = [
    {
      placeName: 'Les Runes de Verre',
      placeType: 'MAGASIN_MAGIE',
      placeDesc:
        "Quartier du Château de Verre, rue des Sceaux Lumineux. Façade de carreaux de verre polis changeant de couleur selon la lumière. Intérieur baigné d'un éclat bleuté, runes de protection flottant le long des murs. Spécialités : gravure de runes mineures, miroirs d'alarme, sceaux lumineux, lentilles d'espionnage (atelier discret). Clientèle : Palhindile, nobles Cilovard, mages urbains. Secret : au sous-sol, le Fragment du Vitrail Brisé peut révéler la forme véritable d'une créature polymorphe — y compris le Roi.",
      owner: {
        name: 'Maître Alyenra Verth',
        breed: 'ELFE',
        desc: "Elfe pâle aux cheveux lilas, yeux couleur opale. Robe à motifs de vitraux, gants de soie runique. Parle lentement, diction parfaite, ironie feutrée : « Une rune mal tracée, c'est comme une promesse mal tenue : ça explose toujours au mauvais moment. » Garde le Fragment du Vitrail Brisé derrière un sort de miroir inversé.",
        ca: 13,
        pv: 40,
        fp: '2',
      },
    },
    {
      placeName: "L'Œil d'Étain",
      placeType: 'MAGASIN_MAGIE',
      placeDesc:
        "Les Comptes de Zitris, ruelle de la Balance. Magasin étroit et profond, bougies vertes et vitrail d'œil stylisé. Étagères de grimoires, fioles, loupes et plumes animées. Petites créatures de métal (araignées, papillons, rats d'étain) nettoient et classent les objets. Spécialités : objets utilitaires, réparation d'artefacts, composants rares, traçage magique de résidus arcaniques. Clientèle : scribes, marchands, jeunes mages, Syndicat.",
      owner: {
        name: 'Edran Voss',
        breed: 'GNOME',
        desc: "Gnome au crâne rasé, lunettes à triple lentille, tablier de cuir. Bras gauche automate couvert de glyphes — animé par l'âme de son apprenti mort dans une explosion. Parle très vite : « Non, pas ce flacon-là, il boude. Prenez celui qui tremble un peu, il aime les aventuriers. » Certains soirs le bras écrit seul dans une langue oubliée.",
        ca: 12,
        pv: 28,
        fp: '1',
      },
    },
    {
      placeName: "Le Souffle d'Obsidienne",
      placeType: 'MAGASIN_MAGIE',
      placeDesc:
        "Quartier des Tentations, ruelle du Masque Fendu. Devanture noire mate, lanternes de verre fumé. Intérieur chaud : cannelle, soufre, musc, fleurs fanées. Étagères de pierre volcanique, fioles, poudres, statuettes serpentines. Spécialités : parfums alchimiques (charme, peur, sincérité, oubli), encens psioniques, herbes et huiles enchantées, potions de charme ou combustion émotionnelle. Clientèle : espions, courtisans, Syndicat.",
      owner: {
        name: 'Isha Ka',
        breed: 'TIEFFELIN',
        desc: "Tieffeline à la peau cendrée, yeux dorés, tatouages runiques sur la gorge. Bijoux d'os et anneaux serpentins. Voix douce, légèrement sifflante : « Chaque parfum a une intention, chaque poison une poésie. » Son faucon translucide Voriel est un fragment de son pouvoir vital — si Voriel meurt, elle s'effondre.",
        ca: 13,
        pv: 45,
        fp: '3',
      },
    },
    {
      placeName: "L'Herbe & le Sablier",
      placeType: 'HERBORISTE_APOTHICAIRE',
      placeDesc:
        "Jardins des Âmes. Mi-herboristerie, mi-atelier d'antiquaire. Plantes suspendues, bocaux empilés, montres et sabliers au plafond. Sol pavé de carreaux gravés de symboles différents. Spécialités : plantes médicinales, herbes de chance, talismans d'ancrage, encens de purification, restauration d'objets anciens, analyse d'aura végétale. Secret : sous le plancher, une racine vivante de l'Arbre de Tal Odius arrosée d'une goutte de son sang chaque lune.",
      owner: {
        name: 'Salome Lirn',
        breed: 'HUMAIN',
        desc: "Humaine ridée, longue natte argentée, lunettes rondes toujours sales. Parle lentement : « Chaque feuille connaît une époque, chaque graine se souvient d'un visage. » Son chat à deux queues Khem dort sur le comptoir. Garde sous le plancher une racine vivante de l'Arbre de Tal Odius.",
        ca: 11,
        pv: 22,
        fp: '1',
      },
    },
    {
      placeName: 'Le Cabinet du Silence',
      placeType: 'MAGASIN_MAGIE',
      placeDesc:
        "Porte Pourpre, caché derrière la Caisse des Richesses Cachées. Façade sans enseigne, porte de bois sombre encadrée d'onyx. Intérieur silencieux : tentures noires absorbent le son, vitrines en cristal, lumière froide bleutée. Spécialités : objets magiques rares (armes muettes, bagues d'oubli, fioles de silence), souvenirs encapsulés, effacement émotionnel ciblé. Clientèle : aristocratie, espions du Roi, Cilovard. Rumeur : Dovren n'aurait pas d'ombre — mais son reflet dans la vitre bouge encore après son départ.",
      owner: {
        name: 'Dovren Sile',
        breed: 'HUMAIN',
        desc: "Humain d'âge indéterminable, costume noir sans ornement, cheveux argentés impeccables. Voix calme, presque inaudible, résonne dans la tête : « Les sons sont des dettes. Je préfère le silence des transactions parfaites. » Rumeur : illusion consciente créée par le magasin lui-même.",
        ca: 14,
        pv: 52,
        fp: '5',
      },
    },
  ];

  for (const shop of shops) {
    let place = await prisma.place.findFirst({
      where: { name: shop.placeName, cityId: CITY_ID },
    });

    if (!place) {
      place = await prisma.place.create({
        data: {
          name: shop.placeName,
          placeType: shop.placeType,
          description: shop.placeDesc,
          cityId: CITY_ID,
          showOnMap: false,
        },
      });
      await prisma.position
        .create({ data: { x: CITY_X, y: CITY_Y, placeId: place.id } })
        .catch(() => {});
      console.log(`✅ Magasin créé : ${shop.placeName}`);
    } else {
      console.log(`ℹ️  Magasin déjà existant : ${shop.placeName}`);
    }

    const existingOwner = await prisma.personOfInterest.findFirst({
      where: { name: shop.owner.name, cityId: CITY_ID },
    });
    if (existingOwner) {
      if (!existingOwner.placeId) {
        await prisma.personOfInterest.update({
          where: { id: existingOwner.id },
          data: { placeId: place.id },
        });
      }
      console.log(`ℹ️  Tenancier déjà existant : ${shop.owner.name}`);
      continue;
    }

    const owner = await prisma.personOfInterest.create({
      data: {
        name: shop.owner.name,
        breed: shop.owner.breed,
        description: shop.owner.desc,
        ca: shop.owner.ca ?? null,
        pv: shop.owner.pv ?? null,
        fp: shop.owner.fp ?? null,
        cityId: CITY_ID,
        placeId: place.id,
        showOnMap: false,
        STR: 10,
        DEX: 10,
        CON: 10,
        INT: 10,
        WIS: 10,
        CHA: 10,
      },
    });

    await prisma.position
      .create({ data: { x: CITY_X, y: CITY_Y, personOfInterestId: owner.id } })
      .catch(() => {});

    console.log(`✅ Tenancier créé : ${shop.owner.name} → ${shop.placeName}`);
  }
}

// ─────────────────────────────────────────
// 6. LIENS PNJ EXISTANTS → ORGANISATIONS
// ─────────────────────────────────────────
async function linkExistingNPCs(orgIds: Record<string, string>) {
  const links: { name: string; orgs: string[] }[] = [
    { name: 'Pelfort Vanguard', orgs: ['Maison Vanguard', "L'Œil Pourpre"] },
    { name: 'Guetel', orgs: ['Maison Vanguard'] },
    { name: 'Ékénon Tracx', orgs: ['Le Soleil Pourpre', 'Maison Vanguard'] },
    { name: 'Lierin Lorial', orgs: ["La Ligature Bancaire d'Alagir"] },
    { name: 'Faith', orgs: ["Le Syndicat d'Alagir", 'La Braise'] },
    { name: 'Rany Mullimax', orgs: ["Le Conseil d'Acier"] },
    { name: 'Jillian Riverpipe', orgs: ["Le Syndicat d'Alagir", 'La Braise'] },
  ];

  for (const l of links) {
    const pnj = await prisma.personOfInterest.findFirst({
      where: { name: l.name, cityId: CITY_ID },
    });
    if (!pnj) { console.log(`⚠️  PNJ non trouvé : ${l.name}`); continue; }

    for (const orgName of l.orgs) {
      const orgId = orgIds[orgName];
      if (!orgId) continue;
      await prisma.organisationMember
        .create({ data: { organisationId: orgId, personId: pnj.id } })
        .catch(() => {});
    }
    console.log(`🔗 Liens mis à jour : ${l.name}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
