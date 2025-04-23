import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const result = await setup.generateTestTokens();
  generateTokens = result.tokens;
  const userId = result.user.data.id;

  const amount = 4500;
  await setup.createSalary(amount, userId);
});

describe("PUT /api/v1/salary", () => {
  describe("Anonymous user", () => {
    test("Updating salary with salary id", async () => {
      const getSalary = await fetch(`${process.env.BASE_API_URL}/salary`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens.data.accessToken}`,
        },
      });
      const getSalaryBody = await getSalary.json();
      const salaryId = await getSalaryBody.id;
      const updatedAmount = 5000;
      const response = await fetch(
        `${process.env.BASE_API_URL}/salary/${salaryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
          body: JSON.stringify({
            amount: updatedAmount,
          }),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("updated");
      expect(responseBody.message).toBe(`value updated to ${updatedAmount}`);
    });

    test("Trying to update salary with non existent id", async () => {
      const salaryId = 333;
      const amount = 5000;
      const response = await fetch(
        `${process.env.BASE_API_URL}/salary/${salaryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
          body: JSON.stringify({
            amount,
          }),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(404);
      expect(responseBody.name).toBe("not found");
      expect(responseBody.message).toBe(
        `Value ${salaryId} does not exist on table. Try another value`,
      );
    });
  });
});
