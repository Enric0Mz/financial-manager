import { ConflictError } from "errors/http";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { httpSuccessCreated } from "helpers/httpSuccess";
import month from "models/month";
import { createRouter } from "next-connect";

const router = createRouter();

router.post(postHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});


/**
 * @swagger
 * {
 *   "/api/v1/month": {
 *     "post": {
 *       "tags": ["Month"],
 *       "summary": "Create all months of the year",
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
  const result = await month.createAllMonths();
  if (!result) {
    const responseError = new ConflictError("", "all months");
    return res.status(responseError.statusCode).json(responseError);
  }
  const responseSuccess = new httpSuccessCreated(result);
  res.status(responseSuccess.statusCode).json(responseSuccess);
}
