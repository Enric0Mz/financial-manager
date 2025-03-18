import { httpSuccessUpdated } from "helpers/httpSuccess";
import { NotFoundError } from "errors/http";
import salary from "models/salary";

export default async function putHandler(req, res) {
  const salaryId = req.query.salaryId;
  const body = JSON.parse(req.body);
  const amountValue = body.amount;

  const result = await salary.update(salaryId, amountValue);

  return res.status(result.statusCode).json(result);
}
