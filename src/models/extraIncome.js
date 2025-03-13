import prisma from "infra/database.js";
import bankStatement from "./bankStatement";
import { httpSuccessCreated, httpSuccessDeleted } from "helpers/httpSuccess";
import { NotFoundError } from "errors/http";

async function findMany(bankStatementId) {
  return await prisma.extraIncome.findMany({
    where: {
      bankStatments: {
        every: {
          id: bankStatementId,
        },
      },
    },
  });
}

async function create(payload, bankStatementId) {
  try {
    const result = await prisma.extraIncome.create({
      data: {
        name: payload.name,
        amount: payload.amount,
        bankStatments: {
          connect: { id: bankStatementId },
        },
      },
    });
    await bankStatement.incrementBalance(payload.amount, bankStatementId);
    return new httpSuccessCreated(`Extra income ${result.name} created`);
  } catch {
    return new NotFoundError(bankStatementId);
  }
}

async function update(payload, id) {
  return await prisma.extraIncome.update({
    where: { id },
    data: { name: payload.name, amount: payload.amount },
  });
}

async function remove(id) {
  try {
    await prisma.extraIncome.delete({
      where: {
        id: id,
      },
    });
  } catch {
    return new NotFoundError(id);
  }
  return new httpSuccessDeleted(`with id ${id}`);
}

const extraIncome = {
  create,
  findMany,
  update,
  remove,
};

export default extraIncome;
