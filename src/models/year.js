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

async function findAssociatedMonths(id) {
  const result = await prisma.year.findUnique({
    where: { yearNumber: id },
    include: {
      months: {
        include: {
          month: true,
        },
      },
    },
  });
  return result?.months.map((item) => item.month) || [];
}

const year = {
  findMany,
  findUnique,
  create,
  remove,
  findAssociatedMonths,
};

export default year;
