/*
  Warnings:

  - Added the required column `subjectName` to the `TurnQueue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TurnQueue" ADD COLUMN     "subjectName" TEXT NOT NULL;
