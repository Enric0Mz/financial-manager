import prisma from "infra/database.js";
import Month from "./enum/month";
import { httpSuccessCreated } from "helpers/httpSuccess";
import { NotFoundError, UnprocessableEntityError } from "errors/http";
import { validateAndParseAmount } from "helpers/validators";

async function findFirst() {
  return await prisma.bankStatement.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function findUnique(month, year) {
  const monthId = Month[month];
  const result = await prisma.bankStatement.findFirst({
    // Always will find unique here
    where: {
      yearMonth: {
        is: {
          monthId: monthId,
          yearId: parseInt(year),
        },
      },
    },
    include: {
      salary: true,
      expenses: true,
      banks: {
        include: {
          bank: true,
        },
      },
    },
  });
  if (!result) {
    throw new NotFoundError(`[${month}, ${year}]`);
  }
  return result;
}

async function findById(id) {
  return await prisma.bankStatement.findUnique({
    where: { id },
  });
}

async function findMany(yearNumber) {
  return await prisma.bankStatement.findMany({
    where: {
      yearMonth: {
        is: {
          yearId: parseInt(yearNumber),
        },
      },
    },
    include: {
      salary: true,
      expenses: true,
      banks: {
        include: {
          bank: true,
        },
      },
    },
  });
}

async function create(salary, yearMonthId, lastStatement, banks) {
  let lastMonthBalance;
  if (lastStatement) {
    lastMonthBalance = lastStatement.balanceReal;
  }

  const balance = lastMonthBalance
    ? salary.amount + lastMonthBalance
    : salary.amount;

  const result = await prisma.bankStatement.create({
    data: {
      salaryId: salary.id,
      yearMonthId: yearMonthId,
      balanceInitial: balance,
      balanceTotal: balance,
      balanceReal: balance,
      banks: banks
        ? {
            create: banks.map((bank) => ({
              bank: {
                connect: {
                  id: bank.id,
                },
              },
            })),
          }
        : undefined,
    },
    include: {
      banks: true,
    },
  });

  return new httpSuccessCreated("Bank statement created", result).toJson();
}

async function incrementBalance(amount, id) {
  await prisma.bankStatement.update({
    where: { id },
    data: {
      balanceTotal: { increment: amount },
      balanceReal: { increment: amount },
    },
  });
}

async function decrementBalance(amount, id) {
  await prisma.bankStatement.update({
    where: { id },
    data: {
      balanceTotal: { decrement: amount },
      balanceReal: { decrement: amount },
    },
  });
}

async function decrementBalanceReal(amount, id) {
  await prisma.bankStatement.update({
    where: { id },
    data: {
      balanceReal: { decrement: amount },
    },
  });
}

async function incrementDebitBalance(amount, id) {
  await prisma.bankStatement.update({
    where: { id },
    data: {
      debitBalance: { increment: amount },
    },
  });
}

async function updateDebitBalance(amount, id) {
  await prisma.bankStatement.update({
    where: { id },
    data: {
      debitBalance: amount,
    },
  });
}

async function updateBalance(amount, id) {
  const result = await findById(id);
  const updatedValue = result.balanceInitial - amount;
  await prisma.bankStatement.update({
    where: { id },
    data: {
      balanceTotal: updatedValue,
      balanceReal: updatedValue,
    },
  });
}

async function updateBalanceForExtraIncome(amount, id) {
  await prisma.bankStatement.update({
    where: { id },
    data: {
      balanceTotal: amount,
      balanceReal: amount,
    },
  });
}

async function updateBalanceReal(amount, id) {
  const result = await findById(id);
  const updatedValue = result.balanceInitial - amount;
  await prisma.bankStatement.update({
    where: { id },
    data: {
      balanceReal: updatedValue,
    },
  });
}

async function updateWithExpense(expense, id, isDebit) {
  const { name, description, total, bankBankStatementId } = expense;

  searchForMissingFields(expense, isDebit);

  const fixedAmount = validateAndParseAmount(total);

  const result = await prisma.bankStatement.update({
    where: {
      id,
    },
    data: {
      expenses: {
        create: {
          name,
          description,
          total: fixedAmount,
          bankBankStatementId,
        },
      },
    },
    include: {
      expenses: true,
    },
  });
  const lastExpense = result.expenses[result.expenses.length - 1];

  return new httpSuccessCreated(
    `expense ${lastExpense.name} created`,
    lastExpense,
  );

  function searchForMissingFields(fields, isDebit) {
    const missingFields = [];

    if (!fields.name) missingFields.push("name");
    if (!fields.total) missingFields.push("total");
    if (!isDebit) {
      if (!fields.bankBankStatementId)
        missingFields.push("bankBankStatementId");
    }

    if (missingFields.length > 0) {
      throw new UnprocessableEntityError(
        "Missing required fields",
        missingFields,
      );
    }
  }
}

const bankStatement = {
  create,
  findFirst,
  findUnique,
  findMany,
  incrementBalance,
  decrementBalanceReal,
  decrementBalance,
  updateWithExpense,
  incrementDebitBalance,
  updateBalance,
  updateBalanceForExtraIncome,
  updateBalanceReal,
  updateDebitBalance,
};

export default bankStatement;
