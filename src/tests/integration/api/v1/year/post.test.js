import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const result = await setup.generateTestTokens();
  generateTokens = result.tokens;
});

describe("POST /api/v1/year", () => {
  describe("Authenticated user", () => {
    test("Creating year", async () => {
      const year = 1996;
      const response = await fetch(`${process.env.BASE_API_URL}/year/${year}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens.data.accessToken}`,
        },
      });
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
    });

    test("Creating year that already exist", async () => {
      const year = 1996;
      const response = await fetch(`${process.env.BASE_API_URL}/year/${year}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens.data.accessToken}`,
        },
      });
      const responseBody = await response.json();

      expect(response.status).toBe(409);
      expect(responseBody.name).toBe("conflict");
    });

    test("Creating year out of range", async () => {
      const year = 333;
      const response = await fetch(`${process.env.BASE_API_URL}/year/${year}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens.data.accessToken}`,
        },
      });
      const responseBody = await response.json();

      expect(response.status).toBe(422);
      expect(responseBody.name).toBe("unprocessable entity");
    });
  });
});
