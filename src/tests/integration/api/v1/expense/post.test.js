import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase({
    createMonths: ["january"],
    createBankStatements: [{ yearId: 2025, monthId: 1 }],
  });
  await fetch(`${process.env.BASE_API_URL}/bank`, {
    method: "POST",
    body: JSON.stringify({ name: "Itaú" }),
  });
});

test("route POST /api/v1/expense/{bankStatementId} should return 201 created", async () => {
  const bankStatementResponse = await fetch(
    `${process.env.BASE_API_URL}/bankStatement?` +
      new URLSearchParams({
        monthId: 1,
        yearId: 2025,
      }),
  );
  const bankStatementResponseBody = await bankStatementResponse.json();
  const bankStatementId = bankStatementResponseBody.id;

  const bankResponse = await fetch(`${process.env.BASE_API_URL}/bank`);
  const bankResponseBody = await bankResponse.json();

  const expense = {
    name: "Compra mercado",
    description: "Compra de mercado da semana",
    total: 543.12,
    bankId: bankResponseBody.data[0].id,
  };
  const response = await fetch(
    `${process.env.BASE_API_URL}/expense/${bankStatementId}`,
    {
      method: "POST",
      body: JSON.stringify(expense),
    },
  );
  const responseBody = await response.json();

  expect(response.status).toBe(201);
  expect(responseBody.name).toBe("created");
  expect(responseBody.message).toBe(`expense created`);
});
