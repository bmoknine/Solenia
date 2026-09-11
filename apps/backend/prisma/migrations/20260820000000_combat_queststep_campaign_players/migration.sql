-- Combat lié à une péripétie (rencontre)
ALTER TABLE "Combat" ADD COLUMN "questStepId" TEXT;
ALTER TABLE "Combat" ADD CONSTRAINT "Combat_questStepId_fkey" FOREIGN KEY ("questStepId") REFERENCES "QuestStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Relation N-N Campagne <-> PJ (joueurs d'une campagne)
CREATE TABLE "_CampaignPlayers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_CampaignPlayers_AB_unique" ON "_CampaignPlayers"("A", "B");
CREATE INDEX "_CampaignPlayers_B_index" ON "_CampaignPlayers"("B");

ALTER TABLE "_CampaignPlayers" ADD CONSTRAINT "_CampaignPlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CampaignPlayers" ADD CONSTRAINT "_CampaignPlayers_B_fkey" FOREIGN KEY ("B") REFERENCES "PlayerCharacter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
