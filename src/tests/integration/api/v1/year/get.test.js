import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase({
    createSalary: {
      create: false,
    },
    createYear: {
      create: false,
    },
  });
});

test("route GET /api/v1/year/{yearNumber} should return 200 ok", async () => {
  await fetch(`${process.env.BASE_API_URL}/year/1996`, {
    method: "POST",
  });
  const response = await fetch(`${process.env.BASE_API_URL}/year/1996`);
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(responseBody.data).toMatchObject({ yearNumber: 1996 });
});

test("route GET /api/v1/year/{yearNumber} should return 404 if yearNumber do not exist", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/year/9999`);
  const responseBody = await response.json();

  expect(response.status).toBe(404);
  expect(responseBody.name).toBe("not found");
});

test("route GET /api/v1/year should return a list of years", async () => {
  await fetch(`${process.env.BASE_API_URL}/year/1997`, {
    method: "POST",
  });
  const response = await fetch(`${process.env.BASE_API_URL}/year`);
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(Array.isArray(responseBody.data)).toBe(true);
});

test("route DELETE /api/v1/year should return 405 invalid method", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/year`, {
    method: "DELETE",
  });
  const responseBody = await response.json();

  expect(response.status).toBe(405);
  expect(responseBody.name).toBe("invalid method");
});
