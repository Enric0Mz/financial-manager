import prisma from "infra/database.js";
import { NotFoundError, InternalServerError } from "errors/http";
import { httpSuccessCreated, httpSuccessDeleted } from "helpers/httpSuccess";

async function findMany() {
  return await prisma.bank.findMany();
}

async function findUnique(id) {
  const result = await prisma.bank.findUnique({
    where: { id },
  });
  if (!result) {
    throw new NotFoundError(id);
  }
  return result;
}

async function create(name, userId) {
  try {
    const result = await prisma.bank.create({
      data: { name, userId },
      select: {
        id: true,
        name: true,
      },
    });
    return new httpSuccessCreated(`bank ${name} created`, result);
  } catch (err) {
    throw new InternalServerError(err, 500);
  }
}

async function update(id, name) {
  await findUnique(id);
  return await prisma.bank.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
}

async function remove(id) {
  await findUnique(id);
  await prisma.bank.delete({
    where: {
      id: id,
    },
  });
  return new httpSuccessDeleted(`with id ${id}`);
}

const bank = {
  create,
  findMany,
  update,
  remove,
};

export default bank;
