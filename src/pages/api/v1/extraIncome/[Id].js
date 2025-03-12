import { createRouter } from "next-connect";
import prisma from "@infra/database";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { NotFoundError } from "errors/http";
import { httpSuccessCreated, httpSuccessDeleted } from "helpers/httpSuccess";
import extraIncome from "models/extraIncome";

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
  const bankStatementId = parseInt(query.Id);

  const result = await extraIncome.create(body, bankStatementId);

  return res.status(result.statusCode).json(result);
}

async function patchHandler(req, res) {
  const query = req.query;
  const extraIncomeId = parseInt(query.Id);
  const { name, amount } = JSON.parse(req.body);

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
