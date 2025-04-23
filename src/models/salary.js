import { httpSuccessCreated, httpSuccessUpdated } from "helpers/httpSuccess";
import { NotFoundError } from "errors/http";
import { validateAndParseAmount } from "helpers/validators";
import prisma from "infra/database.js";

async function findFirst() {
  const result = await prisma.salary.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!result) {
    throw new NotFoundError("salary");
  }
  return result;
}

async function create(amount, userId) {
  const fixedAmount = validateAndParseAmount(amount);
  const result = await prisma.salary.create({
    data: {
      userId,
      amount: fixedAmount,
    },
  });
  return new httpSuccessCreated(`salary amount of ${amount} created.`, result);
}

async function update(id, amount) {
  validateAndParseAmount(amount);
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
