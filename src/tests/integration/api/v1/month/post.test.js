import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

test("route POST /api/v1/month should return 201 created and message 'all months created successufuly'", async () => {
  const response = await fetch("http://localhost:3000/api/v1/month", {
    method: "POST",
  });
  const responseBody = await response.json();

  expect(response.status).toBe(201);
  expect(responseBody.message).toBe("all months created successufuly");
});

test("route POST /api/v1/month/2024 should return created 201 and message 'month january created on 2024'", async () => {
  const responseWithExpectedError = await fetch(
    "http://localhost:3000/api/v1/month/2025",
    {
      method: "POST",
      body: "january",
    },
  );
  const responseBodyWithExpectedError = await responseWithExpectedError.json();

  expect(responseWithExpectedError.status).toBe(404);
  expect(responseBodyWithExpectedError.name).toBe("not found");
  expect(responseBodyWithExpectedError.message).toBe(
    "Value 2025 does not exist on table. Try another value",
  );

  await fetch("http://localhost:3000/api/v1/year/2025", {
    method: "POST",
    body: "january",
  });
  const response = await fetch("http://localhost:3000/api/v1/month/2025", {
    method: "POST",
    body: "january",
  });
  const responseBody = await response.json();

  expect(response.status).toBe(201);
  expect(responseBody.name).toBe("created");
  expect(responseBody.message).toBe("month january created on 2025");
});
