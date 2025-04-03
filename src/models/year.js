import prisma from "infra/database.js";
import { ConflictError, NotFoundError } from "errors/http";
import { httpSuccessCreated } from "helpers/httpSuccess";

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
  try {
    const result = await prisma.year.create({
      data: {
        yearNumber: id,
      },
    });
    return new httpSuccessCreated(`value ${id} inserted into database`, result);
  } catch (err) {
    throw new ConflictError(err, id);
  }
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
