import orchestrator from "tests/orchestrator";

const salary = 4500;
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await fetch(`${process.env.BASE_API_URL}/salary`, {
    method: "POST",
    body: JSON.stringify({
      amount: salary,
    }),
  });
});

test("route PUT /api/v1/salary/{salaryId} should return 200 updated", async () => {
  const newSalary = 5000;
  const getSalaryId = await fetch(`${process.env.BASE_API_URL}/salary`);
  const getSalaryIdBody = await getSalaryId.json();
  const salaryId = await getSalaryIdBody.data.id;
  const response = await fetch(
    `${process.env.BASE_API_URL}/salary/${salaryId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        amount: newSalary,
      }),
    },
  );
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(responseBody.name).toBe("updated");
  expect(responseBody.message).toBe(`value updated to ${newSalary}`);
});

test("route PUT /api/v1/salary/{salaryId} should return 404 if salary id doesent exist", async () => {
  const salaryId = 333;
  const response = await fetch(
    `${process.env.BASE_API_URL}/salary/${salaryId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        amount: 5000,
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
