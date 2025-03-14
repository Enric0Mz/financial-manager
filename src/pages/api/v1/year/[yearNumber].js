import { ConflictError, NotFoundError } from "errors/http.js";
import { onNoMatchHandler } from "helpers/handlers";
import { httpSuccessCreated, httpSuccessDeleted } from "helpers/httpSuccess";
import { createRouter } from "next-connect";
import year from "models/year";

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
  const yearNumberValue = parseInt(payload.yearNumber);
  if (req.method === "POST") {
    const responseError = new ConflictError(err, yearNumberValue);
    return res.status(409).json(responseError);
  }
  const responseError = new NotFoundError(yearNumberValue);
  return res.status(404).json(responseError);
}

async function getHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.yearNumber);
  const result = await year.findUnique(yearNumberValue);
  if (!result) {
    const responseError = new NotFoundError(yearNumberValue);
    return res.status(404).json(responseError);
  }
  return res.status(200).json({ data: result });
}

async function postHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.yearNumber);
  await year.create(yearNumberValue);
  const responseSuccess = new httpSuccessCreated(
    `value ${yearNumberValue} inserted into database`,
  );
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}

async function deleteHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.yearNumber);
  await year.remove(yearNumberValue);
  const responseSuccess = new httpSuccessDeleted(yearNumberValue);
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
