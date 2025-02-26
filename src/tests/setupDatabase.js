// This file will override  setupTests

import year from "models/year.js";
import month from "models/month";
import yearMonth from "models/yearMonth";

async function createYear(yearId) {
  return await year.create(yearId);
}

async function createAllMonths() {
  return await month.createAllMonths();
}

async function createMonthInYear(month, year) {
  return await yearMonth.create(month, year);
}

const setup = {
  createYear,
  createAllMonths,
  createMonthInYear,
};

export default setup;
