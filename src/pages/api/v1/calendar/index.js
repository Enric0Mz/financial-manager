import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { createRouter } from "next-connect";
import authenticateAccessToken from "middlewares/auth";
import calendar from "models/calendar";

const route = createRouter();

route.use(authenticateAccessToken);
route.post(postHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function postHandler(req, res) {
  const result = await calendar.create();

  return res.status(result.statusCode).json(result);
}
