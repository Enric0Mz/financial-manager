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

const bankBankStatement = {
  updateBalance,
  incrementBalance,
};

export default bankBankStatement;
