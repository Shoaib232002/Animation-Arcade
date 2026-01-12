import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envTestPath = path.resolve(__dirname, "../../../.env.test");
const envExamplePath = path.resolve(__dirname, "../../../.env.test.example");

if (fs.existsSync(envExamplePath)) {
  dotenv.config({ path: envExamplePath });
}

if (fs.existsSync(envTestPath)) {
  dotenv.config({ path: envTestPath, override: true });
}

export const TEST_USERS = {
  PRIMARY: {
    name: process.env.TEST_USER_PRIMARY_NAME,
    email: process.env.TEST_USER_PRIMARY_EMAIL,
    password: process.env.TEST_USER_PRIMARY_PASSWORD,
  },
  DUPLICATE: {
    name: process.env.TEST_USER_DUPLICATE_NAME,
    email: process.env.TEST_USER_DUPLICATE_EMAIL,
    password: process.env.TEST_USER_DUPLICATE_PASSWORD,
  },
  DUPLICATE_ATTEMPT: {
    name: "Duplicate Attempt",
    email: process.env.TEST_USER_DUPLICATE_EMAIL,
    password: "DifferentPassword@123",
  },
  LOGIN: {
    name: process.env.TEST_USER_LOGIN_NAME,
    email: process.env.TEST_USER_LOGIN_EMAIL,
    password: process.env.TEST_USER_LOGIN_PASSWORD,
  },
  VALID: {
    name: process.env.TEST_USER_VALID_NAME,
    email: process.env.TEST_USER_VALID_EMAIL,
    password: process.env.TEST_USER_VALID_PASSWORD,
  },
  LOGOUT: {
    name: process.env.TEST_USER_LOGOUT_NAME,
    email: process.env.TEST_USER_LOGOUT_EMAIL,
    password: process.env.TEST_USER_LOGOUT_PASSWORD,
  },
};
export const WRONG_PASSWORD = process.env.WRONG_PASSWORD;
