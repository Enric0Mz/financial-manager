// This file will override  setupTests

import year from "models/year.js";
import month from "models/month";
import yearMonth from "models/yearMonth";
import salary from "models/salary";
import bank from "models/bank";
import bankStatement from "models/bankStatement";
import extraIncome from "models/extraIncome";

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
  return await salary.create(amount);
}

async function createBank(name) {
  return await bank.create(name);
}

async function createBankStatement(salary, yearMonthId, lastBankStatement) {
  return await bankStatement.create(salary, yearMonthId, lastBankStatement);
}

async function createExtraIncome(payload, bankStatementId) {
  return await extraIncome.create(payload, bankStatementId);
}

const setup = {
  createYear,
  createAllMonths,
  createMonthInYear,
  createSalary,
  createBank,
  createBankStatement,
  createExtraIncome,
};

export default setup;
