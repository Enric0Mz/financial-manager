/*eslint no-undef: 0*/

import { UnauthorizedError } from "errors/http";
import jwt from "jsonwebtoken";

export async function generateJwtAccessToken(userPayload) {
  return new Promise((resolve, reject) => {
    const expiresIn = 15 * 60; // 15m;
    jwt.sign(
      userPayload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve({ accessToken: token, expiresIn });
        }
      },
    );
  });
}

export async function generateJwtRefreshToken(userPayload) {
  return new Promise((resolve, reject) => {
    const expiresIn = 1000 * 60 * 60 * 24; // 1d
    jwt.sign(
      userPayload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve({ refreshToken: token, expiresIn });
        }
      },
    );
  });
}

export async function verifyJwtAccessToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        reject(new UnauthorizedError("Invalid or expired access token"));
      } else {
        resolve(payload);
      }
    });
  });
}

export async function verifyJwtRefreshToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        reject(new UnauthorizedError("Invalid or expired refresh token"));
      } else {
        resolve(user);
      }
    });
  });
}
