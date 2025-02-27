import prisma from "infra/database.js";

async function create(amount) {
  await prisma.salary.create({
    data: {
      amount,
    },
  });
}

const salary = {
  create,
};

export default salary;
