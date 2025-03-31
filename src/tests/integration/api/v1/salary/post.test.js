import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/salary", () => {
  describe("Anonymous user", () => {
    test("Creating salary", async () => {
      const amount = 2563.57;
      const response = await fetch(`${process.env.BASE_API_URL}/salary/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
