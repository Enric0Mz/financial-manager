import prisma from "@infra/database";

async function create(name) {
  await prisma.bank.create({
    data: { name },
  });
}

const bank = {
  create,
};

export default bank;
