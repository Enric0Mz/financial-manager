import { httpSuccessUpdated } from "helpers/httpSuccess";
import { NotFoundError } from "errors/http";
import salary from "models/salary";

export default async function putHandler(req, res) {
  const salaryId = req.query.salaryId;
  const body = JSON.parse(req.body);
  const amountValue = body.amount;

  try {
    await salary.update(salaryId, amountValue);
  } catch {
    const responseError = new NotFoundError(salaryId);
    return res.status(responseError.statusCode).json(responseError);
  }

  const responseSuccess = new httpSuccessUpdated(amountValue);
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
