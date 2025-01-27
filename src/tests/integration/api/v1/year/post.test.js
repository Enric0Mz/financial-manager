import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

test("route POST /api/v1/year should return 201 created", async () => {
  const response = await fetch("http://localhost:3000/api/v1/year/1996", {
    method: "POST",
  });
  expect(response.status).toBe(201);

  const responseBody = await response.json();

  expect(responseBody.name).toBe("created");
});

test("route POST /api/v1/year should return 409 conflict if year already exist", async () => {
  const response = await fetch("http:localhost:3000/api/v1/year/1996", {
    method: "POST",
  });

  expect(response.status).toBe(409);

  const responseBody = await response.json();

  expect(responseBody.name).toBe("conflict");
});
