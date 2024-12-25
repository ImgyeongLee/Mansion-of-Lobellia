-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('Chat', 'System', 'Action', 'Result', 'Debuff', 'Buff');

-- CreateEnum
CREATE TYPE "Class" AS ENUM ('Gladiolus', 'Saintpaulia', 'Saffron', 'Cypress', 'Blackthorn');

-- CreateEnum
CREATE TYPE "SkillRange" AS ENUM ('short', 'medium', 'long');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('Easy', 'Normal', 'Hard');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('Attack', 'Buff', 'Debuff');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('Waiting', 'Processing', 'User', 'Monster', 'End');

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "class" "Class" NOT NULL,
    "image" TEXT,
    "maxHp" INTEGER NOT NULL,
    "currentHp" INTEGER NOT NULL,
    "maxCost" INTEGER NOT NULL,
    "currentCost" INTEGER NOT NULL,
    "money" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "dodge" INTEGER NOT NULL,
    "crit" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "rowPos" INTEGER NOT NULL,
    "colPos" INTEGER NOT NULL,
    "hasMoved" BOOLEAN NOT NULL,
    "hasActioned" BOOLEAN NOT NULL,
    "hasUsedUltimate" BOOLEAN NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterStatus" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "isDead" BOOLEAN NOT NULL,
    "isStun" BOOLEAN NOT NULL,
    "isConfused" BOOLEAN NOT NULL,
    "isDark" BOOLEAN NOT NULL,
    "isImmortal" BOOLEAN NOT NULL,
    "attackBuffedAmount" INTEGER NOT NULL,
    "attackBuffedTurn" INTEGER NOT NULL,
    "defenseBuffedAmount" INTEGER NOT NULL,
    "defenseBuffedTurn" INTEGER NOT NULL,
    "protectorId" TEXT,
    "protectedTurn" INTEGER NOT NULL,
    "dotDamageTurn" INTEGER NOT NULL,
    "dotDamageAmount" INTEGER NOT NULL,

    CONSTRAINT "CharacterStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityStatus" (
    "id" TEXT NOT NULL,
    "isDead" BOOLEAN NOT NULL,
    "isStun" BOOLEAN NOT NULL,
    "isConfused" BOOLEAN NOT NULL,
    "buffedAmount" INTEGER NOT NULL,
    "buffedTurn" INTEGER NOT NULL,
    "dotDamageTurn" INTEGER NOT NULL,
    "dotDamageAmount" INTEGER NOT NULL,

    CONSTRAINT "EntityStatus_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sellPrice" INTEGER NOT NULL,
    "buyPrice" INTEGER NOT NULL,
    "isStoreItem" BOOLEAN NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sender" TEXT NOT NULL,
    "chatType" "ChatType" NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterSkill" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "class" "Class" NOT NULL,
    "range" "SkillRange" NOT NULL,
    "isEntire" BOOLEAN NOT NULL,
    "isUltimate" BOOLEAN NOT NULL,
    "requiredCost" INTEGER NOT NULL,
    "requiredHp" INTEGER NOT NULL,

    CONSTRAINT "CharacterSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonsterSkill" (
    "id" TEXT NOT NULL,
    "monsterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "range" "SkillRange" NOT NULL,
    "isEntire" BOOLEAN NOT NULL,

    CONSTRAINT "MonsterSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dungeon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" "Difficulty" NOT NULL,
    "minMember" INTEGER,
    "maxMember" INTEGER,

    CONSTRAINT "Dungeon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BattleRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "round" INTEGER NOT NULL,
    "numActions" INTEGER NOT NULL,
    "roomStatus" "RoomStatus" NOT NULL,

    CONSTRAINT "BattleRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CharacterStatus_characterId_key" ON "CharacterStatus"("characterId");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "BattleRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterStatus" ADD CONSTRAINT "CharacterStatus_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterStatus" ADD CONSTRAINT "CharacterStatus_protectorId_fkey" FOREIGN KEY ("protectorId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monster" ADD CONSTRAINT "Monster_dungeonId_fkey" FOREIGN KEY ("dungeonId") REFERENCES "Dungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "BattleRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "BattleRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSkill" ADD CONSTRAINT "CharacterSkill_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonsterSkill" ADD CONSTRAINT "MonsterSkill_monsterId_fkey" FOREIGN KEY ("monsterId") REFERENCES "Monster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
