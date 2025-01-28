import prisma from "@infra/database";
import { NotFoundError } from "errors/http";
import { httpSuccessCreated } from "helpers/httpSuccess";

export default async function postHandler(req, res) {
  const query = req.query;
  const body = JSON.parse(req.body);
  const extraIncomeName = body.name;
  const extraIncomeAmount = body.amount;
  const bankStatementId = parseInt(query.bankStatementId);

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
