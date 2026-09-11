-- Nouveau type d'organisation : FAMILLE
-- (la valeur est seulement ajoutée ici ; son affectation aux familles existantes
--  se fait dans un script séparé, PostgreSQL interdisant d'utiliser une valeur
--  d'énum dans la transaction qui l'ajoute)
ALTER TYPE "OrganisationType" ADD VALUE 'FAMILLE';

-- Nœuds d'arbre généalogique rattachés à une famille
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "personId" TEXT,
    "playerCharacterId" TEXT,
    "fatherId" TEXT,
    "motherId" TEXT,
    "spouseId" TEXT,
    "sex" "Sex",
    "isFounder" BOOLEAN NOT NULL DEFAULT false,
    "generation" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "isForDM" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "FamilyMember_organisationId_idx" ON "FamilyMember"("organisationId");
CREATE INDEX "FamilyMember_personId_idx" ON "FamilyMember"("personId");
CREATE INDEX "FamilyMember_playerCharacterId_idx" ON "FamilyMember"("playerCharacterId");

ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_organisationId_fkey"
  FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_personId_fkey"
  FOREIGN KEY ("personId") REFERENCES "PersonOfInterest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_playerCharacterId_fkey"
  FOREIGN KEY ("playerCharacterId") REFERENCES "PlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_fatherId_fkey"
  FOREIGN KEY ("fatherId") REFERENCES "FamilyMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_motherId_fkey"
  FOREIGN KEY ("motherId") REFERENCES "FamilyMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_spouseId_fkey"
  FOREIGN KEY ("spouseId") REFERENCES "FamilyMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
