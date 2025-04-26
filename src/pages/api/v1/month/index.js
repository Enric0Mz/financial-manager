import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { httpSuccessCreated } from "helpers/httpSuccess";
import authenticateAccessToken from "middlewares/auth";
import month from "models/month";
import { createRouter } from "next-connect";

const router = createRouter();

router.use(authenticateAccessToken);
router.post(postHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function postHandler(req, res) {
  const months = await month.bulkCreate();
  const result = new httpSuccessCreated("All months created successfuly");
  res.status(result.statusCode).json(result);
}
