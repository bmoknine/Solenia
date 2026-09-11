import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Retire toute accroche « Aesir » des fiches PNJ en la remplaçant par un ressort
 * équivalent non-Aesir (même fonction narrative), raccroché quand c'est possible
 * à des fils déjà en place (convois nocturnes / Citadelle Rouge, souterrains d'Alagir,
 * l'Œil Pourpre, secrets financiers de Maison).
 */
const REPLACEMENTS: { idPrefix: string; name: string; from: string; to: string }[] = [
  {
    idPrefix: '0622d84c',
    name: 'Lord Calen Palhindile',
    from: "un rouleau portant le glyphe d'Aesir sans en comprendre le sens",
    to: "une correspondance chiffrée de son temps d'ambassadeur, prouvant qu'un traité d'Alagir a été monnayé — un levier qu'il refuse d'utiliser",
  },
  {
    idPrefix: '41fa949e',
    name: 'Selianne Palhindile',
    from: "une lettre mentionnant « la Lumière Fendue » — fragment du rituel d'Aesir",
    to: "une lettre compromettante liant une Maison rivale à un complot contre sa mère la Chancelière — elle ne sait pas encore comment s'en servir",
  },
  {
    idPrefix: '11bbab3d',
    name: 'Prêtre déchu Voren Kahl',
    from: 'la Désolation de Tal Aesir',
    to: "la Désolation au nom de l'Œil Pourpre",
  },
  {
    idPrefix: '87d809bb',
    name: 'Lady Serenya Palhindile',
    from: "note les réactions lumineuses des vitraux — cartographie sans le savoir l'énergie d'Aesir",
    to: "consigne chaque nuit les lumières qui bougent sur l'excavation depuis son balcon — sans le savoir, ses carnets tracent les itinéraires des convois nocturnes vers la Citadelle Rouge",
  },
  {
    idPrefix: '5e356a69',
    name: 'Ismara Cilovard',
    from: "une tablette dorée portant le sceau d'Aesir, encore actif",
    to: "un registre chiffré prouvant un détournement de fonds au sein de sa propre Maison — le garder la ronge, le révéler la briserait",
  },
  {
    idPrefix: '381eb3b5',
    name: 'Lior Palhindile',
    from: "une dalle transparente pulsant d'une lueur rouge — fragment du Temple d'Aesir",
    to: "une dalle de verre gravée d'un plan oublié des souterrains d'Alagir — il n'ose dire à qui il mène",
  },
];

async function main() {
  for (const r of REPLACEMENTS) {
    const person = await prisma.personOfInterest.findFirst({
      where: { id: { startsWith: r.idPrefix } },
      select: { id: true, name: true, description: true },
    });
    if (!person) {
      console.log(`⚠ introuvable : ${r.name} (${r.idPrefix})`);
      continue;
    }
    const desc = person.description ?? '';
    if (!desc.includes(r.from)) {
      const still = /aesir/i.test(desc);
      console.log(`• ${person.name} : phrase Aesir déjà absente ${still ? '(mais « Aesir » subsiste ailleurs !)' : '(rien à faire)'}`);
      continue;
    }
    const next = desc.replace(r.from, r.to);
    await prisma.personOfInterest.update({ where: { id: person.id }, data: { description: next } });
    const clean = !/aesir/i.test(next);
    console.log(`✓ ${person.name} : accroche Aesir remplacée${clean ? '' : ' ⚠ (« Aesir » subsiste encore !)'}`);
  }

  // Contrôle final : plus aucun PNJ ne doit mentionner Aesir
  const remaining = await prisma.personOfInterest.findMany({
    where: { OR: [{ description: { contains: 'Aesir', mode: 'insensitive' } }, { name: { contains: 'Aesir', mode: 'insensitive' } }] },
    select: { name: true },
  });
  console.log(`\nPNJ mentionnant encore « Aesir » : ${remaining.length}`);
  remaining.forEach((x) => console.log('   -', x.name));
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
