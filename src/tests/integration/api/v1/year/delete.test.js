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
    test("Deleting year", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/year/${year}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("deleted");
      expect(responseBody.message).toBe(`value ${year} deleted successfuly`);
    });

    test("Trying to delete a year that do not exist", async () => {
      const year = 9999;
      const response = await fetch(`${process.env.BASE_API_URL}/year/${year}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseBody = await response.json();
      expect(response.status).toBe(404);
      expect(responseBody.name).toBe("not found");
      expect(responseBody.message).toBe(
        `Value ${year} does not exist on table. Try another value`,
      );
    });

    test("Trying to delete year with no id", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/year`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseBody = await response.json();

      expect(response.status).toBe(405);
      expect(responseBody.name).toBe("invalid method");
    });
  });
});
