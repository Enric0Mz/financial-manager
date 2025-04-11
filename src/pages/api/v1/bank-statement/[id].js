import bankStatement from "models/bankStatement";
import { createRouter } from "next-connect";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";

const route = createRouter();

route.get(getHandler);
route.delete(deleteHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

/**
 * @swagger
 * {
 *    "/api/v1/bank-statement/{yearNumber}": {
 *     "get": {
 *       "tags": ["Bank Statement"],
 *       "summary": "get bank statement",
 *        "parameters": [
 *         {
 *           "name": "yearNumber",
 *           "in": "path",
 *           "description": "Number of year",
 *           "required": true,
 *           "schema": {
 *             "type": "integer",
 *             "format": "int64"
 *           }
 *         },
 *        {
 *          "name": "month",
 *          "in": "query",
 *          "description": "Month of the year",
 *          "required": true,
 *          "schema": {
 *            "type": "string",
 *            "enum": [
 *              "January",
 *              "February",
 *              "March",
 *              "April",
 *              "May",
 *              "June",
 *              "July",
 *              "August",
 *              "September",
 *              "October",
 *              "November",
 *              "December"
 *            ]
 *          }
 *        }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/BankStatement"
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

export async function getHandler(req, res) {
  const queryParams = req.query;
  const { id, month } = queryParams;

  const result = await bankStatement.findUnique(month, id);

  return res.status(200).json(result);
}

/**
 * @swagger
 * {
 *    "/api/v1/bank-statement/{bankStatementId}": {
 *     "delete": {
 *       "tags": ["Bank Statement"],
 *       "summary": "Delete bank statement",
 *       "parameters": [
 *         {
 *           "name": "bankStatementId",
 *           "in": "path",
 *           "description": "Id of a bank statement",
 *           "required": true,
 *           "schema": {
 *             "type": "integer",
 *             "format": "int64"
 *           }
 *         }
 *       ],
 *       "responses": {
 *         "200": {
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

export async function deleteHandler(req, res) {
  const query = req.query;
  const bankStatementId = parseInt(query.id);

  const result = await bankStatement.remove(bankStatementId);

  return res.status(result.statusCode).json(result);
}
