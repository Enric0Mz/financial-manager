import { verifyJwtAccessToken } from "@infra/security/auth";
import { UnauthorizedError, UnprocessableEntityError } from "errors/http";

export default async function authenticateToken(req, res, next) {
  const authHeaders = req.headers["authorization"];
  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token missing or not found");
  }

  const token = authHeaders.split(" ")[1];

  if (!token) {
    throw UnprocessableEntityError("invalid token format", "token");
  }

  try {
    const user = await verifyJwtAccessToken(token);
    req.user = user;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}
