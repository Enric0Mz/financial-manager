import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import user from "models/user";
import { createRouter } from "next-connect";

const route = createRouter();

route.post(authenticateHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function authenticateHandler(req, res) {
  const body = req.body;
  const { username, password } = body;

  const result = await user.generateAccessToken(username, password);

  return res.status(result.statusCode).json(result.toJson());
}
