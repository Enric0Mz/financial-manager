// This file will override  setupTests

import year from "models/year.js";
import month from "models/month";
import yearMonth from "models/yearMonth";
import salary from "models/salary";
import bank from "models/bank";
import bankStatement from "models/bankStatement";
import bankBankStatement from "models/bankBankStatement";
import extraIncome from "models/extraIncome";
import user from "models/user";
import { generateJwtAccessToken } from "infra/security/auth";

async function createYear(yearId) {
  return await year.create(yearId);
}

async function createAllMonths() {
  return await month.createAllMonths();
}

async function createMonthInYear(month, year) {
  return await yearMonth.create(month, year);
}

async function createSalary(amount) {
  let result = await salary.create(amount);
  return result.object;
}

async function createBank(name) {
  return await bank.create(name);
}

async function createBankStatement(
  salary,
  yearMonthId,
  lastBankStatement,
  banks,
) {
  return await bankStatement.create(
    salary,
    yearMonthId,
    lastBankStatement,
    banks,
  );
}

async function createExtraIncome(payload, bankStatementId) {
  return await extraIncome.create(payload, bankStatementId);
}

async function createCreditExpense(expense, bankStatementId) {
  await bankStatement.decrementBalanceReal(expense.total, bankStatementId);
  await bankBankStatement.incrementBalance(
    expense.total,
    expense.bankBankStatementId,
  );
  return await bankStatement.updateWithExpense(expense, bankStatementId, false);
}

async function createDebitExpense(expense, bankStatementId) {
  await bankStatement.decrementBalance(expense.total, bankStatementId);
  await bankStatement.incrementDebitBalance(expense.total, bankStatementId);
  return await bankStatement.updateWithExpense(expense, bankStatementId, true);
}

async function createUser(userPayload) {
  const mockUser = {
    name: "TestUser",
    email: "t@este.com",
    password: "Pass@123",
  };
  return await user.create(userPayload || mockUser);
}

async function generateTestToken() {
  const mockUser = {
    username: "MockUsername",
    email: "mock@email.com",
  };
  return await generateJwtAccessToken(mockUser);
}

const setup = {
  createYear,
  createAllMonths,
  createMonthInYear,
  createSalary,
  createBank,
  createBankStatement,
  createExtraIncome,
  createCreditExpense,
  createDebitExpense,
  createUser,
  generateTestToken,
};

export default setup;
