import orchestrator from "tests/orchestrator.js";
import setup from "tests/setupDatabase.js";

let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const result = await setup.generateTestTokens();
  generateTokens = result.tokens;
});

describe("GET /api/v1/calendar/", () => {
  describe("Authenticated user", () => {
    test("Creating calendar", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/calendar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens.data.accessToken}`,
        },
      });
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
      expect(responseBody.message).toBe(
        "months created for years 1950 to 2050",
      );
    });
  });
});
