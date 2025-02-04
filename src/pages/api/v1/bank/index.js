import prisma from "@infra/database";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { httpSuccessCreated } from "helpers/httpSuccess";
import { createRouter } from "next-connect";
import putHandler from "./[bankId]";

const route = createRouter();

route.get(getHandler);
route.post(postHandler);
route.put(putHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function getHandler(req, res) {
  const result = await prisma.bank.findMany();

  return res.status(200).json({ data: result });
}

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
