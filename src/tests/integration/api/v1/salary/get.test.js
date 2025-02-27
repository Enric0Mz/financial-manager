import setup from "tests/setupDatabase.js";
import orchestrator from "tests/orchestrator";

const secondSalary = 4550.12;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const firstSalary = 3000.12;
  await setup.createSalary(firstSalary);
  await setup.createSalary(secondSalary);
});

describe("GET api/v1/salary", () => {
  describe("Anonymous user", () => {
    test("Getting most recend salary added", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/salary`);
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.data.salary).toEqual(secondSalary);
    });
  });
});
