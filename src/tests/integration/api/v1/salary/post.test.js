import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  const result = await setup.generateTestTokens();
  generateTokens = result.tokens;
});

describe("POST /api/v1/salary", () => {
  describe("Authenticated user", () => {
    test("Creating salary", async () => {
      const amount = 2563.57;
      const response = await fetch(`${process.env.BASE_API_URL}/salary/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens.data.accessToken}`,
        },
        body: JSON.stringify({
          amount,
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
      expect(responseBody.message).toBe(`salary amount of ${amount} created.`);
    });

    test("Creating salary with string", async () => {
      const amount = "Salario em string";
      const response = await fetch(`${process.env.BASE_API_URL}/salary/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens.data.accessToken}`,
        },
        body: JSON.stringify({
          amount,
        }),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(422);
      expect(responseBody.name).toBe("unprocessable entity");
      expect(responseBody.message).toBe(
        `fields [amount] not found or found in incorrect format`,
      );
    });
  });
});
