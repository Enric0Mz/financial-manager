import prisma from "infra/database.js";

async function findMany() {
  return await prisma.year.findMany();
}

async function findUnique(id) {
  return await prisma.year.findUnique({
    where: {
      yearNumber: id,
    },
  });
}

async function create(id) {
  return await prisma.year.create({
    data: {
      yearNumber: id,
    },
  });
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
