import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

const itau = "Itau";
const nuBank = "nuBank";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  await setup.createBank(itau);
  await setup.createBank(nuBank);
});

describe("GET /api/v1/bank", () => {
  describe("Anonymous user", () => {
    test("Fetching banks", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/bank`);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(responseBody.data)).toBe(true);
      expect(responseBody.data[0].name).toBe(itau);
      expect(responseBody.data[1].name).toBe(nuBank);
    });
  });
});
