import { createRouter } from "next-connect";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { NotFoundError } from "errors/http";
import yearMonth from "models/yearMonth";
import salary from "models/salary";
import bankStatement from "models/bankStatement";
import bank from "models/bank";

const route = createRouter();

route.post(postHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

/**
 * @swagger
 * {
 *   "/api/v1/bankStatement": {
 *     "post": {
 *       "tags": ["Bank Statement"],
 *       "summary": "Create bank statement",
 *       "requestBody": {
 *          "description": "Bank Statement year/month",
 *          "content": {
 *            "application/json": {
 *              "schema": {
 *                "$ref": "#/components/schemas/YearMonth"
 *              }
 *            }
 *          }
 *        },
 *       "responses": {
 *         "201": {
 *           "description": "Successful operation",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/HttpSuccess"
 *               }
 *             }
 *           }
 *         },
 *         "500": {
 *           "description": "Internal server error",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/InternalServerError"
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */

async function postHandler(req, res) {
  const body = req.body;
  const yearMonthResult = await yearMonth.findFirst(body.month, body.year);

  if (!yearMonthResult) {
    const responseError = new NotFoundError(`[${body.year}, ${body.month}]`);
    return res.status(responseError.statusCode).json(responseError);
  }

  const salaryResult = await salary.findFirst();

  const lastStatement = await bankStatement.findFirst();

  const banks = await bank.findMany();

  const result = await bankStatement.create(
    salaryResult,
    yearMonthResult.id,
    lastStatement,
    banks,
  );

  return res.status(result.status_code).json(result);
}
