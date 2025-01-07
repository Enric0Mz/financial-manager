import prisma from "@infra/database";
import { ConflictError, NotFoundError } from "errors/http.js";

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
    } catch (error) {
      const responseError = new ConflictError(error);
      res.status(409).json(responseError);
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
      const responseError = new NotFoundError(yearNumberValue);
      res.status(404).json(responseError);
    }

    res.status(200).json({ data: result });
  }
}
