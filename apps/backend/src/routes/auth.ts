import type { FastifyInstance } from 'fastify';
import argon2 from 'argon2';
import { changePasswordSchema, loginSchema, registerSchema, userTypeSchema } from '@solenia/shared';
import { config } from '../config';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', {
    handler: async (request, reply) => {
      const data = registerSchema.parse(request.body);
      const existing = await app.prisma.user.findUnique({ where: { email: data.email } });
      if (existing) {
        return reply.conflict('Email déjà utilisé.');
      }

      const passwordHash = await argon2.hash(data.password);
      const user = await app.prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          passwordHash,
          type: data.type,
        },
      });

      const accessToken = app.jwt.sign(
        { sub: user.id, type: user.type, email: user.email, username: user.username },
        { expiresIn: config.accessTtl },
      );
      const refreshToken = app.jwt.sign(
        { sub: user.id, type: user.type, email: user.email, username: user.username },
        { expiresIn: config.refreshTtl, key: config.refreshSecret },
      );

      return { user: { id: user.id, email: user.email, username: user.username, type: user.type }, accessToken, refreshToken };
    },
  });

  app.post('/auth/login', {
    handler: async (request, reply) => {
      try {
        const data = loginSchema.parse(request.body);
        const user = await app.prisma.user.findUnique({ where: { email: data.email } });
        if (!user) return reply.unauthorized('Identifiants invalides.');

        const valid = await argon2.verify(user.passwordHash, data.password);
        if (!valid) return reply.unauthorized('Identifiants invalides.');

        const accessToken = app.jwt.sign(
          { sub: user.id, type: user.type, email: user.email, username: user.username },
          { expiresIn: config.accessTtl },
        );
        const refreshToken = app.jwt.sign(
          { sub: user.id, type: user.type, email: user.email, username: user.username },
          { expiresIn: config.refreshTtl, key: config.refreshSecret },
        );
        return { user: { id: user.id, email: user.email, username: user.username, type: user.type }, accessToken, refreshToken };
      } catch (err) {
        app.log.error({ err }, 'login failed');
        return reply.internalServerError('Login failed');
      }
    },
  });

  app.post('/auth/refresh', {
    handler: async (request, reply) => {
      const auth = request.headers.authorization;
      if (!auth?.startsWith('Bearer ')) return reply.unauthorized('Token manquant.');
      const token = auth.substring('Bearer '.length);

      let payload: { sub: string };
      try {
        payload = app.jwt.verify<{ sub: string }>(token, { key: config.refreshSecret });
      } catch {
        return reply.unauthorized('Refresh token invalide.');
      }

      const user = await app.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) return reply.unauthorized('Utilisateur introuvable.');

      const accessToken = app.jwt.sign(
        { sub: user.id, type: user.type, email: user.email, username: user.username },
        { expiresIn: config.accessTtl },
      );
      const refreshToken = app.jwt.sign(
        { sub: user.id, type: user.type, email: user.email, username: user.username },
        { expiresIn: config.refreshTtl, key: config.refreshSecret },
      );

      return { user: { id: user.id, email: user.email, username: user.username, type: user.type }, accessToken, refreshToken };
    },
  });

  app.get('/auth/me', {
    preHandler: [app.authenticate],
    handler: async (request) => {
      const userId = request.user?.sub;
      const user = userId
        ? await app.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, username: true, type: true },
          })
        : null;
      return { user };
    },
  });

  app.get('/auth/roles', {
    handler: () => ({ roles: userTypeSchema.options }),
  });

  app.post('/auth/change-password', {
    preHandler: [app.authenticate],
    handler: async (request, reply) => {
      const data = changePasswordSchema.parse(request.body);
      const userId = request.user?.sub;
      if (!userId) return reply.unauthorized();

      const user = await app.prisma.user.findUnique({ where: { id: userId } });
      if (!user) return reply.unauthorized();

      const valid = await argon2.verify(user.passwordHash, data.oldPassword);
      if (!valid) return reply.unauthorized('Ancien mot de passe incorrect.');

      const newHash = await argon2.hash(data.newPassword);
      await app.prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });
      return { status: 'ok' };
    },
  });
}

