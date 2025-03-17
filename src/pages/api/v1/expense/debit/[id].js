import prisma from "@infra/database";
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
  console.log(body);

  const result = await bankStatement.updateWithExpense(body, bankStatementId);
  const totalExpensesAmount = await expense.getTotalAmount(bankStatementId);
  await bankStatement.decrementBalance(totalExpensesAmount, bankStatementId);
  await bankStatement.updateDebitBalance(totalExpensesAmount, bankStatementId);
  console.log(await prisma.bankStatement.findMany());
  return res.status(result.statusCode).json(result.toJson());
}
