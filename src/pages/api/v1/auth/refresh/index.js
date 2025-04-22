import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import auth from "models/auth";
import { createRouter } from "next-connect";
import authenticateAccessToken from "middlewares/auth";

const route = createRouter();

route.post(authenticateAccessToken, refreshSessionHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

/**
 * @swagger
 * {
 *   "/api/v1/auth/refresh": {
 *     "post": {
 *       "tags": ["Auth"],
 *       "summary": "Refresh user login",
 *       "requestBody": {
 *         "description": "Refresh token",
 *         "required": true,
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *                "$ref": "#/components/schemas/RefreshToken"
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

async function refreshSessionHandler(req, res) {
  const { refreshToken } = req.body;

  const result = await auth.refreshSession(refreshToken);

  return res.status(result.statusCode).json(result.toJson());
}
