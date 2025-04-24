import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

const extraIncome = { name: "Freelance Job", amount: 500.0 };
const updatedExtraIncome = {
  name: "Updated Freelance Job",
  amount: 750.0,
};

let bankStatementId;
let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  const january = "January";
  const salaryAmount = 4500;
  const result = await setup.generateTestTokens();
  const userId = result.user.data.id;
  generateTokens = result.tokens;

  await setup.createYear(year);
  await setup.createAllMonths();
  const yearMonth = await setup.createMonthInYear(january, year);
  const salary = await setup.createSalary(salaryAmount, userId);
  const bankStatement = await setup.createBankStatement(
    salary,
    yearMonth.object.id,
    userId,
  );
  bankStatementId = bankStatement.data.id;
  await setup.createExtraIncome(extraIncome, bankStatementId);
});

describe("PATCH /api/v1/extraIncome", () => {
  describe("Authenticated user", () => {
    test("Updating extra income", async () => {
      const extraIncomeResponse = await fetch(
        `${process.env.BASE_API_URL}/extra-income/${bankStatementId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );
      const extraIncomeResponseBody = await extraIncomeResponse.json();

      const extraIncomeId = extraIncomeResponseBody.data[0].id;

      const patchResponse = await fetch(
        `${process.env.BASE_API_URL}/extra-income/${extraIncomeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
          body: JSON.stringify(updatedExtraIncome),
        },
      );
      const patchResponseBody = await patchResponse.json();

      expect(patchResponse.status).toBe(200);
      expect(patchResponseBody.name).toBe(updatedExtraIncome.name);
      expect(patchResponseBody.amount).toBe(updatedExtraIncome.amount);

      const getUpdatedResponse = await fetch(
        `${process.env.BASE_API_URL}/extra-income/${bankStatementId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );
      const getUpdatedBody = await getUpdatedResponse.json();

      expect(getUpdatedBody.data[0].name).toBe(updatedExtraIncome.name);
      expect(getUpdatedBody.data[0].amount).toBe(updatedExtraIncome.amount);
    });
    test("Getting bank statement to check if amount was correctly updated", async () => {
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
        responseBody.balanceInitial + updatedExtraIncome.amount,
      );
      expect(responseBody.balanceReal).toBe(
        responseBody.balanceInitial + updatedExtraIncome.amount,
      );
    });
  });
});
