#!/usr/bin/env node
/**
 * Charge .env puis exécute prisma migrate deploy.
 * Usage: node scripts/run-migrate.mjs (depuis apps/backend)
 */
import { config } from 'dotenv';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
// Charger .env depuis apps/backend ou racine du monorepo
config({ path: join(root, '.env') });
if (!process.env.DATABASE_URL) config({ path: join(root, '..', '..', '.env') });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL non définie. Créez un fichier .env dans apps/backend avec DATABASE_URL=...');
  process.exit(1);
}

const child = spawn('npx', ['prisma', 'migrate', 'deploy'], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
  shell: true,
});
child.on('exit', (code) => process.exit(code ?? 0));
