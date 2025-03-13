import { createRouter } from "next-connect";
import prisma from "@infra/database";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { httpSuccessDeleted, httpSuccessUpdated } from "helpers/httpSuccess";
import { NotFoundError } from "errors/http";
import bankStatement from "models/bankStatement";
import expense from "models/expense";
import bankBankStatment from "models/bankBankStatement";

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
  const body = JSON.parse(req.body);

  const result = await bankStatement.updateWithExpense(body, bankStatementId);
  const totalExpensesAmount = await expense.getTotalAmount(bankStatementId);
  await bankStatement.decrementBalance(totalExpensesAmount, bankStatementId);
  await bankBankStatment.updateBalance(
    totalExpensesAmount,
    body.bankBankStatementId,
  );

  return res.status(result.statusCode).json(result.toJson());
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
