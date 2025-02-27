import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  const month = "January";
  await setup.createAllMonths();
  await setup.createYear(year);
  await setup.createMonthInYear(month, year);
});

describe("DELETE api/v1/month", () => {
  describe("Anonymous user", () => {
    test("Deleting month", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/month/2025`, {
        method: "DELETE",
        body: "january",
      });

      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("deleted");
      expect(responseBody.message).toBe("value january deleted sucessfuly");
    });

    test("Trying to delete month that does not exist", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/month/2025`, {
        method: "DELETE",
        body: "december",
      });
      const responseBody = await response.json();

      expect(response.status).toBe(404);
      expect(responseBody.name).toBe("not found");
      expect(responseBody.message).toBe(
        "Value december does not exist on table. Try another value",
      );
    });

    test("Trying to delete month that does not exist on year", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/month/9999`, {
        method: "DELETE",
        body: "january",
      });
      const responseBody = await response.json();

      expect(response.status).toBe(404);
      expect(responseBody.name).toBe("not found");
    });
  });
});
