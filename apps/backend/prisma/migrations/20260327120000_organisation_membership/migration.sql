-- AlterTable: affiliation des organisations (même enum que PersonOfInterest.membership)
ALTER TABLE "Organisation" ADD COLUMN "membership" "Membership";
