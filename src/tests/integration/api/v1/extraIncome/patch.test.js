import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase({
    createMonths: ["january"],
    createBankStatements: [{ yearId: 2025, monthId: 1 }],
  });
});

test("route PATCH api/v1/extraIncome/{extraIncomeId} should update an extra income entry", async () => {
  const getBankStatementResponse = await fetch(
    `${process.env.BASE_API_URL}/bankStatement?` +
      new URLSearchParams({
        monthId: 1,
        yearId: 2025,
      }),
  );
  const getBankStatementResponseBody = await getBankStatementResponse.json();
  const bankStatementId = getBankStatementResponseBody.data.id;

  await fetch(`${process.env.BASE_API_URL}/extraIncome/${bankStatementId}`, {
    method: "POST",
    body: JSON.stringify({ name: "Freelance Job", amount: 500.0 }),
  });

  const extraIncomeResponse = await fetch(
    `${process.env.BASE_API_URL}/extraIncome/${bankStatementId}`,
  );
  const extraIncomeResponseBody = await extraIncomeResponse.json();

  const extraIncomeId = extraIncomeResponseBody.data[0].id;

  const updatedExtraIncome = {
    name: "Updated Freelance Job",
    amount: 750.0,
  };

  const patchResponse = await fetch(
    `${process.env.BASE_API_URL}/extraIncome/${extraIncomeId}`,
    {
      method: "PATCH",
      body: JSON.stringify(updatedExtraIncome),
    },
  );
  const patchResponseBody = await patchResponse.json();

  expect(patchResponse.status).toBe(200);
  expect(patchResponseBody.data.name).toBe(updatedExtraIncome.name);
  expect(patchResponseBody.data.amount).toBe(updatedExtraIncome.amount);

  const getUpdatedResponse = await fetch(
    `${process.env.BASE_API_URL}/extraIncome/${bankStatementId}`,
  );
  const getUpdatedBody = await getUpdatedResponse.json();

  console.log(getUpdatedBody);
  expect(getUpdatedBody.data[0].name).toBe(updatedExtraIncome.name);
  expect(getUpdatedBody.data[0].amount).toBe(updatedExtraIncome.amount);
});
