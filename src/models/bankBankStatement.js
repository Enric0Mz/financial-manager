import prisma from "infra/database.js";

async function updateBalance(amount, id) {
  await prisma.bankBankStatement.update({
    where: { id },
    data: {
      balance: amount,
    },
  });
}

const bankBankStatment = {
  updateBalance,
};

export default bankBankStatment;
