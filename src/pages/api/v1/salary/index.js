import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { createRouter } from "next-connect";
import prisma from "@infra/database";
import { httpSuccessCreated } from "helpers/httpSuccess";

const route = createRouter();

route.post(postHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function postHandler(req, res) {
  const body = req.body;
  const data = JSON.parse(body);
  await prisma.salary.create({
    data: data,
  });
  const responseSuccess = new httpSuccessCreated(
    `salary amount of ${data.amount} created.`,
  );

  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
