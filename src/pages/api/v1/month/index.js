import prisma from "@infra/database";
import { MonthName } from "@prisma/client";
import { validateAllowedMethods } from "helpers/validators";

export default async function month(req, res) {
  const allowedMethods = ["POST"];

  validateAllowedMethods(req.method, allowedMethods, res);

  if (req.method === "POST") {
    const months = MonthName;
    let counter = 1;
    for (const [value] of Object.entries(months)) {
      await prisma.month.createMany({
        data: [
          {
            month: value,
            numeric: counter,
          },
        ],
      });
      counter++;
    }
    res.status(201).json({
      name: "created",
      message: "all months created successufuly",
      status_code: 201,
    });
  }
}
