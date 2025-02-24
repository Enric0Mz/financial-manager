import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase({
    createMonths: ["january", "february"],
    createBankStatements: [
      { yearId: 2025, monthId: 1 },
      { yearId: 2025, monthId: 2 },
    ],
  });
});

test("route GET /api/v1/bankStatement/ should return a bank statement object for specified month and year", async () => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/bankStatement?` +
      new URLSearchParams({
        monthId: 1,
        yearId: 2025,
      }),
  );
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(typeof responseBody).toBe("object");
});

test("route GET /api/v1/bankStatement/ should return a list of bank statements if no query params is provided", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/bankStatement`);
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(Array.isArray(responseBody.data)).toBe(true);
});
