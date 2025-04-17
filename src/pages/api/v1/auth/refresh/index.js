import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import auth from "models/auth";
import { createRouter } from "next-connect";

const route = createRouter();

route.post(refreshSessionHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function refreshSessionHandler(req, res) {
  const { refreshToken } = req.body;

  const result = await auth.refreshSession(refreshToken);

  return res.status(result.statusCode).json(result.toJson());
}
