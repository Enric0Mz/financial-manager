import prisma from "@infra/database.js";
import { NotFoundError, ConflictError } from "errors/http.js";
import { validateAllowedMethods } from "helpers/validators";

export default async function month(req, res) {
  const allowedMethods = ["POST", "GET", "DELETE"];
  validateAllowedMethods(req.method, allowedMethods, res);

  const payload = req.query;
  const yearNumberValue = parseInt(payload.year_number);
  const body = req.body;

  if (req.method === "POST") {
    const year = await prisma.year.findUnique({
      where: {
        yearNumber: yearNumberValue,
      },
    });
    if (!year) {
      return res.status(404).json(new NotFoundError(yearNumberValue));
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
      return res.status(404).json(responseError);
    }
    return res.status(201).json({
      name: "created",
      message: `month ${body} created on ${yearNumberValue}`,
      statusCode: 201,
    });
  }
  if (req.method === "DELETE") {
    const result = await prisma.month.findFirst({
      where: {
        AND: [
          { month: String(body[0]).toUpperCase() + String(body).slice(1) },
          { years: { some: { yearNumber: yearNumberValue } } },
        ],
      },
    });
    if (!result) {
      const responseError = new NotFoundError(body);
      return res.status(404).json(responseError);
    }
    await prisma.month.delete({
      where: {
        month: result.month,
      },
    });
    return res.status(200).json({
      name: "deleted",
      message: `value ${body} deleted sucessfuly`,
      status_code: 200,
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
