import { httpSuccessCreated, httpSuccessUpdated } from "helpers/httpSuccess";
import { NotFoundError, UnprocessableEntityError } from "errors/http";
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

async function create(amount) {
  validateAmount(amount);
  const result = await prisma.salary.create({
    data: {
      amount,
    },
  });
  return new httpSuccessCreated(`salary amount of ${amount} created.`, result);

  function validateAmount(amount) {
    if (typeof amount != "number") {
      throw new UnprocessableEntityError(`${amount} is not a float`, "amount");
    }
  }
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
