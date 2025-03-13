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

describe("PATCH /api/v1/expense/credit", () => {
  describe("Anonymous user", () => {
    test("route PATCH api/v1/expense/{expenseId} should return 200 updated", async () => {
      const expense = {
        name: "Compra mercado",
        description: "Compra de mercado da semana",
        total: 543.12,
        bankBankStatementId: bankStatementData.banks[0].id,
      };

      await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${bankStatementData.id}`,
        {
          method: "POST",
          body: JSON.stringify(expense),
        },
      );

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

      const getUpdatedExpenseResponse = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${expenseId}`,
      );
      const updatedExpense = await getUpdatedExpenseResponse.json();

      expect(getUpdatedExpenseResponse.status).toBe(200);
      expect(updatedExpense.name).toBe(updatedExpenseData.name);
      expect(updatedExpense.description).toBe(updatedExpenseData.description);
      expect(updatedExpense.total).toBe(updatedExpenseData.total);
    });
  });
});
