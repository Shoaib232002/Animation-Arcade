import { test, expect } from "@playwright/test";
import { AuthTestHelper } from "./helpers/auth-helper.js";
import {
  TEST_USERS,
  WRONG_PASSWORD,
} from "../visual/config/test-user.config.js";
import { MESSAGES, UI_DELAYS } from "../../js/constants.js";

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
