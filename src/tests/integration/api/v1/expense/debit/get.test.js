import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let bankStatementData;

const expense = {
  name: "Compra débito",
  total: 456.98,
};

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
  const bank = await setup.createBank("Banco");
  const bankStatement = await setup.createBankStatement(
    salary,
    yearMonth.object.id,
    undefined,
    [bank],
  );
  bankStatementData = bankStatement.data;
  await setup.createDebitExpense(expense, bankStatementData.id);
});

describe("GET /api/v1/expense/debit", () => {
  describe("Anonymous user", () => {
    test("Getiing debit expenses", async () => {
      const yearMonth = {
        month: "January",
        year: 2025,
      };

      const getBankStatementResponse = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${yearMonth.year}?` +
          new URLSearchParams({ month: yearMonth.month }),
      );
      const getBankStatementResponseBody =
        await getBankStatementResponse.json();

      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/debit/${getBankStatementResponseBody.expenses[0].id}`,
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe(expense.name);
      expect(responseBody.total).toBe(expense.total);
    });
  });
});
