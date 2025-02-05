import { createRouter } from "next-connect";
import prisma from "@infra/database";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { httpSuccessCreated, httpSuccessUpdated } from "helpers/httpSuccess";

const route = createRouter();

route.post(postHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function postHandler(req, res) {
  const query = req.query;
  const bankStatementId = parseInt(query.id);
  const { name, description, total, bankId } = JSON.parse(req.body);

  const updateBankStatement = await prisma.bankStatement.update({
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
  console.log(updateBankStatement);
  const totalExpenses = await prisma.expense.aggregate({
    where: { bankStatementId: bankStatementId },
    _sum: { total: true },
  });
  const totalExpenseValue = totalExpenses._sum.total || 0;

  await prisma.bankStatement.update({
    where: { id: bankStatementId },
    data: {
      balanceTotal: {
        decrement: totalExpenseValue,
      },
    },
  });

  const responseSuccess = new httpSuccessCreated(`expense created`);
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
