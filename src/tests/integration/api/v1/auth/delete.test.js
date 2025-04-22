import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("DELETE /api/v1/auth/logout", () => {
  describe("Authenticated user", () => {
    test("Loggin out off aplication", async () => {
      const generateTokens = await setup.generateTestTokens();

      const response = await fetch(`${process.env.BASE_API_URL}/auth`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${generateTokens.data.accessToken}`,
        },
      });

      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("logout");
      expect(responseBody.message).toBe("User logged out successfully");

      const validateIfIsLoggedOut = await fetch(
        `${process.env.BASE_API_URL}/user`,
        {
          headers: {
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );
      expect(validateIfIsLoggedOut.status).toBe(401);
    });
  });

  describe("Unauthenticated user", () => {
    test("Trying to logout without auth token", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/auth`, {
        method: "DELETE",
      });

      const responseBody = await response.json();

      expect(response.status).toBe(400);
      expect(responseBody.message).toBe("Access token missing or not found");
    });
  });
});
