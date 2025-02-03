import prisma from "@infra/database";
import { MonthName } from "@prisma/client";
import {
  onNoMatchHandler,
  onInternalServerErrorHandler,
} from "helpers/handlers";
import { httpSuccessCreated } from "helpers/httpSuccess";
import { createRouter } from "next-connect";

const router = createRouter();

router.post(postHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function postHandler(req, res) {
  let months = [];

  if (req.method === "POST") {
    for (const [index, [, month]] of Object.entries(
      Object.entries(MonthName),
    )) {
      months.push({
        month,
        numeric: parseInt(index) + 1,
      });
    }
    await prisma.month.createMany({
      data: months,
    });

    const responseSuccess = new httpSuccessCreated(
      "all months created successufuly",
    );
    res.status(responseSuccess.statusCode).json(responseSuccess);
  }
}
