import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import auth from "models/auth";
import { createRouter } from "next-connect";
import authenticateAccessToken from "middlewares/auth";

const route = createRouter();

route.post(authenticateHandler);
route.delete(authenticateAccessToken, logoutHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

/**
 * @swagger
 * {
 *   "/api/v1/auth": {
 *     "post": {
 *       "tags": ["Auth"],
 *       "summary": "Authenticate user",
 *       "security": [],
 *       "requestBody": {
 *         "description": "User credentials",
 *         "required": true,
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *                "$ref": "#/components/schemas/UserLogin"
 *              }
 *            }
 *         }
 *       },
 *       "responses": {
 *         "200": {
 *           "description": "Tokens generated successfully",
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

async function authenticateHandler(req, res) {
  const body = req.body;
  const { username, password } = body;

  const result = await auth.generateTokens(username, password);

  return res.status(result.statusCode).json(result.toJson());
}

/**
 * @swagger
 * {
 *   "/api/v1/auth": {
 *     "delete": {
 *       "tags": ["Auth"],
 *       "summary": "Logout user and invalidate tokens",
 *       "responses": {
 *         "200": {
 *           "description": "Logout successful",
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

async function logoutHandler(req, res) {
  const { id } = req.user;
  const result = await auth.logout(id);
  return res.status(result.statusCode).json(result.toJson());
}
