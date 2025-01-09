import prisma from "@infra/database.js";
import {
  NotFoundError,
  InvalidHttpMethodError,
  ConflictError,
} from "errors/http.js";

export default async function month(req, res) {
  const allowedMethods = ["POST"];
  if (!allowedMethods.includes(req.method)) {
    const responseError = new InvalidHttpMethodError(req.method);
    return res.status(405).json(responseError);
  }

  if (req.method === "POST") {
    const payload = req.query;
    const yearNumberValue = parseInt(payload.year_number);
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
}
