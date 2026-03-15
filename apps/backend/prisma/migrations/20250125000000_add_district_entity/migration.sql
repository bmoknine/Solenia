-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "motto" TEXT,
    "function" TEXT,
    "ambiance" TEXT,
    "factions" TEXT,
    "notablePlaces" TEXT,
    "rumors" TEXT,
    "secret" TEXT,
    "iconUrl" TEXT,
    "cityId" TEXT NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Place" ADD COLUMN "districtId" TEXT;

-- AlterTable
ALTER TABLE "PersonOfInterest" ADD COLUMN "districtId" TEXT;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN "districtId" TEXT;

-- AlterTable
ALTER TABLE "Position" ADD COLUMN "districtId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Position_districtId_key" ON "Position"("districtId");

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOfInterest" ADD CONSTRAINT "PersonOfInterest_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;
