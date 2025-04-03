import prisma from "infra/database.js";
import { NotFoundError } from "errors/http";

async function findMany() {
  return await prisma.year.findMany();
}

async function findUnique(id) {
  const result = await prisma.year.findUnique({
    where: {
      yearNumber: id,
    },
  });
  if (!result) {
    throw new NotFoundError(id);
  }
  return result;
}

async function create(id) {
  const result = await prisma.year.create({
    data: {
      yearNumber: id,
    },
  });
  return result;
}

async function remove(id) {
  return await prisma.year.delete({
    where: {
      yearNumber: id,
    },
  });
}

const year = {
  findMany,
  findUnique,
  create,
  remove,
};

export default year;
