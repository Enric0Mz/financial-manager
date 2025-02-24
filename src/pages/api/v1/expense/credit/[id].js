import { createRouter } from "next-connect";
import prisma from "@infra/database";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import {
  httpSuccessCreated,
  httpSuccessDeleted,
  httpSuccessUpdated,
} from "helpers/httpSuccess";
import { NotFoundError } from "errors/http";

const route = createRouter();

route.get(getHanlder);
route.post(postHandler);
route.delete(deleteHandler);
route.patch(patchHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function getHanlder(req, res) {
  const query = req.query;
  const expenseId = parseInt(query.id);

  const result = await prisma.expense.findUnique({
    where: {
      id: expenseId,
    },
  });
  if (!result) {
    const responseError = new NotFoundError(expenseId);
    return res.status(responseError.statusCode).json(responseError);
  }
  return res.status(200).json(result);
}

async function postHandler(req, res) {
  const query = req.query;
  const bankStatementId = parseInt(query.id);
  const { name, description, total, bankId } = JSON.parse(req.body);

  await prisma.bankStatement.update({
    where: {
      id: bankStatementId,
    },
    data: {
      expenses: {
        create: {
          name,
          description,
          total,
          bankId,
        },
      },
    },
    include: {
      expenses: true,
    },
  });
  const totalExpenses = await prisma.expense.aggregate({
    where: { bankStatementId: bankStatementId },
    _sum: { total: true },
  });
  const totalExpensesValue = totalExpenses._sum.total || 0;

  await prisma.bankStatement.update({
    where: { id: bankStatementId },
    data: {
      balanceReal: {
        decrement: totalExpensesValue,
      },
    },
  });

  await prisma.bank.update({
    where: {
      id: bankId,
    },
    data: {
      balance: totalExpensesValue,
    },
  });

  const responseSuccess = new httpSuccessCreated(`expense created`);
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}

async function patchHandler(req, res) {
  const query = req.query;
  const expenseId = parseInt(query.id);
  const { name, description, total } = JSON.parse(req.body);

  const existingExpense = await prisma.expense.findUnique({
    where: {
      id: expenseId,
    },
  });
  if (!existingExpense) {
    const responseError = new NotFoundError(`with id ${expenseId}`);
    return res.status(responseError.statusCode).json(responseError);
  }

  const result = await prisma.expense.update({
    where: {
      id: expenseId,
    },
    data: {
      name: name ? name : existingExpense.name,
      description: description ? description : existingExpense.description,
      total: total ? total : existingExpense.total,
    },
  });

  const responseSuccess = new httpSuccessUpdated(result.name);
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}

async function deleteHandler(req, res) {
  const query = req.query;
  const expenseId = parseInt(query.id);

  try {
    await prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });
  } catch {
    const responseError = new NotFoundError(expenseId);
    return res.status(responseError).json(responseError);
  }
  const responseSuccess = new httpSuccessDeleted(`with id ${expenseId}`);
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
