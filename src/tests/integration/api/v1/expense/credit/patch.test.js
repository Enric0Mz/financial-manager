import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let bankStatementData;
let expense;

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
  expense = {
    name: "Compra mercado",
    description: "Compra de mercado da semana",
    total: 543.12,
    bankBankStatementId: bankStatementData.banks[0].id,
  };

  await setup.createCreditExpense(expense, bankStatement.id);
});

describe("PATCH /api/v1/expense/credit", () => {
  describe("Anonymous user", () => {
    test("Updating all items in expense", async () => {
      const yearMonth = {
        month: "January",
        year: 2025,
      };

      const getExpensesListResponse = await fetch(
        `${process.env.BASE_API_URL}/bankStatement?` +
          new URLSearchParams(yearMonth),
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
        `${process.env.BASE_API_URL}/bankStatement?` +
          new URLSearchParams(yearMonth),
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
