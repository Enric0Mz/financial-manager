/*
  Warnings:

  - Added the required column `bankStatementId` to the `Bank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bank" ADD COLUMN     "bankStatementId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "BankStatement" ADD COLUMN     "bankId" INTEGER;

-- AddForeignKey
ALTER TABLE "Bank" ADD CONSTRAINT "Bank_bankStatementId_fkey" FOREIGN KEY ("bankStatementId") REFERENCES "BankStatement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
