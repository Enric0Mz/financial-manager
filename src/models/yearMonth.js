import prisma from "infra/database.js";
import Month from "./enum/month.js";

async function findFirst(filter) {
  return await prisma.yearMonth.findFirst({ where: filter });
}

async function create(month, yearId) {
  const monthId = Month[month];
  await prisma.yearMonth.create({
    data: {
      monthId,
      yearId,
    },
  });
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
