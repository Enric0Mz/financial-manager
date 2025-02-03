import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase();
});

test("route POST /api/v1/month should return 201 created and message 'all months created successufuly'", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/month`, {
    method: "POST",
  });
  const responseBody = await response.json();

  expect(response.status).toBe(201);
  expect(responseBody.message).toBe("all months created successufuly");
});

test("route POST /api/v1/month/2025 should return created 201 and message 'month january created on 2025'", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/month/2025`, {
    method: "POST",
    body: "january",
  });
  const responseBody = await response.json();

  expect(response.status).toBe(201);
  expect(responseBody.name).toBe("created");
  expect(responseBody.message).toBe("month january created on 2025");
});

test("route POST /api/v1/month/2020 should return created 404 not found if yaer 2020 do not exist", async () => {
  const responseWithExpectedError = await fetch(
    `${process.env.BASE_API_URL}/month/2020`,
    {
      method: "POST",
      body: "january",
    },
  );
  const responseBodyWithExpectedError = await responseWithExpectedError.json();

  expect(responseWithExpectedError.status).toBe(404);
  expect(responseBodyWithExpectedError.name).toBe("not found");
  expect(responseBodyWithExpectedError.message).toBe(
    "Value 2020 does not exist on table. Try another value",
  );
});
