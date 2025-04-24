import { verifyJwtAccessToken } from "infra/security/auth";
import {
  TokenNotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from "errors/http";
import user from "models/user";

export default async function authenticateAccessToken(req, res, next) {
  const authHeaders = req.headers["authorization"];
  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new TokenNotFoundError("Access token missing or not found");
  }

  const token = authHeaders.split(" ")[1];
  if (!token) {
    throw new UnprocessableEntityError(
      "invalid access token format",
      "accessToken",
    );
  }

  const decoded = await verifyJwtAccessToken(token);
  const userInDatabase = await user.findById(decoded.id);
  if (!userInDatabase || userInDatabase.tokenVersion !== decoded.tokenVersion) {
    throw new UnauthorizedError("Invalid or expired access token");
  }
  req.user = userInDatabase;
  return next();
}
