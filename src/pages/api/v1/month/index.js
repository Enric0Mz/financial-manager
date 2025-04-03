import month from "models/month";
import {
  onNoMatchHandler,
  onInternalServerErrorHandler,
} from "helpers/handlers";
import { createRouter } from "next-connect";

const router = createRouter();

router.post(postHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function postHandler(req, res) {
  const result = await month.createAllMonths();
  res.status(result.statusCode).json(result);
}
