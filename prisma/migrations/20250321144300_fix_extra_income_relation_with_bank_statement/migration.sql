/*
  Warnings:

  - A unique constraint covering the columns `[extraIncomeId]` on the table `BankStatement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BankStatement_extraIncomeId_key" ON "BankStatement"("extraIncomeId");
