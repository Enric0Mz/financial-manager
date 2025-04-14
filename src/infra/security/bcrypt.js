import bcrypt from "bcryptjs";

export async function generatePasswordHash(plainPassword) {
  const rounds = 10;
  const salt = await bcrypt.genSalt(rounds);
  return await bcrypt.hash(plainPassword, salt);
}

export async function comparePasswords(plainPassword, hahsedPassword) {
  return await bcrypt.compare(plainPassword, hahsedPassword);
}
