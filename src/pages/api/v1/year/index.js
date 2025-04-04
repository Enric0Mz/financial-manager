import { onNoMatchHandler } from "helpers/handlers";
import { createRouter } from "next-connect";
import year from "models/year";
import apiMiddleware from "middlewares/cors";

const router = createRouter();

router.use(apiMiddleware);
router.get(getHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
});

/**
 * @swagger
 * {
 *   "/api/v1/year": {
 *     "get": {
 *       "tags": ["Year"],
 *       "summary": "List years",
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/ListOfYears"
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
  const result = await year.findMany();
  res.status(200).json({
    data: result,
  });
}
