import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

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
  await setup.createBankStatement(salary, yearMonth.object.id);
});

describe("POST /api/v1/extraIncome", () => {
  describe("Anonymous user", () => {
    test("Creating extra income", async () => {
      const yearMonth = {
        month: "January",
        year: 2025,
      };
      const getBankStatementResponse = await fetch(
        `${process.env.BASE_API_URL}/bankStatement/${yearMonth.year}?` +
          new URLSearchParams({ month: yearMonth.month }),
      );
      const getBankStatementResponseBody =
        await getBankStatementResponse.json();
      const bankStatementId = getBankStatementResponseBody.id;

      const extraIncome = {
        name: "Bonus Trimestral",
        amount: 750.54,
      };

      const response = await fetch(
        `${process.env.BASE_API_URL}/extraIncome/${bankStatementId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
