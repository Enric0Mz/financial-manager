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
    yearMonth.object.id,
    undefined,
    [bank],
  );
  bankStatementData = bankStatement.data;
  await setup.createDebitExpense(expense, bankStatementData.id);
});

describe("PATCH /api/v1/expense/debit", () => {
  describe("Anonymous user", () => {
    test("Updating all items of an expense", async () => {
      const updatedEXpense = {
        name: "Compra débito (Atualizada)",
        description: "Descrição Atualizada",
        total: 241.08,
      };

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

      const expenseResponse = await fetch(
        `${process.env.BASE_API_URL}/expense/debit/${getBankStatementResponseBody.expenses[0].id}`,
      );
      const expenseResponseBody = await expenseResponse.json();

      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/debit/${expenseResponseBody.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEXpense),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("updated");
      expect(responseBody.message).toBe(
        `value updated to ${updatedEXpense.name}`,
      );
      expect(responseBody.data.name).toBe(updatedEXpense.name);
      expect(responseBody.data.description).toBe(updatedEXpense.description);
      expect(responseBody.data.total).toBe(updatedEXpense.total);
    });
  });
});
