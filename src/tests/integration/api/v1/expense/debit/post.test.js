import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let bankStatementData;
let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  await setup.createCalendar();

  const year = 2025;
  const january = "January";
  const february = "February"
  const salaryAmount = 4500;

  const result = await setup.generateTestTokens();
  const userId = result.user.data.id;
  generateTokens = result.tokens;

  await setup.createSalary(salaryAmount, userId);
  const bankStatement = (
    await setup.createBankStatement(january, year, userId)
  ).toJson();
  await setup.createBankStatement(february, year, userId)
  bankStatementData = bankStatement.data;
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
        `${process.env.BASE_API_URL}/expense/debit/${bankStatementData.id}`,
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
        `${process.env.BASE_API_URL}/expense/debit/${bankStatementData.id}`,
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

    test("Creation of expense should reflect in all bank statements", async () => {
      const yearMonth = {
        month: "February",
        year: 2025
      }
      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${yearMonth.year}?` +
        new URLSearchParams({ month: yearMonth.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );
      const responseBody = await response.json();
      const updatedBalanceIntital = (responseBody.salary.amount * 2) - expense1.total - expense2.total

      expect(response.status).toBe(200);
      expect(responseBody.balanceInitial).toBe(updatedBalanceIntital)
    });
  });
});
