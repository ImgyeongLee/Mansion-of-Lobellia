/*
  Warnings:

  - You are about to drop the `_EntityToMonsterSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EntityToMonsterSkill" DROP CONSTRAINT "_EntityToMonsterSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_EntityToMonsterSkill" DROP CONSTRAINT "_EntityToMonsterSkill_B_fkey";

-- DropTable
DROP TABLE "_EntityToMonsterSkill";

-- CreateTable
CREATE TABLE "EntitySkillRelation" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "EntitySkillRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityInventory" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "EntityInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EntitySkillRelation_entityId_skillId_key" ON "EntitySkillRelation"("entityId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "EntityInventory_entityId_itemId_key" ON "EntityInventory"("entityId", "itemId");

-- AddForeignKey
ALTER TABLE "EntitySkillRelation" ADD CONSTRAINT "EntitySkillRelation_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntitySkillRelation" ADD CONSTRAINT "EntitySkillRelation_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "MonsterSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityInventory" ADD CONSTRAINT "EntityInventory_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityInventory" ADD CONSTRAINT "EntityInventory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
