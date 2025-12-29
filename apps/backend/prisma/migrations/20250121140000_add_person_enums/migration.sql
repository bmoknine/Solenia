-- CreateEnum
CREATE TYPE "Breed" AS ENUM ('ELFE', 'HALFELIN', 'HUMAIN', 'NAIN', 'DEMI_ELFE', 'DEMI_ORC', 'DRAKEIDE', 'GNOME', 'TIEFFELIN', 'AASIMAR', 'GENASIAIR', 'GENASITERRE', 'GENASIFEUR', 'GENASIEAU', 'GOLIATH', 'OTHER');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MAN', 'WOMAN', 'OTHER');

-- CreateEnum
CREATE TYPE "Membership" AS ENUM ('POLITIC', 'RELIGEUX', 'MARCHAND', 'CCCH', 'CRIMINALITE', 'OTHER');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('COMMUN', 'NAIN', 'ELFIQUE', 'GNOME', 'HALFELIN', 'ORC', 'GOBELIN', 'GEANT', 'DRACONIQUE', 'SYLVESTRE', 'INFERNAL', 'ABYSSAL', 'CELESTE', 'PRIMORDIAL', 'AQUAN', 'AURAN', 'IGNAN', 'TERRAN', 'PROFOND', 'SLAADI', 'TELEPATHIQUE', 'ARGOT_VOLEUR');

-- AlterTable
ALTER TABLE "PersonOfInterest" DROP COLUMN IF EXISTS "membership";
ALTER TABLE "PersonOfInterest" DROP COLUMN IF EXISTS "languages";

-- AlterTable
ALTER TABLE "PersonOfInterest" ADD COLUMN "breed" "Breed";
ALTER TABLE "PersonOfInterest" ADD COLUMN "sex" "Sex";
ALTER TABLE "PersonOfInterest" ADD COLUMN "membership" "Membership";
ALTER TABLE "PersonOfInterest" ADD COLUMN "languages" "Language"[] DEFAULT ARRAY[]::"Language"[];

