import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

test("route GET /api/v1/year/{year_number} should return 200 ok", async () => {
  await fetch("http://localhost:3000/api/v1/year/1996", {
    method: "POST",
  });
  const response = await fetch("http://localhost:3000/api/v1/year/1996");
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(responseBody.data).toMatchObject({ yearNumber: 1996 });
});

test("route GET /api/v1/year/{year_number} should return 404 if year_number do not exist", async () => {
  const response = await fetch("http://localhost:3000/api/v1/year/9999");
  const responseBody = await response.json();

  expect(response.status).toBe(404);
  expect(responseBody.error).toBe("not found");
});

test("route GET /api/v1/year should return a list of years", async () => {
  await fetch("http://localhost:3000/api/v1/year/1997", {
    method: "POST",
  });
  const response = await fetch("http://localhost:3000/api/v1/year");
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(Array.isArray(responseBody.data)).toBe(true);
});
