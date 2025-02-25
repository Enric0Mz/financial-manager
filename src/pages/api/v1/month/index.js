import month from "models/month";
import {
  onNoMatchHandler,
  onInternalServerErrorHandler,
} from "helpers/handlers";
import { httpSuccessCreated } from "helpers/httpSuccess";
import { createRouter } from "next-connect";
import { ConflictError } from "errors/http";

const router = createRouter();

router.post(postHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function postHandler(req, res) {
  const result = await month.createAllMonths();
  if (!result) {
    const responseError = new ConflictError("", "all months");
    return res.status(responseError.statusCode).json(responseError);
  }
  const responseSuccess = new httpSuccessCreated(result);
  res.status(responseSuccess.statusCode).json(responseSuccess);
}
