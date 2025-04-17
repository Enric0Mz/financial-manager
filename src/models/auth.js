import prisma from "infra/database";
import user from "./user";
import {
  HttpSuccessAuthenticated,
  HttpSuccessRefreshed,
} from "helpers/httpSuccess";
import {
  compareRefreshTokens,
  generateRefreshTokenHash,
} from "infra/security/bcrypt";
import {
  generateJwtAccessToken,
  generateJwtRefreshToken,
  verifyJwtRefreshToken,
} from "infra/security/auth";
import { UnauthorizedError } from "errors/http";

async function createRefreshToken(token, userId) {
  const hashedToken = await generateRefreshTokenHash(token);

  return await prisma.refreshToken.create({
    data: {
      token: hashedToken,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day,
    },
  });
}

async function generateTokens(username, password) {
  const { id } = await user.validateUser(username, password);

  const { accessToken, expiresIn } = await generateJwtAccessToken({
    id,
  });
  const { refreshToken } = await generateJwtRefreshToken({
    id,
  });

  await createRefreshToken(refreshToken, id);

  return new HttpSuccessAuthenticated({
    accessToken,
    refreshToken,
    expiresIn,
    type: "Bearer",
  });
}

async function findUnique(userId) {
  const result = await prisma.refreshToken.findFirst({
    where: { userId },
  });
  if (!result) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }
  return result;
}

async function refreshSession(refreshToken) {
  if (!refreshToken) {
    throw new UnauthorizedError("Refresh token not found");
  }
  const user = await verifyJwtRefreshToken(refreshToken);
  const refreshTokenData = await findUnique(user.id);
  const hashedRefreshToken = refreshTokenData.token;
  const validateRefreshToken = await compareRefreshTokens(
    refreshToken,
    hashedRefreshToken,
  );
  if (!validateRefreshToken) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }
  const { accessToken, expiresIn } = await generateJwtAccessToken({
    id: user.id,
  });

  return new HttpSuccessRefreshed({
    accessToken,
    expiresIn,
    type: "Bearer",
  });
}

const auth = {
  generateTokens,
  refreshSession,
};

export default auth;
