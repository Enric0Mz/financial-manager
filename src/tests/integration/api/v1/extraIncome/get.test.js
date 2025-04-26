import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

const extraIncome1 = {
  name: "Bônus trimestral",
  amount: 750.54,
};
const extraIncome2 = {
  name: "Bonificação extra",
  amount: 200.14,
};

let bankStatementId;
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
  const bankStatement = (
    await setup.createBankStatement(january, year, userId)
  ).toJson();
  bankStatementId = bankStatement.data.id;
  await setup.createExtraIncome(extraIncome1, bankStatementId);
  await setup.createExtraIncome(extraIncome2, bankStatementId);
});

describe("GET /api/v1/extraIncome", () => {
  describe("Authenticated user", () => {
    test("Fetching extra income", async () => {
      const response = await fetch(
        `${process.env.BASE_API_URL}/extra-income/${bankStatementId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(responseBody.data)).toBe(true);
      expect(responseBody.data[0].amount).toBe(extraIncome1.amount);
      expect(responseBody.data[1].amount).toBe(extraIncome2.amount);
    });

    test("Validate bank statement data with extra income added", async () => {
      const yearMonth = {
        year: 2025,
        month: "January",
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

      expect(response.status).toBe(200);
      expect(responseBody.balanceTotal).toBe(
        responseBody.balanceInitial +
          (extraIncome1.amount + extraIncome2.amount),
      );
      expect(responseBody.balanceReal).toBe(
        responseBody.balanceInitial +
          (extraIncome1.amount + extraIncome2.amount),
      );
    });
  });
});
