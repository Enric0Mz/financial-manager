import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

const extraIncome = { name: "Freelance Job", amount: 500.0 };

let bankStatementId;
let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  await setup.createCalendar();

  const year = 2025;
  const january = "January";
  const february = "February";
  const salaryAmount = 4500;

  const result = await setup.generateTestTokens();
  const userId = result.user.data.id;
  generateTokens = result.tokens;

  await setup.createSalary(salaryAmount, userId);
  const bankStatement = (
    await setup.createBankStatement(january, year, userId)
  ).toJson();
  await setup.createBankStatement(february, year, userId);
  bankStatementId = bankStatement.data.id;
  await setup.createExtraIncome(extraIncome, bankStatementId);
});

describe("DELETE /api/v1/extraIncome", () => {
  describe("Authenticated user", () => {
    test("Deleting extra income", async () => {
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

      const response = await fetch(
        `${process.env.BASE_API_URL}/extra-income/${extraIncomeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("deleted");
      expect(responseBody.message).toBe(
        `value with id ${extraIncomeId} deleted successfuly`,
      );
    });
    test("Getting bank statement to check if amount was correctly deleted", async () => {
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
      expect(responseBody.balanceTotal).toBe(responseBody.balanceInitial);
      expect(responseBody.balanceReal).toBe(responseBody.balanceInitial);
    });

    test("Getting bank statement to check if amount was correctly deleted in second bank statement", async () => {
      const yearMonth = {
        year: 2025,
        month: "February",
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
      expect(responseBody.balanceTotal).toBe(responseBody.balanceInitial);
      expect(responseBody.balanceReal).toBe(responseBody.balanceInitial);
    });
  });
});
