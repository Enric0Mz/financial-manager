import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase({
    createSalary: {
      create: false,
    },
  });
});

test("route DELETE api/v1/year/2025 should return status 200 deleted", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/year/2025`, {
    method: "DELETE",
  });
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(responseBody.name).toBe("deleted");
  expect(responseBody.message).toBe("value 2025 deleted successfuly");
});

test("route DELETE api/v1/year/9999 should return status 404 not found", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/year/9999`, {
    method: "DELETE",
  });
  const responseBody = await response.json();
  expect(response.status).toBe(404);
  expect(responseBody.name).toBe("not found");
  expect(responseBody.message).toBe(
    "Value 9999 does not exist on table. Try another value",
  );
});
