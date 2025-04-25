import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  await setup.createCalendar();

  const result = await setup.generateTestTokens();
  const userId = result.user.data.id;
  generateTokens = result.tokens;

  const salaryAmount = 4500;

  const salary = await setup.createSalary(salaryAmount, userId);
  await setup.createBankStatement(salary, january, userId);
});

const january = { month: "January", year: 2025 };

describe("DELETE /api/v1/bankStatement/{id}", () => {
  describe("Authenticated user", () => {
    test("Deleting bankStatement", async () => {
      const bankStatement = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${january.year}?` +
          new URLSearchParams({ month: january.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );

      const bankStatementResponse = await bankStatement.json();
      const bankStatementId = bankStatementResponse.id;

      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${bankStatementId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("deleted");
      expect(responseBody.message).toBe(
        `value ${bankStatementId} deleted successfuly`,
      );
    });

    test("Deleting bankStatement after adding expense", async () => {
      await fetch(`${process.env.BASE_API_URL}/bank-statement/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens.data.accessToken}`,
        },
        body: JSON.stringify({
          year: january.year,
          month: january.month,
        }),
      });

      const bankStatement = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${january.year}?` +
          new URLSearchParams({ month: january.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );

      const bankStatementResponse = await bankStatement.json();
      const bankStatementId = bankStatementResponse.id;

      const expense = {
        name: "Gasto mercado",
        description: "gasto com mercado dia 15",
        total: 436.09,
      };

      await fetch(
        `${process.env.BASE_API_URL}/expense/debit/${bankStatementId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
          body: JSON.stringify(expense),
        },
      );

      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${bankStatementId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.name).toBe("deleted");
      expect(responseBody.message).toBe(
        `value ${bankStatementId} deleted successfuly`,
      );
    });
  });
});
