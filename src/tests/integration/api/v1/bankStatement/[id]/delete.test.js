import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const salaryAmount = 4500;
  await setup.createYear(year);
  await setup.createAllMonths();
  const monthInYear = await setup.createMonthInYear(month, year);
  const salary = await setup.createSalary(salaryAmount);
  await setup.createBankStatement(salary, monthInYear.object.id);
});

const month = "January";
const year = 2025;

describe("GET /api/v1/bankStatement/{id}", () => {
  describe("Anonymous user", () => {
    test("Deleting bankStatement", async () => {
      const bankStatement = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${year}?` +
          new URLSearchParams({ month }),
      );

      const bankStatementResponse = await bankStatement.json();
      const bankStatementId = bankStatementResponse.id;

      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${bankStatementId}`,
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
        `value ${bankStatementId} deleted successfuly`,
      );
    });
  });
});
