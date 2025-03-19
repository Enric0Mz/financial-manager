import { createRouter } from "next-connect";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { httpSuccessDeleted, httpSuccessUpdated } from "helpers/httpSuccess";
import bankStatement from "models/bankStatement";
import expense from "models/expenseCredit";
import bankBankStatement from "models/bankBankStatement";
import prisma from "@infra/database";

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

  const result = await expense.findUnique(expenseId);
  return res.status(result.statusCode || 200).json(result);
}

async function postHandler(req, res) {
  const query = req.query;
  const bankStatementId = parseInt(query.id);
  const body = JSON.parse(req.body);

  const result = await bankStatement.updateWithExpense(body, bankStatementId);

  await bankStatement.decrementBalanceReal(body.total, bankStatementId);
  await bankBankStatement.incrementBalance(
    body.total,
    body.bankBankStatementId,
  );
  return res.status(result.statusCode).json(result.toJson());
}

async function patchHandler(req, res) {
  const query = req.query;
  const expenseId = parseInt(query.id);
  const body = JSON.parse(req.body);

  const result = await expense.update(body, expenseId);
  return res.status(result.statusCode).json(result);
}

async function deleteHandler(req, res) {
  const query = req.query;
  const expenseId = parseInt(query.id);

  const result = await expense.remove(expenseId);

  return res.status(result.statusCode).json(result);
}
