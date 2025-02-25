import { onNoMatchHandler } from "helpers/handlers";
import { createRouter } from "next-connect";
import year from "models/year";

const router = createRouter();

router.get(getHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
});

async function getHandler(req, res) {
  const result = await year.findMany();
  res.status(200).json({
    data: result,
  });
}
