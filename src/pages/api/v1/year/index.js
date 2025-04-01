import { onNoMatchHandler } from "helpers/handlers";
import { createRouter } from "next-connect";
import year from "models/year";
import apiMiddleware from "middlewares/cors";

const router = createRouter();

router.use(apiMiddleware);
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
