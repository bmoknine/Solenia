-- Enum des statuts de péripétie
CREATE TYPE "QuestStepStatus" AS ENUM ('A_FAIRE', 'EN_COURS', 'FAITE');

-- CreateTable Campaign
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- AlterTable Quest : rattachement à une campagne
ALTER TABLE "Quest" ADD COLUMN "campaignId" TEXT;

-- CreateTable QuestStep (péripéties)
CREATE TABLE "QuestStep" (
    "id" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "QuestStepStatus" NOT NULL DEFAULT 'A_FAIRE',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestStep_pkey" PRIMARY KEY ("id")
);

-- Foreign keys
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "QuestStep" ADD CONSTRAINT "QuestStep_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Données : campagne "Général" par défaut + rattachement des quêtes existantes
INSERT INTO "Campaign" ("id", "name", "description", "order", "updatedAt")
VALUES ('00000000-0000-0000-0000-0000000c0001', 'Général', 'Campagne par défaut — quêtes non classées.', 0, CURRENT_TIMESTAMP);

UPDATE "Quest" SET "campaignId" = '00000000-0000-0000-0000-0000000c0001' WHERE "campaignId" IS NULL;
