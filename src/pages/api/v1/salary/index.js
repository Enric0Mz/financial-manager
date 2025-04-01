import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { createRouter } from "next-connect";
import { httpSuccessCreated } from "helpers/httpSuccess";
import putHandler from "./[salaryId]";
import salary from "models/salary.js";

const route = createRouter();

route.post(postHandler);
route.get(getHandler);
route.put(putHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function getHandler(req, res) {
  const result = await salary.findFirst();

  return res.status(200).json(result);
}

async function postHandler(req, res) {
  const body = req.body;
  const result = await salary.create(body.amount);

  return res.status(result.statusCode).json(result.toJson());
}
