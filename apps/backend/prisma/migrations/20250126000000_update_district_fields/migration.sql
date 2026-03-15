-- AlterTable District: Rename function to content, drop iconUrl, factions, notablePlaces
ALTER TABLE "District" RENAME COLUMN "function" TO "content";
ALTER TABLE "District" DROP COLUMN "iconUrl";
ALTER TABLE "District" DROP COLUMN "factions";
ALTER TABLE "District" DROP COLUMN "notablePlaces";
