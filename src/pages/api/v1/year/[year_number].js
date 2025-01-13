import prisma from "@infra/database";
import { ConflictError, NotFoundError } from "errors/http.js";
import { validateAllowedMethods } from "helpers/validators";

export default async function year(req, res) {
  const allowedMethods = ["POST", "GET", "DELETE"];

  validateAllowedMethods(req.method, allowedMethods, res);

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
      const responseError = new ConflictError(error, yearNumberValue);
      return res.status(409).json(responseError);
    }

    return res.status(201).json({
      status_code: 201,
      status: "created",
      description: `value ${yearNumberValue} inserted into database`,
    });
  }

  if (req.method === "DELETE") {
    try {
      await prisma.year.delete({
        where: {
          yearNumber: yearNumberValue,
        },
      });
    } catch {
      const responseError = new NotFoundError(yearNumberValue);
      return res.status(404).json(responseError);
    }
    return res.status(200).json({
      name: "deleted",
      message: `value ${yearNumberValue} deleted successfuly`,
      status_code: 200,
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
      return res.status(404).json(responseError);
    }

    res.status(200).json({ data: result });
  }
}
