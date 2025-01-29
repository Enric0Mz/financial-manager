import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase({
    createMonths: ["january"],
    createBankStatements: [{ yearId: 2025, monthId: 1 }],
  });
});

test("route POST /api/v1/extraIncome/{bankStatementId} should return 201 created", async () => {
  const getBankStatementResponse = await fetch(
    `${process.env.BASE_API_URL}/bankStatement?` +
      new URLSearchParams({
        monthId: 1,
        yearId: 2025,
      }),
  );
  const getBankStatementResponseBody = await getBankStatementResponse.json();
  const bankStatementId = getBankStatementResponseBody.data.id;
  const extraIncomeName = "Bônus trimestral";
  const response = await fetch(
    `${process.env.BASE_API_URL}/extraIncome/${bankStatementId}`,
    {
      method: "POST",
      body: JSON.stringify({
        name: extraIncomeName,
        amount: 750.54,
      }),
    },
  );
  const responseBody = await response.json();

  expect(response.status).toBe(201);
  expect(responseBody.name).toBe("created");
  expect(responseBody.message).toBe(
    `Extra income '${extraIncomeName}' created`,
  );
});
