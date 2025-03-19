import { InvalidHttpMethodError, InternalServerError } from "errors/http";

export function onNoMatchHandler(req, res) {
  const responseError = new InvalidHttpMethodError(req.method);
  return res.status(responseError.statusCode).json(responseError);
}

export function onInternalServerErrorHandler(err, req, res) {
  const responseError = new InternalServerError(err, err.statusCode);
  console.info(responseError);
  return res.status(responseError.statusCode).json(responseError);
}
