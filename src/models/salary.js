import { httpSuccessUpdated } from "helpers/httpSuccess";
import { NotFoundError } from "errors/http";
import prisma from "infra/database.js";

async function findFirst() {
  return await prisma.salary.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function create(amount) {
  return await prisma.salary.create({
    data: {
      amount,
    },
  });
}

async function update(id, amount) {
  try {
    const result = await prisma.salary.update({
      where: {
        id: parseInt(id),
      },
      data: {
        amount: amount,
      },
    });
    return new httpSuccessUpdated(result, result.amount);
  } catch {
    return new NotFoundError(id);
  }
}

const salary = {
  create,
  findFirst,
  update,
};

export default salary;
