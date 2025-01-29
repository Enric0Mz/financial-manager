import setupDatabase from "tests/setupTests";

beforeAll(async () => {
  await setupDatabase({
    createMonths: ["january"],
  });
});

test("route GET api/v1/month/2025 should return 200 with a object with a list of months", async () => {
  const response = await fetch(`${process.env.BASE_API_URL}/month/2025`);
  const responseBody = await response.json();

  expect(response.status).toBe(200);
  expect(Array.isArray(responseBody.data)).toBe(true);
  expect(responseBody.data[0].month).toBe("January");
  expect(responseBody.data[0].numeric).toBe(1);
});
