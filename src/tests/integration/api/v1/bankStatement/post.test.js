import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase({
    createMonths: ["january", "february"],
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

test("route POST /api/v1/bankStatement should return an updated balance real based on last bankStatement", async () => {
  const bankStatementResponse = await fetch(
    `${process.env.BASE_API_URL}/bankStatement?` +
      new URLSearchParams({
        monthId: 1,
        yearId: 2025,
      }),
  );
  const bankStatementResponseBody = await bankStatementResponse.json();
  const bankStatementId = bankStatementResponseBody.id;

  const expense = {
    name: "Compra mercado",
    description: "Compra de mercado da semana",
    total: 543.12,
  };

  const result = await fetch(
    `${process.env.BASE_API_URL}/expense/${bankStatementId}`,
    {
      method: "POST",
      body: JSON.stringify(expense),
    },
  );

  await fetch(`${process.env.BASE_API_URL}/bankStatement`, {
    method: "POST",
    body: JSON.stringify({
      yearId: 2025,
      monthId: 2,
    }),
  });

  const response = await fetch(`${process.env.BASE_API_URL}/bankStatement`);
  const responseBody = await response.json();

  console.log(responseBody);
});
