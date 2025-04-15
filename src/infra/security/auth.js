import jwt from "jsonwebtoken";

export async function generateJwtAccessToken(userPayload) {
  return new Promise((resolve, reject) => {
    jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve({ accessToken: token });
      }
    });
  });
}
