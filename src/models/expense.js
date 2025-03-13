import prisma from "infra/database.js";

async function getTotalAmount(bankStatementId) {
  const totalExpenses = await prisma.expense.aggregate({
    where: { bankStatementId: bankStatementId },
    _sum: { total: true },
  });
  return totalExpenses._sum.total || 0;
}

const expense = {
  getTotalAmount,
};

export default expense;
