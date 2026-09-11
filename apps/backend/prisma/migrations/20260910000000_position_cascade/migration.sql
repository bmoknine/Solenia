-- Position : passage de ON DELETE SET NULL à ON DELETE CASCADE sur les cinq relations.
--
-- Pourquoi : une ligne Position n'a de sens que pour l'entité qu'elle place. En SET NULL,
-- supprimer un royaume / une ville / un lieu / un PNJ / un PJ laissait la ligne en base avec
-- toutes ses clés à null — plus rien ne pouvait la référencer, et elle ne référençait rien.
-- 27 résidus de ce type ont été nettoyés le 2026-09-10 (sauvegarde dans backups/).
--
-- Sûreté : chaque ligne ne porte qu'une seule clé étrangère (les cinq colonnes sont UNIQUE et,
-- en pratique, exactement une est renseignée — vérifié : 7 royaumes + 70 villes + 103 lieux
-- + 212 PNJ + 3 PJ = 395 = total des lignes). La cascade ne peut donc pas emporter la position
-- d'une autre entité.

ALTER TABLE "Position" DROP CONSTRAINT "Position_kingdomId_fkey";
ALTER TABLE "Position" ADD CONSTRAINT "Position_kingdomId_fkey"
  FOREIGN KEY ("kingdomId") REFERENCES "Kingdom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Position" DROP CONSTRAINT "Position_cityId_fkey";
ALTER TABLE "Position" ADD CONSTRAINT "Position_cityId_fkey"
  FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Position" DROP CONSTRAINT "Position_placeId_fkey";
ALTER TABLE "Position" ADD CONSTRAINT "Position_placeId_fkey"
  FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Position" DROP CONSTRAINT "Position_personOfInterestId_fkey";
ALTER TABLE "Position" ADD CONSTRAINT "Position_personOfInterestId_fkey"
  FOREIGN KEY ("personOfInterestId") REFERENCES "PersonOfInterest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Position" DROP CONSTRAINT "Position_playerCharacterId_fkey";
ALTER TABLE "Position" ADD CONSTRAINT "Position_playerCharacterId_fkey"
  FOREIGN KEY ("playerCharacterId") REFERENCES "PlayerCharacter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
