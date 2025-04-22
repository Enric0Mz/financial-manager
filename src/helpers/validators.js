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

export const passwordRules = [
  {
    test: (pwd) => pwd.length >= 6,
    message: "Password must be at least 6 characters long",
  },
  {
    test: (pwd) => /[A-Z]/.test(pwd),
    message: "Password must contain at least one uppercase letter",
  },
  {
    test: (pwd) => /[a-z]/.test(pwd),
    message: "Password must contain at least one lowercase letter",
  },
  {
    test: (pwd) => /\d/.test(pwd),
    message: "Password must contain at least one number",
  },
  {
    test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    message: "Password must contain at least one special character",
  },
];
