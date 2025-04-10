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

describe("DELETE /api/v1/bank/{bankId}", () => {
  describe("Anonymous user", () => {
    test("Deleting bank", async () => {
      const bankReponse = await fetch(`${process.env.BASE_API_URL}/bank`);
      const bankResponseBody = await bankReponse.json();
      const bankId = bankResponseBody.data[0].id;

      const response = await fetch(
        `${process.env.BASE_API_URL}/bank/${bankId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("deleted");
      expect(responseBody.message).toBe(
        `value with id ${bankId} deleted successfuly`,
      );
    });

    test("Trying to delete bank with non existend id", async () => {
      const bankId = 333;
      const response = await fetch(
        `${process.env.BASE_API_URL}/bank/${bankId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(404);
      expect(responseBody.name).toBe("not found");
    });
  });
});
