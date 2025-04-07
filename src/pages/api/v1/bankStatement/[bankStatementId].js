import prisma from "@infra/database";
import { NotFoundError } from "errors/http";
import { httpSuccessDeleted } from "helpers/httpSuccess";

/**
 * @swagger
 * {
 *   "/api/v1/bankStatement/{bankStatementId}": {
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

export default async function deleteHandler(req, res) {
  const query = req.query;
  const bankStatementId = parseInt(query.bankStatementId);

  try {
    await prisma.bankStatement.delete({
      where: {
        id: bankStatementId,
      },
    });
  } catch {
    const responseError = new NotFoundError(bankStatementId);
    return res.status(responseError.statusCode).json(responseError);
  }
  const responseSuccess = new httpSuccessDeleted(bankStatementId);
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
