-- DropForeignKey
ALTER TABLE "BankBankStatement" DROP CONSTRAINT "BankBankStatement_bankStatementId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_bankStatementId_fkey";

-- DropForeignKey
ALTER TABLE "ExtraIncome" DROP CONSTRAINT "ExtraIncome_bankStatementId_fkey";

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_bankStatementId_fkey" FOREIGN KEY ("bankStatementId") REFERENCES "BankStatement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankBankStatement" ADD CONSTRAINT "BankBankStatement_bankStatementId_fkey" FOREIGN KEY ("bankStatementId") REFERENCES "BankStatement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtraIncome" ADD CONSTRAINT "ExtraIncome_bankStatementId_fkey" FOREIGN KEY ("bankStatementId") REFERENCES "BankStatement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
