import prisma from "infra/database.js";
import Month from "./enum/month.js";

async function findFirst(monthName, yearId) {
  return await prisma.yearMonth.findFirst({
    where: {
      month: {
        month: monthName,
      },
      year: {
        yearNumber: yearId,
      },
    },
  });
}

async function create(monthName, yearId) {
  const monthId = Month[monthName];
  await prisma.yearMonth.create({
    data: {
      monthId,
      yearId,
    },
  });
}

async function deleteMany(yearId, monthId) {
  return await prisma.yearMonth.deleteMany({
    where: {
      yearId,
      monthId,
    },
  });
}

const yearMonth = {
  create,
  findFirst,
  deleteMany,
};

export default yearMonth;
