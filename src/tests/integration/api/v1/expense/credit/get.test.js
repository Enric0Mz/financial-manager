import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let bankStatementData;
let expense;
let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  const january = "January";
  const salaryAmount = 4500;
  const bankName = "Itau";
  await setup.createYear(year);
  await setup.createAllMonths();
  const result = await setup.generateTestTokens();
  const userId = result.user.data.id;
  generateTokens = result.tokens;

  const yearMonth = await setup.createMonthInYear(january, year);
  const salary = await setup.createSalary(salaryAmount, userId);
  const bank = (await setup.createBank(bankName, userId)).toJson();
  const bankStatement = await setup.createBankStatement(
    salary,
    yearMonth.object.id,
    userId,
    undefined,
    [bank.data],
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
  describe("Authenticated user", () => {
    test("Getting credit expense", async () => {
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
        `${process.env.BASE_API_URL}/expense/credit/${getBankStatementResponseBody.expenses[0].id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
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
