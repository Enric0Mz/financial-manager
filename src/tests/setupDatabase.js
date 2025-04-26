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
import auth from "models/auth";
import calendar from "models/calendar";

async function createYear(yearId) {
  return await year.create(yearId);
}

async function createAllMonths() {
  return await month.bulkCreate();
}

async function createMonthInYear(month, year) {
  return await yearMonth.create(month, year);
}

async function createSalary(amount, userId) {
  let result = await salary.create(amount, userId);
  return result.object;
}

async function createBank(name, userId) {
  return await bank.create(name, userId);
}

async function createBankStatement(
  salary,
  yearMonthValue,
  userId,
  lastBankStatement,
  banks,
) {
  const { month, year } = yearMonthValue;
  const { id: yearMonthId } = await yearMonth.findFirst(month, year);

  return await bankStatement.create(
    salary,
    yearMonthId,
    lastBankStatement,
    banks,
    userId,
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
  return await user.create(userPayload);
}

async function generateTestTokens(userPayload) {
  let mockUser = {
    username: "MockUsername",
    email: "mock@email.com",
    password: "Passw@123",
  };
  if (userPayload) {
    mockUser = userPayload;
  }
  const user = (await createUser(mockUser)).toJson();
  const tokens = await auth.generateTokens(mockUser.email, mockUser.password);
  return { tokens, user };
}

async function createCalendar() {
  return await calendar.create();
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
  generateTestTokens,
  createCalendar,
};

export default setup;
