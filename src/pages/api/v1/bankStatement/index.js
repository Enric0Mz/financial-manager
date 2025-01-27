import { createRouter } from "next-connect";
import prisma from "@infra/database";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
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
  const yearMonth = await prisma.yearMonth.findFirst({
    where: {
      yearId: data.yearId,
      monthId: data.monthId,
    },
    select: {
      id: true,
    },
  });
  const salary = await prisma.salary.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      amount: true,
    },
  });

  await prisma.bankStatement.create({
    data: {
      salaryId: salary.id,
      yearMonthId: yearMonth.id,
      balanceTotal: salary.amount,
      balanceReal: salary.amount,
    },
  });

  const responseSuccess = new httpSuccessCreated("Bank statement created");

  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
