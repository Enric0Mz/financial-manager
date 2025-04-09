import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

const extraIncome = { name: "Freelance Job", amount: 500.0 };

let bankStatementId;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  const january = "January";
  const salaryAmount = 4500;
  await setup.createYear(year);
  await setup.createAllMonths();
  const yearMonth = await setup.createMonthInYear(january, year);
  const salary = await setup.createSalary(salaryAmount);
  const bankStatement = await setup.createBankStatement(
    salary,
    yearMonth.object.id,
  );
  bankStatementId = bankStatement.data.id;
  await setup.createExtraIncome(extraIncome, bankStatementId);
});

describe("DELETE /api/v1/extraIncome", () => {
  describe("Anonymous user", () => {
    test("Deleting extra income", async () => {
      const extraIncomeResponse = await fetch(
        `${process.env.BASE_API_URL}/extraIncome/${bankStatementId}`,
      );
      const extraIncomeResponseBody = await extraIncomeResponse.json();

      const extraIncomeId = extraIncomeResponseBody.data[0].id;

      const response = await fetch(
        `${process.env.BASE_API_URL}/extraIncome/${extraIncomeId}`,
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
        `value with id ${extraIncomeId} deleted successfuly`,
      );
    });
    test("Getting bank statement to check if amount was correctly deleted", async () => {
      const yearMonth = {
        year: 2025,
        month: "January",
      };
      const response = await fetch(
        `${process.env.BASE_API_URL}/bankStatement/${yearMonth.year}?` +
          new URLSearchParams({ month: yearMonth.month }),
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.balanceTotal).toBe(responseBody.balanceInitial);
      expect(responseBody.balanceReal).toBe(responseBody.balanceInitial);
    });
  });
});
