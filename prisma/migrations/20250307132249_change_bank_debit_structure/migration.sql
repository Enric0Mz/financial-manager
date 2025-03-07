/*
  Warnings:

  - You are about to drop the column `balance` on the `Bank` table. All the data in the column will be lost.
  - The primary key for the `BankBankStatement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bankId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `debitId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the `Debit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_bankId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_debitId_fkey";

-- AlterTable
ALTER TABLE "Bank" DROP COLUMN "balance";

-- AlterTable
ALTER TABLE "BankBankStatement" DROP CONSTRAINT "BankBankStatement_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "BankBankStatement_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BankStatement" ADD COLUMN     "debitBalance" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "bankId",
DROP COLUMN "debitId",
ADD COLUMN     "bankBankStatementId" INTEGER;

-- DropTable
DROP TABLE "Debit";

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_bankBankStatementId_fkey" FOREIGN KEY ("bankBankStatementId") REFERENCES "BankBankStatement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
