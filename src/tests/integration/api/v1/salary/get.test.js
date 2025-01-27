import orchestrator from "tests/orchestrator.js";

const secondSalary = 3578.87;
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  const firstSalary = 2563.57;
  await fetch("http://localhost:3000/api/v1/salary", {
    method: "POST",
    body: JSON.stringify({
      amount: firstSalary,
    }),
  });
  await fetch("http://localhost:3000/api/v1/salary", {
    method: "POST",
    body: JSON.stringify({
      amount: secondSalary,
    }),
  });
});

test("route GET api/v1/salary should return a object with the most recent created salary", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/salary`);
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(responseBody.data.salary).toEqual(secondSalary);
});
