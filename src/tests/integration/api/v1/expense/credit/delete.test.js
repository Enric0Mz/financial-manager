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

describe("DELETE /api/v1/expense/credit", () => {
  describe("Anonymous user", () => {
    test("route DELETE api/v1/expense/credit/{expenseId} should return 200 deleted", async () => {
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

      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${expenseId}`,
        {
          method: "DELETE",
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
      );

      expect(getDeletedExpenseResponse.status).toBe(404);
    });
  });
});
