import prisma from "@infra/database";
import { MonthName } from "@prisma/client";

async function findFirst(filter) {
  return await prisma.month.findFirst({
    where: filter,
  });
}

async function createAllMonths() {
  const result = await prisma.month.findMany();
  if (result.length !== 0) {
    return;
  }
  let months = [];
  for (const [index, [, month]] of Object.entries(Object.entries(MonthName))) {
    months.push({
      month,
      numeric: parseInt(index) + 1,
    });
  }
  await prisma.month.createMany({
    data: months,
  });
  return "all months created successufuly";
}

const month = {
  findFirst,
  createAllMonths,
};

export default month;
