import prisma from "@infra/database";

export default async function year(req, res) {
  const allowedMethods = ["GET"];

  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      status_code: 405,
      error: "invalid_method",
      description: `method ${req.method} not allowed`,
    });
  }

  const result = await prisma.year.findMany();
  res.status(200).json({
    data: result,
  });
}
