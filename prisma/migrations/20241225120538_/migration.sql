/*
  Warnings:

  - You are about to drop the column `dungeonId` on the `Monster` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Monster" DROP CONSTRAINT "Monster_dungeonId_fkey";

-- AlterTable
ALTER TABLE "Monster" DROP COLUMN "dungeonId";

-- CreateTable
CREATE TABLE "_DungeonToMonster" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DungeonToMonster_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DungeonToMonster_B_index" ON "_DungeonToMonster"("B");

-- AddForeignKey
ALTER TABLE "_DungeonToMonster" ADD CONSTRAINT "_DungeonToMonster_A_fkey" FOREIGN KEY ("A") REFERENCES "Dungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DungeonToMonster" ADD CONSTRAINT "_DungeonToMonster_B_fkey" FOREIGN KEY ("B") REFERENCES "Monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
