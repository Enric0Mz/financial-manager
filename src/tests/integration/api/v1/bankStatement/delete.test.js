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
  await fetch("http://localhost:3000/api/v1/month/2025", {
    method: "POST",
    body: "february",
  });
  await fetch("http://localhost:3000/api/v1/salary", {
    method: "POST",
    body: JSON.stringify({
      amount: 4500,
    }),
  });
  await fetch(`${process.env.BASE_API_URL}/bankStatement`, {
    method: "POST",
    body: JSON.stringify({
      yearId: 2025,
      monthId: 1,
    }),
  });
});

test("route DELETE /api/v1/BankStatement/{bankStatementId} should return 200 deleted", async () => {
  const getResponse = await fetch(
    `${process.env.BASE_API_URL}/bankStatement?` +
      new URLSearchParams({
        monthId: 1,
        yearId: 2025,
      }),
  );

  const getResponseBody = await getResponse.json();
  const bankStatementId = getResponseBody.data.id;
  const response = await fetch(
    `${process.env.BASE_API_URL}/bankStatement/${bankStatementId}`,
    {
      method: "DELETE",
    },
  );
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(responseBody.name).toBe("deleted");
  expect(responseBody.message).toBe(
    `value ${bankStatementId} deleted successfuly`,
  );
});
