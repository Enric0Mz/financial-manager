// This file will override  setupTests

import year from "models/year.js";
import month from "models/month";
import yearMonth from "models/yearMonth";
import salary from "models/salary";

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

const setup = {
  createYear,
  createAllMonths,
  createMonthInYear,
  createSalary,
};

export default setup;
