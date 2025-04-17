import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import auth from "models/auth";
import { createRouter } from "next-connect";
import authenticateAccessToken from "middlewares/auth";

const route = createRouter();

route.post(authenticateHandler);
route.delete(authenticateAccessToken, logoutHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function authenticateHandler(req, res) {
  const body = req.body;
  const { username, password } = body;

  const result = await auth.generateTokens(username, password);

  return res.status(result.statusCode).json(result.toJson());
}

async function logoutHandler(req, res) {
  const { id } = req.user;
  const result = await auth.logout(id);
  return res.status(result.statusCode).json(result.toJson());
}
