import { test, expect } from "@playwright/test";
import { AuthTestHelper } from "./helpers/auth-helper.js";

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
    await helper.page.waitForTimeout(1100);
  };

  const login = async (email, password) => {
    await helper.clickLoginButton();
    await helper.fillLoginForm({ email, password });
    await helper.clickSubmit();
    await helper.page.waitForTimeout(1100);
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
    await helper.expectErrorMessage("Please fill in all required fields");
  });

  test("creates a new account", async () => {
    await signup({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    await helper.expectLoggedIn("Test User");
  });

  test("prevents duplicate signup", async () => {
    await signup({
      name: "User One",
      email: "duplicate@example.com",
      password: "password123",
    });

    await helper.logout();

    await helper.clickLoginButton();
    await helper.clickSignupTab();
    await helper.fillSignupForm({
      name: "User Two",
      email: "duplicate@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    await helper.clickSubmit();

    await helper.expectErrorMessage(
      "An account with this email already exists"
    );
  });

  test("rejects login with incorrect password", async () => {
    await signup({
      name: "Login User",
      email: "login@example.com",
      password: "correctpassword",
    });

    await helper.logout();
    await login("login@example.com", "wrongpassword");

    await helper.expectErrorMessage("Incorrect password");
  });

  test("logs in with valid credentials", async () => {
    await signup({
      name: "Valid User",
      email: "valid@example.com",
      password: "password123",
    });

    await helper.logout();
    await login("valid@example.com", "password123");

    await helper.expectLoggedIn("Valid User");
  });


  test("logs out and clears session", async () => {
    await signup({
      name: "Logout User",
      email: "logout@example.com",
      password: "password123",
    });

    await helper.logout();

    const authData = await helper.getAuthFromLocalStorage();
    expect(authData).toBeNull();
    expect(await helper.getLoginButtonText()).toBe("Login");
  });

  test("blocks game start when not authenticated", async () => {
    await helper.clickStartGameButton();
    await helper.expectModalVisible();
    await helper.expectErrorMessage(
      "Please login or sign up to start playing!"
    );
  });
});
