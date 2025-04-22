import bcrypt from "bcryptjs";

export async function generatePasswordHash(plainPassword) {
  const rounds = 10;
  const salt = await bcrypt.genSalt(rounds);
  return await bcrypt.hash(plainPassword, salt);
}

export async function comparePasswords(plainPassword, hahsedPassword) {
  return await bcrypt.compare(plainPassword, hahsedPassword);
}

export async function generateRefreshTokenHash(plainToken) {
  const rounds = 6; // less rounds to ensure performance
  const salt = await bcrypt.genSalt(rounds);
  return await bcrypt.hash(plainToken, salt);
}

export async function compareRefreshTokens(plainToken, hashedToken) {
  return await bcrypt.compare(plainToken, hashedToken);
}
