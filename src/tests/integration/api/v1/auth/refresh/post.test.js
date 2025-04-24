import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  const result = await setup.generateTestTokens();
  generateTokens = result.tokens;
});

describe("POST /api/v1/auth/refresh", () => {
  describe("Authenticated user", () => {
    test("Refreshing session with valid refreshToken", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens.data.accessToken}`,
        },
        body: JSON.stringify({
          refreshToken: generateTokens.data.refreshToken,
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("refreshed session");
      expect(responseBody.message).toBe("User refreshed session sucessfuly");
      expect(responseBody.data.type).toBe("Bearer");
    });
  });
});
