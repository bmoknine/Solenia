import type { FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';
import { createWriteStream, mkdirSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { requireRole } from '../utils/rbac';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';

// Dossier de destination : apps/frontend/public/maps/
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MAPS_DIR = join(__dirname, '..', '..', '..', 'frontend', 'public', 'maps');

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 Mo

export async function uploadRoutes(app: FastifyInstance) {
  app.register(multipart, {
    limits: { fileSize: MAX_FILE_SIZE },
  });

  app.post(
    '/upload/map',
    { preHandler: requireRole(app, ['admin', 'editor']) },
    async (request, reply) => {
      const data = await request.file();
      if (!data) return reply.badRequest('Aucun fichier reçu');

      const ext = extname(data.filename).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return reply.badRequest(`Extension non autorisée : ${ext}. Formats acceptés : png, jpg, gif, webp, svg`);
      }

      mkdirSync(MAPS_DIR, { recursive: true });

      const filename = `${randomUUID()}${ext}`;
      const dest = join(MAPS_DIR, filename);

      await pipeline(data.file, createWriteStream(dest));

      return { url: `/maps/${filename}` };
    },
  );
}
