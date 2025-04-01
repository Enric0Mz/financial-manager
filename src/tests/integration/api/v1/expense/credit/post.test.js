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
  bankStatementData = bankStatement.data;
});

const expense1 = { total: 543.12 };

const expense2 = { total: 350 };

describe("POST /api/v1/expense/credit", () => {
  describe("Anonymous user", () => {
    test("Creating credit expense", async () => {
      Object.assign(expense1, {
        name: "Compra mercado",
        description: "Compra de mercado da semana",
        bankBankStatementId: bankStatementData.banks[0].id,
      });
      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${bankStatementData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expense1),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
      expect(responseBody.message).toBe(`expense ${expense1.name} created`);
      expect(responseBody.data.name).toBe(expense1.name);
      expect(responseBody.data.description).toBe(expense1.description);
      expect(responseBody.data.total).toBe(expense1.total);
    });

    test("Creating credit expense for the second time", async () => {
      Object.assign(expense2, {
        name: "Jogo ps5",
        description: "Compra jogo gta 6",
        bankBankStatementId: bankStatementData.banks[0].id,
      });
      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${bankStatementData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expense2),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");

      const bankStatementResponse = await fetch(
        `${process.env.BASE_API_URL}/bankStatement/`,
      );
      const bankStatementResponseBody = await bankStatementResponse.json();

      const validateBalanceReal =
        bankStatementResponseBody.data[0].balanceInitial -
        (expense1.total + expense2.total);

      expect(bankStatementResponseBody.data[0].balanceReal).toBe(
        validateBalanceReal,
      );
      expect(bankStatementResponseBody.data[0].banks[0].balance).toBe(
        expense1.total + expense2.total,
      );
    });

    test("Creating expense without required fields", async () => {
      const expense = {
        name: "Gasto sem campos",
      };

      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${bankStatementData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expense),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(422);
      expect(responseBody.name).toBe("unprocessable entity");
      expect(responseBody.message).toBe(
        "fields [total,bankBankStatementId] not found or found in incorrect format",
      );
    });
  });
});
