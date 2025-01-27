import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { createRouter } from "next-connect";
import prisma from "@infra/database";
import { httpSuccessCreated } from "helpers/httpSuccess";
import putHandler from "./[salaryId]";

const route = createRouter();

route.post(postHandler);
route.get(getHandler);
route.put(putHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function getHandler(req, res) {
  const result = await prisma.salary.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json({
    data: {
      id: result.id,
      salary: result.amount,
    },
  });
}

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
