-- CreateTable
CREATE TABLE "Lore" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tag" TEXT,
    "dateInGame" INTEGER,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoreKingdom" (
    "id" TEXT NOT NULL,
    "loreId" TEXT NOT NULL,
    "kingdomId" TEXT NOT NULL,

    CONSTRAINT "LoreKingdom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoreCity" (
    "id" TEXT NOT NULL,
    "loreId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,

    CONSTRAINT "LoreCity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LorePlace" (
    "id" TEXT NOT NULL,
    "loreId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "LorePlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LorePerson" (
    "id" TEXT NOT NULL,
    "loreId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,

    CONSTRAINT "LorePerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoreOrganisation" (
    "id" TEXT NOT NULL,
    "loreId" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,

    CONSTRAINT "LoreOrganisation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoreKingdom_loreId_kingdomId_key" ON "LoreKingdom"("loreId", "kingdomId");

-- CreateIndex
CREATE UNIQUE INDEX "LoreCity_loreId_cityId_key" ON "LoreCity"("loreId", "cityId");

-- CreateIndex
CREATE UNIQUE INDEX "LorePlace_loreId_placeId_key" ON "LorePlace"("loreId", "placeId");

-- CreateIndex
CREATE UNIQUE INDEX "LorePerson_loreId_personId_key" ON "LorePerson"("loreId", "personId");

-- CreateIndex
CREATE UNIQUE INDEX "LoreOrganisation_loreId_organisationId_key" ON "LoreOrganisation"("loreId", "organisationId");

-- AddForeignKey
ALTER TABLE "LoreKingdom" ADD CONSTRAINT "LoreKingdom_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES "Lore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoreKingdom" ADD CONSTRAINT "LoreKingdom_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES "Kingdom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoreCity" ADD CONSTRAINT "LoreCity_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES "Lore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoreCity" ADD CONSTRAINT "LoreCity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LorePlace" ADD CONSTRAINT "LorePlace_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES "Lore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LorePlace" ADD CONSTRAINT "LorePlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LorePerson" ADD CONSTRAINT "LorePerson_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES "Lore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LorePerson" ADD CONSTRAINT "LorePerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES "PersonOfInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoreOrganisation" ADD CONSTRAINT "LoreOrganisation_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES "Lore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoreOrganisation" ADD CONSTRAINT "LoreOrganisation_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

