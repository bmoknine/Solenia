import type { FastifyInstance } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);

export async function flagRoutes(app: FastifyInstance) {
  app.get('/api/flags', async (_request, reply) => {
    // Dossier flags du frontend (public/flag) — cwd peut être apps/backend ou la racine du monorepo
    const candidates = [
      path.join(process.cwd(), '..', 'frontend', 'public', 'flag'),
      path.join(process.cwd(), 'apps', 'frontend', 'public', 'flag'),
    ];
    const flagDir = candidates.find((d) => fs.existsSync(d)) ?? candidates[0];
    let files: string[] = [];
    try {
      if (fs.existsSync(flagDir)) {
        files = fs.readdirSync(flagDir)
          .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
          .map((f) => `/flag/${f}`);
      }
    } catch (err) {
      app.log.warn(err, 'Could not read flag directory');
    }
    return reply.send({ flags: files });
  });
}
