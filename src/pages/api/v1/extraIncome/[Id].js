import { createRouter } from "next-connect";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
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
  const result = await extraIncome.findMany(bankStatementId);
  return res.status(200).json({ data: result });
}

async function postHandler(req, res) {
  const query = req.query;
  const body = req.body;
  const bankStatementId = parseInt(query.Id);

  const result = await extraIncome.create(body, bankStatementId);

  return res.status(result.statusCode).json(result.toJson());
}

async function patchHandler(req, res) {
  const query = req.query;
  const extraIncomeId = parseInt(query.Id);
  const body = req.body;

  const updatedExtraIncome = await extraIncome.update(body, extraIncomeId);

  return res.status(200).json(updatedExtraIncome);
}

async function deleteHandler(req, res) {
  const query = req.query;
  const extraIncomeId = parseInt(query.Id);

  const result = await extraIncome.remove(extraIncomeId);

  return res.status(result.statusCode).json(result);
}
