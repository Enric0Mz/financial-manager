import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { httpSuccessCreated } from "helpers/httpSuccess";
import { createRouter } from "next-connect";
import bank from "models/bank";

const route = createRouter();

route.get(getHandler);
route.post(postHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

/**
 * @swagger
 * {
 *   "/api/v1/bank": {
 *     "get": {
 *       "tags": ["Bank"],
 *       "summary": "List banks",
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/ListOfBanks"
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
  const result = await bank.findMany();

  return res.status(200).json({ data: result });
}

/**
 * @swagger
 * {
 *   "/api/v1/bank": {
 *     "post": {
 *       "tags": ["Bank"],
 *       "summary": "Create bank",
 *        "requestBody": {
 *        "description": "Bank body",
 *        "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/BankCreate"
 *               }
 *             }
 *           }
 *         },
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
  const name = body.bank;

  await bank.create(name);

  const responseSuccess = new httpSuccessCreated(`bank ${name} created`);

  return res.status(responseSuccess.statusCode).json(responseSuccess);
}
