-- CreateTable
CREATE TABLE "OrganisationKingdom" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "kingdomId" TEXT NOT NULL,

    CONSTRAINT "OrganisationKingdom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganisationKingdom_organisationId_kingdomId_key" ON "OrganisationKingdom"("organisationId", "kingdomId");

-- AddForeignKey
ALTER TABLE "OrganisationKingdom" ADD CONSTRAINT "OrganisationKingdom_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganisationKingdom" ADD CONSTRAINT "OrganisationKingdom_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES "Kingdom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
