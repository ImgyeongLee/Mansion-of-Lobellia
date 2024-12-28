/*
  Warnings:

  - You are about to drop the `_DungeonToMonster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EntityToItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ItemToMonster` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MonsterToMonsterSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DungeonToMonster" DROP CONSTRAINT "_DungeonToMonster_A_fkey";

-- DropForeignKey
ALTER TABLE "_DungeonToMonster" DROP CONSTRAINT "_DungeonToMonster_B_fkey";

-- DropForeignKey
ALTER TABLE "_EntityToItem" DROP CONSTRAINT "_EntityToItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_EntityToItem" DROP CONSTRAINT "_EntityToItem_B_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToMonster" DROP CONSTRAINT "_ItemToMonster_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToMonster" DROP CONSTRAINT "_ItemToMonster_B_fkey";

-- DropForeignKey
ALTER TABLE "_MonsterToMonsterSkill" DROP CONSTRAINT "_MonsterToMonsterSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_MonsterToMonsterSkill" DROP CONSTRAINT "_MonsterToMonsterSkill_B_fkey";

-- DropTable
DROP TABLE "_DungeonToMonster";

-- DropTable
DROP TABLE "_EntityToItem";

-- DropTable
DROP TABLE "_ItemToMonster";

-- DropTable
DROP TABLE "_MonsterToMonsterSkill";

-- CreateTable
CREATE TABLE "MonsterDungeonRelation" (
    "id" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,
    "dungeonId" TEXT NOT NULL,

    CONSTRAINT "MonsterDungeonRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonsterSkillRelation" (
    "id" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "MonsterSkillRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonsterInventory" (
    "id" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "MonsterInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonsterDungeonRelation_monsterId_dungeonId_key" ON "MonsterDungeonRelation"("monsterId", "dungeonId");

-- CreateIndex
CREATE UNIQUE INDEX "MonsterSkillRelation_monsterId_skillId_key" ON "MonsterSkillRelation"("monsterId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "MonsterInventory_monsterId_itemId_key" ON "MonsterInventory"("monsterId", "itemId");

-- AddForeignKey
ALTER TABLE "MonsterDungeonRelation" ADD CONSTRAINT "MonsterDungeonRelation_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonsterDungeonRelation" ADD CONSTRAINT "MonsterDungeonRelation_dungeonId_fkey" FOREIGN KEY ("dungeonId") REFERENCES "Dungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonsterSkillRelation" ADD CONSTRAINT "MonsterSkillRelation_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonsterSkillRelation" ADD CONSTRAINT "MonsterSkillRelation_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "MonsterSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonsterInventory" ADD CONSTRAINT "MonsterInventory_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonsterInventory" ADD CONSTRAINT "MonsterInventory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
