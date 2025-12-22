import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { config } from '../config';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: import('fastify').preHandlerHookHandler;
  }

  interface FastifyRequest {
    user?: {
      sub: string;
      type: string;
      email: string;
      username: string;
      iat: number;
      exp: number;
    };
  }
}

export default fp(async (app) => {
  app.register(fastifyJwt, {
    secret: config.jwtSecret,
    sign: { expiresIn: config.accessTtl },
  });

  app.decorate(
    'authenticate',
    async (request) => {
      await request.jwtVerify();
    },
  );
});

