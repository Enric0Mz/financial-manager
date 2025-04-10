import prisma from "infra/database.js";
import bankStatement from "./bankStatement";
import { httpSuccessDeleted, httpSuccessUpdated } from "helpers/httpSuccess";
import { NotFoundError } from "errors/http";

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

async function findUnique(id) {
  const result = await prisma.expense.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new NotFoundError(id);
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
    const expensesAmount = await debitTotalExpenses(
      existingExpense.bankStatementId,
    );
    await bankStatement.updateBalance(
      expensesAmount,
      existingExpense.bankStatementId,
    );
    await bankStatement.updateDebitBalance(
      expensesAmount,
      existingExpense.bankStatementId,
    );
  }
  return new httpSuccessUpdated(result);
}

async function debitTotalExpenses(bankStatementId) {
  const totalExpenses = await prisma.expense.aggregate({
    where: {
      bankStatementId: bankStatementId,
      bankBankStatementId: null,
    },
    _sum: { total: true },
  });

  return totalExpenses._sum.total || 0;
}

async function remove(id) {
  const existingExpense = await findUnique(id);
  await prisma.expense.delete({
    where: { id },
  });
  const expensesAmount = await debitTotalExpenses(
    existingExpense.bankStatementId,
  );
  await bankStatement.updateBalance(
    expensesAmount,
    existingExpense.bankStatementId,
  );
  await bankStatement.updateDebitBalance(
    expensesAmount,
    existingExpense.bankStatementId,
  );
  return new httpSuccessDeleted(`with id ${id}`);
}

const expenseDebit = {
  findMany,
  findUnique,
  update,
  debitTotalExpenses,
  remove,
};

export default expenseDebit;
