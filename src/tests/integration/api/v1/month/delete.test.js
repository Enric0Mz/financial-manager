import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  const month = "January";
  const result = await setup.generateTestTokens();
  generateTokens = result.tokens;

  await setup.createAllMonths();
  await setup.createYear(year);
  await setup.createMonthInYear(month, year);
});

describe("DELETE api/v1/month", () => {
  describe("Anonymous user", () => {
    test("Deleting month", async () => {
      const year = 2025;
      const month = "January";
      const response = await fetch(
        `${process.env.BASE_API_URL}/month/${year}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
          body: JSON.stringify({ month }),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("deleted");
      expect(responseBody.message).toBe(`value ${month} deleted sucessfuly`);
    });

    test("Trying to delete month that does not exist", async () => {
      const month = "December";
      const response = await fetch(`${process.env.BASE_API_URL}/month/2025`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens.data.accessToken}`,
        },
        body: JSON.stringify({ month }),
      });
      const responseBody = await response.json();

      expect(response.status).toBe(404);
      expect(responseBody.name).toBe("not found");
      expect(responseBody.message).toBe(
        `Value ${month} does not exist on table. Try another value`,
      );
    });

    test("Trying to delete month that does not exist on year", async () => {
      const year = 9999;
      const month = "January";
      const response = await fetch(
        `${process.env.BASE_API_URL}/month/${year}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
          body: JSON.stringify({ month }),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(404);
      expect(responseBody.name).toBe("not found");
    });
  });
});
