/*
  Warnings:

  - Made the column `name` on table `BattleRoom` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `image` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BattleRoom" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "attackBuff" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "costRecovery" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "critBuff" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "defenseBuff" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dodgeBuff" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dotDamageCure" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hpRecovery" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isConfusedCure" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "speedBuff" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "sellPrice" SET DEFAULT 0,
ALTER COLUMN "buyPrice" SET DEFAULT 0;
