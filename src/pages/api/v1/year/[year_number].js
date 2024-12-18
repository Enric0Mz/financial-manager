import prisma from "@infra/database";

export default async function year(req, res) {
  const allowedMethods = ["POST"];

  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      error: `method ${req.method} not allowed`,
    });
  }

  if (req.method == "POST") {
    const payload = req.query;
    const yearNumberValue = parseInt(payload.year_number);

    await prisma.year.create({
      data: {
        yearNumber: yearNumberValue,
      },
    });

    res.status(201).json({
      status: "created",
    });
  }
}
