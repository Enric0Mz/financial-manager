import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let bankStatement1Data;
let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  await setup.createCalendar();

  const year = 2025;
  const january = "January";
  const salaryAmount = 4500;

  const result = await setup.generateTestTokens();
  const userId = result.user.data.id;
  generateTokens = result.tokens;

  await setup.createSalary(salaryAmount, userId);
  const bankStatement1 = (
    await setup.createBankStatement(january, year, userId)
  ).toJson();
  bankStatement1Data = bankStatement1.data;
});

const expense1 = {
  name: "Pix curso",
  description: "Pix para curso de matemática",
  total: 150.99,
};

const expense2 = {
  name: "Gasto mercado",
  description: "gasto com mercado dia 15",
  total: 436.09,
};

describe("POST /api/v1/expense/debit", () => {
  describe("Authenticated user", () => {
    test("Creating debit expense", async () => {
      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/debit/${bankStatement1Data.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
          body: JSON.stringify(expense1),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
      expect(responseBody.message).toBe(`expense ${expense1.name} created`);
      expect(responseBody.data.name).toBe(expense1.name);
      expect(responseBody.data.description).toBe(expense1.description);
      expect(responseBody.data.total).toBe(expense1.total);
    });

    test("Creating debit expense for the second time", async () => {
      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/debit/${bankStatement1Data.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
          body: JSON.stringify(expense2),
        },
      );
      const responseBody = await response.json();
      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
      expect(responseBody.message).toBe(`expense ${expense2.name} created`);
      expect(responseBody.data.name).toBe(expense2.name);
      expect(responseBody.data.description).toBe(expense2.description);
      expect(responseBody.data.total).toBe(expense2.total);
    });
  });
});
