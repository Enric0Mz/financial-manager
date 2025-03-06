import prisma from "infra/database.js";

async function findMany() {
  return await prisma.bank.findMany();
}

async function create(name) {
  await prisma.bank.create({
    data: { name },
  });
}

async function update(id, name) {
  return await prisma.bank.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
}

const bank = {
  create,
  findMany,
  update,
};

export default bank;
