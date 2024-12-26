/*
  Warnings:

  - You are about to drop the column `dungeonType` on the `BattleRoom` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invitationCode]` on the table `BattleRoom` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dungeonName` to the `BattleRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitationCode` to the `BattleRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BattleRoom" DROP COLUMN "dungeonType",
ADD COLUMN     "dungeonName" TEXT NOT NULL,
ADD COLUMN     "invitationCode" TEXT NOT NULL,
ALTER COLUMN "round" SET DEFAULT 0,
ALTER COLUMN "queue" SET DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "BattleRoom_invitationCode_key" ON "BattleRoom"("invitationCode");

-- CreateIndex
CREATE UNIQUE INDEX "Character_userId_key" ON "Character"("userId");

-- CreateIndex
CREATE INDEX "CharacterSkill_name_idx" ON "CharacterSkill"("name" ASC);

-- CreateIndex
CREATE INDEX "Chat_createdAt_idx" ON "Chat"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Item_name_idx" ON "Item"("name" ASC);
