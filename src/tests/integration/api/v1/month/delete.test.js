import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await fetch("http://localhost:3000/api/v1/year/2025", {
    method: "POST",
  });
  await fetch("http://localhost:3000/api/v1/month", {
    method: "POST",
  });
  await fetch("http://localhost:3000/api/v1/month/2025", {
    method: "POST",
    body: "january",
  });
});

test("route DELETE api/v1/month/2025 with body january should return 200 deleted", async () => {
  const response = await fetch("http://localhost:3000/api/v1/month/2025", {
    method: "DELETE",
    body: "january",
  });

  const responseBody = await response.json();

  const responseWithInvalidYear = await fetch(
    "http://localhost:3000/api/v1/month/9999",
    {
      method: "DELETE",
      body: "january",
    },
  );
  const responseBodyWithInvalidYear = await responseWithInvalidYear.json();

  const responseWithInvalidMonth = await fetch(
    "http://localhost:3000/api/v1/month/2025",
    {
      method: "DELETE",
      body: "december",
    },
  );

  const responseBodyWithInvalidMonth = await responseWithInvalidMonth.json();

  expect(response.status).toBe(200);
  expect(responseBody.name).toBe("deleted");
  expect(responseBody.message).toBe("value january deleted sucessfuly");
  expect(responseWithInvalidMonth.status).toBe(404);
  expect(responseWithInvalidYear.status).toBe(404);
  expect(responseBodyWithInvalidMonth.name).toBe("not found");
  expect(responseBodyWithInvalidYear.name).toBe("not found");
  expect(responseBodyWithInvalidMonth.message).toBe(
    "Value december does not exist on table. Try another value",
  );
});
