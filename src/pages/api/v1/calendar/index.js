import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import authenticateAccessToken from "middlewares/auth";
import calendar from "models/calendar";
import { createRouter } from "next-connect";

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
 *   "/api/v1/calendar": {
 *     "post": {
 *       "tags": ["Calendar"],
 *       "summary": "Create months and years",
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
  const result = await calendar.create();

  return res.status(result.statusCode).json(result.toJson());
}
