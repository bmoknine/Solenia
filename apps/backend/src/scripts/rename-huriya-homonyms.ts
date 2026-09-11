import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Alagir : on retire le suffixe temporaire "(Alagir)" et on remet le nom d'origine
const ALAGIR: Record<string, string> = {
  '216d16e4-dc88-45be-95bf-aa4469195ae3': 'Lierin Lorial',
  '53f2f592-f1a7-4a7a-8e69-94f1f7e10392': 'Faith',
  '93239b41-8dee-4147-bc01-c5f2bdfd4614': 'Rany Mullimax',
  '7633faa3-0a05-46c2-84ef-2af359ecddbd': 'Jillian Riverpipe',
  'a831e174-ab51-47c3-92db-37b66cc35336': 'Ery Seel',
};

// Huriya : nouveaux noms distincts
const HURIYA: Record<string, string> = {
  '305f7912-1425-49b9-9529-3101b7649577': 'Maddox Vharn',      // ex-Lierin Lorial
  '50f56fba-bd43-49b3-950c-826bb22de8da': 'Doran Kell',        // ex-Ery Seel
  'a769c06b-ef2d-4987-ad34-80758bd81651': 'Vessna Kholt',      // ex-Faith
  '0e7884ef-39e4-426c-ada4-4851a847be10': 'Perla Sonne',       // ex-Jillian Riverpipe
  '149293d0-6af3-42ff-9d20-d61ee6cb087b': 'Tobrin Mullimax',   // ex-Rany Mullimax
};

async function setName(id: string, name: string) {
  await prisma.personOfInterest.update({ where: { id }, data: { name } });
  console.log(`  PNJ ${id} -> ${name}`);
}

async function replaceInPersonDesc(id: string, from: string, to: string) {
  const p = await prisma.personOfInterest.findUnique({ where: { id }, select: { name: true, description: true } });
  if (!p?.description || !p.description.includes(from)) { console.log(`  ⚠️ "${from}" absent de la fiche ${id}`); return; }
  await prisma.personOfInterest.update({ where: { id }, data: { description: p.description.replaceAll(from, to) } });
  console.log(`  desc PNJ [${p.name}] : "${from}" -> "${to}"`);
}

async function replaceInOrgDesc(orgName: string, from: string, to: string) {
  const o = await prisma.organisation.findFirst({ where: { name: orgName }, select: { id: true, description: true } });
  if (!o?.description || !o.description.includes(from)) { console.log(`  ⚠️ "${from}" absent de l'org ${orgName}`); return; }
  await prisma.organisation.update({ where: { id: o.id }, data: { description: o.description.replaceAll(from, to) } });
  console.log(`  desc ORG [${orgName}] : "${from}" -> "${to}"`);
}

async function replaceInPlaceDesc(placeName: string, from: string, to: string) {
  const pl = await prisma.place.findFirst({ where: { name: placeName }, select: { id: true, description: true } });
  if (!pl?.description || !pl.description.includes(from)) { console.log(`  ⚠️ "${from}" absent du lieu ${placeName}`); return; }
  await prisma.place.update({ where: { id: pl.id }, data: { description: pl.description.replaceAll(from, to) } });
  console.log(`  desc PLACE [${placeName}] : "${from}" -> "${to}"`);
}

async function main() {
  console.log('== Restauration des noms Alagir ==');
  for (const [id, name] of Object.entries(ALAGIR)) await setName(id, name);

  console.log('\n== Nouveaux noms Huriya ==');
  for (const [id, name] of Object.entries(HURIYA)) await setName(id, name);

  console.log('\n== Corrections des références croisées (Huriya uniquement) ==');
  // Doran Kell (ex-Ery Seel Huriya) : son patron = Maddox Vharn
  await replaceInPersonDesc('50f56fba-bd43-49b3-950c-826bb22de8da', 'Lierin Lorial', 'Maddox Vharn');
  // Alliance des Veines : Faith -> Vessna Kholt, Jillian Riverpipe -> Perla Sonne
  await replaceInOrgDesc('Alliance des Veines', 'Jillian Riverpipe', 'Perla Sonne');
  await replaceInOrgDesc('Alliance des Veines', 'Faith', 'Vessna Kholt');
  // Compagnie des Voiliers d'Éther : Rany Mullimax -> Tobrin Mullimax
  await replaceInOrgDesc("Compagnie des Voiliers d'Éther", 'Rany Mullimax', 'Tobrin Mullimax');
  // La Grenouille Royale (Huriya) : cousin de Rany Mullimax -> Tobrin Mullimax
  await replaceInPlaceDesc('La Grenouille Royale', 'Rany Mullimax', 'Tobrin Mullimax');

  console.log('\nTerminé.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
