import prisma from "@infra/database";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { httpSuccessCreated } from "helpers/httpSuccess";
import { createRouter } from "next-connect";

const route = createRouter();

route.post(postHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function postHandler(req, res) {
  const body = JSON.parse(req.body);
  const name = body.name;

  await prisma.bank.create({
    data: {
      name,
    },
  });

  const responseSuccess = new httpSuccessCreated(`bank ${name} created`);

  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
