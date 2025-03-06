import prisma from "@infra/database";
import { NotFoundError } from "errors/http";
import { httpSuccessDeleted } from "helpers/httpSuccess";
import bank from "models/bank";

export async function putHandler(req, res) {
  const query = req.query;
  const bankId = parseInt(query.bankId);
  const body = JSON.parse(req.body);

  const result = await bank.update(bankId, body.name);
  return res.status(200).json(result);
}

export async function deleteHandler(req, res) {
  const query = req.query;
  const bankId = parseInt(query.bankId);

  try {
    await prisma.bank.delete({
      where: {
        id: bankId,
      },
    });
  } catch {
    const responseError = new NotFoundError(bankId);
    return res.status(responseError.statusCode).json(responseError);
  }
  const responseSuccess = new httpSuccessDeleted(`with id ${bankId}`);
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}

export default function handler(req, res) {
  if (req.method === "PUT") return putHandler(req, res);
  if (req.method === "DELETE") return deleteHandler(req, res);
}
