test("Retrieving current database information", async () => {
  const response = await fetch("http://localhost:3000/api/v1/health");
  const responseBody = await response.json();
  const databaseInfo = responseBody.dependencies.database;
  const currentDate = new Date(responseBody.updated_at).toISOString();

  expect(response.status).toBe(200);
  expect(responseBody.updated_at).toBe(currentDate);
  expect(databaseInfo.version).toBe("17.2");
  expect(databaseInfo.max_connections).toBe("100");
  expect(databaseInfo.opened_connections).toBe(1);
});
