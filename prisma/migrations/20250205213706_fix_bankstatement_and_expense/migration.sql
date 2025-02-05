/*
  Warnings:

  - Added the required column `bankStatementId` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BankStatement" DROP CONSTRAINT "BankStatement_expenseId_fkey";

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "bankStatementId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_bankStatementId_fkey" FOREIGN KEY ("bankStatementId") REFERENCES "BankStatement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
