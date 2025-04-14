import prisma from "@infra/database";
import { generatePasswordHash } from "@infra/security/bcrypt";
import { IncorrectPasswordError } from "errors/http";
import { httpSuccessCreated } from "helpers/httpSuccess";
import { passwordRules } from "helpers/validators";

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
        throw new IncorrectPasswordError(rule.message);
      }
    }
  }
}

const user = {
  create,
};

export default user;
