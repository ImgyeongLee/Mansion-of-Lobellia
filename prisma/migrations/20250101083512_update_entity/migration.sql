/*
  Warnings:

  - Added the required column `currentHp` to the `Entity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entity" ADD COLUMN     "currentHp" INTEGER NOT NULL,
ALTER COLUMN "rowPos" SET DEFAULT -1,
ALTER COLUMN "colPos" SET DEFAULT -1;
