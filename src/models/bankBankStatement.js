import prisma from "infra/database.js";

async function updateBalance(amount, id) {
  await prisma.bankBankStatement.update({
    where: { id },
    data: {
      balance: amount,
    },
  });
}

async function incrementBalance(amount, id) {
  await prisma.bankBankStatement.update({
    where: { id },
    data: {
      balance: { increment: amount },
    },
  });
}

const bankBankStatement = {
  updateBalance,
  incrementBalance,
};

export default bankBankStatement;
