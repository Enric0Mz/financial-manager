import prisma from "@infra/database";
import { generatePasswordHash, comparePasswords } from "@infra/security/bcrypt";
import { UnprocessableEntityError } from "errors/http";
import { httpSuccessCreated } from "helpers/httpSuccess";

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
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{5,}$/;
    const result = regex.test(password);
    if (!result) {
      throw new UnprocessableEntityError("Invalid password", "password");
    }
  }
}

const user = {
  create,
};

export default user;
