import prisma from "infra/database";
import user from "./user";
import {
  HttpSuccessAuthenticated,
  HttpSuccessLoggedOut,
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
  const expDate = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day,

  return await prisma.refreshToken.upsert({
    where: {
      userId,
    },
    update: {
      token: hashedToken,
      expiresAt: expDate,
    },
    create: {
      token: hashedToken,
      userId,
      expiresAt: expDate,
    },
  });
}

async function generateTokens(username, password) {
  const { id } = await user.validateUser(username, password);
  const tokenVersion = await user.updateTokenVersion(id);
  const { accessToken, expiresIn } = await generateJwtAccessToken({
    id,
    tokenVersion,
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
  const { id } = await verifyJwtRefreshToken(refreshToken);
  const refreshTokenData = await findUnique(id);
  const hashedRefreshToken = refreshTokenData.token;
  const isValid = await compareRefreshTokens(refreshToken, hashedRefreshToken);
  if (!isValid) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }
  const { tokenVersion } = await user.findById(id);
  const { accessToken, expiresIn } = await generateJwtAccessToken({
    id,
    tokenVersion,
  });

  return new HttpSuccessRefreshed({
    accessToken,
    expiresIn,
    type: "Bearer",
  });
}

async function logout(userId) {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
  await user.updateTokenVersion(userId);

  return new HttpSuccessLoggedOut();
}

const auth = {
  generateTokens,
  refreshSession,
  logout,
};

export default auth;
