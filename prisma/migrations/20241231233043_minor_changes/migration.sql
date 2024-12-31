/*
  Warnings:

  - The values [User,Result] on the enum `RoomStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `dungeonName` on the `BattleRoom` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `BattleRoom` table. All the data in the column will be lost.
  - You are about to drop the column `queue` on the `BattleRoom` table. All the data in the column will be lost.
  - Added the required column `dungeonType` to the `BattleRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomName` to the `BattleRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `BattleRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoomStatus_new" AS ENUM ('Initial', 'Waiting', 'Character', 'Monster', 'End');
ALTER TABLE "BattleRoom" ALTER COLUMN "roomStatus" TYPE "RoomStatus_new" USING ("roomStatus"::text::"RoomStatus_new");
ALTER TYPE "RoomStatus" RENAME TO "RoomStatus_old";
ALTER TYPE "RoomStatus_new" RENAME TO "RoomStatus";
DROP TYPE "RoomStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "BattleRoom" DROP COLUMN "dungeonName",
DROP COLUMN "name",
DROP COLUMN "queue",
ADD COLUMN     "dungeonType" TEXT NOT NULL,
ADD COLUMN     "roomName" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TurnQueue" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "subjectType" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "TurnQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TurnQueue_order_idx" ON "TurnQueue"("order" ASC);
