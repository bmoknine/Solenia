-- Frontière tracée du royaume sur la carte : tableau de sommets [x, y] en ratio 0..1
ALTER TABLE "Kingdom" ADD COLUMN "borderPoints" JSONB;
