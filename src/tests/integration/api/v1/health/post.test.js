test("route POST /api/v1/health should return 405 method not allowed", async () => {
  const response = await fetch("http://localhost:3000/api/v1/health", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseBody = await response.json();

  expect(response.status).toBe(405);
  expect(responseBody.name).toBe("invalid method");
  expect(responseBody.message).toBe("Value POST not allowed on this route");
});
