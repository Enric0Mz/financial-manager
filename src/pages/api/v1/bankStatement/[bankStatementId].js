import prisma from "@infra/database";
import { NotFoundError } from "errors/http";
import { httpSuccessDeleted } from "helpers/httpSuccess";

export default async function deleteHandler(req, res) {
  const query = req.query;
  const bankStatementId = parseInt(query.bankStatementId);

  try {
    await prisma.bankStatement.delete({
      where: {
        id: bankStatementId,
      },
    });
  } catch {
    const responseError = new NotFoundError(bankStatementId);
    return res.status(responseError.statusCode).json(responseError);
  }
  const responseSuccess = new httpSuccessDeleted(bankStatementId);
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
