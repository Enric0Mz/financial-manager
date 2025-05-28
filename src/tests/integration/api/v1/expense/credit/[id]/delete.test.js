import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let bankStatementData;
let expense;
let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  await setup.createCalendar();

  const year = 2025;
  const january = "January";
  const salaryAmount = 4500;
  const bankName = "Itau";

  const result = await setup.generateTestTokens();
  const userId = result.user.data.id;
  generateTokens = result.tokens;

  await setup.createSalary(salaryAmount, userId);
  await setup.createBank(bankName, userId);
  const bankStatement = (
    await setup.createBankStatement(january, year, userId)
  ).toJson();
  bankStatementData = bankStatement.data;
  expense = {
    name: "Compra mercado",
    description: "Compra de mercado da semana",
    total: 543.12,
    bankBankStatementId: bankStatementData.banks[0].id,
  };

  await setup.createCreditExpense(expense, bankStatementData.id, userId);
});

describe("DELETE /api/v1/expense/credit", () => {
  describe("Authenticated user", () => {
    test("Deleting credit expense", async () => {
      const yearMonth = {
        month: "January",
        year: 2025,
      };

      const getExpensesListResponse = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${yearMonth.year}?` +
          new URLSearchParams({ month: yearMonth.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );
      const getExpensesListResponseBody = await getExpensesListResponse.json();
      const expenseId = getExpensesListResponseBody.expenses[0].id;

      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${expenseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("deleted");
      expect(responseBody.message).toBe(
        `value with id ${expenseId} deleted successfuly`,
      );

      const getDeletedExpenseResponse = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${expenseId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );

      expect(getDeletedExpenseResponse.status).toBe(404);
    });
  });
});
