import { NotFoundError, ConflictError } from "errors/http.js";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { createRouter } from "next-connect";
import { httpSuccessCreated } from "helpers/httpSuccess";
import year from "models/year.js";
import month from "models/month.js";
import yearMonth from "models/yearMonth.js";

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
    return res.status(responseError.statusCode).json(responseError);
  }
  return onInternalServerErrorHandler(err, req, res);
}

async function getHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.yearNumber);
  const result = await year.findAssociatedMonths(yearNumberValue);
  return res.status(200).json({
    data: result,
  });
}

async function postHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.yearNumber);
  const body = req.body;

  const findYear = await year.findUnique(yearNumberValue);
  if (!findYear) {
    return res.status(404).json(new NotFoundError(yearNumberValue));
  }
  const findMonth = await month.findFirst({
    month: String(body[0]).toUpperCase() + String(body).slice(1),
  });

  if (!findMonth) {
    return res.status(404).json(new NotFoundError(yearNumberValue));
  }

  await yearMonth.create({
    monthId: findMonth.numeric,
    yearId: findYear.yearNumber,
  });

  const responseSuccess = new httpSuccessCreated(
    `month ${body} created on ${yearNumberValue}`,
  );
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}

async function deleteHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.yearNumber);
  const body = req.body;

  const result = await yearMonth.findFirst({
    month: {
      month: String(body[0]).toUpperCase() + String(body).slice(1),
    },
    year: {
      yearNumber: yearNumberValue,
    },
  });
  if (!result) {
    const responseError = new NotFoundError(body);
    return res.status(404).json(responseError);
  }
  await yearMonth.deleteMany({
    yearId: yearNumberValue,
    monthId: result.monthId,
  });

  return res.status(200).json({
    name: "deleted",
    message: `value ${body} deleted sucessfuly`,
    status_code: 200,
  });
}
