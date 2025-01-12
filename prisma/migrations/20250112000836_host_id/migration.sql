/*
  Warnings:

  - Added the required column `hostId` to the `BattleRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BattleRoom" ADD COLUMN     "hostId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "isReady" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "image" DROP NOT NULL;
