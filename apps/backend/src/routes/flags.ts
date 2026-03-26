import type { FastifyInstance } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);

export async function flagRoutes(app: FastifyInstance) {
  const listImages = (folderName: 'flag' | 'map') => {
    const candidates = [
      path.join(process.cwd(), '..', 'frontend', 'public', folderName),
      path.join(process.cwd(), 'apps', 'frontend', 'public', folderName),
    ];
    const targetDir = candidates.find((d) => fs.existsSync(d)) ?? candidates[0];
    let files: string[] = [];
    try {
      if (fs.existsSync(targetDir)) {
        files = fs.readdirSync(targetDir)
          .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
          .map((f) => `/${folderName}/${f}`);
      }
    } catch (err) {
      app.log.warn(err, `Could not read ${folderName} directory`);
    }
    return files;
  };

  app.get('/api/flags', async (_request, reply) => {
    // Dossier flags du frontend (public/flag) — cwd peut être apps/backend ou la racine du monorepo
    const files = listImages('flag');
    return reply.send({ flags: files });
  });

  app.get('/api/maps', async (_request, reply) => {
    // Dossier maps du frontend (public/map) — cwd peut être apps/backend ou la racine du monorepo
    const files = listImages('map');
    return reply.send({ maps: files });
  });
}
