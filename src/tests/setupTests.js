import orchestrator from "tests/orchestrator";

const BASE_API_URL = process.env.BASE_API_URL;

async function setupDatabase({
  createYear = {
    create: true,
    value: 2025,
  },
  createMonths = [],
  createSalary = {
    create: true,
    value: 4500,
  },
  createBankStatements = [],
} = {}) {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  if (createYear.create) {
    await fetch(`${BASE_API_URL}/year/${createYear.value}`, { method: "POST" });
  }
  if (createMonths.length > 0) {
    await fetch(`${BASE_API_URL}/month`, { method: "POST" });
    for (const month of createMonths) {
      await fetch(`${BASE_API_URL}/month/2025`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: month,
      });
    }
  }
  if (createSalary.create) {
    await fetch(`${BASE_API_URL}/salary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: createSalary.value }),
    });
  }

  if (createBankStatements.length > 0) {
    for (const { yearId, monthId } of createBankStatements) {
      await fetch(`${BASE_API_URL}/bankStatement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ monthId, yearId }),
      });
    }
  }
}

export default setupDatabase;
