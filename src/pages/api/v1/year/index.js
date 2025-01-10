import prisma from "@infra/database";
import { validateAllowedMethods } from "helpers/validators";

export default async function year(req, res) {
  const allowedMethods = ["GET"];

  validateAllowedMethods(req.method, allowedMethods, res);

  const result = await prisma.year.findMany();
  res.status(200).json({
    data: result,
  });
}
