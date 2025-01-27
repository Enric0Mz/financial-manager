import prisma from "@infra/database";
import { httpSuccessUpdated } from "helpers/httpSuccess";
import { NotFoundError } from "errors/http";

export default async function putHandler(req, res) {
  const salaryId = req.query.salaryId;
  const amountPayload = JSON.parse(req.body);
  const amountValue = amountPayload.amount;

  try {
    await prisma.salary.update({
      where: {
        id: parseInt(salaryId),
      },
      data: {
        amount: amountValue,
      },
    });
  } catch {
    const responseError = new NotFoundError(salaryId);
    return res.status(responseError.statusCode).json(responseError);
  }

  const responseSuccess = new httpSuccessUpdated(amountValue);
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
