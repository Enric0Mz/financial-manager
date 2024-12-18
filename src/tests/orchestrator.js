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
  await prisma.year.deleteMany({
    where: {},
  });
}

const orchestrator = { waitForAllServices, clearDatabase };

export default orchestrator;
