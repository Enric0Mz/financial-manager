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

    try {
      await prisma.year.create({
        data: {
          yearNumber: yearNumberValue,
        },
      });
    } catch (err) {
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
}
