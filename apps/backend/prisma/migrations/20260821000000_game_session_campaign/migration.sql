-- Journal de sessions rattaché à une campagne
ALTER TABLE "GameSession" ADD COLUMN "campaignId" TEXT;
ALTER TABLE "GameSession" ADD CONSTRAINT "GameSession_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
