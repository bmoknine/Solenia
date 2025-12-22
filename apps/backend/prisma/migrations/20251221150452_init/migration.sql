-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('admin', 'editor', 'viewer');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "type" "UserType" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kingdom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "population" INTEGER,
    "description" TEXT,
    "dateInGame" TIMESTAMP(3),

    CONSTRAINT "Kingdom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "kingdomId" TEXT,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "kingdomId" TEXT,
    "cityId" TEXT,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonOfInterest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "membership" TEXT,
    "languages" TEXT[],
    "STR" INTEGER NOT NULL,
    "DEX" INTEGER NOT NULL,
    "CON" INTEGER NOT NULL,
    "INT" INTEGER NOT NULL,
    "WIS" INTEGER NOT NULL,
    "CHA" INTEGER NOT NULL,
    "kingdomId" TEXT,
    "cityId" TEXT,
    "placeId" TEXT,

    CONSTRAINT "PersonOfInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateInGame" TIMESTAMP(3),
    "kingdomId" TEXT,
    "cityId" TEXT,
    "placeId" TEXT,
    "personOfInterestId" TEXT,
    "authorId" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "kingdomId" TEXT,
    "cityId" TEXT,
    "placeId" TEXT,
    "personOfInterestId" TEXT,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Position_kingdomId_key" ON "Position"("kingdomId");

-- CreateIndex
CREATE UNIQUE INDEX "Position_cityId_key" ON "Position"("cityId");

-- CreateIndex
CREATE UNIQUE INDEX "Position_placeId_key" ON "Position"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "Position_personOfInterestId_key" ON "Position"("personOfInterestId");

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES "Kingdom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES "Kingdom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOfInterest" ADD CONSTRAINT "PersonOfInterest_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES "Kingdom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOfInterest" ADD CONSTRAINT "PersonOfInterest_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOfInterest" ADD CONSTRAINT "PersonOfInterest_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES "Kingdom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_personOfInterestId_fkey" FOREIGN KEY ("personOfInterestId") REFERENCES "PersonOfInterest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_kingdomId_fkey" FOREIGN KEY ("kingdomId") REFERENCES "Kingdom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_personOfInterestId_fkey" FOREIGN KEY ("personOfInterestId") REFERENCES "PersonOfInterest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
