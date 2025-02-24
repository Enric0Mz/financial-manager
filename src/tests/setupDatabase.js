// This file will override  setupTests

import year from "models/year.js";

async function createYear(yearId) {
  return await year.create(yearId);
}

const setup = {
  createYear,
};

export default setup;
