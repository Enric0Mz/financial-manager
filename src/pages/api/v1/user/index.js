import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import user from "models/user";
import { createRouter } from "next-connect";

const route = createRouter();

route.post(postHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

async function postHandler(req, res) {
  const payload = req.body;

  const result = await user.create(payload);

  return res.status(result.statusCode).json(result.toJson());
}
