# Solenia

Application de world-building pour une campagne de jeu de rôle : carte interactive,
fiches d'entités (royaumes, villes, quartiers, lieux, PNJ, PJ), organisations avec
arbres généalogiques et organigrammes, quêtes, journal de campagne et page Maître du Jeu.

Monorepo npm workspaces : `apps/frontend` (React + Vite + Leaflet), `apps/backend`
(Fastify + Prisma + PostgreSQL), `packages/shared` (schémas zod partagés).

---

## Remonter le site à partir de zéro

Le dépôt contient **tout ce qu'il faut pour reconstruire une instance complète avec les
données du monde** : `apps/backend/prisma/data/solenia-full.sql`. Il ne contient
délibérément **aucun compte** — vous créez le vôtre à la dernière étape.

```bash
git clone https://github.com/bmoknine/Solenia.git
cd Solenia
npm install
```

Créez `apps/backend/.env` :

```
DATABASE_URL=postgresql://UTILISATEUR:MOT_DE_PASSE@localhost:5432/solenia
JWT_SECRET=une-chaîne-longue-et-aléatoire
ACCESS_TTL=24h
REFRESH_TTL=30d
```

Puis :

```bash
createdb solenia                                          # base VIERGE
cd apps/backend
npm run db:data:load                                      # schéma + données + historique de migration
ADMIN_PASSWORD="votre-mot-de-passe" npm run db:create-user
```

Et c'est tout :

```bash
cd ../..
npm run dev        # backend sur :3001, frontend sur :5173
```

Connectez-vous avec `admin` et le mot de passe que vous venez de choisir.

### Pourquoi un dump plutôt que les migrations

`prisma migrate deploy` **ne sait pas amorcer une base vierge** dans ce projet : la
toute première migration est un `ALTER TABLE "City"`, parce que le schéma initial a été
créé avec `db push` avant que l'historique de migrations n'existe. Il n'y a donc pas de
migration de création.

Le dump complet contourne le problème et vaut mieux pour une reprise : il pose le schéma,
les données et la table `_prisma_migrations` en une passe — la base restaurée accepte donc
les migrations suivantes normalement. Bonus : pg_dump crée les clés étrangères *après* les
données, ce qui règle les cycles d'auto-référence d'`Organisation` et de `FamilyMember`.

### Régénérer le jeu de données

Après une grosse session de saisie, pour que le dépôt reflète le monde à jour :

```bash
cd apps/backend
npm run db:data:dump
```

Le script **relit le fichier produit** et refuse de finir en succès s'il y trouve un hash
de mot de passe. Committez ensuite `prisma/data/solenia-full.sql`.

---

## Comptes et mots de passe

Aucun hash n'est versionné, nulle part — ni dans le dump, ni dans le seed.

```bash
# créer un compte, ou changer le mot de passe d'un compte existant
ADMIN_PASSWORD="…" npm run db:create-user            # admin
ADMIN_PASSWORD="…" npm run db:create-user editor     # editor
```

Les sauvegardes locales (`apps/backend/backups/`) sont **ignorées par git** : elles sont
produites par `npm run db:backup` et contiennent, elles, la table `User` en entier.

> **Historique** — jusqu'au 11 septembre 2026, un hash argon2id partagé par les comptes
> `admin` et `editor` était écrit en dur dans `prisma/seed.ts` et présent dans quatre
> sauvegardes SQL versionnées, sur ce dépôt public. L'historique git a été réécrit pour
> les purger, et les mots de passe ont été changés. Si vous aviez un clone antérieur à
> cette date, il contient encore ces fichiers : supprimez-le et reclonez.

---

## Développement

```bash
npm run dev                  # les deux applications
cd apps/backend && npm run dev     # backend seul (port 3001)
cd apps/frontend && npm run dev    # frontend seul (port 5173)
```

Après modification de `prisma/schema.prisma` :

```bash
cd apps/backend
npm run prisma:sync          # applique les migrations en attente + régénère le client
```

Les migrations sont écrites à la main dans `prisma/migrations/<horodatage>_<nom>/migration.sql`.

### Scripts utiles (`apps/backend`)

| Commande | Effet |
|---|---|
| `npm run db:backup` | sauvegarde locale complète, **avec** les comptes (non versionnée) |
| `npm run db:data:dump` | régénère le jeu de données versionné, **sans** les comptes |
| `npm run db:data:load` | restaure ce jeu de données dans une base vierge |
| `npm run db:create-user` | crée un compte ou change son mot de passe |
| `npm run check-orphans` | détecte les lignes orphelines |
| `npm run prisma:seed` | ⚠️ **vide la base** et insère un jeu de démonstration |

`prisma:seed` n'a rien à voir avec la reprise : il efface tout. Pour restaurer le monde,
c'est `db:data:load`.

---

## Dette connue

- **Pas de migration initiale** : voir plus haut. Un squash de l'historique en une
  migration de base réglerait le sujet, au prix d'un `prisma migrate resolve` sur les
  instances existantes.
- **`npm run build` échoue côté backend** : 41 erreurs de typage dans trois scripts ad hoc
  de `src/scripts/` (dont 37 dans `import-alagir-remaining.ts`). Le `tsconfig` inclut tout
  `src`. Les routes, elles, sont propres.
