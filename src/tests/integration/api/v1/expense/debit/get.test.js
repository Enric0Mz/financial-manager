import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let bankStatementData;
let generateTokens;

const expense = {
  name: "Compra débito",
  total: 456.98,
};

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  await setup.createCalendar();

  const year = 2025;
  const january = "January";
  const salaryAmount = 4500;

  const result = await setup.generateTestTokens();
  const userId = result.user.data.id;
  generateTokens = result.tokens;

  await setup.createSalary(salaryAmount, userId);
  await setup.createBank("Banco", userId);
  const bankStatement = (
    await setup.createBankStatement(january, year, userId)
  ).toJson();
  bankStatementData = bankStatement.data;
  await setup.createDebitExpense(expense, bankStatementData.id);
});

describe("GET /api/v1/expense/debit", () => {
  describe("Authenticated user", () => {
    test("Getiing debit expenses", async () => {
      const yearMonth = {
        month: "January",
        year: 2025,
      };

      const getBankStatementResponse = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${yearMonth.year}?` +
          new URLSearchParams({ month: yearMonth.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );
      const getBankStatementResponseBody =
        await getBankStatementResponse.json();

      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/debit/${getBankStatementResponseBody.expenses[0].id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe(expense.name);
      expect(responseBody.total).toBe(expense.total);
    });
  });
});
