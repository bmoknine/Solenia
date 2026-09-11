-- Supérieur hiérarchique : permet de dessiner les organigrammes des organisations
-- non familiales (les familles continuent d'utiliser fatherId / motherId / spouseId).
ALTER TABLE "FamilyMember" ADD COLUMN "superiorId" TEXT;

CREATE INDEX "FamilyMember_superiorId_idx" ON "FamilyMember"("superiorId");

ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_superiorId_fkey"
  FOREIGN KEY ("superiorId") REFERENCES "FamilyMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
