import prisma from "@infra/database.js";
import {
  NotFoundError,
  InvalidHttpMethodError,
  ConflictError,
} from "errors/http.js";

export default async function month(req, res) {
  const allowedMethods = ["POST", "GET"];
  if (!allowedMethods.includes(req.method)) {
    const responseError = new InvalidHttpMethodError(req.method);
    return res.status(405).json(responseError);
  }

  const payload = req.query;
  const yearNumberValue = parseInt(payload.year_number);

  if (req.method === "POST") {
    const body = req.body;

    const year = await prisma.year.findUnique({
      where: {
        yearNumber: yearNumberValue,
      },
    });
    if (!year) {
      res.status(404).json(new NotFoundError(yearNumberValue));
    }

    try {
      await prisma.month.update({
        where: {
          month: String(body[0]).toUpperCase() + String(body).slice(1),
        },
        data: {
          years: { connect: [year] },
        },
      });
    } catch (error) {
      const responseError = new ConflictError(error, body);
      res.status(404).json(responseError);
    }

    return res.status(201).json({
      name: "created",
      message: `month ${body} created on ${yearNumberValue}`,
      statusCode: 201,
    });
  }
  if (req.method === "GET") {
    const result = await prisma.month.findMany({
      where: {
        years: {
          some: {
            yearNumber: yearNumberValue,
          },
        },
      },
    });
    res.status(200).json({
      data: result,
    });
  }
}
