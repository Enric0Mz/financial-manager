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

  return res.status(200).json({
    data: {
      id: result.id,
      salary: result.amount,
    },
  });
}

async function postHandler(req, res) {
  const body = JSON.parse(req.body);
  await salary.create(body.amount);
  const responseSuccess = new httpSuccessCreated(
    `salary amount of ${body.amount} created.`,
  );

  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
