import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase({
    createMonths: ["january"],
  });
});

test("route DELETE api/v1/month/2025 with body january should return 200 deleted", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/month/2025`, {
    method: "DELETE",
    body: "january",
  });

  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(responseBody.name).toBe("deleted");
  expect(responseBody.message).toBe("value january deleted sucessfuly");
});

test("route DELETE api/v1/month/2025 with body december or invalid year should return 404 not found", async () => {
  const responseWithInvalidYear = await fetch(
    `${process.env.BASE_API_URL}/month/9999`,
    {
      method: "DELETE",
      body: "january",
    },
  );
  const responseBodyWithInvalidYear = await responseWithInvalidYear.json();

  const responseWithInvalidMonth = await fetch(
    `${process.env.BASE_API_URL}/month/2025`,
    {
      method: "DELETE",
      body: "december",
    },
  );
  const responseBodyWithInvalidMonth = await responseWithInvalidMonth.json();

  expect(responseWithInvalidMonth.status).toBe(404);
  expect(responseWithInvalidYear.status).toBe(404);
  expect(responseBodyWithInvalidMonth.name).toBe("not found");
  expect(responseBodyWithInvalidYear.name).toBe("not found");
  expect(responseBodyWithInvalidMonth.message).toBe(
    "Value december does not exist on table. Try another value",
  );
});
