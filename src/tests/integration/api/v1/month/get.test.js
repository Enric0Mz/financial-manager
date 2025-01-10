import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await fetch("http://localhost:3000/api/v1/year/2025", {
    method: "POST",
  });
  await fetch("http://localhost:3000/api/v1/month", {
    method: "POST",
  });
  await fetch("http://localhost:3000/api/v1/month/2025", {
    method: "POST",
    body: "january",
  });
});

test("route GET api/v1/month/2025 should return 200 with a object with a list of months", async () => {
  const response = await fetch("http://localhost:3000/api/v1/month/2025");
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(Array.isArray(responseBody.data)).toBe(true);
  expect(responseBody.data[0].month).toBe("January");
  expect(responseBody.data[0].numeric).toBe(1);
});
