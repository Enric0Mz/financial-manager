import prisma from "infra/database.js";
import { NotFoundError } from "errors/http";
import { httpSuccessDeleted } from "helpers/httpSuccess";

async function findMany() {
  return await prisma.bank.findMany();
}

async function create(name) {
  await prisma.bank.create({
    data: { name },
  });
}

async function update(id, name) {
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
  try {
    await prisma.bank.delete({
      where: {
        id: id,
      },
    });
  } catch {
    return new NotFoundError(id);
  }
  return new httpSuccessDeleted(`with id ${id}`);
}

const bank = {
  create,
  findMany,
  update,
  remove,
};

export default bank;
