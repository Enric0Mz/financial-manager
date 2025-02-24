-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_bankId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_debitId_fkey";

-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "expenseDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "debitId" DROP NOT NULL,
ALTER COLUMN "bankId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_debitId_fkey" FOREIGN KEY ("debitId") REFERENCES "Debit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;
