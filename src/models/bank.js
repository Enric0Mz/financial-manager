import prisma from "infra/database.js";

async function findMany() {
  return await prisma.bank.findMany();
}

async function create(name) {
  await prisma.bank.create({
    data: { name },
  });
}

const bank = {
  create,
  findMany,
};

export default bank;
