-- Enums
CREATE TYPE "CombatStatus" AS ENUM ('ACTIVE', 'FINISHED');
CREATE TYPE "QuestStatus" AS ENUM ('A_FAIRE', 'EN_COURS', 'TERMINEE', 'ECHOUEE');

-- CreateTable Combat
CREATE TABLE "Combat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "round" INTEGER NOT NULL DEFAULT 1,
    "activeTurnIndex" INTEGER NOT NULL DEFAULT 0,
    "status" "CombatStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Combat_pkey" PRIMARY KEY ("id")
);

-- CreateTable Combatant
CREATE TABLE "Combatant" (
    "id" TEXT NOT NULL,
    "combatId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "playerCharacterId" TEXT,
    "personId" TEXT,
    "initiativeRoll" INTEGER NOT NULL DEFAULT 0,
    "currentHp" INTEGER NOT NULL DEFAULT 0,
    "maxHp" INTEGER NOT NULL DEFAULT 0,
    "ca" INTEGER,
    "conditions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Combatant_pkey" PRIMARY KEY ("id")
);

-- CreateTable Quest
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "QuestStatus" NOT NULL DEFAULT 'A_FAIRE',
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable GameSession
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- Foreign keys
ALTER TABLE "Combatant" ADD CONSTRAINT "Combatant_combatId_fkey" FOREIGN KEY ("combatId") REFERENCES "Combat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Combatant" ADD CONSTRAINT "Combatant_playerCharacterId_fkey" FOREIGN KEY ("playerCharacterId") REFERENCES "PlayerCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Combatant" ADD CONSTRAINT "Combatant_personId_fkey" FOREIGN KEY ("personId") REFERENCES "PersonOfInterest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
