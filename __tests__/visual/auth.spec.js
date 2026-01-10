import { test, expect } from "@playwright/test";
import { AuthTestHelper } from "./helpers/auth-helper.js";
import { MESSAGES, UI_DELAYS } from "../../js/constants.js";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envTestPath = path.resolve(__dirname, "../../.env.test");
const envExamplePath = path.resolve(__dirname, "../../.env.test.example");

if (fs.existsSync(envExamplePath)) {
  dotenv.config({ path: envExamplePath });
}

if (fs.existsSync(envTestPath)) {
  dotenv.config({ path: envTestPath, override: true });
}

const TEST_USERS = {
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

const WRONG_PASSWORD = process.env.WRONG_PASSWORD;

test.describe("Authentication", () => {
  let helper;
  const signup = async (user) => {
    await helper.clickLoginButton();
    await helper.clickSignupTab();
    await helper.fillSignupForm({
      ...user,
      confirmPassword: user.password,
    });
    await helper.clickSubmit();
    await helper.page.waitForTimeout(UI_DELAYS.SIGNUP_COMPLETE);
  };
  const login = async (email, password) => {
    await helper.clickLoginButton();
    await helper.fillLoginForm({ email, password });
    await helper.clickSubmit();
    await helper.page.waitForTimeout(UI_DELAYS.LOGIN_COMPLETE);
  };
  test.beforeEach(async ({ page }) => {
    helper = new AuthTestHelper(page);
    await helper.clearStorage();
    await helper.goto();
  });
  test("opens login modal", async () => {
    await helper.clickLoginButton();
    await helper.expectModalVisible();
    await helper.expectModalTitle("Login");
  });
  test("switches to signup tab", async () => {
    await helper.clickLoginButton();
    await helper.clickSignupTab();
    await helper.expectModalTitle("Sign Up");
    await helper.expectNameFieldVisible();
    await helper.expectConfirmPasswordVisible();
  });
  test("shows signup error for empty fields", async () => {
    await helper.clickLoginButton();
    await helper.clickSignupTab();
    await helper.clickSubmit();
    await helper.expectErrorMessage(MESSAGES.FILL_REQUIRED);
  });
  test("creates a new account", async () => {
    await signup(TEST_USERS.PRIMARY);
    await helper.expectLoggedIn(TEST_USERS.PRIMARY.name);
  });
  test("prevents duplicate signup", async () => {
    await signup(TEST_USERS.DUPLICATE);
    await helper.logout();
    await helper.clickLoginButton();
    await helper.clickSignupTab();
    await helper.fillSignupForm({
      ...TEST_USERS.DUPLICATE_ATTEMPT,
      confirmPassword: TEST_USERS.DUPLICATE_ATTEMPT.password,
    });
    await helper.clickSubmit();
    await helper.expectErrorMessage(MESSAGES.DUPLICATE_EMAIL);
  });
  test("rejects login with incorrect password", async () => {
    await signup(TEST_USERS.LOGIN);
    await helper.logout();
    await login(TEST_USERS.LOGIN.email, WRONG_PASSWORD);
    await helper.expectErrorMessage(MESSAGES.INCORRECT_PASSWORD);
  });
  test("logs in with valid credentials", async () => {
    await signup(TEST_USERS.VALID);
    await helper.logout();
    await login(TEST_USERS.VALID.email, TEST_USERS.VALID.password);
    await helper.expectLoggedIn(TEST_USERS.VALID.name);
  });
  test("logs out and clears session", async () => {
    await signup(TEST_USERS.LOGOUT);
    await helper.logout();
    const authData = await helper.getAuthFromLocalStorage();
    expect(authData).toBeNull();
    expect(await helper.getLoginButtonText()).toBe("Login");
  });
  test("blocks game start when not authenticated", async () => {
    await helper.clickStartGameButton();
    await helper.expectModalVisible();
    await helper.expectErrorMessage(MESSAGES.LOGIN_REQUIRED);
  });
});
