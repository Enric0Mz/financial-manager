import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import authenticateAccessToken from "middlewares/auth";
import bankStatement from "models/bankStatement";
import expenseDebit from "models/expenseDebit.js";
import { createRouter } from "next-connect";

const router = createRouter();

router.use(authenticateAccessToken);
router.get(getHandler);
router.post(postHandler);
router.patch(patchHandler);
router.delete(deleteHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

/**
 * @swagger
 * {
 *   "/api/v1/expense/debit/{expenseId}": {
 *     "get": {
 *       "tags": ["Expense - Debit"],
 *       "summary": "Get debit expense",
 *       "parameters": [
 *      {
 *       "name": "expenseId",
 *        "in": "path",
 *        "description": "Id of a debit expense",
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

async function getHandler(req, res) {
  const query = req.query;
  const expenseId = parseInt(query.id);

  const result = await expenseDebit.findUnique(expenseId);

  return res.status(200).json(result);
}

/**
 * @swagger
 * {
 *   "/api/v1/expense/debit/{bankStatementId}": {
 *     "post": {
 *       "tags": ["Expense - Debit"],
 *       "summary": "Create debit expense",
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
 *          "description": "Debit expense body",
 *          "content": {
 *            "application/json": {
 *              "schema": {
 *                "$ref": "#/components/schemas/DebitExpenseCreate"
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
  const body = req.body;
  const expenseAmount = body.total;

  const result = await bankStatement.updateWithExpense(
    body,
    bankStatementId,
    true,
  );
  await bankStatement.decrementBalance(expenseAmount, bankStatementId);
  await bankStatement.incrementDebitBalance(expenseAmount, bankStatementId);
  return res.status(result.statusCode).json(result.toJson());
}

/**
 * @swagger
 * {
 *   "/api/v1/expense/debit/{expenseId}": {
 *     "patch": {
 *       "tags": ["Expense - Debit"],
 *       "summary": "Update debit expense",
 *        "requestBody": {
 *          "description": "Debit expense body",
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
 *        "description": "Id of a debit expense",
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

  const result = await expenseDebit.update(body, expenseId);

  return res.status(result.statusCode).json(result.toJson());
}

/**
 * @swagger
 * {
 *   "/api/v1/expense/debit/{expenseId}": {
 *     "delete": {
 *       "tags": ["Expense - Debit"],
 *       "summary": "Delete debit expense",
 *        "parameters": [
 *      {
 *       "name": "expenseId",
 *        "in": "path",
 *        "description": "Id of a debit expense",
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

  const result = await expenseDebit.remove(expenseId);

  return res.status(result.statusCode).json(result);
}
