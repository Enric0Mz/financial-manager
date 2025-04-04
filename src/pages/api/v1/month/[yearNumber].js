import { NotFoundError } from "errors/http.js";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { httpSuccessCreated } from "helpers/httpSuccess";
import month from "models/month.js";
import year from "models/year.js";
import yearMonth from "models/yearMonth.js";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);
router.delete(deleteHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onErrorHandler(err, req, res) {
  return onInternalServerErrorHandler(err, req, res);
}


/**
 * @swagger
 * {
 *   "/api/v1/month/{yearNumber}": {
 *     "get": {
 *       "tags": ["Month"],
 *       "summary": "List months",
 *        "parameters": [
 *      {
 *       "name": "yearNumber",
 *        "in": "path",
 *        "description": "Number of year",
 *        "required": true,
 *        "schema": {
 *          "type": "integer",
 *          "format": "int64"
 *          }
 *       }
 *     ],
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/ListOfMonths"
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
  const payload = req.query;
  const yearNumberValue = parseInt(payload.yearNumber);
  const result = await month.findMany(yearNumberValue);
  return res.status(200).json({
    data: result,
  });
}


/**
 * @swagger
 * {
 *   "/api/v1/month/{yearNumber}": {
 *     "post": {
 *       "tags": ["Month"],
 *       "summary": "Create month in year",
 *        "parameters": [
 *      {
 *       "name": "yearNumber",
 *        "in": "path",
 *        "description": "Number of year",
 *        "required": true,
 *        "schema": {
 *          "type": "integer",
 *          "format": "int64"
 *          }
 *       }
 *     ],
 *       "requestBody": {
 *        "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/MonthCreate"
 *               }
 *             }
 *           } 
 *         },
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/ListOfMonths"
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
  const payload = req.query;
  const yearNumberValue = parseInt(payload.yearNumber);
  const body = req.body;

  const findYear = await year.findUnique(yearNumberValue);
  if (!findYear) {
    return res.status(404).json(new NotFoundError(yearNumberValue));
  }
  const findMonth = await month.findFirst(body.month);

  if (!findMonth) {
    return res.status(404).json(new NotFoundError(yearNumberValue));
  }
  await yearMonth.create(findMonth.month, findYear.yearNumber);

  const responseSuccess = new httpSuccessCreated(
    `month ${body.month} created on ${yearNumberValue}`,
  );
  return res.status(responseSuccess.statusCode).json(responseSuccess);
}


/**
 * @swagger
 * {
 *   "/api/v1/month/{yearNumber}": {
 *     "delete": {
 *       "tags": ["Month"],
 *       "summary": "Delete month of a year",
 *        "parameters": [
 *      {
 *       "name": "yearNumber",
 *        "in": "path",
 *        "description": "Number of year",
 *        "required": true,
 *        "schema": {
 *          "type": "integer",
 *          "format": "int64"
 *          }
 *       }
 *     ],
 *       "requestBody": {
 *        "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/MonthCreate"
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
async function deleteHandler(req, res) {
  const payload = req.query;
  const yearNumberValue = parseInt(payload.yearNumber);
  const body = req.body;
  const result = await yearMonth.findFirst(body.month, yearNumberValue);
  if (!result) {
    const responseError = new NotFoundError(body.month);
    return res.status(404).json(responseError);
  }
  await yearMonth.deleteMany(yearNumberValue, result.monthId);

  return res.status(200).json({
    name: "deleted",
    message: `value ${body.month} deleted sucessfuly`,
    status_code: 200,
  });
}
