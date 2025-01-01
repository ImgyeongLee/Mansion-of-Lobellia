-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_roomId_fkey";

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "BattleRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
