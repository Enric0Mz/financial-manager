import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { httpSuccessCreated } from "helpers/httpSuccess";
import { createRouter } from "next-connect";
import { putHandler } from "./[bankId]";
import { deleteHandler } from "./[bankId]";
import bank from "models/bank";

const route = createRouter();

route.get(getHandler);
route.post(postHandler);
route.put(putHandler);
route.delete(deleteHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function getHandler(req, res) {
  const result = await bank.findMany();

  return res.status(200).json({ data: result });
}

async function postHandler(req, res) {
  const body = req.body;
  const name = body.bank;

  await bank.create(name);

  const responseSuccess = new httpSuccessCreated(`bank ${name} created`);

  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
