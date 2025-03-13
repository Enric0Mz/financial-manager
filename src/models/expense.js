import prisma from "infra/database.js";

async function findUnique(id) {
  return await prisma.expense.findUnique({
    where: {
      id,
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

const expense = {
  findUnique,
  getTotalAmount,
};

export default expense;
