/*
  Warnings:

  - Added the required column `balanceInitial` to the `BankStatement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankStatement" ADD COLUMN     "balanceInitial" DOUBLE PRECISION NOT NULL;
