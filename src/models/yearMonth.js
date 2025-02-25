import prisma from "@infra/database";

async function findFirst(filter) {
  return await prisma.yearMonth.findFirst({ where: filter });
}

async function create(data) {
  await prisma.yearMonth.create({ data });
}

async function deleteMany(filter) {
  return await prisma.yearMonth.deleteMany({
    where: filter,
  });
}

const yearMonth = {
  create,
  findFirst,
  deleteMany,
};

export default yearMonth;
