import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let generateToken;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  const result = await setup.generateTestTokens();
  generateToken = result.tokens;
});

describe("PUT api/v1/user", () => {
  describe("Authenticated user", () => {
    test("Updating username", async () => {
      const updatedUser = {
        username: "username (updated)",
      };
      const response = await fetch(`${process.env.BASE_API_URL}/user`, {
        method: "PUT",
        body: JSON.stringify(updatedUser),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateToken.data.accessToken}`,
        },
      });
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("updated");
      expect(responseBody.data.username).toBe("username (updated)");
      expect(responseBody.data.email).toBe("mock@email.com"); // from generateTestTokens method
    });

    test("Updating username with invalid data type", async () => {
      const updatedUser = {
        username: 12345,
      };

      const response = await fetch(`${process.env.BASE_API_URL}/user`, {
        method: "PUT",
        body: JSON.stringify(updatedUser),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateToken.data.accessToken}`,
        },
      });

      const responseBody = await response.json();

      expect(response.status).toBe(422);
      expect(responseBody.name).toBe("unprocessable entity");
    });
  });
});
