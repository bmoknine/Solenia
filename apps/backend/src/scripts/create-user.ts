import 'dotenv/config';
import argon2 from 'argon2';
import { PrismaClient, UserType } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Crée (ou met à jour) un compte, sans toucher au reste de la base.
 *
 * À ne pas confondre avec `prisma:seed`, qui VIDE la base avant d'insérer un jeu
 * de démonstration : après un chargement de données, c'est ce script-ci qu'il faut.
 *
 * Sert aussi à changer un mot de passe :
 *   ADMIN_PASSWORD="…" npx tsx src/scripts/create-user.ts admin
 *
 * Usage : [nom] [email] — par défaut « admin » / admin@solenia.local
 * Le mot de passe vient de ADMIN_PASSWORD, jamais d'un argument (il resterait
 * dans l'historique du shell).
 */
async function main() {
  const username = process.argv[2] ?? 'admin';
  const email = process.argv[3] ?? `${username}@solenia.local`;
  const type = username === 'admin' ? UserType.admin : UserType.editor;

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.error(
      'ADMIN_PASSWORD est absente.\n' +
        'Exemple :\n' +
        '  ADMIN_PASSWORD="votre-mot-de-passe" npx tsx src/scripts/create-user.ts admin',
    );
    process.exit(1);
  }
  if (password.length < 12) {
    console.error('Mot de passe trop court : 12 caractères minimum.');
    process.exit(1);
  }

  const passwordHash = await argon2.hash(password);
  const existant = await prisma.user.findFirst({ where: { username }, select: { id: true } });

  if (existant) {
    await prisma.user.update({ where: { id: existant.id }, data: { passwordHash, type } });
    console.log(`↻ Mot de passe de « ${username} » mis à jour (${type}).`);
  } else {
    await prisma.user.create({ data: { username, email, passwordHash, type } });
    console.log(`+ Compte « ${username} » créé (${type}, ${email}).`);
  }

  const total = await prisma.user.count();
  console.log(`Comptes en base : ${total}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
