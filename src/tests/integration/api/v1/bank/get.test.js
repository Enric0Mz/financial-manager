import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

const itau = "Itau";
const nuBank = "nuBank";

let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const result = await setup.generateTestTokens();
  const userId = result.user.data.id;
  generateTokens = result.tokens;

  await setup.createBank(itau, userId);
  await setup.createBank(nuBank, userId);
});

describe("GET /api/v1/bank", () => {
  describe("Authenticated user", () => {
    test("Fetching banks", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/bank`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens.data.accessToken}`,
        },
      });
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(responseBody.data)).toBe(true);
      expect(responseBody.data[0].name).toBe(itau);
      expect(responseBody.data[1].name).toBe(nuBank);
    });
  });
});
