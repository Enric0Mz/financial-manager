import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const january = "January";
  const february = "February";
  const salaryAmount = 4500;
  await setup.createYear(year);
  await setup.createAllMonths();
  const monthInYearJanuary = await setup.createMonthInYear(january, year);
  const monthInYearFebruary = await setup.createMonthInYear(february, year);
  const salary = await setup.createSalary(salaryAmount);
  const bankStatement = await setup.createBankStatement(
    salary,
    monthInYearJanuary.object.id,
  );
  await setup.createBankStatement(
    salary,
    monthInYearFebruary.object.id,
    bankStatement.data,
  );
});

const year = 2025;
const salary = 4500;

describe("GET /api/v1/bankStatement/{id}", () => {
  describe("Anonymous user", () => {
    test("Getting bank statement", async () => {
      const month = "January";
      const response = await fetch(
        `${process.env.BASE_API_URL}/bankStatement/${year}?` +
          new URLSearchParams({ month }),
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(typeof responseBody).toBe("object");
      expect(responseBody.balanceInitial).toBe(salary);
    });

    test("Fetching bank statement", async () => {
      const response = await fetch(
        `${process.env.BASE_API_URL}/bankStatement/fetch/${year}`,
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(responseBody.data)).toBe(true);
      expect(responseBody.data[1].balanceInitial).toBe(salary * 2);
    });
  });
});
