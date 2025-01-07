import prisma from "@infra/database";
import { InvalidHttpMethodError } from "errors/http";

export default async function year(req, res) {
  const allowedMethods = ["GET"];

  if (!allowedMethods.includes(req.method)) {
    const responseError = new InvalidHttpMethodError(req.method);
    return res.status(405).json(responseError);
  }

  const result = await prisma.year.findMany();
  res.status(200).json({
    data: result,
  });
}
