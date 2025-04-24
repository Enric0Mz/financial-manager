import bcrypt from "bcryptjs";

export async function generatePasswordHash(plainPassword) {
  const rounds = getNumberOfRoundsPassword();
  const salt = await bcrypt.genSalt(rounds);
  return await bcrypt.hash(plainPassword, salt);
}

export async function comparePasswords(plainPassword, hahsedPassword) {
  return await bcrypt.compare(plainPassword, hahsedPassword);
}

export async function generateRefreshTokenHash(plainToken) {
  const rounds = getNumberOfRoundsToken(); // less rounds to ensure performance
  const salt = await bcrypt.genSalt(rounds);
  return await bcrypt.hash(plainToken, salt);
}

export async function compareRefreshTokens(plainToken, hashedToken) {
  return await bcrypt.compare(plainToken, hashedToken);
}

function getNumberOfRoundsPassword() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

function getNumberOfRoundsToken() {
  return process.env.NODE_ENV === "production" ? 8 : 1;
}
