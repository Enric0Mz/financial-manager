/*
  Warnings:

  - You are about to drop the column `bankId` on the `BankStatement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BankStatement" DROP CONSTRAINT "BankStatement_bankId_fkey";

-- AlterTable
ALTER TABLE "BankStatement" DROP COLUMN "bankId";
