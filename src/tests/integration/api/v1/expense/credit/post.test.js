import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let bankStatementId;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  const january = "January";
  const salaryAmount = 4500;
  const bank = "Itau";
  await setup.createYear(year);
  await setup.createAllMonths();
  const yearMonth = await setup.createMonthInYear(january, year);
  const salary = await setup.createSalary(salaryAmount);
  const bankStatement = await setup.createBankStatement(salary, yearMonth.id);
  bankStatementId = bankStatement.id;
  await setup.createBank(bank);
});

describe("POST /api/v1/expense/credit", () => {
  describe("Anonymous user", () => {
    test("Creating credit expense", async () => {
      const bankResponse = await fetch(`${process.env.BASE_API_URL}/bank`);
      const bankResponseBody = await bankResponse.json();

      const expense = {
        name: "Compra mercado",
        description: "Compra de mercado da semana",
        total: 543.12,
        bankId: bankResponseBody.data[0].id,
      };
      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${bankStatementId}`,
        {
          method: "POST",
          body: JSON.stringify(expense),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
      expect(responseBody.message).toBe(`expense created`);
    });
  });
});
