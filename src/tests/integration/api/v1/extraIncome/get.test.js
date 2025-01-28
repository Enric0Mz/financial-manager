import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await fetch(`${process.env.BASE_API_URL}/year/2025`, {
    method: "POST",
  });

  await fetch(`${process.env.BASE_API_URL}/month`, {
    method: "POST",
  });
  await fetch(`${process.env.BASE_API_URL}/month/2025`, {
    method: "POST",
    body: "january",
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

test("route GET api/v1/extraIncome/{bankStatementId} should return a list of extra incomes linked to a bank statement", async () => {
  const getBankStatementResponse = await fetch(
    `${process.env.BASE_API_URL}/bankStatement?` +
      new URLSearchParams({
        monthId: 1,
        yearId: 2025,
      }),
  );
  const getBankStatementResponseBody = await getBankStatementResponse.json();
  const bankStatementId = getBankStatementResponseBody.data.id;
  const extraIncomeAmount = 750.54;
  await fetch(`${process.env.BASE_API_URL}/extraIncome/${bankStatementId}`, {
    method: "POST",
    body: JSON.stringify({
      name: "Bônus trimestral",
      amount: extraIncomeAmount,
    }),
  });
  const secondExtraIncomeAmount = 200.14;
  await fetch(`${process.env.BASE_API_URL}/extraIncome/${bankStatementId}`, {
    method: "POST",
    body: JSON.stringify({
      name: "Bonificação extra",
      amount: secondExtraIncomeAmount,
    }),
  });
  const response = await fetch(
    `${process.env.BASE_API_URL}/extraIncome/${bankStatementId}`,
  );
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(Array.isArray(responseBody.data)).toBe(true);
  expect(responseBody.data[0].amount).toBe(extraIncomeAmount);
  expect(responseBody.data[1].amount).toBe(secondExtraIncomeAmount);
});
