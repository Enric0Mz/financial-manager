import prisma from "infra/database.js";
import bankStatement from "./bankStatement";
import { httpSuccessCreated, httpSuccessDeleted } from "helpers/httpSuccess";
import { NotFoundError } from "errors/http";
import { validateAndParseAmount } from "helpers/validators";

async function findMany(bankStatementId) {
  return await prisma.extraIncome.findMany({
    where: {
      bankStatement: {
        id: bankStatementId,
      },
    },
  });
}

async function findUnique(id) {
  const result = await prisma.extraIncome.findUnique({
    where: { id },
    include: {
      bankStatement: true,
    },
  });
  if (!result) {
    throw new NotFoundError(id);
  }
  return result;
}

async function create(payload, bankStatementId, userId) {
  const fixedAmount = validateAndParseAmount(payload.amount);
  try {
    const result = await prisma.extraIncome.create({
      data: {
        name: payload.name,
        amount: fixedAmount,
        bankStatementId,
      },
    });

    await bankStatement.incrementBalance(payload.amount, bankStatementId);
    await bankStatement.reprocessAmounts(bankStatementId, userId);
    return new httpSuccessCreated(
      `Extra income ${result.name} created`,
      result,
    );
  } catch (err) {
    console.log(err);
    throw new NotFoundError(bankStatementId);
  }
}

async function update(payload, id) {
  if (payload.amount !== undefined) {
    payload.amount = validateAndParseAmount(payload.amount);
  }
  const existingExtraIncome = await findUnique(id);

  const { name, amount } = existingExtraIncome;

  const result = await prisma.extraIncome.update({
    where: { id },
    data: {
      name,
      amount,
      ...payload,
    },
  });

  if (payload.amount) {
    const bankStatementId = existingExtraIncome.bankStatement.id;
    const extraIncomeAmount = await totalExtraIncomeAmount(bankStatementId);
    const totalAmount =
      existingExtraIncome.bankStatement.balanceInitial + extraIncomeAmount;

    await bankStatement.updateBalanceForExtraIncome(
      totalAmount,
      bankStatementId,
    );
  }
  return result;
}

async function remove(id) {
  const existingExtraIncome = await findUnique(id);
  await prisma.extraIncome.delete({
    where: {
      id,
    },
  });
  const expensesAmount = await totalExtraIncomeAmount(
    existingExtraIncome.bankStatementId,
  );
  await bankStatement.updateBalance(
    expensesAmount,
    existingExtraIncome.bankStatementId,
  );
  return new httpSuccessDeleted(`with id ${id}`);
}

async function totalExtraIncomeAmount(bankStatementId) {
  const totalExpenses = await prisma.extraIncome.aggregate({
    where: {
      bankStatementId: bankStatementId,
    },
    _sum: { amount: true },
  });
  return totalExpenses._sum.amount || 0;
}

const extraIncome = {
  create,
  findMany,
  update,
  remove,
};

export default extraIncome;
