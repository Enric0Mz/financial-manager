import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import bankStatement from "models/bankStatement";
import expenseDebit from "models/expenseDebit.js";
import { createRouter } from "next-connect";

const route = createRouter();

route.get(getHandler);
route.post(postHandler);
route.patch(patchHandler);
route.delete(deleteHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function getHandler(req, res) {
  const query = req.query;
  const bankStatementId = parseInt(query.id);

  const result = await expenseDebit.findMany(bankStatementId);

  return res.status(200).json({ data: result });
}

async function postHandler(req, res) {
  const query = req.query;
  const bankStatementId = parseInt(query.id);
  const body = JSON.parse(req.body);
  const expenseAmount = body.total;

  const result = await bankStatement.updateWithExpense(
    body,
    bankStatementId,
    true,
  );
  await bankStatement.decrementBalance(expenseAmount, bankStatementId);
  await bankStatement.incrementDebitBalance(expenseAmount, bankStatementId);
  return res.status(result.statusCode).json(result.toJson());
}

async function patchHandler(req, res) {
  const query = req.query;
  const expenseId = parseInt(query.id);
  const body = JSON.parse(req.body);

  const result = await expenseDebit.update(body, expenseId);

  return res.status(result.statusCode).json(result.toJson());
}

async function deleteHandler(req, res) {
  const query = req.query;
  const expenseId = parseInt(query.id);

  const result = await expenseDebit.remove(expenseId);

  return res.status(result.statusCode).json(result);
}
