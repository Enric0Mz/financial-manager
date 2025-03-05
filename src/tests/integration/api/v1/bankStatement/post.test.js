import setup from "tests/setupDatabase";
import orchestrator from "tests/orchestrator";

const salary = 4500;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  const month = "January";
  const secondMonth = "February";
  await setup.createAllMonths();
  await setup.createYear(year);
  await setup.createMonthInYear(month, year);
  await setup.createMonthInYear(secondMonth, year);
  await setup.createSalary(salary);
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
      const yearMonth = {
        year: 2025,
        month: "February",
      };
      await fetch(`${process.env.BASE_API_URL}/bankStatement`, {
        method: "POST",
        body: JSON.stringify(yearMonth),
      });

      const response = await fetch(
        `${process.env.BASE_API_URL}/bankStatement?` +
          new URLSearchParams(yearMonth),
      );
      const responseBody = await response.json();
      console.log(responseBody);

      expect(response.status).toBe(200);
      expect(responseBody.balanceInitial).toBe(salary * 2);
    });

    test("Creating bankStatement with previous bankStatement that has one expense", async () => {
      const bankStatementResponse = await fetch(
        `${process.env.BASE_API_URL}/bankStatement?` +
          new URLSearchParams({
            monthId: 1,
            yearId: 2025,
          }),
      );
      const bankStatementResponseBody = await bankStatementResponse.json();
      const bankStatementId = bankStatementResponseBody.id;

      const bankResponse = await fetch(`${process.env.BASE_API_URL}/bank`);
      const bankResponseBody = await bankResponse.json();

      const expense = {
        name: "Compra mercado",
        description: "Compra de mercado da semana",
        total: 543.12,
        bankId: bankResponseBody.data[0].id,
      };

      await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${bankStatementId}`,
        {
          method: "POST",
          body: JSON.stringify(expense),
        },
      );

      await fetch(`${process.env.BASE_API_URL}/bankStatement`, {
        method: "POST",
        body: JSON.stringify({
          yearId: 2025,
          monthId: 2,
        }),
      });

      const response = await fetch(`${process.env.BASE_API_URL}/bankStatement`);
      const responseBody = await response.json();

      const validateBalanceReal =
        responseBody.data[0].balanceInitial - expense.total;

      expect(response.status).toBe(200);
      expect(responseBody.data[0].balanceReal).toBe(validateBalanceReal);
    });
  });
});
