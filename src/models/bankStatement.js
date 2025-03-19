import prisma from "infra/database.js";
import Month from "./enum/month";
import { httpSuccessCreated } from "helpers/httpSuccess";

async function findFirst() {
  return await prisma.bankStatement.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function findUnique(month, year) {
  const monthId = Month[month];
  return await prisma.bankStatement.findFirst({
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
}

async function findById(id) {
  return await prisma.bankStatement.findUnique({
    where: { id },
  });
}

async function findMany() {
  return await prisma.bankStatement.findMany({
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

  return result;
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

async function updateWithExpense(expense, id) {
  const { name, description, total, bankBankStatementId } = expense;
  const result = await prisma.bankStatement.update({
    where: {
      id,
    },
    data: {
      expenses: {
        create: {
          name,
          description,
          total,
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
  updateDebitBalance,
};

export default bankStatement;
