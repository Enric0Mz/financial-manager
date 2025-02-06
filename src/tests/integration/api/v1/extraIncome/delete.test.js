import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase({
    createMonths: ["january"],
    createBankStatements: [{ yearId: 2025, monthId: 1 }],
  });
});

test("route DELETE api/v1/extraIncome/{extraIncomeId} should return 200 deleted", async () => {
  const getBankStatementResponse = await fetch(
    `${process.env.BASE_API_URL}/bankStatement?` +
      new URLSearchParams({
        monthId: 1,
        yearId: 2025,
      }),
  );
  const getBankStatementResponseBody = await getBankStatementResponse.json();
  const bankStatementId = getBankStatementResponseBody.id;

  await fetch(`${process.env.BASE_API_URL}/extraIncome/${bankStatementId}`, {
    method: "POST",
    body: JSON.stringify({ name: "Freelance Job", amount: 500.0 }),
  });

  const extraIncomeResponse = await fetch(
    `${process.env.BASE_API_URL}/extraIncome/${bankStatementId}`,
  );
  const extraIncomeResponseBody = await extraIncomeResponse.json();

  const extraIncomeId = extraIncomeResponseBody.data[0].id;

  const response = await fetch(
    `${process.env.BASE_API_URL}/extraIncome/${extraIncomeId}`,
    {
      method: "DELETE",
    },
  );
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(responseBody.name).toBe("deleted");
  expect(responseBody.message).toBe(
    `value with id ${extraIncomeId} deleted successfuly`,
  );
});
