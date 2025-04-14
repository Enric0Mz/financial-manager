import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST api/v1/user", () => {
  describe("Anonymous user", () => {
    test("Creating user", async () => {
      const userBody = {
        username: "Enrico",
        password: "AAA@@@111",
        email: "enrico@email.com",
      };
      const response = await fetch(`${process.env.BASE_API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userBody),
      });
      const responseBody = await response.json();
      console.log(responseBody);

      expect(response.status).toBe(201);
      expect(responseBody.name).toEqual("created");
      expect(responseBody.message).toBe(`User ${userBody.username} created`);
      expect(responseBody.data.username).toBe(userBody.username);
      expect(responseBody.data.email).toBe(userBody.email);
    });
  });
});
