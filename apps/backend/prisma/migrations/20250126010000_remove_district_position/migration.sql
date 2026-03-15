-- DropForeignKey: Remove foreign key constraint for districtId
ALTER TABLE "Position" DROP CONSTRAINT IF EXISTS "Position_districtId_fkey";

-- AlterTable Position: Remove districtId column
ALTER TABLE "Position" DROP COLUMN IF EXISTS "districtId";
