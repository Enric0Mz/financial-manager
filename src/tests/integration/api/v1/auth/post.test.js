import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

const mockUser = {
  username: "TestUser",
  email: "t@este.com",
  password: "Pass@123",
};

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await setup.createUser(mockUser);
});

describe("POST /api/v1/auth", () => {
  describe("Authenticated user", () => {
    test("Authenticate with correct email and password", async () => {
      delete mockUser["username"];
      const response = await fetch(`${process.env.BASE_API_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockUser),
      });

      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("authenticated");
      expect(responseBody.message).toBe("User authenticated successfuly");
    });
  });
});
