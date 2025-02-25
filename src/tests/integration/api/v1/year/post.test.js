import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/year", () => {
  describe("Anonymous user", () => {
    test("Creating year", async () => {
      const year = 1996;
      const response = await fetch(`${process.env.BASE_API_URL}/year/${year}`, {
        method: "POST",
      });
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
    });

    test("Creating year that already exist ", async () => {
      const year = 1996;
      const response = await fetch(`${process.env.BASE_API_URL}/year/${year}`, {
        method: "POST",
      });
      const responseBody = await response.json();

      expect(response.status).toBe(409);
      expect(responseBody.name).toBe("conflict");
    });
  });
});
