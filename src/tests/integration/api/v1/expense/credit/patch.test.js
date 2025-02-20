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

test("route PATCH api/v1/expense/{expenseId} should return 200 updated", async () => {
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

  await fetch(`${process.env.BASE_API_URL}/expense/credit/${bankStatementId}`, {
    method: "POST",
    body: JSON.stringify(expense),
  });

  const getExpensesListResponse = await fetch(
    `${process.env.BASE_API_URL}/bankStatement?` +
      new URLSearchParams({
        monthId: 1,
        yearId: 2025,
      }),
  );
  const getExpensesListResponseBody = await getExpensesListResponse.json();
  const expenseId = getExpensesListResponseBody.expenses[0].id;

  const updatedExpenseData = {
    name: "Compra farmácia",
    description: "Remédios e itens de higiene",
    total: 200.5,
  };

  const response = await fetch(
    `${process.env.BASE_API_URL}/expense/credit/${expenseId}`,
    {
      method: "PATCH",
      body: JSON.stringify(updatedExpenseData),
    },
  );
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(responseBody.name).toBe("updated");
  expect(responseBody.message).toBe(
    `value updated to ${updatedExpenseData.name}`,
  );

  const getUpdatedExpenseResponse = await fetch(
    `${process.env.BASE_API_URL}/expense/credit/${expenseId}`,
  );
  const updatedExpense = await getUpdatedExpenseResponse.json();

  expect(getUpdatedExpenseResponse.status).toBe(200);
  expect(updatedExpense.name).toBe(updatedExpenseData.name);
  expect(updatedExpense.description).toBe(updatedExpenseData.description);
  expect(updatedExpense.total).toBe(updatedExpenseData.total);
});
