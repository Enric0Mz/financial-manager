import prisma from "infra/database.js";

async function findFirst() {
  return await prisma.salary.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function create(amount) {
  await prisma.salary.create({
    data: {
      amount,
    },
  });
}

async function update(id, amount) {
  await prisma.salary.update({
    where: {
      id: parseInt(id),
    },
    data: {
      amount: amount,
    },
  });
}

const salary = {
  create,
  findFirst,
  update,
};

export default salary;
