import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CITY_LABELS: Record<string, string> = {
  '6d39b2bc-6488-4763-9643-b57e9af59c03': 'Alagir',
  '57171985-dade-4fcc-a00b-c06de058c7d6': 'Huriya',
};

const IDS = [
  '216d16e4-dc88-45be-95bf-aa4469195ae3', // Lierin Lorial (Alagir)
  '305f7912-1425-49b9-9529-3101b7649577', // Lierin Lorial (Huriya)
  '53f2f592-f1a7-4a7a-8e69-94f1f7e10392', // Faith (Alagir)
  'a769c06b-ef2d-4987-ad34-80758bd81651', // Faith (Huriya)
  '93239b41-8dee-4147-bc01-c5f2bdfd4614', // Rany Mullimax (Alagir)
  '149293d0-6af3-42ff-9d20-d61ee6cb087b', // Rany Mullimax (Huriya)
  '7633faa3-0a05-46c2-84ef-2af359ecddbd', // Jillian Riverpipe (Alagir)
  '0e7884ef-39e4-426c-ada4-4851a847be10', // Jillian Riverpipe (Huriya)
  '50f56fba-bd43-49b3-950c-826bb22de8da', // Ery Seel (Huriya)
  'a831e174-ab51-47c3-92db-37b66cc35336', // Ery Seel (Alagir)
];

async function main() {
  for (const id of IDS) {
    const p = await prisma.personOfInterest.findUnique({ where: { id }, select: { name: true, cityId: true } });
    if (!p) { console.log(`INTROUVABLE ${id}`); continue; }
    if (p.name.includes('(')) { console.log(`Déjà suffixé, ignoré : ${p.name}`); continue; }
    const label = p.cityId ? CITY_LABELS[p.cityId] : undefined;
    if (!label) { console.log(`Ville inconnue pour ${p.name} (city=${p.cityId}), ignoré`); continue; }
    const newName = `${p.name} (${label})`;
    await prisma.personOfInterest.update({ where: { id }, data: { name: newName } });
    console.log(`  ${p.name}  ->  ${newName}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
