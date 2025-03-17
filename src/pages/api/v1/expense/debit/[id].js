import prisma from "@infra/database";
import helperFunctions from "helpers/functions";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import bankStatement from "models/bankStatement";
import expense from "models/expense";
import { createRouter } from "next-connect";

const route = createRouter();

route.post(postHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function postHandler(req, res) {
  const query = req.query;
  const bankStatementId = parseInt(query.id);
  const body = JSON.parse(req.body);
  const expenseAmount = body.total;

  const result = await bankStatement.updateWithExpense(body, bankStatementId);
  await bankStatement.decrementBalance(expenseAmount, bankStatementId);
  await bankStatement.updateDebitBalance(expenseAmount, bankStatementId);
  return res.status(result.statusCode).json(result.toJson());
}
