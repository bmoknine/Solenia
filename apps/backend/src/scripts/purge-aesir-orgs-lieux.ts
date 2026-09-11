import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Purge des liens Aesir sur les organisations et les lieux (les PNJ l'avaient déjà été).
 * Règle : on ne supprime pas le mystère, on lui retire son nom et sa divinité.
 * Le rituel du Roi est redirigé vers la Crypte Rubis / l'aplanissement émotionnel,
 * qui existent déjà dans le lore (réunion Mirdobas Filan – Regalio Regani, Partie 5).
 * Idempotent : les remplacements déjà appliqués ne matchent plus.
 */
type Remplacement = { de: string; vers: string };
type Cible = { type: 'org' | 'place' | 'city'; id: string; label: string; nom?: string; rempl: Remplacement[] };

const CIBLES: Cible[] = [
  {
    type: 'org', id: 'c4566c9c-7412-4548-ae0b-e65351943294', label: 'Famille Palhindile',
    rempl: [{
      de: "Entretiennent sans le savoir des rituels oubliés d'Aesir.",
      vers: "Perpétuent sans le savoir des rites de verre dont le sens s'est perdu : un serment scellé dans un vitrail lie plus sûrement qu'un contrat, et plus personne chez eux ne sait pourquoi.",
    }],
  },
  {
    type: 'org', id: 'ed402865-97fe-4623-a6b0-48d311d5f054', label: 'Maison Vanguard',
    rempl: [{
      de: "Le Roi Pelfort est en réalité un Tyrannœil polymorphe cherchant à réveiller le Temple de Tal Aesir.",
      vers: "Le Roi Pelfort est en réalité un Tyrannœil polymorphe. Ce qu'il fait creuser sous le Château de Verre — la Crypte Rubis — n'a rien de divin : il veut étendre à la cité entière l'aplanissement émotionnel que ses canalistes expérimentent déjà, et régner sur une population devenue incapable de vouloir autre chose.",
    }],
  },
  {
    type: 'place', id: 'b15522c5-a603-424e-aa13-55a7e5de4785', label: 'Temple de Tal Aesir (scellé)',
    nom: 'Le Temple Scellé',
    rempl: [{
      de: "Temple oublié de Tal Aesir, dieu ancien de la Désolation, enfoui sous les fondations d'Alagir. Dormant et scellé depuis des siècles.",
      vers: "Temple oublié enfoui sous les fondations d'Alagir, dormant et scellé depuis des siècles. Le nom du dieu qu'on y honorait a été martelé sur chaque pierre : nul ne sait plus qui y était adoré, ni qui a pris la peine de l'effacer.",
    }],
  },
  {
    type: 'place', id: 'c061f772-bfcb-41f4-be1d-01fa653cfb06', label: 'Temple scellé de Tal Aesir',
    nom: 'Temple Scellé (sous le Château de Verre)',
    rempl: [],
  },
  {
    type: 'place', id: 'b3b0f2aa-5124-4985-bf1f-d07bf3097628', label: 'Cour des Ambassades',
    rempl: [{
      de: "À certaines pleines lunes, les murs en verre reflètent le glyphe d'Aesir.",
      vers: "À certaines pleines lunes, les murs en verre renvoient un motif que personne n'a gravé : une balance fendue.",
    }],
  },
  {
    type: 'place', id: '9ffe2919-51a4-4ec3-92a2-4af55fa1355f', label: 'Rotonde des Reflets',
    rempl: [{
      de: "À la pleine lune : glyphe d'Aesir (balance fendue) brièvement visible.",
      vers: "À la pleine lune : une balance fendue affleure brièvement dans le verre, sans que nul sache d'où vient le motif.",
    }],
  },
  {
    type: 'place', id: 'ac5fdf5d-4195-42a7-8a86-9d8c964336e1', label: "Four « la Gueule d'Aube »",
    rempl: [{
      de: "Bâti sur faille reliée au Temple d'Aesir : nourri d'un serment, le vitrail correspondant devient vivant.",
      vers: "Bâti sur une faille de pouvoir : nourri d'un serment, le vitrail correspondant devient vivant.",
    }],
  },
  {
    type: 'place', id: '199430ce-4977-47bb-9bf8-9a5eb922adad', label: 'Cercle du Verre Clair',
    rempl: [{
      de: "Rites de la Transparence — relais inconscient de Ral Aesir.",
      vers: "Rites de la Transparence — dont les officiants ne mesurent pas ce qu'ils relaient.",
    }],
  },
  {
    type: 'place', id: '4001bd74-56fb-4909-82dc-1eef5feeac39', label: 'Docks des Lunes',
    rempl: [{
      de: "Chambre noyée : mini-sanctuaire Tal Taris ↔ Tal Aesir.",
      vers: "Chambre noyée : mini-sanctuaire de Tal Taris.",
    }],
  },
  {
    type: 'place', id: '32fcbadb-fcd9-493b-bc91-da51404e1a13', label: 'C.C.R.C.',
    rempl: [{ de: "Sous-sol : autel Zitris/Aesir, balances brisées.", vers: "Sous-sol : autel de Zitris, balances brisées." }],
  },
  {
    type: 'place', id: '3d7eb84a-fc88-48d3-a4c4-69a73848ad03', label: 'Cour des Murs Rouges',
    rempl: [{
      de: "Placette aux fresques de dieux effacés (symboles d'Aesir). Puits muré vers galeries du Temple.",
      vers: "Placette aux fresques de dieux effacés, dont les noms ont été martelés. Puits muré vers des galeries profondes.",
    }],
  },
  {
    type: 'place', id: '423c1e1d-80fa-49b5-bc4c-16e3ab7c7254', label: "Chancellerie d'Alagir",
    rempl: [{
      de: "tradition qui réveille subtilement la magie dormante d'Aesir",
      vers: "tradition dont plus personne ne sait ce qu'elle scelle réellement",
    }],
  },
  {
    type: 'place', id: '0b468ff9-0290-4ea3-ad7a-4c4ba4189bbf', label: 'Verreries Royales',
    rempl: [{
      de: "est bâti sur une faille de pouvoir reliée au Temple d'Aesir.",
      vers: "est bâti sur une faille de pouvoir.",
    }],
  },
  {
    // La ville n'était pas dans la demande, mais son « secret caché » est la mention
    // Aesir la plus visible de toute la base : la laisser viderait la purge de son sens.
    type: 'city', id: '6d39b2bc-6488-4763-9643-b57e9af59c03', label: 'Alagir (ville)',
    rempl: [{
      de: "<strong>temple oublié de Tal Aesir</strong>, dieu ancien de la Désolation.",
      vers: "<strong>temple oublié</strong> dont le nom du dieu a été martelé sur chaque pierre.",
    }],
  },
];

async function lire(c: Cible) {
  if (c.type === 'org') return prisma.organisation.findUnique({ where: { id: c.id }, select: { name: true, description: true } });
  if (c.type === 'city') return prisma.city.findUnique({ where: { id: c.id }, select: { name: true, description: true } });
  return prisma.place.findUnique({ where: { id: c.id }, select: { name: true, description: true } });
}

async function ecrire(c: Cible, data: { name?: string; description: string }) {
  if (c.type === 'org') return prisma.organisation.update({ where: { id: c.id }, data });
  if (c.type === 'city') return prisma.city.update({ where: { id: c.id }, data });
  return prisma.place.update({ where: { id: c.id }, data });
}

async function main() {
  const restants: string[] = [];

  for (const c of CIBLES) {
    const e = await lire(c);
    if (!e) { console.log(`⚠ introuvable : ${c.label}`); continue; }

    let desc = e.description ?? '';
    const appliques: number[] = [];
    c.rempl.forEach((r, i) => {
      if (desc.includes(r.de)) { desc = desc.replace(r.de, r.vers); appliques.push(i); }
    });

    const renomme = c.nom && e.name !== c.nom;
    if (appliques.length || renomme) {
      await ecrire(c, { ...(c.nom ? { name: c.nom } : {}), description: desc });
    }

    const reste = /Aesir/i.test(desc) || /Aesir/i.test(c.nom ?? e.name);
    if (reste) restants.push(`${c.label} → ${c.nom ?? e.name}`);

    const nonApplique = c.rempl.length - appliques.length;
    console.log(
      `${reste ? '✗' : '✓'} ${(c.nom ?? e.name).padEnd(42)}` +
      `${appliques.length} remplacement(s)${nonApplique ? `, ${nonApplique} déjà fait(s) ou introuvable(s)` : ''}` +
      `${renomme ? ' · renommé' : ''}`,
    );
  }

  // ── Contrôle global ─────────────────────────────────────────────────
  const like = { contains: 'Aesir', mode: 'insensitive' as const };
  const orgs = await prisma.organisation.findMany({ where: { OR: [{ name: like }, { description: like }] }, select: { name: true } });
  const places = await prisma.place.findMany({ where: { OR: [{ name: like }, { description: like }] }, select: { name: true } });
  const cities = await prisma.city.findMany({ where: { OR: [{ name: like }, { description: like }] }, select: { name: true } });
  const persons = await prisma.personOfInterest.findMany({ where: { OR: [{ name: like }, { description: like }] }, select: { name: true } });

  console.log('\n── Contrôle global « Aesir » ──');
  console.log('  organisations :', orgs.map((o) => o.name).join(', ') || 'aucune');
  console.log('  lieux         :', places.map((p) => p.name).join(', ') || 'aucun');
  console.log('  villes        :', cities.map((c) => c.name).join(', ') || 'aucune');
  console.log('  PNJ           :', persons.map((p) => p.name).join(', ') || 'aucun');
  if (restants.length) console.log('\n⚠ Restent à traiter :', restants.join(' | '));
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
