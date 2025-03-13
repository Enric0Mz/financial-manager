import prisma from "infra/database.js";
import bankStatement from "./bankStatement";
import { httpSuccessCreated } from "helpers/httpSuccess";

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
    await bankStatement.updateBalance(payload.amount, bankStatementId);
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

const extraIncome = {
  create,
  findMany,
  update,
};

export default extraIncome;
