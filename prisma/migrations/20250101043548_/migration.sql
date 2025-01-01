/*
  Warnings:

  - Added the required column `roomId` to the `TurnQueue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TurnQueue" ADD COLUMN     "roomId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TurnQueue" ADD CONSTRAINT "TurnQueue_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "BattleRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
