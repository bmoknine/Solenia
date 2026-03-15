-- CreateTable
CREATE TABLE "Organisation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganisationMember" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,

    CONSTRAINT "OrganisationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganisationCity" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,

    CONSTRAINT "OrganisationCity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganisationPlace" (
    "id" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "OrganisationPlace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganisationMember_organisationId_personId_key" ON "OrganisationMember"("organisationId", "personId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganisationCity_organisationId_cityId_key" ON "OrganisationCity"("organisationId", "cityId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganisationPlace_organisationId_placeId_key" ON "OrganisationPlace"("organisationId", "placeId");

-- AddForeignKey
ALTER TABLE "OrganisationMember" ADD CONSTRAINT "OrganisationMember_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganisationMember" ADD CONSTRAINT "OrganisationMember_personId_fkey" FOREIGN KEY ("personId") REFERENCES "PersonOfInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganisationCity" ADD CONSTRAINT "OrganisationCity_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganisationCity" ADD CONSTRAINT "OrganisationCity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganisationPlace" ADD CONSTRAINT "OrganisationPlace_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganisationPlace" ADD CONSTRAINT "OrganisationPlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
