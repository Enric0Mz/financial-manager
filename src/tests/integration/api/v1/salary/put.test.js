import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const amount = 4500;
  await setup.createSalary(amount);
});

describe("PUT /api/v1/salary", () => {
  describe("Anonymous user", () => {
    test("Updating salary with salary id", async () => {
      const getSalary = await fetch(`${process.env.BASE_API_URL}/salary`);
      const getSalaryBody = await getSalary.json();
      const salaryId = await getSalaryBody.data.id;
      const updatedAmount = 5000;
      const response = await fetch(
        `${process.env.BASE_API_URL}/salary/${salaryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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
