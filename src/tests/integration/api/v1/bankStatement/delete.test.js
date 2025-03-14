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
  const monthInYear = await setup.createMonthInYear(january, year);
  const salary = await setup.createSalary(salaryAmount);
  await setup.createBankStatement(salary, monthInYear.id);
});

describe("GET /api/v1/bank", () => {
  describe("Anonymous user", () => {
    test("Deleting bankStatement", async () => {
      const january = {
        month: "January",
        year: 2025,
      };

      const bankStatement = await fetch(
        `${process.env.BASE_API_URL}/bankStatement?` +
          new URLSearchParams(january),
      );

      const bankStatementResponse = await bankStatement.json();
      const bankStatementId = bankStatementResponse.id;

      const response = await fetch(
        `${process.env.BASE_API_URL}/bankStatement/${bankStatementId}`,
        {
          method: "DELETE",
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("deleted");
      expect(responseBody.message).toBe(
        `value ${bankStatementId} deleted successfuly`,
      );
    });
  });
});
