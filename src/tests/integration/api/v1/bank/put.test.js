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

test("route PUT api/v1/bank/{bankId} should return a bank object updated", async () => {
  const bankReponse = await fetch(`${process.env.BASE_API_URL}/bank`);
  const bankResponseBody = await bankReponse.json();
  const bankId = bankResponseBody.data[0].id;

  const updateBankData = { name: "Itaú updated" };
  const response = await fetch(`${process.env.BASE_API_URL}/bank/${bankId}`, {
    method: "PUT",
    body: JSON.stringify(updateBankData),
  });
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(responseBody.name).toBe(updateBankData.name);
});
