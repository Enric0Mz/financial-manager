/*
  Warnings:

  - You are about to drop the column `extraIncomeId` on the `BankStatement` table. All the data in the column will be lost.
  - Added the required column `bankStatementId` to the `ExtraIncome` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BankStatement" DROP CONSTRAINT "BankStatement_extraIncomeId_fkey";

-- DropIndex
DROP INDEX "BankStatement_extraIncomeId_key";

-- AlterTable
ALTER TABLE "BankStatement" DROP COLUMN "extraIncomeId";

-- AlterTable
ALTER TABLE "ExtraIncome" ADD COLUMN     "bankStatementId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ExtraIncome" ADD CONSTRAINT "ExtraIncome_bankStatementId_fkey" FOREIGN KEY ("bankStatementId") REFERENCES "BankStatement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
