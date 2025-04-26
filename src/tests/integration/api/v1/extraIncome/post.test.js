import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let generateTokens;

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
  await setup.createBankStatement(january, year, userId);
});

describe("POST /api/v1/extraIncome", () => {
  describe("Authenticated user", () => {
    test("Creating extra income", async () => {
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
      const bankStatementId = getBankStatementResponseBody.id;

      const extraIncome = {
        name: "Bonus Trimestral",
        amount: 750.54,
      };

      const response = await fetch(
        `${process.env.BASE_API_URL}/extra-income/${bankStatementId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
          body: JSON.stringify(extraIncome),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
      expect(responseBody.message).toBe(
        `Extra income ${extraIncome.name} created`,
      );
    });
  });
});
