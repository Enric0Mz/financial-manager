import prisma from "@infra/database.js";
import { NotFoundError, ConflictError } from "errors/http.js";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);
router.delete(deleteHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onErrorHandler(err, req, res) {
  if (req.method === "POST") {
    const body = req.body;
    const responseError = new ConflictError(err, body);
    return res.status(404).json(responseError);
  }
  return onInternalServerErrorHandler(err, req, res);
}

async function getHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.year_number);
  const result = await prisma.month.findMany({
    where: {
      years: {
        some: {
          yearNumber: yearNumberValue,
        },
      },
    },
  });
  return res.status(200).json({
    data: result,
  });
}

async function postHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.year_number);
  const body = req.body;

  const year = await prisma.year.findUnique({
    where: {
      yearNumber: yearNumberValue,
    },
  });
  if (!year) {
    return res.status(404).json(new NotFoundError(yearNumberValue));
  }

  await prisma.month.update({
    where: {
      month: String(body[0]).toUpperCase() + String(body).slice(1),
    },
    data: {
      years: { connect: [year] },
    },
  });
  return res.status(201).json({
    name: "created",
    message: `month ${body} created on ${yearNumberValue}`,
    statusCode: 201,
  });
}

async function deleteHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.year_number);
  const body = req.body;

  const result = await prisma.month.findFirst({
    where: {
      AND: [
        { month: String(body[0]).toUpperCase() + String(body).slice(1) },
        { years: { some: { yearNumber: yearNumberValue } } },
      ],
    },
  });
  if (!result) {
    const responseError = new NotFoundError(body);
    return res.status(404).json(responseError);
  }
  await prisma.month.delete({
    where: {
      month: result.month,
    },
  });
  return res.status(200).json({
    name: "deleted",
    message: `value ${body} deleted sucessfuly`,
    status_code: 200,
  });
}
