import salary from "models/salary";

/**
 * @swagger
 * {
 *   "/api/v1/salary/{salaryId}": {
 *     "put": {
 *       "tags": ["Salary"],
 *       "summary": "Update salary",
 *        "requestBody": {
 *          "description": "Salary body",
 *          "content": {
 *            "application/json": {
 *              "schema": {
 *                "$ref": "#/components/schemas/SalaryCreate"
 *              }
 *            }
 *          }
 *        },
 *        "parameters": [
 *      {
 *       "name": "salaryId",
 *        "in": "path",
 *        "description": "Id of a salary",
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
export default async function putHandler(req, res) {
  const salaryId = req.query.salaryId;
  const body = req.body;
  const amountValue = body.amount;

  const result = await salary.update(salaryId, amountValue);

  return res.status(result.statusCode).json(result);
}
