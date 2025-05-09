import prisma from "infra/database.js";
import { MonthName } from "@prisma/client";
import { ConflictError } from "errors/http";
import { NotFoundError } from "errors/http";

async function findFirst(monthName) {
  const result = await prisma.month.findFirst({
    where: {
      month: monthName,
    },
  });
  if (!result) {
    throw new NotFoundError(monthName);
  }
}
async function findMany(year) {
  return await prisma.month.findMany({
    where: {
      years: {
        some: {
          yearId: year,
        },
      },
    },
  });
}

async function bulkCreate() {
  const exists = await prisma.month.findFirst();
  if (exists) {
    throw new ConflictError("", "all months");
  }

  const months = createMonthsObject();
  return await prisma.month.createManyAndReturn({
    data: months,
  });

  function createMonthsObject() {
    let months = [];
    for (const [index, [, month]] of Object.entries(
      Object.entries(MonthName),
    )) {
      months.push({
        month,
        numeric: parseInt(index) + 1,
      });
    }
    return months;
  }
}

const month = {
  findFirst,
  bulkCreate,
  findMany,
};

export default month;
