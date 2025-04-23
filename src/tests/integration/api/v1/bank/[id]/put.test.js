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
describe("PUT /api/v1/bank/{bankId}", () => {
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateBankData),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe(updateBankData.name);
    });

    test("Trying to update bank with non existent id", async () => {
      const bankId = 333;
      const updateBankData = { name: "Itaú updated" };
      const response = await fetch(
        `${process.env.BASE_API_URL}/bank/${bankId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateBankData),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(404);
      expect(responseBody.name).toBe("not found");
    });
  });
});
