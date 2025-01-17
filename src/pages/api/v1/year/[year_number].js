import prisma from "@infra/database";
import { ConflictError, NotFoundError } from "errors/http.js";
import { onNoMatchHandler } from "helpers/handlers";
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
  const payload = req.query;
  const yearNumberValue = parseInt(payload.year_number);
  if (req.method === "POST") {
    const responseError = new ConflictError(err, yearNumberValue);
    return res.status(409).json(responseError);
  }
  const responseError = new NotFoundError(yearNumberValue);
  return res.status(404).json(responseError);
}

async function getHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.year_number);

  const result = await prisma.year.findUnique({
    where: {
      yearNumber: yearNumberValue,
    },
  });

  if (!result) {
    const responseError = new NotFoundError(yearNumberValue);
    return res.status(404).json(responseError);
  }

  return res.status(200).json({ data: result });
}

async function postHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.year_number);

  await prisma.year.create({
    data: {
      yearNumber: yearNumberValue,
    },
  });

  return res.status(201).json({
    status_code: 201,
    status: "created",
    description: `value ${yearNumberValue} inserted into database`,
  });
}

async function deleteHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.year_number);
  await prisma.year.delete({
    where: {
      yearNumber: yearNumberValue,
    },
  });
  return res.status(200).json({
    name: "deleted",
    message: `value ${yearNumberValue} deleted successfuly`,
    status_code: 200,
  });
}
