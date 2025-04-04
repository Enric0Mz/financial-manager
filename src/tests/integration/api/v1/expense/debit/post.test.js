import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let bankStatementData;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  const january = "January";
  const salaryAmount = 4500;
  await setup.createYear(year);
  await setup.createAllMonths();
  const yearMonth = await setup.createMonthInYear(january, year);
  const salary = await setup.createSalary(salaryAmount);
  const bankStatement = await setup.createBankStatement(
    salary,
    yearMonth.object.id,
  );
  bankStatementData = bankStatement.data;
});

describe("POST /api/v1/expense/debit", () => {
  describe("Anonymous user", () => {
    test("Creating debit expense", async () => {
      const expense = {
        name: "Pix curso",
        description: "Pix para curso de matemática",
        total: 150.99,
      };
      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/debit/${bankStatementData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
  test("Creating debit expense for the second time", async () => {
    const expense = {
      name: "Gasto mercado",
      description: "gasto com mercado dia 15",
      total: 436.09,
    };
    const response = await fetch(
      `${process.env.BASE_API_URL}/expense/debit/${bankStatementData.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
