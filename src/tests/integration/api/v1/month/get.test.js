import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  const month = "January";
  const result = await setup.generateTestTokens();
  generateTokens = result.tokens;

  await setup.createAllMonths();
  await setup.createYear(year);
  await setup.createMonthInYear(month, year);
});

describe("GET api/v1/month", () => {
  describe("Authenticated user", () => {
    test("Fething months", async () => {
      const year = 2025;
      const response = await fetch(
        `${process.env.BASE_API_URL}/month/${year}`,
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
      expect(responseBody.data[0].month).toBe("January");
      expect(responseBody.data[0].numeric).toBe(1);
    });
  });
});
