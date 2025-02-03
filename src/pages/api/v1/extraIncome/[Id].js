import { createRouter } from "next-connect";
import prisma from "@infra/database";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { NotFoundError } from "errors/http";
import { httpSuccessCreated, httpSuccessDeleted } from "helpers/httpSuccess";

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
  const bankStatementId = parseInt(query.Id);
  const result = await prisma.extraIncome.findMany({
    where: {
      bankStatments: {
        every: {
          id: bankStatementId,
        },
      },
    },
  });
  return res.status(200).json({ data: result });
}

async function postHandler(req, res) {
  const query = req.query;
  const body = JSON.parse(req.body);
  const extraIncomeName = body.name;
  const extraIncomeAmount = body.amount;
  const bankStatementId = parseInt(query.Id);

  try {
    await prisma.extraIncome.create({
      data: {
        name: extraIncomeName,
        amount: extraIncomeAmount,
        bankStatments: {
          connect: { id: bankStatementId },
        },
      },
    });
  } catch {
    const responseError = new NotFoundError(bankStatementId);
    return res.status(responseError.statusCode).json(responseError);
  }

  const responseSuccess = new httpSuccessCreated(
    `Extra income '${extraIncomeName}' created`,
  );
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}

async function patchHandler(req, res) {
  const query = req.query;
  const extraIncomeId = parseInt(query.Id);
  const { name, amount } = JSON.parse(req.body);
  console.log(extraIncomeId);

  const updatedExtraIncome = await prisma.extraIncome.update({
    where: { id: extraIncomeId },
    data: { name, amount },
  });

  return res.status(200).json({ data: updatedExtraIncome });
}

async function deleteHandler(req, res) {
  const query = req.query;
  const extraIncomeId = parseInt(query.Id);
  try {
    await prisma.extraIncome.delete({
      where: {
        id: extraIncomeId,
      },
    });
  } catch {
    const responseError = new NotFoundError(extraIncomeId);
    return res.status(responseError.statusCode).json(responseError);
  }

  const responseSuccess = new httpSuccessDeleted(`with id ${extraIncomeId}`);
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
