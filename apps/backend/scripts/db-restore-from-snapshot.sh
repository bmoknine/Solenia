#!/usr/bin/env bash
# Restaure la BDD depuis un snapshot SQL.
# Usage : npm run db:restore -- <chemin/vers/snapshot.sql>
set -euo pipefail

# Charger .env si présent
if [ -f "$(dirname "$0")/../.env" ]; then
  set -a
  # shellcheck source=/dev/null
  source "$(dirname "$0")/../.env"
  set +a
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌  Variable DATABASE_URL non définie." >&2
  exit 1
fi

FILE="${1:-}"
if [ -z "$FILE" ]; then
  echo "❌  Usage : $0 <fichier.sql>" >&2
  echo "   ou via npm : npm run db:restore -- backups/snapshot_XXXX.sql" >&2
  exit 1
fi

if [ ! -f "$FILE" ]; then
  echo "❌  Fichier introuvable : $FILE" >&2
  exit 1
fi

echo "⏪  Restauration depuis : $FILE"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$FILE"
echo "✅  Restauration terminée."
