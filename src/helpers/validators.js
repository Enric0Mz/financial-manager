import { InvalidHttpMethodError, UnprocessableEntityError } from "errors/http";

export async function validateAllowedMethods(method, allowedMethods, res) {
  if (!allowedMethods.includes(method)) {
    const responseError = new InvalidHttpMethodError(method);
    return res.status(405).json(responseError);
  }
}

export function validateAndParseAmount(amount) {
  if (typeof amount != "number") {
    throw new UnprocessableEntityError(`${amount} is not a float`, "amount");
  }
  return parseFloat(amount.toFixed(2));
}
