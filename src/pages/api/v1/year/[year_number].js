import prisma from "@infra/database";

export default async function year(req, res) {
  const allowedMethods = ["POST", "GET"];

  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      status_code: 405,
      error: "invalid_method",
      description: `method ${req.method} not allowed`,
    });
  }

  const payload = req.query;
  const yearNumberValue = parseInt(payload.year_number);

  if (req.method == "POST") {
    try {
      await prisma.year.create({
        data: {
          yearNumber: yearNumberValue,
        },
      });
    } catch {
      res.status(409).json({
        status_code: 409,
        error: "conflict",
        description: `value ${yearNumberValue} already exists`,
      });
    }

    res.status(201).json({
      status_code: 201,
      status: "created",
      description: `value ${yearNumberValue} inserted into database`,
    });
  }

  if (req.method === "GET") {
    const result = await prisma.year.findUnique({
      where: {
        yearNumber: yearNumberValue,
      },
    });

    if (!result) {
      res.status(404).json({
        status_code: 404,
        error: `not found`,
        description: `value ${yearNumberValue} not found`,
      });
    }

    res.status(200).json({ data: result });
  }
}
