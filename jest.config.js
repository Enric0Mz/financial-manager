const nextJest = require("next/jest");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

const env = dotenv.config({
  path: ".env.development",
});

dotenvExpand.expand(env);

const createJestConfig = nextJest();

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>/src"],
});

module.exports = jestConfig;
