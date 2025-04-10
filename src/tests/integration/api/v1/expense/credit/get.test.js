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
    yearMonth.object.id,
    undefined,
    [bank],
  );
  bankStatementData = bankStatement.data;
  expense = {
    name: "Compra mercado",
    description: "Compra de mercado da semana",
    total: 543.12,
    bankBankStatementId: bankStatementData.banks[0].id,
  };

  await setup.createCreditExpense(expense, bankStatementData.id);
});

describe("GET /api/v1/expense/credit", () => {
  describe("Anonymous user", () => {
    test("Getting credit expense", async () => {
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
        `${process.env.BASE_API_URL}/expense/credit/${getBankStatementResponseBody.expenses[0].id}`,
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(typeof responseBody).toBe("object");
      expect(responseBody.name).toBe(expense.name);
      expect(responseBody.description).toBe(expense.description);
      expect(responseBody.total).toBe(expense.total);
    });
  });
});
