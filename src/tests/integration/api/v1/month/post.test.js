import setup from "tests/setupDatabase.js";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  setup.createYear(year);
});

describe("POST /api/v1/month", () => {
  describe("Anonymous user", () => {
    test("Creating all months of the year", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/month`, {
        method: "POST",
      });
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.message).toBe("all months created successufuly");
    });

    test("Creating month january on year 2025", async () => {
      const year = 2025;
      const month = "January";
      const response = await fetch(
        `${process.env.BASE_API_URL}/month/${year}`,
        {
          method: "POST",
          body: JSON.stringify({ month }),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
      expect(responseBody.message).toBe(`month ${month} created on ${year}`);
    });

    test("Trying to insert month in non existent year", async () => {
      const year = 2020;
      const month = "January";
      const responseWithExpectedError = await fetch(
        `${process.env.BASE_API_URL}/month/${year}`,
        {
          method: "POST",
          body: JSON.stringify({ month }),
        },
      );
      const responseBodyWithExpectedError =
        await responseWithExpectedError.json();

      expect(responseWithExpectedError.status).toBe(404);
      expect(responseBodyWithExpectedError.name).toBe("not found");
      expect(responseBodyWithExpectedError.message).toBe(
        `Value ${year} does not exist on table. Try another value`,
      );
    });
  });
});
