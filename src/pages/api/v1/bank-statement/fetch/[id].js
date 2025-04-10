import bankStatement from "models/bankStatement";
import { createRouter } from "next-connect";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";

const route = createRouter();

route.get(fetchHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

/**
 * @swagger
 * {
 *    "/api/v1/bank-statement/fetch/{yearNumber}": {
 *     "get": {
 *       "tags": ["Bank Statement"],
 *       "summary": "List bank statements",
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
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/ListOfBankStatements"
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

async function fetchHandler(req, res) {
  const query = req.query;
  const yearNumber = query.id;

  const result = await bankStatement.findMany(yearNumber);
  return res.status(200).json({ data: result });
}
