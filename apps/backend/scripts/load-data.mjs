#!/usr/bin/env node
/**
 * Restaure prisma/data/solenia-full.sql dans une base VIERGE.
 *
 * Le fichier contient le schéma, les données et l'historique des migrations —
 * il n'y a donc PAS de `prisma migrate deploy` à lancer avant. Il ne contient
 * aucune ligne de la table User : créez le compte ensuite avec
 * `ADMIN_PASSWORD="…" npm run db:create-user`.
 *
 * Surtout pas `prisma:seed` après coup : il vide la base avant d'insérer un jeu
 * de démonstration.
 *
 * Usage : npm run db:data:load [chemin/vers/dump.sql]
 */
import { config } from 'dotenv';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

config({ path: join(root, '.env') });
if (!process.env.DATABASE_URL) config({ path: join(root, '..', '..', '.env') });
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL non définie. Créez apps/backend/.env avec DATABASE_URL=...');
  process.exit(1);
}

const fichier = process.argv[2] ?? join(root, 'prisma', 'data', 'solenia-full.sql');
if (!existsSync(fichier)) {
  console.error(`Jeu de données introuvable : ${fichier}`);
  process.exit(1);
}

const base = process.env.DATABASE_URL.replace(/^.*\//, '');
console.log(`Restauration de ${fichier}`);
console.log(`vers la base « ${base} » — elle doit être vide.\n`);

// ON_ERROR_STOP : un échec franc vaut mieux qu'une base à moitié remplie.
const child = spawn('psql', [process.env.DATABASE_URL, '-v', 'ON_ERROR_STOP=1', '-q', '-f', fichier], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  if (code === 0) {
    console.log('\n✓ Base restaurée.');
    console.log('Créez le compte admin :  ADMIN_PASSWORD="…" npm run db:create-user');
  } else {
    console.error(`\n✗ psql a échoué (code ${code}). Si la base n'était pas vide, repartez d'un createdb.`);
  }
  process.exit(code ?? 0);
});
