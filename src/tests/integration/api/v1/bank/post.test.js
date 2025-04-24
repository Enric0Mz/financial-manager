import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const result = await setup.generateTestTokens();
  generateTokens = result.tokens;
});

describe("POST api/v1/bank", () => {
  describe("Authenticated user", () => {
    test("Creating bank", async () => {
      const bank = "nuBank";
      const response = await fetch(`${process.env.BASE_API_URL}/bank`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens.data.accessToken}`,
        },
        body: JSON.stringify({ bank }),
      });
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
      expect(responseBody.message).toBe(`bank ${bank} created`);
    });
  });
});
