import { NotFoundError } from "errors/http";
import prisma from "infra/database.js";

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

async function getTotalAmount(bankStatementId) {
  const totalExpenses = await prisma.expense.aggregate({
    where: { bankStatementId: bankStatementId },
    _sum: { total: true },
  });
  return totalExpenses._sum.total || 0;
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
  update,
  getTotalAmount,
  remove,
};

export default expense;
