import { createRouter } from "next-connect";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import bankStatement from "models/bankStatement";
import expense from "models/expenseCredit";
import bankBankStatement from "models/bankBankStatement";
import authenticateAccessToken from "middlewares/auth";

const route = createRouter();

route.use(authenticateAccessToken);
route.get(getHanlder);
route.post(postHandler);
route.delete(deleteHandler);
route.patch(patchHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

/**
 * @swagger
 * {
 *   "/api/v1/expense/credit/{expenseId}": {
 *     "get": {
 *       "tags": ["Expense - Credit"],
 *       "summary": "Get credit expense",
 *       "parameters": [
 *      {
 *       "name": "expenseId",
 *        "in": "path",
 *        "description": "Id of a credit expense",
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
 *                 "$ref": "#/components/schemas/Expense"
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

async function getHanlder(req, res) {
  const query = req.query;
  const expenseId = parseInt(query.id);

  const result = await expense.findUnique(expenseId);
  return res.status(result.statusCode || 200).json(result);
}

/**
 * @swagger
 * {
 *   "/api/v1/expense/credit/{bankStatementId}": {
 *     "post": {
 *       "tags": ["Expense - Credit"],
 *       "summary": "Create credit expense",
 *       "parameters": [
 *      {
 *       "name": "bankStatementId",
 *        "in": "path",
 *        "description": "Id of a bank statement",
 *        "required": true,
 *        "schema": {
 *          "type": "integer",
 *          "format": "int64"
 *          }
 *       }
 *     ],
 *      "requestBody": {
 *          "description": "Credit expense body",
 *          "content": {
 *            "application/json": {
 *              "schema": {
 *                "$ref": "#/components/schemas/CreditExpenseCreate"
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
  const bankStatementId = parseInt(query.id);
  const { id: userId } = req.user;
  const body = req.body;

  const result = await bankStatement.updateWithExpense(
    body,
    bankStatementId,
    false,
  );

  await bankStatement.decrementBalanceReal(body.total, bankStatementId);
  await bankBankStatement.incrementBalance(
    body.total,
    body.bankBankStatementId,
  );
  await bankStatement.reprocessBalances(bankStatementId, userId);
  return res.status(result.statusCode).json(result.toJson());
}

/**
 * @swagger
 * {
 *   "/api/v1/expense/credit/{expenseId}": {
 *     "patch": {
 *       "tags": ["Expense - Credit"],
 *       "summary": "Update credit expense",
 *        "requestBody": {
 *          "description": "Credit expense body",
 *          "content": {
 *            "application/json": {
 *              "schema": {
 *                "$ref": "#/components/schemas/ExpenseUpdate"
 *              }
 *            }
 *          }
 *        },
 *        "parameters": [
 *      {
 *       "name": "expenseId",
 *        "in": "path",
 *        "description": "Id of a credit expense",
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
  const expenseId = parseInt(query.id);
  const body = req.body;

  const result = await expense.update(body, expenseId);
  return res.status(result.statusCode).json(result);
}

/**
 * @swagger
 * {
 *   "/api/v1/expense/credit/{expenseId}": {
 *     "delete": {
 *       "tags": ["Expense - Credit"],
 *       "summary": "Delete credit expense",
 *        "parameters": [
 *      {
 *       "name": "expenseId",
 *        "in": "path",
 *        "description": "Id of a credit expense",
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

async function deleteHandler(req, res) {
  const query = req.query;
  const expenseId = parseInt(query.id);

  const result = await expense.remove(expenseId);

  return res.status(result.statusCode).json(result);
}
