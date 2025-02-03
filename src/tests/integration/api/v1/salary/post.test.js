import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase({
    createSalary: {
      create: false,
    },
  });
});

test("route POST /api/v1/salary should return 201 created", async () => {
  const salary = 2563.57;
  const response = await fetch(`${process.env.BASE_API_URL}/salary/`, {
    method: "POST",
    body: JSON.stringify({
      amount: salary,
    }),
  });

  const responseBody = await response.json();

  expect(response.status).toBe(201);
  expect(responseBody.name).toBe("created");
  expect(responseBody.message).toBe(`salary amount of ${salary} created.`);
});
