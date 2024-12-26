/*
  Warnings:

  - You are about to drop the `_CharacterToCharacterSkill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CharacterToCharacterSkill" DROP CONSTRAINT "_CharacterToCharacterSkill_A_fkey";

-- DropForeignKey
ALTER TABLE "_CharacterToCharacterSkill" DROP CONSTRAINT "_CharacterToCharacterSkill_B_fkey";

-- DropTable
DROP TABLE "_CharacterToCharacterSkill";

-- CreateTable
CREATE TABLE "CharacterSkillRelation" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "CharacterSkillRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CharacterSkillRelation_characterId_skillId_key" ON "CharacterSkillRelation"("characterId", "skillId");

-- AddForeignKey
ALTER TABLE "CharacterSkillRelation" ADD CONSTRAINT "CharacterSkillRelation_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSkillRelation" ADD CONSTRAINT "CharacterSkillRelation_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "CharacterSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
