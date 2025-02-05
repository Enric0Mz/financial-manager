import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await fetch(`${process.env.BASE_API_URL}/bank`, {
    method: "POST",
    body: JSON.stringify({ name: "Itaú" }),
  });
  await fetch(`${process.env.BASE_API_URL}/bank`, {
    method: "POST",
    body: JSON.stringify({ name: "NuBank" }),
  });
});

test("route GET api/v1/bank should return a list of banks", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/bank`);
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(Array.isArray(responseBody.data)).toBe(true);
  expect(responseBody.data[0].name).toBe("Itaú");
  expect(responseBody.data[1].name).toBe("NuBank");
});
