import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  await setup.createCalendar();

  const year = 2025;
  const january = "January";
  const february = "February";
  const march = "March";

  const result = await setup.generateTestTokens();
  const userId = result.user.data.id;
  generateTokens = result.tokens;

  await setup.createSalary(salaryAmount, userId);
  await setup.createBankStatement(january, year, userId);
  await setup.createBankStatement(february, year, userId);
  await setup.createBankStatement(march, year, userId);
});

const salaryAmount = 4500;
const extraIncome = {
  name: "Bonus Trimestral",
  amount: 750.54,
};

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

    test("Creation of extra income should reflect through both statements created", async () => {
      const yearMonth = {
        month: "February",
        year: 2025,
      };
      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${yearMonth.year}?` +
          new URLSearchParams({ month: yearMonth.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );
      const responseBody = await response.json();

      const totalBalanceInitial = salaryAmount * 2 + extraIncome.amount;

      expect(response.status).toBe(200);
      expect(responseBody.balanceInitial).toBe(totalBalanceInitial);
    });

    test("Creation of extra income should reflect through all statements created", async () => {
      const yearMonth = {
        month: "March",
        year: 2025,
      };
      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${yearMonth.year}?` +
          new URLSearchParams({ month: yearMonth.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );
      const responseBody = await response.json();

      const totalBalanceInitial = salaryAmount * 3 + extraIncome.amount;

      expect(response.status).toBe(200);
      expect(responseBody.balanceInitial).toBe(totalBalanceInitial);
    });
  });
});
