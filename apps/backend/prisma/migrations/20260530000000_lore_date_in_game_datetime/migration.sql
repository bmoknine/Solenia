-- Convert Lore.dateInGame from integer year to text (année seule ou YYYY-MM-DD calendrier Solenia)
ALTER TABLE "Lore" ALTER COLUMN "dateInGame" TYPE TEXT USING (
  CASE WHEN "dateInGame" IS NULL THEN NULL ELSE "dateInGame"::text END
);
