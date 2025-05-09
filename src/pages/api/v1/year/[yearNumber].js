import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { createRouter } from "next-connect";
import year from "models/year";
import authenticateAccessToken from "middlewares/auth";

const router = createRouter();

router.use(authenticateAccessToken);
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
  const result = await year.findUnique(yearNumberValue);
  return res.status(200).json(result);
}

async function postHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.yearNumber);
  const result = await year.create(yearNumberValue);
  return res.status(result.statusCode).json(result);
}

async function deleteHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.yearNumber);
  const result = await year.remove(yearNumberValue);
  return res.status(result.statusCode).json(result);
}
