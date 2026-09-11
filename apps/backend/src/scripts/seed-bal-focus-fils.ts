import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FIL_RIGART_TITLE = '[Fil] Compagnie Rigart — Illevas';
const FIL_RIGART_DESC = `Fil porté par Illevas (protagoniste). Objectif du soir : donner suite à l'offre de Maître Ulric Brumel (cf. journal) — préparer la libération d'Eldric Rigart, retenu dans les geôles des Cilovard sur l'île, et mettre la main sur le contrat signé par Haldor qui a fait basculer 49 % de la compagnie (Rigart & fils / « Victus & fils »).

Ce que le bal permet de récolter :
— Ismara Cilovard (voir sa péripétie de contact) : bien traitée, elle devient une alliée et confirme l'existence du contrat Haldor. Son propre secret comptable en fait un levier.
— Maerin Tovalis : laisse entendre qu'« Eldric ne signe plus » — il est tenu sous contrainte.
— Ordan Tovalis provoque en public : la tension Cilovard / Rigart s'affiche au grand jour.

Sortie de soirée : Illevas repart avec la localisation (geôles Cilovard, sur l'île) et la piste du contrat → prépare l'opération de sauvetage d'Eldric et de récupération du contrat de cession.`;

const FIL_ESCLAVAGE_TITLE = '[Fil] Esclavagisme — Ezbehar';
const FIL_ESCLAVAGE_DESC = `Fil porté par Ezbehar. Objectif du soir : reprendre la piste Mastiggia (il a déjà pris Vittore en chasse au Fretin) et sonder le terrain de l'abolition.

Ce que le bal permet de récolter :
— Vittore Mastiggia, émissaire présent : sous ses dehors de marchand dolomicien, il propose des « contrats de main-d'œuvre » troubles. Face à Ezbehar, la rencontre est tendue — ils se connaissent déjà.
— Selianne Palhindile (voir sa péripétie de contact) : évoque sa loi d'abolition et ce négociant dolomicien qui rôde de trop près.

Sortie de soirée : le fil de l'abolition est amorcé → il enchaîne directement sur le Bal Palhindile (Soir 2), où la proposition d'abolition de l'esclavage sera développée.`;

const NOTES_MARKER = 'Focus PJ';
const NOTES_APPEND = `\nFocus PJ : Compagnie Rigart → Illevas (libérer Eldric + contrat Haldor) ; Esclavagisme → Ezbehar (Mastiggia / Palhindile) → enchaîne sur le Bal Palhindile (Soir 2, abolition).`;

async function main() {
  const bal = await prisma.quest.findFirst({
    where: { title: { contains: 'Bal', mode: 'insensitive' } },
    select: { id: true, title: true, notes: true },
  });
  if (!bal) throw new Error('Quête « Bal » introuvable.');

  async function ensureStep(title: string, description: string) {
    const step = await prisma.questStep.findFirst({ where: { questId: bal!.id, title } });
    if (!step) {
      await prisma.questStep.create({ data: { questId: bal!.id, title, description, optional: false, order: 999 } });
      console.log(`Étape créée : « ${title} ».`);
    } else {
      await prisma.questStep.update({ where: { id: step.id }, data: { description, optional: false } });
      console.log(`Étape mise à jour : « ${title} ».`);
    }
  }

  await ensureStep(FIL_RIGART_TITLE, FIL_RIGART_DESC);
  await ensureStep(FIL_ESCLAVAGE_TITLE, FIL_ESCLAVAGE_DESC);

  // Réordonner : les deux fils juste après « Les invités du Bal — les trois Maisons ».
  const steps = await prisma.questStep.findMany({
    where: { questId: bal.id },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    select: { id: true, title: true },
  });
  const filR = steps.find((s) => s.title === FIL_RIGART_TITLE)!;
  const filE = steps.find((s) => s.title === FIL_ESCLAVAGE_TITLE)!;
  const base = steps.filter((s) => s.id !== filR.id && s.id !== filE.id);

  const seq: { id: string; title: string }[] = [];
  for (const s of base) {
    seq.push(s);
    if (s.title === 'Les invités du Bal — les trois Maisons') {
      seq.push(filR, filE);
    }
  }
  if (!seq.some((s) => s.id === filR.id)) seq.push(filR, filE); // filet de sécurité

  for (let i = 0; i < seq.length; i++) {
    await prisma.questStep.update({ where: { id: seq[i].id }, data: { order: i } });
  }
  console.log('\nOrdre des étapes du Bal :');
  seq.forEach((s, i) => console.log(`   ${String(i).padStart(2)} · ${s.title}`));

  // Note MJ : pointeur de focus (idempotent).
  if (!(bal.notes ?? '').includes(NOTES_MARKER)) {
    await prisma.quest.update({ where: { id: bal.id }, data: { notes: (bal.notes ?? '') + NOTES_APPEND } });
    console.log('\nNote MJ : pointeur « Focus PJ » ajouté.');
  } else {
    console.log('\nNote MJ : pointeur « Focus PJ » déjà présent.');
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
