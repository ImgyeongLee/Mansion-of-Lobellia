/*
  Warnings:

  - You are about to drop the `CharacterStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EntityStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CharacterStatus" DROP CONSTRAINT "CharacterStatus_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterStatus" DROP CONSTRAINT "CharacterStatus_protectorId_fkey";

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "attackBuffedAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "attackBuffedTurn" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "defenseBuffedAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "defenseBuffedTurn" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dotDamageAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dotDamageTurn" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isConfused" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDark" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isImmortal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isStun" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "protectedTurn" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "protectorId" TEXT,
ALTER COLUMN "roomId" SET DEFAULT '',
ALTER COLUMN "image" SET DEFAULT '',
ALTER COLUMN "money" SET DEFAULT 0,
ALTER COLUMN "rowPos" SET DEFAULT -1,
ALTER COLUMN "colPos" SET DEFAULT -1,
ALTER COLUMN "hasMoved" SET DEFAULT false,
ALTER COLUMN "hasActioned" SET DEFAULT false,
ALTER COLUMN "hasUsedUltimate" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Entity" ADD COLUMN     "buffedAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "buffedTurn" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dotDamageAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dotDamageTurn" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isConfused" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isStun" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isAdmin" SET DEFAULT false;

-- DropTable
DROP TABLE "CharacterStatus";

-- DropTable
DROP TABLE "EntityStatus";

-- DropEnum
DROP TYPE "ActionType";
