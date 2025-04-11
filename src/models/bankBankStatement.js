import { NotFoundError } from "errors/http";
import { validateAndParseAmount } from "helpers/validators";
import prisma from "infra/database.js";

async function updateBalance(amount, id) {
  const fixedAmount = validateAndParseAmount(amount);
  await prisma.bankBankStatement.update({
    where: { id },
    data: {
      balance: fixedAmount,
    },
  });
}

async function incrementBalance(amount, id) {
  const fixedAmount = validateAndParseAmount(amount);
  await prisma.bankBankStatement.update({
    where: { id },
    data: {
      balance: { increment: fixedAmount },
    },
  });
}

async function findUnique(id) {
  const result = await prisma.bankBankStatement.findUnique({
    where: { id },
  });
  if (!result) {
    throw new NotFoundError(id);
  }
  return result;
}

const bankBankStatement = {
  updateBalance,
  incrementBalance,
  findUnique,
};

export default bankBankStatement;
