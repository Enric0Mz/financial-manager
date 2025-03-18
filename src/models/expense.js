import { NotFoundError } from "errors/http";
import prisma from "infra/database.js";
import bankBankStatment from "./bankBankStatement";

async function findUnique(id) {
  const result = await prisma.expense.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    return new NotFoundError(id);
  }
  return result;
}

async function findMany(bankStatementId) {
  return await prisma.expense.findMany({
    where: {
      AND: [
        {
          bankStatementId,
        },
        {
          bankBankStatementId: null,
        },
      ],
    },
  });
}

async function update(payload, id) {
  const existingExpense = await findUnique(id);
  return await prisma.expense.update({
    where: {
      id,
    },
    data: {
      ...existingExpense,
      ...payload,
    },
  });
}

async function getTotalAmount(bankStatementId, bankBankStatementId) {
  if (!bankBankStatementId) {
    return await debitTotalExpenses(bankStatementId);
  }
  return await creditTotalExpenses(bankStatementId, bankBankStatementId);

  async function debitTotalExpenses(bankStatementId) {
    const totalExpenses = await prisma.expense.aggregate({
      where: {
        bankStatementId: bankStatementId,
        NOT: {
          bankBankStatementId,
        },
      },
      _sum: { total: true },
    });

    return totalExpenses._sum.total || 0;
  }
  async function creditTotalExpenses(bankStatementId, bankBankStatementId) {
    const totalExpenses = await prisma.expense.aggregate({
      where: { AND: [{ bankStatementId }, { bankBankStatementId }] },
      _sum: { total: true },
    });

    return totalExpenses._sum.total || 0;
  }
}

async function remove(id) {
  try {
    await prisma.expense.delete({
      where: {
        id,
      },
    });
  } catch {
    throw new NotFoundError(id).toJSON();
  }
}

const expense = {
  findUnique,
  findMany,
  update,
  getTotalAmount,
  remove,
};

export default expense;
