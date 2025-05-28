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

describe("PATCH /api/v1/expense/credit", () => {
  describe("Authenticated user", () => {
    test("Updating all items in expense", async () => {
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

      const updatedExpenseData = {
        name: "Compra farmácia",
        description: "Remédios e itens de higiene",
        total: 200.5,
      };

      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${expenseId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
          body: JSON.stringify(updatedExpenseData),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("updated");
      expect(responseBody.message).toBe(
        `value updated to ${updatedExpenseData.name}`,
      );
      expect(responseBody.data.name).toBe(updatedExpenseData.name);
      expect(responseBody.data.description).toBe(
        updatedExpenseData.description,
      );
      expect(responseBody.data.total).toBe(updatedExpenseData.total);
    });

    test("Updating only name of an expense", async () => {
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
      const updatedExpenseData = {
        name: "Compra farmácia (updated)",
      };
      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${expenseId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
          body: JSON.stringify(updatedExpenseData),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.data.name).toBe(updatedExpenseData.name);
      expect(responseBody.data.description).toBe(
        getExpensesListResponseBody.expenses[0].description,
      );
      expect(responseBody.data.total).toBe(
        getExpensesListResponseBody.expenses[0].total,
      );
    });
  });
});
