/*eslint no-undef: 0*/

import Cors from "cors";
import { createRouter } from "next-connect";

const cors = Cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const apiMiddleware = createRouter();

apiMiddleware.use(async (req, res, next) => {
  await runMiddleware(req, res, cors);
  next();
});

export default apiMiddleware;
