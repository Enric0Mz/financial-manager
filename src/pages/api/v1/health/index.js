import prisma from "@infra/database.js";
import { validateAllowedMethods } from "helpers/validators";

export default async function health(req, res) {
  const allowedMethods = ["GET"];
  validateAllowedMethods(req.method, allowedMethods, res);

  const serverVersionResult = await prisma.$queryRaw`SHOW server_version;`;
  const serverVersionValue = serverVersionResult[0].server_version.slice(0, 4);

  const maxConnectionsResult = await prisma.$queryRaw`SHOW max_connections`;
  const maxConnectionsValue = maxConnectionsResult[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;

  const openedConnectionsResult =
    await prisma.$queryRaw`SELECT count(*)::int FROM pg_stat_activity WHERE datname = ${databaseName}`;
  const openedConnectionsValue = openedConnectionsResult[0].count;

  const updatedAt = new Date().toISOString();

  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: serverVersionValue,
        max_connections: maxConnectionsValue,
        opened_connections: openedConnectionsValue,
      },
    },
  });
}
