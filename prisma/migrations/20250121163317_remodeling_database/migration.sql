/*
  Warnings:

  - You are about to drop the column `monthId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the `BankStatment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MonthToYear` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BankStatment" DROP CONSTRAINT "BankStatment_bankId_fkey";

-- DropForeignKey
ALTER TABLE "BankStatment" DROP CONSTRAINT "BankStatment_expenseId_fkey";

-- DropForeignKey
ALTER TABLE "BankStatment" DROP CONSTRAINT "BankStatment_monthId_fkey";

-- DropForeignKey
ALTER TABLE "BankStatment" DROP CONSTRAINT "BankStatment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_monthId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_userId_fkey";

-- DropForeignKey
ALTER TABLE "_MonthToYear" DROP CONSTRAINT "_MonthToYear_A_fkey";

-- DropForeignKey
ALTER TABLE "_MonthToYear" DROP CONSTRAINT "_MonthToYear_B_fkey";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "monthId",
DROP COLUMN "userId";

-- DropTable
DROP TABLE "BankStatment";

-- DropTable
DROP TABLE "_MonthToYear";

-- CreateTable
CREATE TABLE "YearMonth" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monthId" INTEGER NOT NULL,
    "yearId" INTEGER NOT NULL,

    CONSTRAINT "YearMonth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankStatement" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "salaryId" INTEGER NOT NULL,
    "extraIncomeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "expenseId" INTEGER NOT NULL,
    "yearMonthId" INTEGER NOT NULL,
    "balanceTotal" DOUBLE PRECISION NOT NULL,
    "balanceReal" DOUBLE PRECISION NOT NULL,
    "bankId" INTEGER,

    CONSTRAINT "BankStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salary" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtraIncome" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExtraIncome_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YearMonth_yearId_monthId_key" ON "YearMonth"("yearId", "monthId");

-- AddForeignKey
ALTER TABLE "YearMonth" ADD CONSTRAINT "YearMonth_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YearMonth" ADD CONSTRAINT "YearMonth_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("yearNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankStatement" ADD CONSTRAINT "BankStatement_salaryId_fkey" FOREIGN KEY ("salaryId") REFERENCES "Salary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankStatement" ADD CONSTRAINT "BankStatement_extraIncomeId_fkey" FOREIGN KEY ("extraIncomeId") REFERENCES "ExtraIncome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankStatement" ADD CONSTRAINT "BankStatement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankStatement" ADD CONSTRAINT "BankStatement_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankStatement" ADD CONSTRAINT "BankStatement_yearMonthId_fkey" FOREIGN KEY ("yearMonthId") REFERENCES "YearMonth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankStatement" ADD CONSTRAINT "BankStatement_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;
