import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import user from "models/user";
import { createRouter } from "next-connect";

const route = createRouter();

route.post(postHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

/**
 * @swagger
 * {
 *   "/api/v1/user": {
 *     "post": {
 *       "tags": ["User"],
 *       "summary": "Create user",
 *       "requestBody": {
 *          "description": "User Body",
 *          "content": {
 *            "application/json": {
 *              "schema": {
 *                "$ref": "#/components/schemas/UserCreate"
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
  const payload = req.body;

  const result = await user.create(payload);

  return res.status(result.statusCode).json(result.toJson());
}
