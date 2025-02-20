import { createRouter } from "next-connect";
import prisma from "@infra/database";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { httpSuccessCreated } from "helpers/httpSuccess";
import { NotFoundError } from "errors/http";
import deleteHandler from "./[bankStatementId]";

const route = createRouter();

route.get(getHandler);
route.post(postHandler);
route.delete(deleteHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function getHandler(req, res) {
  const queryParams = req.query;
  if (!(queryParams.monthId || queryParams.yearId)) {
    const result = await prisma.bankStatement.findMany({
      include: {
        salary: true,
        expenses: true,
      },
    });
    return res.status(200).json({ data: result });
  }
  const result = await prisma.bankStatement.findFirst({
    where: {
      yearMonth: {
        is: {
          monthId: parseInt(queryParams.monthId),
          yearId: parseInt(queryParams.yearId),
        },
      },
    },
    include: {
      salary: true,
      expenses: true,
    },
  });

  return res.status(200).json(result);
}

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
  if (!yearMonth) {
    const responseError = new NotFoundError(
      `[${data.yearId}, ${data.monthId}]`,
    );
    return res.status(responseError.statusCode).json(responseError);
  }
  const salary = await prisma.salary.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      amount: true,
    },
  });
  await prisma.bankStatement.findFirst({});
  await prisma.bankStatement.create({
    data: {
      salaryId: salary.id,
      yearMonthId: yearMonth.id,
      balanceInitial: salary.amount,
      balanceTotal: salary.amount,
      balanceReal: salary.amount,
      initialBalance: salary.amount,
    },
  });

  const responseSuccess = new httpSuccessCreated("Bank statement created");

  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
