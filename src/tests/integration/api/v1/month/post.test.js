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
  console.log(responseBody);

  expect(response.status).toBe(201);
  expect(responseBody.message).toBe("all months created successufuly");
});
