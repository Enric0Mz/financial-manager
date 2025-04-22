import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("GET api/v1/user", () => {
  describe("Authenticated user", () => {
    test("Getting user", async () => {
      const generateToken = await setup.generateTestTokens();
      const response = await fetch(`${process.env.BASE_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${generateToken.data.accessToken}`,
        },
      });
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.username).toBe("MockUsername"); // from generateTestTokens method
      expect(responseBody.email).toBe("mock@email.com"); // from generateTestTokens method
    });
  });
});
