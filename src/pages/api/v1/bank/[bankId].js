import bank from "models/bank";

/**
 * @swagger
 * {
 *   "/api/v1/bank/{bankId}": {
 *     "put": {
 *       "tags": ["Bank"],
 *       "summary": "Update bank",
 *        "requestBody": {
 *          "description": "Bank body",
 *          "content": {
 *            "application/json": {
 *              "schema": {
 *                "$ref": "#/components/schemas/BankUpdate"
 *              }
 *            }
 *          }
 *        },
 *        "parameters": [
 *      {
 *       "name": "bankId",
 *        "in": "path",
 *        "description": "Id of a bank",
 *        "required": true,
 *        "schema": {
 *          "type": "integer",
 *          "format": "int64"
 *          }
 *       }
 *     ],
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

export async function putHandler(req, res) {
  const query = req.query;
  const bankId = parseInt(query.bankId);
  const body = req.body;

  const result = await bank.update(bankId, body.name);
  return res.status(200).json(result);
}

/**
 * @swagger
 * {
 *   "/api/v1/bank/{bankId}": {
 *     "delete": {
 *       "tags": ["Bank"],
 *       "summary": "Delete bank",
 *       "parameters": [
 *         {
 *           "name": "bankId",
 *           "in": "path",
 *           "description": "Id of a bank",
 *           "required": true,
 *           "schema": {
 *             "type": "integer",
 *             "format": "int64"
 *           }
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "Year successfully deleted",
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
  const bankId = parseInt(query.bankId);

  const result = await bank.remove(bankId);
  if (result.statusCode === 404) {
    return res.status(result.statusCode).json(result);
  }
  return res.status(result.statusCode).json(result);
}

export default function handler(req, res) {
  if (req.method === "PUT") return putHandler(req, res);
  if (req.method === "DELETE") return deleteHandler(req, res);
}
