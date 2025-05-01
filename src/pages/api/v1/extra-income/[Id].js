import { createRouter } from "next-connect";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import extraIncome from "models/extraIncome";
import authenticateAccessToken from "middlewares/auth";

const route = createRouter();

route.use(authenticateAccessToken);
route.get(getHandler);
route.post(postHandler);
route.patch(patchHandler);
route.delete(deleteHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

/**
 * @swagger
 * {
 *   "/api/v1/extra-income/{bankStatementId}": {
 *     "get": {
 *       "tags": ["Extra Income"],
 *       "summary": "List extra incomes",
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
 *                 "$ref": "#/components/schemas/ListOfExtraIncome"
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

async function getHandler(req, res) {
  const query = req.query;
  const bankStatementId = parseInt(query.Id);
  const result = await extraIncome.findMany(bankStatementId);
  return res.status(200).json({ data: result });
}

/**
 * @swagger
 * {
 *   "/api/v1/extra-income/{bankStatementId}": {
 *     "post": {
 *       "tags": ["Extra Income"],
 *       "summary": "Create extra income",
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
 *      "requestBody": {
 *          "description": "Extra income body",
 *          "content": {
 *            "application/json": {
 *              "schema": {
 *                "$ref": "#/components/schemas/ExtraIncomeCreate"
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
  const query = req.query;
  const body = req.body;
  const bankStatementId = parseInt(query.Id);
  const { id: userId } = req.user;

  const result = await extraIncome.create(body, bankStatementId, userId);

  return res.status(result.statusCode).json(result.toJson());
}

/**
 * @swagger
 * {
 *   "/api/v1/extra-income/{extraIncomeId}": {
 *     "patch": {
 *       "tags": ["Extra Income"],
 *       "summary": "Update extra income",
 *        "requestBody": {
 *          "description": "Extra income body",
 *          "content": {
 *            "application/json": {
 *              "schema": {
 *                "$ref": "#/components/schemas/ExtraIncomeCreate"
 *              }
 *            }
 *          }
 *        },
 *        "parameters": [
 *      {
 *       "name": "extraIncomeId",
 *        "in": "path",
 *        "description": "Id of a extra income",
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

async function patchHandler(req, res) {
  const query = req.query;
  const extraIncomeId = parseInt(query.Id);
  const body = req.body;

  const updatedExtraIncome = await extraIncome.update(body, extraIncomeId);

  return res.status(200).json(updatedExtraIncome);
}

/**
 * @swagger
 * {
 *   "/api/v1/extra-income/{extraIncomeId}": {
 *     "delete": {
 *       "tags": ["Extra Income"],
 *       "summary": "Delete extra income",
 *       "parameters": [
 *         {
 *           "name": "extraIncomeId",
 *           "in": "path",
 *           "description": "Id of a extra income",
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

async function deleteHandler(req, res) {
  const query = req.query;
  const { id: userId } = req.user;
  const extraIncomeId = parseInt(query.Id);

  const result = await extraIncome.remove(extraIncomeId, userId);

  return res.status(result.statusCode).json(result);
}
