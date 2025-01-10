import { InvalidHttpMethodError } from "errors/http";

export async function validateAllowedMethods(method, allowedMethods, res) {
  if (!allowedMethods.includes(method)) {
    const responseError = new InvalidHttpMethodError(method);
    return res.status(405).json(responseError);
  }
}
