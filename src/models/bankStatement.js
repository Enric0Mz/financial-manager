import prisma from "infra/database.js";
import Month from "./enum/month";
import { httpSuccessCreated, httpSuccessDeleted } from "helpers/httpSuccess";
import { NotFoundError, UnprocessableEntityError } from "errors/http";
import { validateAndParseAmount } from "helpers/validators";
import bankBankStatement from "./bankBankStatement";
import month from "pages/api/v1/month";

async function findFirst() {
  return await prisma.bankStatement.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function findUnique(month, year, userId) {
  const monthId = Month[month];
  const result = await prisma.bankStatement.findFirst({
    // Always will find unique here
    where: {
      AND: [
        {
          yearMonth: {
            is: {
              monthId: monthId,
              yearId: parseInt(year),
            },
          },
        },
        { userId },
      ],
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

async function validateIfExists(month, year) {
  const monthId = Month[month];
  return await prisma.bankStatement.findFirst({
    where: {
      yearMonth: {
        is: {
          monthId: monthId,
          yearId: parseInt(year),
        },
      },
    },
  });
}

async function findById(id) {
  const result = await prisma.bankStatement.findUnique({
    where: { id },
  });
  if (!result) {
    throw new NotFoundError(id);
  }
  return result;
}

async function findMany(yearNumber, userId) {
  return await prisma.bankStatement.findMany({
    where: {
      AND: [
        {
          yearMonth: {
            is: {
              yearId: parseInt(yearNumber),
            },
          },
        },
        { userId },
      ],
    },
    select: {
      balanceInitial: true,
      yearMonth: {
        select: {
          year: {
            select: {
              yearNumber: true,
            },
          },
          month: {
            select: {
              month: true,
            },
          },
        },
      },
    },
  });
}

async function create(salary, yearMonthId, lastStatement, banks, userId) {
  let lastMonthBalance;
  if (lastStatement) {
    lastMonthBalance = lastStatement.balanceReal;
  }

  const balance = lastMonthBalance
    ? salary.amount + lastMonthBalance
    : salary.amount;

  const result = await prisma.bankStatement.create({
    data: {
      userId,
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

  await searchForMissingFields(expense, isDebit);

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

  async function searchForMissingFields(fields, isDebit) {
    const missingFields = [];

    if (!fields.name) missingFields.push("name");
    if (!fields.total) missingFields.push("total");
    if (!isDebit) {
      if (!fields.bankBankStatementId)
        missingFields.push("bankBankStatementId");
      else {
        await bankBankStatement.findUnique(bankBankStatementId);
      }
    }

    if (missingFields.length > 0) {
      throw new UnprocessableEntityError(
        "Missing required fields",
        missingFields,
      );
    }
  }
}

async function remove(id) {
  await findById(id);

  await prisma.bankStatement.delete({
    where: { id },
  });

  return new httpSuccessDeleted(id);
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
  remove,
  validateIfExists,
};

export default bankStatement;
