import prisma from "infra/database";
import user from "./user";
import { HttpSuccessAuthenticated } from "helpers/httpSuccess";
import { generateRefreshTokenHash } from "infra/security/bcrypt";
import {
  generateJwtAccessToken,
  generateJwtRefreshToken,
} from "@infra/security/auth";

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

const auth = {
  generateTokens,
};

export default auth;
