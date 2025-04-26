import setup from "tests/setupDatabase";
import orchestrator from "tests/orchestrator";

const salary = 4500;
const salary2 = 1500;
const bank = "nuBank";

let generateTokens1;
let generateTokens2;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  await setup.createCalendar();

  const tokensResult1 = await setup.generateTestTokens();
  const userId1 = tokensResult1.user.data.id;
  generateTokens1 = tokensResult1.tokens;
  const tokensResult2 = await setup.generateTestTokens({
    username: "user2",
    email: "user2@email.com",
    password: "Password@123",
  });
  const userId2 = tokensResult2.user.data.id;
  generateTokens2 = tokensResult2.tokens;

  await setup.createSalary(salary, userId1);
  await setup.createBank(bank, userId1);
  await setup.createSalary(salary2, userId2);
  await setup.createBank(bank, userId2);
});

describe("POST /api/v1/bankStatement", () => {
  describe("Authenticated user", () => {
    test("Creating bank statement without any previous bankStatements", async () => {
      const yearMonth = {
        year: 2025,
        month: "January",
      };
      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens1.data.accessToken}`,
          },
          body: JSON.stringify(yearMonth),
        },
      );

      const responseBody = await response.json();
      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
      expect(responseBody.message).toBe(`Bank statement created`);
    });

    test("Creating bankStatement with previous bankStatement", async () => {
      const february = {
        year: 2025,
        month: "February",
      };
      await fetch(`${process.env.BASE_API_URL}/bank-statement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens1.data.accessToken}`,
        },
        body: JSON.stringify(february),
      });

      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${february.year}?` +
          new URLSearchParams({ month: february.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens1.data.accessToken}`,
          },
        },
      );
      const responseBody = await response.json();
      expect(response.status).toBe(200);
      expect(responseBody.balanceInitial).toBe(salary * 2);
      expect(responseBody.banks[0].bank.name).toBe(bank);
    });

    test("Creating bankStatement with previous bankStatement that has one credit expense", async () => {
      const february = {
        year: 2025,
        month: "February",
      };
      const bankStatementResponse = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${february.year}?` +
          new URLSearchParams({ month: february.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens1.data.accessToken}`,
          },
        },
      );
      const bankStatementResponseBody = await bankStatementResponse.json();
      const bankStatementId = bankStatementResponseBody.id;

      const expense = {
        name: "Compra mercado",
        description: "Compra de mercado da semana",
        total: 543.12,
        bankBankStatementId: bankStatementResponseBody.banks[0].id,
      };

      await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${bankStatementId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens1.data.accessToken}`,
          },
          body: JSON.stringify(expense),
        },
      );

      const march = {
        year: 2025,
        month: "March",
      };

      await fetch(`${process.env.BASE_API_URL}/bank-statement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${generateTokens1.data.accessToken}`,
        },
        body: JSON.stringify(march),
      });

      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${march.year}?` +
          new URLSearchParams({ month: march.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens1.data.accessToken}`,
          },
        },
      );
      const responseBody = await response.json();

      const validateBalanceReal =
        bankStatementResponseBody.balanceReal +
        responseBody.salary.amount -
        expense.total;

      expect(response.status).toBe(200);
      expect(responseBody.balanceReal).toBe(validateBalanceReal);
    });
    test("Creating debit expenses in a bank statement", async () => {
      const march = {
        year: 2025,
        month: "March",
      };

      const bankStatementResponse = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${march.year}?` +
          new URLSearchParams({ month: march.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens1.data.accessToken}`,
          },
        },
      );
      const bankStatementResponseBody = await bankStatementResponse.json();

      const expense1 = {
        name: "Pix conta",
        description: "Pix conta de luz",
        total: 225.99,
      };
      const expense2 = {
        name: "Compra mercado",
        description: "Compra de mercado semana 2",
        total: 325.85,
      };

      await fetch(
        `${process.env.BASE_API_URL}/expense/debit/${bankStatementResponseBody.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens1.data.accessToken}`,
          },
          body: JSON.stringify(expense1),
        },
      );
      await fetch(
        `${process.env.BASE_API_URL}/expense/debit/${bankStatementResponseBody.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens1.data.accessToken}`,
          },
          body: JSON.stringify(expense2),
        },
      );
      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${march.year}?` +
          new URLSearchParams({ month: march.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens1.data.accessToken}`,
          },
        },
      );
      const responseBody = await response.json();
      const totalExpensesAmount = expense1.total + expense2.total;
      const exepectedBalanceReal =
        responseBody.balanceInitial - totalExpensesAmount;

      expect(response.status).toBe(200);
      expect(responseBody.debitBalance).toBe(totalExpensesAmount);
      expect(responseBody.balanceReal).toBe(
        parseFloat(exepectedBalanceReal.toFixed(2)),
      );
    });
    test("Including credit expense in previous bank statement to validate balance", async () => {
      const march = {
        year: 2025,
        month: "March",
      };

      const bankStatementResponse = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${march.year}?` +
          new URLSearchParams({ month: march.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens1.data.accessToken}`,
          },
        },
      );
      const bankStatementResponseBody = await bankStatementResponse.json();

      const expense = {
        name: "Cinema",
        description: "Filme da Disney novo",
        total: 125.56,
        bankBankStatementId: bankStatementResponseBody.banks[0].id,
      };
      await fetch(
        `${process.env.BASE_API_URL}/expense/credit/${bankStatementResponseBody.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens1.data.accessToken}`,
          },
          body: JSON.stringify(expense),
        },
      );

      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${march.year}?` +
          new URLSearchParams({ month: march.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens1.data.accessToken}`,
          },
        },
      );
      const responseBody = await response.json();
      const expectBalanceReal =
        bankStatementResponseBody.balanceReal - expense.total;

      expect(responseBody.balanceTotal).toBe(
        bankStatementResponseBody.balanceTotal,
      );
      expect(responseBody.balanceReal).toBe(
        parseFloat(expectBalanceReal.toFixed(2)),
      );

      const april = {
        year: 2025,
        month: "April",
      };

      const newBankStatementResponse = await fetch(
        `${process.env.BASE_API_URL}/bank-statement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens1.data.accessToken}`,
          },
          body: JSON.stringify(april),
        },
      );
      const newBankStatementResponseBody =
        await newBankStatementResponse.json();

      expect(newBankStatementResponseBody.data.balanceReal).toBe(
        responseBody.balanceReal + responseBody.salary.amount,
      );
    });

    test("Trying to create bank statement that already exists", async () => {
      const yearMonth = {
        year: 2025,
        month: "January",
      };
      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens1.data.accessToken}`,
          },
          body: JSON.stringify(yearMonth),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(409);
      expect(responseBody.name).toBe("conflict");
      expect(responseBody.message).toBe(
        `Value BankStatement with [${yearMonth.month}, ${yearMonth.year}] already exists on table. Insert other value`,
      );
    });

    test("Creating bank statement for new user", async () => {
      const yearMonth = {
        year: 2025,
        month: "January",
      };
      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens2.data.accessToken}`,
          },
          body: JSON.stringify(yearMonth),
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(201);
      expect(responseBody.name).toBe("created");
    });

    test("BankStatement for new user should be a empty statement", async () => {
      const yearMonth = {
        year: 2025,
        month: "January",
      };
      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${yearMonth.year}?` +
          new URLSearchParams({ month: yearMonth.month }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${generateTokens2.data.accessToken}`,
          },
        },
      );

      const responseBody = await response.json();

      expect(response.status).toBe(200);
      expect(responseBody.balanceInitial).toBe(salary2);
      expect(responseBody.debitBalance).toBe(0);
    });
  });
});
