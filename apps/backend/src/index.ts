import dotenv from 'dotenv';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import prismaPlugin from './plugins/prisma';
import authPlugin from './plugins/auth';
import { config } from './config';
import { authRoutes } from './routes/auth';
import { kingdomRoutes } from './routes/kingdoms';
import { cityRoutes } from './routes/cities';
import { districtRoutes } from './routes/districts';
import { placeRoutes } from './routes/places';
import { personRoutes } from './routes/persons';
import { commentRoutes } from './routes/comments';
import { positionRoutes } from './routes/positions';
import { mapRoutes } from './routes/map';
import { organisationRoutes } from './routes/organisations';
import { loreRoutes } from './routes/lores';

dotenv.config();

export const buildServer = () => {
  const app = Fastify({
    logger: true,
  });

  app.register(sensible);
  app.register(cors, {
    origin: true,
  });

  app.register(prismaPlugin);
  app.register(authPlugin);

  app.get('/health', async () => ({ status: 'ok' }));
  app.register(authRoutes);
  app.register(kingdomRoutes);
  app.register(cityRoutes);
  app.register(districtRoutes);
  app.register(placeRoutes);
  app.register(personRoutes);
  app.register(commentRoutes);
  app.register(positionRoutes);
  app.register(mapRoutes);
  app.register(organisationRoutes);
  app.register(loreRoutes);

  return app;
};

const start = async () => {
  const app = buildServer();
  try {
    await app.listen({ port: config.port, host: config.host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

