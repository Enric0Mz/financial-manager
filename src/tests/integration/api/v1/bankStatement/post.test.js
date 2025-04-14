import setup from "tests/setupDatabase";
import orchestrator from "tests/orchestrator";

const salary = 4500;
const bank = "nuBank";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();

  const year = 2025;
  const january = "January";
  const february = "February";
  const march = "March";
  const april = "April";
  await setup.createAllMonths();
  await setup.createYear(year);
  await setup.createMonthInYear(january, year);
  await setup.createMonthInYear(february, year);
  await setup.createMonthInYear(march, year);
  await setup.createMonthInYear(april, year);
  await setup.createSalary(salary);
  await setup.createBank(bank);
});

describe("POST /api/v1/bankStatement", () => {
  describe("Anonymous user", () => {
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
        },
        body: JSON.stringify(february),
      });

      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${february.year}?` +
          new URLSearchParams({ month: february.month }),
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
        },
        body: JSON.stringify(march),
      });

      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${march.year}?` +
          new URLSearchParams({ month: march.month }),
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
          },
          body: JSON.stringify(expense2),
        },
      );
      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${march.year}?` +
          new URLSearchParams({ month: march.month }),
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
          },
          body: JSON.stringify(expense),
        },
      );

      const response = await fetch(
        `${process.env.BASE_API_URL}/bank-statement/${march.year}?` +
          new URLSearchParams({ month: march.month }),
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
  });
});
