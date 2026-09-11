#!/usr/bin/env node
/**
 * Régénère prisma/data/solenia-full.sql depuis la base courante.
 *
 * C'est le point de reprise à zéro du projet : schéma + données + historique des
 * migrations, tout sauf les comptes. Trois raisons d'en passer par un dump complet
 * plutôt que par les migrations :
 *  — les migrations ne savent PAS amorcer une base vierge (la première est un
 *    `ALTER TABLE "City"`, le projet a démarré en `db push`) ;
 *  — un dump complet crée les clés étrangères APRÈS les données, ce qui règle les
 *    cycles d'auto-référence d'Organisation et de FamilyMember ;
 *  — `_prisma_migrations` est inclus, donc la base restaurée accepte les migrations
 *    suivantes sans rejouer l'historique.
 *
 * `--exclude-table-data` sur User garantit qu'aucun hash de mot de passe ne part
 * dans le dépôt. Les comptes se recréent avec `npm run db:create-user`.
 *
 * Usage : npm run db:data:dump
 */
import { config } from 'dotenv';
import { spawn } from 'child_process';
import { mkdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

config({ path: join(root, '.env') });
if (!process.env.DATABASE_URL) config({ path: join(root, '..', '..', '.env') });
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL non définie.');
  process.exit(1);
}

const dossier = join(root, 'prisma', 'data');
mkdirSync(dossier, { recursive: true });
const sortie = join(dossier, 'solenia-full.sql');

const child = spawn(
  'pg_dump',
  [process.env.DATABASE_URL, '--exclude-table-data=public."User"', '--no-owner', '--no-privileges', '-f', sortie],
  { stdio: 'inherit', env: process.env },
);

child.on('exit', (code) => {
  if (code !== 0) { console.error(`✗ pg_dump a échoué (code ${code}).`); process.exit(code ?? 1); }

  // Garde-fou : on relit le fichier avant de le laisser filer dans un commit.
  const contenu = readFileSync(sortie, 'utf8');
  const fuite = /\$argon2/i.test(contenu);
  console.log(`✓ ${sortie}`);
  console.log(`  ${(contenu.length / 1024).toFixed(0)} Ko · hash de mot de passe : ${fuite ? 'PRÉSENT ⚠ NE PAS COMMITER' : 'aucun'}`);
  process.exit(fuite ? 1 : 0);
});
