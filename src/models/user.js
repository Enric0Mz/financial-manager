import prisma from "infra/database";
import { generatePasswordHash, comparePasswords } from "infra/security/bcrypt";
import {
  IncorrectPasswordError,
  InvalidPasswordFormatError,
  NotFoundError,
} from "errors/http";
import {
  HttpSuccessAuthenticated,
  httpSuccessCreated,
} from "helpers/httpSuccess";
import { passwordRules } from "helpers/validators";

import { generateJwtAccessToken } from "infra/security/auth";

async function findUnique(username) {
  const result = await prisma.user.findUnique({
    where: { username },
  });
  if (!result) {
    throw new NotFoundError(username);
  }
  return result;
}

async function validateUser(username, password) {
  const user = await findUnique(username);

  const passwordIsValid = await comparePasswords(password, user.password);

  if (!passwordIsValid) {
    throw new IncorrectPasswordError("invalid password");
  }
  return user;
}

async function generateAccessToken(username, password) {
  const user = await validateUser(username, password);

  const accesstoken = await generateJwtAccessToken({
    username: user.username,
    email: user.email,
  });
  return new HttpSuccessAuthenticated(accesstoken);
}

async function create(payload) {
  const { username, password, email } = payload;
  validatePassword(password);
  const hashedPassword = await generatePasswordHash(password);

  const result = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      email,
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });
  return new httpSuccessCreated(`User ${result.username} created`, result);

  function validatePassword(password) {
    for (const rule of passwordRules) {
      if (!rule.test(password)) {
        throw new InvalidPasswordFormatError(rule.message);
      }
    }
  }
}

const user = {
  create,
  validateUser,
  generateAccessToken,
};

export default user;
