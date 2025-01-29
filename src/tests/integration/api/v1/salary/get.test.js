import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase({
    createSalary: {
      create: true,
      value: 3000.12,
    },
    createSalary: {
      create: true,
      value: 4550.12,
    },
  });
});

test("route GET api/v1/salary should return a object with the most recent created salary", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/salary`);
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(responseBody.data.salary).toEqual(4550.12);
});
