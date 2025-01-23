import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await fetch("http://localhost:3000/api/v1/year/2025", {
    method: "POST",
  });
});

test("route DELETE api/v1/year/2025 should return status 200 deleted", async () => {
  const response = await fetch("http://localhost:3000/api/v1/year/2025", {
    method: "DELETE",
  });
  const responseBody = await response.json();

  const responseWithExpectedError = await fetch(
    "http://localhost:3000/api/v1/year/9999",
    {
      method: "DELETE",
    },
  );
  const responseBodyWithExpectedError = await responseWithExpectedError.json();

  expect(response.status).toBe(200);
  expect(responseBody.name).toBe("deleted");
  expect(responseBody.message).toBe("value 2025 deleted successfuly");
  expect(responseWithExpectedError.status).toBe(404);
  expect(responseBodyWithExpectedError.name).toBe("not found");
  expect(responseBodyWithExpectedError.message).toBe(
    "Value 9999 does not exist on table. Try another value",
  );
});
