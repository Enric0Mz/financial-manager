import setup from "tests/setupDatabase.js";
import orchestrator from "tests/orchestrator";
import helperFunctions from "helpers/functions";

let generateTokens;

const secondSalary = 4550.12;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const result = await setup.generateTestTokens();
  generateTokens = result.tokens;
  const userId = result.user.data.id;
  const firstSalary = 3000.12;
  await setup.createSalary(firstSalary, userId);
  await helperFunctions.waitToCreate();
  await setup.createSalary(secondSalary, userId);
});

describe("GET api/v1/salary", () => {
  describe("Authenticated user", () => {
    test("Getting most recend salary added", async () => {
      const response = await fetch(`${process.env.BASE_API_URL}/salary`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens.data.accessToken}`,
        },
      });
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.amount).toEqual(secondSalary);
    });
  });
});
