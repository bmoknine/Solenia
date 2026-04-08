#!/usr/bin/env bash
# Crée un snapshot complet de la BDD (avec DROP pour permettre la restauration propre).
# Usage : npm run db:snapshot
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

OUTDIR="$(dirname "$0")/../backups"
mkdir -p "$OUTDIR"

OUT="$OUTDIR/snapshot_$(date +%Y%m%d_%H%M%S).sql"

echo "📸  Snapshot → $OUT"
pg_dump "$DATABASE_URL" \
  --format=plain \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  -f "$OUT"

echo "✅  Snapshot créé : $OUT"
echo "   Pour restaurer : npm run db:restore -- $OUT"
