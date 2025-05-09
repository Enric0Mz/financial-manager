import prisma from "@infra/database.js";
import {
  onNoMatchHandler,
  onInternalServerErrorHandler,
} from "helpers/handlers";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});

/**
 * @swagger
 * {
 *   "/api/v1/health": {
 *     "get": {
 *       "tags": ["Health"],
 *       "summary": "Check API health",
 *       "security": [],
 *       "responses": {
 *         "200": {
 *           "description": "Successful operation",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/Health"
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
  const serverVersionResult = await prisma.$queryRaw`SHOW server_version;`;
  const serverVersionValue = serverVersionResult[0].server_version.slice(0, 4);

  const maxConnectionsResult = await prisma.$queryRaw`SHOW max_connections`;
  const maxConnectionsValue = maxConnectionsResult[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;

  const openedConnectionsResult =
    await prisma.$queryRaw`SELECT count(*)::int FROM pg_stat_activity WHERE datname = ${databaseName}`;
  const openedConnectionsValue = openedConnectionsResult[0].count;

  const updatedAt = new Date().toISOString();

  return res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: serverVersionValue,
        maxConnections: maxConnectionsValue,
        openedConnections: openedConnectionsValue,
      },
    },
  });
}
