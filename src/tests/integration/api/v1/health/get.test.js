test("Retrieving current database information", async () => {
  const response = await fetch("http://localhost:3000/api/v1/health");
  const responseBody = await response.json();
  const databaseInfo = responseBody.dependencies.database;
  const currentDate = new Date(responseBody.updated_at).toISOString();

  expect(response.status).toBe(200);
  expect(responseBody.updated_at).toBe(currentDate);
  expect(databaseInfo.version).toBe("16.0");
  expect(databaseInfo.max_connections).toBe("100");
  expect(databaseInfo.opened_connections).toBe(1);
});

test("route GET /api/v1/nonexistent should return 404 not found", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/nonexistent`);
  const responseBody = await response.json();

  expect(response.status).toBe(404);
  expect(responseBody.name).toBe("not found");
  expect(responseBody.message).toBe("route /api/v1/nonexistent does not exist");
});
