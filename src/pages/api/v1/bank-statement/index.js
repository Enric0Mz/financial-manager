import { createRouter } from "next-connect";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import bankStatement from "models/bankStatement";
import authenticateAccessToken from "middlewares/auth";

const route = createRouter();

route.use(authenticateAccessToken);
route.post(postHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

/**
 * @swagger
 * {
 *   "/api/v1/bank-statement": {
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
  const { id } = req.user;
  const { month, year } = body;

  const result = await bankStatement.create(month, year, id);

  return res.status(result.statusCode).json(result.toJson());
}
