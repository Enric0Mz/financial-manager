import prisma from "infra/database.js";
import Month from "./enum/month.js";
import year from "./year.js";
import month from "./month.js";
import { httpSuccessCreated } from "helpers/httpSuccess.js";

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
  await year.findUnique(yearId);
  await month.findFirst(monthName);
  const monthId = Month[monthName];
  const result = await prisma.yearMonth.create({
    data: {
      monthId,
      yearId,
    },
  });
  return new httpSuccessCreated(
    `month ${monthName} created on ${yearId}`,
    result,
  );
}

async function deleteMany(yearId, monthId) {
  return await prisma.yearMonth.deleteMany({
    where: {
      yearId,
      monthId,
    },
  });
}

async function connect(yearList, monthList) {
  const payload = generatePayload(yearList, monthList);
  return await prisma.yearMonth.createManyAndReturn({
    data: payload,
  });

  function generatePayload(years, months) {
    const result = [];
    for (const year of years) {
      for (const month of months) {
        result.push({ yearId: year.yearNumber, monthId: month.numeric });
      }
    }
    return result;
  }
}

const yearMonth = {
  create,
  findFirst,
  deleteMany,
  connect,
};

export default yearMonth;
