/*
  Warnings:

  - You are about to drop the column `bankStatementId` on the `Bank` table. All the data in the column will be lost.
  - You are about to drop the column `bankId` on the `BankStatement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bank" DROP CONSTRAINT "Bank_bankStatementId_fkey";

-- AlterTable
ALTER TABLE "Bank" DROP COLUMN "bankStatementId";

-- AlterTable
ALTER TABLE "BankStatement" DROP COLUMN "bankId";

-- CreateTable
CREATE TABLE "BankBankStatement" (
    "bankId" INTEGER NOT NULL,
    "bankStatementId" INTEGER NOT NULL,

    CONSTRAINT "BankBankStatement_pkey" PRIMARY KEY ("bankId","bankStatementId")
);

-- AddForeignKey
ALTER TABLE "BankBankStatement" ADD CONSTRAINT "BankBankStatement_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankBankStatement" ADD CONSTRAINT "BankBankStatement_bankStatementId_fkey" FOREIGN KEY ("bankStatementId") REFERENCES "BankStatement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
