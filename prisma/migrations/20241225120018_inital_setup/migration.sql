-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('Chat', 'System', 'Action', 'Result', 'Debuff', 'Buff');

-- CreateEnum
CREATE TYPE "Class" AS ENUM ('Gladiolus', 'Saintpaulia', 'Cypress', 'Blackthorn');

-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('General', 'Gladiolus', 'Saintpaulia', 'Cypress', 'Blackthorn');

-- CreateEnum
CREATE TYPE "SkillRange" AS ENUM ('Self', 'Narrow', 'Normal', 'Wide');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Easy', 'Normal', 'Hard');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('Waiting', 'User', 'Monster', 'Result', 'End');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "class" "Class" NOT NULL,
    "image" TEXT DEFAULT '',
    "maxHp" INTEGER NOT NULL,
    "currentHp" INTEGER NOT NULL,
    "maxCost" INTEGER NOT NULL,
    "currentCost" INTEGER NOT NULL,
    "money" INTEGER NOT NULL DEFAULT 0,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "dodge" INTEGER NOT NULL,
    "crit" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "rowPos" INTEGER NOT NULL DEFAULT -1,
    "colPos" INTEGER NOT NULL DEFAULT -1,
    "hasMoved" BOOLEAN NOT NULL DEFAULT false,
    "hasActioned" BOOLEAN NOT NULL DEFAULT false,
    "hasUsedUltimate" BOOLEAN NOT NULL DEFAULT false,
    "isDead" BOOLEAN NOT NULL DEFAULT false,
    "isStun" BOOLEAN NOT NULL DEFAULT false,
    "isConfused" BOOLEAN NOT NULL DEFAULT false,
    "isDark" BOOLEAN NOT NULL DEFAULT false,
    "isImmortal" BOOLEAN NOT NULL DEFAULT false,
    "attackBuffedAmount" INTEGER NOT NULL DEFAULT 0,
    "attackBuffedTurn" INTEGER NOT NULL DEFAULT 0,
    "defenseBuffedAmount" INTEGER NOT NULL DEFAULT 0,
    "defenseBuffedTurn" INTEGER NOT NULL DEFAULT 0,
    "protectorId" TEXT,
    "protectedTurn" INTEGER NOT NULL DEFAULT 0,
    "dotDamageTurn" INTEGER NOT NULL DEFAULT 0,
    "dotDamageAmount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterInventory" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CharacterInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Monster" (
    "id" TEXT NOT NULL,
    "dungeonId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maxHp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "dodge" INTEGER NOT NULL,
    "crit" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "reward" INTEGER NOT NULL,

    CONSTRAINT "Monster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maxHp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "dodge" INTEGER NOT NULL,
    "crit" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "reward" INTEGER NOT NULL,
    "rowPos" INTEGER NOT NULL,
    "colPos" INTEGER NOT NULL,
    "isDead" BOOLEAN NOT NULL DEFAULT false,
    "isStun" BOOLEAN NOT NULL DEFAULT false,
    "isConfused" BOOLEAN NOT NULL DEFAULT false,
    "buffedAmount" INTEGER NOT NULL DEFAULT 0,
    "buffedTurn" INTEGER NOT NULL DEFAULT 0,
    "dotDamageTurn" INTEGER NOT NULL DEFAULT 0,
    "dotDamageAmount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sellPrice" INTEGER NOT NULL DEFAULT 0,
    "buyPrice" INTEGER NOT NULL DEFAULT 0,
    "isStoreItem" BOOLEAN NOT NULL,
    "hpRecovery" INTEGER NOT NULL DEFAULT 0,
    "costRecovery" INTEGER NOT NULL DEFAULT 0,
    "speedBuff" INTEGER NOT NULL DEFAULT 0,
    "attackBuff" INTEGER NOT NULL DEFAULT 0,
    "defenseBuff" INTEGER NOT NULL DEFAULT 0,
    "critBuff" INTEGER NOT NULL DEFAULT 0,
    "dodgeBuff" INTEGER NOT NULL DEFAULT 0,
    "dotDamageCure" BOOLEAN NOT NULL DEFAULT false,
    "isConfusedCure" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sender" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "chatType" "ChatType" NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterSkill" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "SkillType" NOT NULL,
    "range" "SkillRange" NOT NULL,
    "isAllyTargeting" BOOLEAN NOT NULL,
    "isEnemyTargeting" BOOLEAN NOT NULL,
    "isSelfTargeting" BOOLEAN NOT NULL,
    "isEntire" BOOLEAN NOT NULL,
    "isUltimate" BOOLEAN NOT NULL,
    "requiredCost" INTEGER NOT NULL,
    "requiredHp" INTEGER NOT NULL,

    CONSTRAINT "CharacterSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonsterSkill" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "range" "SkillRange" NOT NULL,
    "isSelfTargeting" BOOLEAN NOT NULL,
    "isEntire" BOOLEAN NOT NULL,

    CONSTRAINT "MonsterSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dungeon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "description" TEXT,
    "difficulty" "Difficulty" NOT NULL,
    "minMember" INTEGER NOT NULL,
    "maxMember" INTEGER NOT NULL,

    CONSTRAINT "Dungeon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dungeonType" TEXT NOT NULL,
    "description" TEXT,
    "minMember" INTEGER NOT NULL,
    "maxMember" INTEGER NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "round" INTEGER NOT NULL,
    "queue" TEXT[],
    "roomStatus" "RoomStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BattleRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CharacterToCharacterSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CharacterToCharacterSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MonsterToMonsterSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MonsterToMonsterSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EntityToMonsterSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EntityToMonsterSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EntityToItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EntityToItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ItemToMonster" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ItemToMonster_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterInventory_characterId_itemId_key" ON "CharacterInventory"("characterId", "itemId");

-- CreateIndex
CREATE INDEX "_CharacterToCharacterSkill_B_index" ON "_CharacterToCharacterSkill"("B");

-- CreateIndex
CREATE INDEX "_MonsterToMonsterSkill_B_index" ON "_MonsterToMonsterSkill"("B");

-- CreateIndex
CREATE INDEX "_EntityToMonsterSkill_B_index" ON "_EntityToMonsterSkill"("B");

-- CreateIndex
CREATE INDEX "_EntityToItem_B_index" ON "_EntityToItem"("B");

-- CreateIndex
CREATE INDEX "_ItemToMonster_B_index" ON "_ItemToMonster"("B");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "BattleRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterInventory" ADD CONSTRAINT "CharacterInventory_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterInventory" ADD CONSTRAINT "CharacterInventory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monster" ADD CONSTRAINT "Monster_dungeonId_fkey" FOREIGN KEY ("dungeonId") REFERENCES "Dungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "BattleRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "BattleRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToCharacterSkill" ADD CONSTRAINT "_CharacterToCharacterSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToCharacterSkill" ADD CONSTRAINT "_CharacterToCharacterSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "CharacterSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MonsterToMonsterSkill" ADD CONSTRAINT "_MonsterToMonsterSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MonsterToMonsterSkill" ADD CONSTRAINT "_MonsterToMonsterSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "MonsterSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityToMonsterSkill" ADD CONSTRAINT "_EntityToMonsterSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityToMonsterSkill" ADD CONSTRAINT "_EntityToMonsterSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "MonsterSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityToItem" ADD CONSTRAINT "_EntityToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityToItem" ADD CONSTRAINT "_EntityToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToMonster" ADD CONSTRAINT "_ItemToMonster_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToMonster" ADD CONSTRAINT "_ItemToMonster_B_fkey" FOREIGN KEY ("B") REFERENCES "Monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
