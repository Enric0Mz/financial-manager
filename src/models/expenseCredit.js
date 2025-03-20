import { NotFoundError } from "errors/http";
import prisma from "infra/database.js";
import bankStatement from "./bankStatement";
import bankBankStatement from "./bankBankStatement";
import { httpSuccessUpdated, httpSuccessDeleted } from "helpers/httpSuccess";

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
  const result = await prisma.expense.update({
    where: {
      id,
    },
    data: {
      ...existingExpense,
      ...payload,
    },
  });
  if (payload.total) {
    const expensesAmount = await creditTotalExpenses(
      existingExpense.bankStatementId,
      existingExpense.bankBankStatementId,
    );
    await bankStatement.updateBalanceReal(
      expensesAmount,
      existingExpense.bankStatementId,
    );
    await bankBankStatement.updateBalance(
      expensesAmount,
      existingExpense.bankBankStatementId,
    );
  }
  return new httpSuccessUpdated(result);
}

async function creditTotalExpenses(bankStatementId, bankBankStatementId) {
  const totalExpenses = await prisma.expense.aggregate({
    where: { AND: [{ bankStatementId }, { bankBankStatementId }] },
    _sum: { total: true },
  });

  return totalExpenses._sum.total || 0;
}

async function remove(id) {
  const existingExpense = await findUnique(id);
  await prisma.expense.delete({
    where: { id },
  });
  const expensesAmount = await creditTotalExpenses(
    existingExpense.bankStatementId,
    existingExpense.bankBankStatementId,
  );
  await bankStatement.updateBalanceReal(
    expensesAmount,
    existingExpense.bankStatementId,
  );
  await bankBankStatement.updateBalance(
    expensesAmount,
    existingExpense.bankBankStatementId,
  );
  return new httpSuccessDeleted(`with id ${id}`);
}
const expense = {
  findUnique,
  update,
  getTotalAmount: creditTotalExpenses,
  remove,
};

export default expense;
