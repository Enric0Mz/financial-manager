import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "errors/http";
import { httpSuccessCreated, httpSuccessDeleted } from "helpers/httpSuccess";
import { validateAndParseAmount } from "helpers/validators";
import prisma from "infra/database.js";
import bank from "./bank";
import bankBankStatement from "./bankBankStatement";
import Month from "./enum/month";
import salary from "./salary";
import yearMonth from "./yearMonth";

async function findFirst(userId) {
  return await prisma.bankStatement.findFirst({
    where: { userId },
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

async function validateIfExists(yearMonthId, userId) {
  const result = await prisma.bankStatement.findFirst({
    where: {
      AND: [{ yearMonthId }, { userId }],
    },
    include: {
      yearMonth: {
        include: {
          month: true,
        },
      },
    },
  });
  if (result) {
    throw new ConflictError(
      "bankStatement already found",
      `BankStatement with [${result.yearMonth.month.month}, ${result.yearMonth.yearId}]`,
    );
  }
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
      id: true,
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

async function create(month, year, userId) {
  const { id: yearMonthId } = await yearMonth.findFirst(month, year);
  await validateIfExists(yearMonthId, userId);

  const { id: salaryId, amount } = await salary.findFirst(userId);

  const lastStatement = await findFirst(userId);

  const balance = calcBalance(lastStatement, amount);

  const banks = await bank.findMany(userId);

  const result = await prisma.bankStatement.create({
    data: {
      userId,
      salaryId,
      yearMonthId,
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
  return new httpSuccessCreated("Bank statement created", result);

  function calcBalance(lastStatement, salaryAmount) {
    let lastMonthBalance;

    if (lastStatement) {
      lastMonthBalance = lastStatement.balanceReal;
    }

    return lastMonthBalance ? salaryAmount + lastMonthBalance : salaryAmount;
  }
}

async function incrementBalance(amount, id) {
  return await prisma.bankStatement.update({
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

async function reprocessBalances(id, userId) {
  const currentStatement = await findById(id);
  const nextStatements = await findNextStatements(currentStatement, userId);
  const { amount: salaryAmount } = await salary.findFirst(userId);
  if (nextStatements.length === 1) {
    return;
  }
  await reprocess(nextStatements, salaryAmount);

  async function findNextStatements(currentStatement, userId) {
    return await prisma.bankStatement.findMany({
      where: {
        userId,
        createdAt: {
          gte: currentStatement.createdAt,
        },
      },
      orderBy: { createdAt: "asc" },
      include: {
        expenses: true,
      },
    });
  }

  async function reprocess(bankStatements, salary) {
    for (let i = 0; i < bankStatements.length - 1; i++) {
      const current = bankStatements[i];
      const updatedCurrent = await findById(current.id);
      const next = bankStatements[i + 1];
      const result = await calculateAndUpdateBalanceInitial(
        next.id,
        updatedCurrent.balanceReal,
        salary,
      );
      await calculateAndUpdateBalanceRealAndTotal(result);
    }
  }

  async function calculateAndUpdateBalanceInitial(
    statementId,
    previousBalance,
    salary,
  ) {
    const updatedBalance = previousBalance + salary;
    return await updateBalanceInitial(statementId, updatedBalance);
  }

  async function updateBalanceInitial(id, amount) {
    const result = await prisma.bankStatement.update({
      where: { id },
      data: {
        balanceInitial: amount,
      },
      include: {
        expenses: true,
      },
    });
    return result;
  }

  async function calculateAndUpdateBalanceRealAndTotal(statement) {
    const totalExpenses = statement.expenses.reduce(
      (sum, expense) => sum + expense.total,
      0,
    );
    const updatedBalance = statement.balanceInitial - totalExpenses;
    await prisma.bankStatement.update({
      where: { id: statement.id },
      data: {
        balanceTotal: updatedBalance,
        balanceReal: updatedBalance,
      },
    });
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
  remove,
  validateIfExists,
  reprocessBalances,
};

export default bankStatement;
