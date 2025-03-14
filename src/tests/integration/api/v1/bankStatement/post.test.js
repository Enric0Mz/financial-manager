import setup from "tests/setupDatabase";
import orchestrator from "tests/orchestrator";

const salary = 4500;
const bank = "nuBank";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  const january = "January";
  const february = "February";
  const march = "March";
  await setup.createAllMonths();
  await setup.createYear(year);
  await setup.createMonthInYear(january, year);
  await setup.createMonthInYear(february, year);
  await setup.createMonthInYear(march, year);
  await setup.createSalary(salary);
  await setup.createBank(bank);
});

describe("POST /api/v1/bankStatement", () => {
  describe("Anonymous user", () => {
    test("Creating bank statement without any previous bankStatements", async () => {
      const yearMonth = {
        year: 2025,
        month: "January",
      };
      const response = await fetch(
        `${process.env.BASE_API_URL}/bankStatement`,
        {
          method: "POST",
          body: JSON.stringify(yearMonth),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
      expect(responseBody.message).toBe(`Bank statement created`);
    });

    test("Creating bankStatement with previous bankStatement", async () => {
      const february = {
        year: 2025,
        month: "February",
      };
      await fetch(`${process.env.BASE_API_URL}/bankStatement`, {
        method: "POST",
        body: JSON.stringify(february),
      });

      const response = await fetch(
        `${process.env.BASE_API_URL}/bankStatement?` +
          new URLSearchParams(february),
      );
      const responseBody = await response.json();
      expect(response.status).toBe(200);
      expect(responseBody.balanceInitial).toBe(salary * 2);
      expect(responseBody.banks[0].bank.name).toBe(bank);
    });

    test("Creating bankStatement with previous bankStatement that has one expense", async () => {
      const february = {
        year: 2025,
        month: "February",
      };
      const bankStatementResponse = await fetch(
        `${process.env.BASE_API_URL}/bankStatement?` +
          new URLSearchParams(february),
      );
      const bankStatementResponseBody = await bankStatementResponse.json();
      const bankStatementId = bankStatementResponseBody.id;

      const expense = {
        name: "Compra mercado",
        description: "Compra de mercado da semana",
        total: 543.12,
        bankId: bankStatementResponseBody.banks[0].id,
      };

      await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${bankStatementId}`,
        {
          method: "POST",
          body: JSON.stringify(expense),
        },
      );

      const march = {
        year: 2025,
        month: "March",
      };

      await fetch(`${process.env.BASE_API_URL}/bankStatement`, {
        method: "POST",
        body: JSON.stringify(march),
      });

      const response = await fetch(
        `${process.env.BASE_API_URL}/bankStatement?` +
          new URLSearchParams(march),
      );
      const responseBody = await response.json();

      const validateBalanceReal =
        bankStatementResponseBody.balanceReal +
        responseBody.salary.amount -
        expense.total;

      expect(response.status).toBe(200);
      expect(responseBody.balanceReal).toBe(validateBalanceReal);
    });
  });
});
