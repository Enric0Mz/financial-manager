import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase({
    createMonths: ["january", "february"],
    createBankStatements: [{ yearId: 2025, monthId: 1 }],
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
  const bankStatementId = getResponseBody.id;
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
