import { createRouter } from "next-connect";
import prisma from "@infra/database";
import {
  onInternalServerErrorHandler,
  onNoMatchHandler,
} from "helpers/handlers";
import { postHandler } from "./[bankStatementId]";

const route = createRouter();

route.get(getHandler);
route.post(postHandler);

export default route.handler({
  onNoMatch: onNoMatchHandler,
  onError: onInternalServerErrorHandler,
});
