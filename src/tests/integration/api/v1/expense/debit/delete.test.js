import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let bankStatementData;
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  const january = "January";
  const salaryAmount = 4500;
  const expense = {
    name: "Compra débito",
    total: 456.98,
  };
  await setup.createYear(year);
  await setup.createAllMonths();
  const yearMonth = await setup.createMonthInYear(january, year);
  const salary = await setup.createSalary(salaryAmount);
  const bank = await setup.createBank("Banco");
  const bankStatement = await setup.createBankStatement(
    salary,
    yearMonth.id,
    undefined,
    [bank],
  );
  bankStatementData = bankStatement.data;
  await setup.createDebitExpense(expense, bankStatementData.id);
});

describe("DELETE /api/v1/expense/debit", () => {
  describe("Anonymous user", () => {
    test("Deleting expense", async () => {
      const expenseResponse = await fetch(
        `${process.env.BASE_API_URL}/expense/debit/${bankStatementData.id}`,
      );
      const expenseResponseBody = await expenseResponse.json();

      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/debit/${expenseResponseBody.data[0].id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("deleted");
      expect(responseBody.message).toBe(
        `value with id ${expenseResponseBody.data[0].id} deleted successfuly`,
      );
    });
  });
});
