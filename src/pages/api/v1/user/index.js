import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import user from "models/user";
import { createRouter } from "next-connect";
import authenticateAccessToken from "middlewares/auth";

const route = createRouter();

route.get(authenticateAccessToken, getHandler);
route.post(postHandler);
route.put(authenticateAccessToken, putHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

/**
 * @swagger
 * {
 *   "/api/v1/user": {
 *     "get": {
 *       "tags": ["User"],
 *       "summary": "Get self user",
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/User"
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
  const { id } = req.user;

  const result = await user.findById(id);
  return res.status(200).json(result);
}

/**
 * @swagger
 * {
 *   "/api/v1/user": {
 *     "post": {
 *       "tags": ["User"],
 *       "summary": "Create user",
 *        "security": [],
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

async function putHandler(req, res) {
  const { id } = req.user;
  const { username } = req.body;
  const result = await user.update(id, username);
  return res.status(result.statusCode).json(result.toJson());
}
