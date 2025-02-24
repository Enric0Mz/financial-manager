import orchestrator from "tests/orchestrator.js";
import setup from "tests/setupDatabase.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  await setup.createYear(year);
});

describe("DELETE api/v1/year", () => {
  describe("anonymous user", () => {
    const year = 2025;
    test("route DELETE api/v1/year/2025 should return status 200 deleted", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/year/${year}`, {
        method: "DELETE",
      });
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("deleted");
      expect(responseBody.message).toBe(`value ${year} deleted successfuly`);
    });

    test("route DELETE api/v1/year/9999 should return status 404 not found", async () => {
      const year = 9999;
      const response = await fetch(`${process.env.BASE_API_URL}/year/${year}`, {
        method: "DELETE",
      });
      const responseBody = await response.json();
      expect(response.status).toBe(404);
      expect(responseBody.name).toBe("not found");
      expect(responseBody.message).toBe(
        `Value ${year} does not exist on table. Try another value`,
      );
    });

    test("tryng to delete with no id should return 405 invalid method", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/year`, {
        method: "DELETE",
      });
      const responseBody = await response.json();

      expect(response.status).toBe(405);
      expect(responseBody.name).toBe("invalid method");
    });
  });
});
