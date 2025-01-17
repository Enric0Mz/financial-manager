import prisma from "@infra/database";
import { onNoMatchHandler } from "helpers/handlers";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
});

async function getHandler(req, res) {
  const result = await prisma.year.findMany();
  res.status(200).json({
    data: result,
  });
}
