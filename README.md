# Solenia 2.0

Monorepo TypeScript : front React/Vite, back Fastify/Prisma, package partagé Zod.

## Prérequis
- Node 20 (voir `.nvmrc`)
- PostgreSQL (localhost:5432)

## Installation
```bash
npm install
```

## Env backend
Créer `apps/backend/.env` (déjà prérempli en dev) :
```
DATABASE_URL="postgresql://postgres:admin@localhost:5432/solenia"
JWT_SECRET="dev-access-secret"
REFRESH_SECRET="dev-refresh-secret"
PORT=3001
ACCESS_TTL="15m"
REFRESH_TTL="7d"
```

## Commandes
- Backend : `npm run dev --workspace backend`
- Frontend : `npm run dev --workspace frontend`
- Prisma : `npm run prisma:migrate --workspace backend -- --name <nom>`, `npm run prisma:seed --workspace backend`

## Comptes seed
- admin@solenia.dev / Admin!123

## Front
- API par défaut : `http://localhost:3001` (`VITE_API_URL` si besoin).
- Placer l’image de carte en `apps/frontend/public/map.jpg`.
- Carte interactive (zoom/pan), points, popover, auth (login/change-password).

## Clean Code
- Schémas Zod partagés (`packages/shared`) utilisés côté backend.
- Lint exécuté sur front/back.

