import prisma from "infra/database.js";
import {
  ConflictError,
  NotFoundError,
  UnprocessableEntityError,
} from "errors/http";
import { httpSuccessCreated, httpSuccessDeleted } from "helpers/httpSuccess";

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
  validateYearRange(id);
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

  function validateYearRange(year) {
    const isYearValid = year >= 1900 && year <= 2098;
    const errorMessage = "Invalid in year range of (1899 <> 2099)";
    if (!isYearValid) {
      throw new UnprocessableEntityError(
        errorMessage,
        `${year}, that is ${errorMessage}`,
      );
    }
  }
}

async function remove(id) {
  try {
    await prisma.year.delete({
      where: {
        yearNumber: id,
      },
    });
    return new httpSuccessDeleted(id);
  } catch {
    throw new NotFoundError(id);
  }
}

async function bulkCreate() {
  const years = Array.from({ length: 2051 - 1950 }, (_, i) => ({
    yearNumber: i + 1950,
  }));

  return await prisma.year.createManyAndReturn({
    data: years,
  });
}

const year = {
  findMany,
  findUnique,
  create,
  remove,
  bulkCreate,
};

export default year;
