import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let bankStatementData;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  const january = "January";
  const salaryAmount = 4500;
  const bankName = "Itau";
  await setup.createYear(year);
  await setup.createAllMonths();
  const yearMonth = await setup.createMonthInYear(january, year);
  const salary = await setup.createSalary(salaryAmount);
  const bank = await setup.createBank(bankName);
  const bankStatement = await setup.createBankStatement(
    salary,
    yearMonth.id,
    undefined,
    [bank],
  );
  bankStatementData = bankStatement;
});

describe("POST /api/v1/expense/credit", () => {
  describe("Anonymous user", () => {
    test("Creating credit expense", async () => {
      const expense = {
        name: "Compra mercado",
        description: "Compra de mercado da semana",
        total: 543.12,
        bankBankStatementId: bankStatementData.banks[0].id,
      };
      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${bankStatementData.id}`,
        {
          method: "POST",
          body: JSON.stringify(expense),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
      expect(responseBody.message).toBe(`expense ${expense.name} created`);
      expect(responseBody.data.name).toBe(expense.name);
      expect(responseBody.data.description).toBe(expense.description);
      expect(responseBody.data.total).toBe(expense.total);
    });
  });
});
