import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { createRouter } from "next-connect";
import putHandler from "./[salaryId]";
import salary from "models/salary.js";
import authenticateAccessToken from "middlewares/auth";

const route = createRouter();

route.use(authenticateAccessToken);
route.post(postHandler);
route.get(getHandler);
route.put(putHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

/**
 * @swagger
 * {
 *   "/api/v1/salary": {
 *     "get": {
 *       "tags": ["Salary"],
 *       "summary": "Get latest added salary",
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/Salary"
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
  const result = await salary.findFirst();

  return res.status(200).json(result);
}

/**
 * @swagger
 * {
 *   "/api/v1/salary": {
 *     "post": {
 *       "tags": ["Salary"],
 *       "summary": "Create salary",
 *       "requestBody": {
 *          "description": "Salary body",
 *          "content": {
 *            "application/json": {
 *              "schema": {
 *                "$ref": "#/components/schemas/SalaryCreate"
 *              }
 *            }
 *          }
 *        },
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

async function postHandler(req, res) {
  const body = req.body;
  const { id } = req.user;
  const result = await salary.create(body.amount, id);

  return res.status(result.statusCode).json(result.toJson());
}
