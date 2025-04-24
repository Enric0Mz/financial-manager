import prisma from "infra/database";
import { generatePasswordHash, comparePasswords } from "infra/security/bcrypt";
import {
  IncorrectPasswordError,
  InvalidPasswordFormatError,
  NotFoundError,
  UnprocessableEntityError,
} from "errors/http";
import { httpSuccessCreated, httpSuccessUpdated } from "helpers/httpSuccess";
import { passwordRules } from "helpers/validators";

async function findById(id) {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      tokenVersion: true,
    },
  });
  if (!result) {
    throw new NotFoundError(id);
  }
  return result;
}

async function findUnique(email) {
  const result = await prisma.user.findUnique({
    where: { email },
  });
  if (!result) {
    throw new NotFoundError(email);
  }
  return result;
}

async function validateUser(email, password) {
  const user = await findUnique(email);

  const passwordIsValid = await comparePasswords(password, user.password);

  if (!passwordIsValid) {
    throw new IncorrectPasswordError("invalid password");
  }
  return user;
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

async function update(id, username) {
  await findById(id);

  if (typeof username !== "string") {
    throw new UnprocessableEntityError("incorrect format", username);
  }

  const result = await prisma.user.update({
    where: { id },
    data: { username },
  });

  return new httpSuccessUpdated(result);
}

async function updateTokenVersion(id) {
  const result = await prisma.user.update({
    where: { id },
    data: {
      tokenVersion: { increment: 1 },
    },
  });
  return result.tokenVersion;
}

const user = {
  findById,
  create,
  validateUser,
  update,
  updateTokenVersion,
  findUnique,
};

export default user;
