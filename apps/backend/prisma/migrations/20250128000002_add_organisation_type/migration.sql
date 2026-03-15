-- CreateEnum
CREATE TYPE "OrganisationType" AS ENUM ('CELLULE', 'PRINCIPAL');

-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN "organisationType" "OrganisationType";
