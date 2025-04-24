import { createRouter } from "next-connect";

const router = createRouter();

router.post(postHandler);

export default router.handler();

async function postHandler(req, res) {
  const body = req.body;
  const { num1, num2 } = body;

  return await res.status(201).json({
    data: num1 + num2,
  });
}
