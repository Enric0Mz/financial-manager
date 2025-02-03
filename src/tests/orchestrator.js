import retry from "async-retry";
import prisma from "infra/database";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/health");
      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await prisma.bankStatement.deleteMany({
    where: {},
  });
  await prisma.yearMonth.deleteMany({
    where: {},
  });
  await prisma.year.deleteMany({
    where: {},
  });
  await prisma.month.deleteMany({
    where: {},
  });
  await prisma.salary.deleteMany({
    where: {},
  });
  await prisma.extraIncome.deleteMany({
    where: {},
  });
  await prisma.bank.deleteMany({
    where: {},
  });
}

const orchestrator = { waitForAllServices, clearDatabase };

afterAll(async () => {
  await prisma.$disconnect();
});

export default orchestrator;
