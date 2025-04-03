import { NotFoundError } from "errors/http.js";
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
  onError: onInternalServerErrorHandler,
});

async function getHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.yearNumber);
  const result = await month.findMany(yearNumberValue);
  return res.status(200).json({
    data: result,
  });
}

async function postHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.yearNumber);
  const body = req.body;

  const result = await yearMonth.create(body.month, yearNumberValue);

  return res.status(result.statusCode).json(result);
}

async function deleteHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.yearNumber);
  const body = req.body;
  const result = await yearMonth.findFirst(body.month, yearNumberValue);
  if (!result) {
    const responseError = new NotFoundError(body.month);
    return res.status(404).json(responseError);
  }
  await yearMonth.deleteMany(yearNumberValue, result.monthId);

  return res.status(200).json({
    name: "deleted",
    message: `value ${body.month} deleted sucessfuly`,
    status_code: 200,
  });
}
