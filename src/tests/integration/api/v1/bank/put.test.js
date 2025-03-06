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

describe("PUT /api/v1/bank", () => {
  describe("Anonymous user", () => {
    test("Updating bank", async () => {
      const bankReponse = await fetch(`${process.env.BASE_API_URL}/bank`);
      const bankResponseBody = await bankReponse.json();
      const bankId = bankResponseBody.data[0].id;

      const updateBankData = { name: "Itaú updated" };
      const response = await fetch(
        `${process.env.BASE_API_URL}/bank/${bankId}`,
        {
          method: "PUT",
          body: JSON.stringify(updateBankData),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe(updateBankData.name);
    });
  });
});
