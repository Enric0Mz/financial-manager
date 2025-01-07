import prisma from "@infra/database.js";
import { InvalidHttpMethodError } from "errors/http";

export default async function health(req, res) {
  const allowedMethods = ["GET"];

  if (!allowedMethods.includes(req.method)) {
    const responseError = new InvalidHttpMethodError(req.method);
    return res.status(405).json(responseError);
  }
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
        max_connections: maxConnectionsValue,
        opened_connections: openedConnectionsValue,
      },
    },
  });
}
