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
        password: "Senha@123",
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

      expect(response.status).toBe(201);
      expect(responseBody.name).toEqual("created");
      expect(responseBody.message).toBe(`User ${userBody.username} created`);
      expect(responseBody.data.username).toBe(userBody.username);
      expect(responseBody.data.email).toBe(userBody.email);
    });

    test("Creating user with only one letter", async () => {
      const userBody = {
        username: "Enrico",
        password: "a",
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

      expect(response.status).toBe(422);
      expect(responseBody.message).toBe(
        "Password must be at least 6 characters long",
      );
    });

    test("Creating user with only lower case", async () => {
      const userBody = {
        username: "Enrico",
        password: "abcdefg",
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

      expect(response.status).toBe(422);
      expect(responseBody.message).toBe(
        "Password must contain at least one uppercase letter",
      );
    });
    test("Creating user with only upper case letters", async () => {
      const userBody = {
        username: "Enrico",
        password: "ABCDEFGHJK",
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

      expect(response.status).toBe(422);
      expect(responseBody.message).toBe(
        "Password must contain at least one lowercase letter",
      );
    });

    test("Creating user without numbers", async () => {
      const userBody = {
        username: "Enrico",
        password: "Abcdefghij!",
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

      expect(response.status).toBe(422);
      expect(responseBody.message).toBe(
        "Password must contain at least one number",
      );
    });

    test("Creating user without special character", async () => {
      const userBody = {
        username: "Enrico",
        password: "Abcdefghij1",
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

      expect(response.status).toBe(422);
      expect(responseBody.message).toBe(
        "Password must contain at least one special character",
      );
    });

    test("Creating user with duplicate 'email'", async () => {
      const userBody = {
        username: "Enrico",
        password: "Senha@123",
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

      expect(response.status).toBe(409);
      expect(responseBody.message).toBe(
        `Value ${userBody.email} already exists on table. Insert other value`,
      );
    });
  });
});
