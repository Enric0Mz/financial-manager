import { createRouter } from "next-connect";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { httpSuccessDeleted, httpSuccessUpdated } from "helpers/httpSuccess";
import bankStatement from "models/bankStatement";
import expense from "models/expenseCredit";
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

  const result = await expense.findUnique(expenseId);
  return res.status(result.statusCode || 200).json(result);
}

async function postHandler(req, res) {
  const query = req.query;
  const bankStatementId = parseInt(query.id);
  const body = JSON.parse(req.body);

  const result = await bankStatement.updateWithExpense(body, bankStatementId);
  const totalExpensesAmount = await expense.getTotalAmount(
    bankStatementId,
    body.bankBankStatementId,
  );
  await bankStatement.decrementBalanceReal(
    totalExpensesAmount,
    bankStatementId,
  );
  await bankBankStatment.updateBalance(
    totalExpensesAmount,
    body.bankBankStatementId,
  );

  return res.status(result.statusCode).json(result.toJson());
}

async function patchHandler(req, res) {
  const query = req.query;
  const expenseId = parseInt(query.id);
  const body = JSON.parse(req.body);

  const result = await expense.update(body, expenseId);

  const responseSuccess = new httpSuccessUpdated(result.name);
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}

async function deleteHandler(req, res) {
  const query = req.query;
  const expenseId = parseInt(query.id);

  await expense.remove(expenseId);

  const responseSuccess = new httpSuccessDeleted(`with id ${expenseId}`);
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
