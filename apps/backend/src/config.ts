export const config = {
  port: Number(process.env.PORT ?? 3001),
  host: process.env.HOST ?? '0.0.0.0',
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? 'please-change-me',
  refreshSecret: process.env.REFRESH_SECRET ?? 'please-change-me-too',
  accessTtl: process.env.ACCESS_TTL ?? '15m',
  refreshTtl: process.env.REFRESH_TTL ?? '7d',
};

