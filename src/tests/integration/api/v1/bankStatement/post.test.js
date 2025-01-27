import orchestrator from "tests/orchestrator";

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
  await fetch("http://localhost:3000/api/v1/salary", {
    method: "POST",
    body: JSON.stringify({
      amount: 4500,
    }),
  });
});

test("route POST /api/v1/bankStatement/ should return 201 created", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/bankStatement`, {
    method: "POST",
    body: JSON.stringify({
      yearId: 2025,
      monthId: 1,
    }),
  });

  const responseBody = await response.json();

  expect(response.status).toBe(201);
  expect(responseBody.name).toBe("created");
  expect(responseBody.message).toBe(`Bank statement created`);
});
