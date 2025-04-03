import prisma from "infra/database.js";
import { MonthName } from "@prisma/client";
import { ConflictError } from "errors/http";
import { httpSuccessCreated } from "helpers/httpSuccess";

async function findFirst(monthName) {
  return await prisma.month.findFirst({
    where: {
      month: monthName,
    },
  });
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

async function createAllMonths() {
  const exists = await prisma.month.findFirst();
  if (exists) {
    throw new ConflictError("", "all months");
  }

  const months = createMonthsObject();
  const result = await prisma.month.createMany({
    data: months,
  });
  return new httpSuccessCreated("All months created successfuly", result);

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
  createAllMonths,
  findMany,
};

export default month;
