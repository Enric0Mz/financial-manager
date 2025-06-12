import orchestrator from "tests/orchestrator";
import setup from "tests/setupDatabase";

let bankStatement1Data;
let bankStatement2Data;
let generateTokens;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  await setup.createCalendar();

  const january = "January";
  const february = "February";
  const salaryAmount = 4500;
  const bankName = "Itau";
  const result = await setup.generateTestTokens();
  const userId = result.user.data.id;
  generateTokens = result.tokens;

  await setup.createSalary(salaryAmount, userId);

  await setup.createBank(bankName, userId);

  const bankStatement1 = (
    await setup.createBankStatement(january, year, userId)
  ).toJson();
  bankStatement1Data = bankStatement1.data;

  const bankStatement2 = (
    await setup.createBankStatement(february, year, userId)
  ).toJson();
  bankStatement2Data = bankStatement2.data;

  const expense3 = {
    name: "expense teste",
    description: "description teste",
    total: 200,
    bankBankStatementId: bankStatement2Data.banks[0].id,
  };

  await setup.createCreditExpense(expense3, bankStatement2Data.id, userId);
});

const year = 2025;

const expense1 = { total: 543.12 };

const expense2 = { total: 350 };

describe("POST /api/v1/expense/credit", () => {
  describe("Authenticated user", () => {
    test("Creating credit expense", async () => {
      Object.assign(expense1, {
        name: "Compra mercado",
        description: "Compra de mercado da semana",
        bankBankStatementId: bankStatement1Data.banks[0].id,
      });
      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${bankStatement1Data.id}`,
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

    test("Creating credit expense for the second time", async () => {
      Object.assign(expense2, {
        name: "Jogo ps5",
        description: "Compra jogo gta 6",
        bankBankStatementId: bankStatement1Data.banks[0].id,
      });
      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${bankStatement1Data.id}`,
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

      const bankStatementResponse = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${year}?` +
          new URLSearchParams({ month: "January" }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
        },
      );

      const bankStatementResponseBody = await bankStatementResponse.json();
      const validateBalanceReal =
        bankStatementResponseBody.balanceInitial -
        (expense1.total + expense2.total);

      expect(bankStatementResponseBody.balanceReal).toBe(validateBalanceReal);
      expect(bankStatementResponseBody.banks[0].balance).toBe(
        expense1.total + expense2.total,
      );
    });

    test("Creating expense without required fields", async () => {
      const expense = {
        name: "Gasto sem campos",
      };

      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${bankStatement1Data.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
          body: JSON.stringify(expense),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(422);
      expect(responseBody.name).toBe("unprocessable entity");
      expect(responseBody.message).toBe(
        "fields [total,bankBankStatementId] not found or found in incorrect format",
      );
    });

    test("Creating credit expense with unexistent bank bank statement id", async () => {
      const expense = {
        name: "Compra mercado",
        description: "Compra de mercado da semana",
        amount: 10.43,
        bankBankStatementId: 333,
      };
      const response = await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${bankStatement1Data.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens.data.accessToken}`,
          },
          body: JSON.stringify(expense),
        },
      );
      const responseBody = await response.json();

      expect(response.status).toBe(404);
      expect(responseBody.name).toBe("not found");
      expect(responseBody.message).toBe(
        `Value ${expense.bankBankStatementId} does not exist on table. Try another value`,
      );
    });

    test("Creation of credit expenses should reflect in all bankStatements", async () => {
      const yearMonth = {
        year: 2025,
        month: "February",
      };
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

      const correctedBalanceTotalAmount =
        responseBody.salary.amount * 2 - expense1.total - expense2.total;

      const correctBalanceRealAmount = correctedBalanceTotalAmount - 200;

      expect(response.status).toBe(200);
      expect(responseBody.balanceTotal).toBe(
        parseFloat(correctedBalanceTotalAmount.toFixed(2)),
      );
      expect(responseBody.balanceReal).toBe(
        parseFloat(correctBalanceRealAmount.toFixed(2)),
      );
    });
  });
});
