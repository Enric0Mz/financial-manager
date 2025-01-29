import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase({
    createSalary: {
      create: true,
      value: 3000.12,
    },
  });
  await fetch(`${process.env.BASE_API_URL}/salary`, {
    method: "POST",
    body: JSON.stringify({ amount: 4550.12 }),
  }); // TODO: fix this logic
});

test("route GET api/v1/salary should return a object with the most recent created salary", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/salary`);
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(responseBody.data.salary).toEqual(4550.12);
});
