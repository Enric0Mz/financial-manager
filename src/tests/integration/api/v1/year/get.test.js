import orchestrator from "tests/orchestrator.js";
import setup from "tests/setupDatabase.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 1997;
  await setup.createYear(year);
});

describe("GET /api/v1/year/", () => {
  describe("Authenticated user", () => {
    test("Fetching years", async () => {
      const generateToken = await setup.generateTestTokens();
      const response = await fetch(`${process.env.BASE_API_URL}/year`, {
        headers: {
          Authorization: `Bearer ${generateToken.data.accessToken}`,
        },
      });
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(responseBody.data)).toBe(true);
    });

    test("Getting year based on id", async () => {
      const year = 1996;
      await fetch(`${process.env.BASE_API_URL}/year/${year}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await fetch(`${process.env.BASE_API_URL}/year/${year}`);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody).toMatchObject({ yearNumber: year });
    });

    test("Getting year by id of year that do not exist", async () => {
      const year = 9999;
      const response = await fetch(`${process.env.BASE_API_URL}/year/${year}`);
      const responseBody = await response.json();

      expect(response.status).toBe(404);
      expect(responseBody.name).toBe("not found");
    });
  });

  describe("Anonymous User", () => {
    test("Fetching years", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/year`, {
        headers: {
          Authorization: "Bearer Invalid Token",
        },
      });
      const responseBody = await response.json();

      expect(response.status).toBe(401);
      expect(responseBody.name).toBe("unauthorized");
      expect(responseBody.message).toBe("Invalid or expired token");
    });
  });
});
