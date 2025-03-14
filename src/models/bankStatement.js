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

async function findMany() {
  return await prisma.bankStatement.findMany({
    include: {
      salary: true,
      expenses: true,
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
      balanceReal: { decrement: amount },
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
  return new httpSuccessCreated(
    `expense ${result.expenses[0].name} created`,
    result.expenses[0],
  );
}

const bankStatement = {
  create,
  findFirst,
  findUnique,
  findMany,
  incrementBalance,
  decrementBalance,
  updateWithExpense,
};

export default bankStatement;
