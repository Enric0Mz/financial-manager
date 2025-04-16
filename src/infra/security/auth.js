/*eslint no-undef: 0*/

import jwt from "jsonwebtoken";

export async function generateJwtAccessToken(userPayload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      userPayload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve({ accessToken: token });
        }
      },
    );
  });
}

export async function generateJwtRefreshToken(userPayload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      userPayload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve({ refreshToken: token });
        }
      },
    );
  });
}

export async function verifyJwtAccessToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve({ user });
      }
    });
  });
}

export async function verifyJwtRefreshToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve({ user });
      }
    });
  });
}
