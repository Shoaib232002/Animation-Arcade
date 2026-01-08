import { expect } from "@playwright/test";
import { UI_DELAYS } from "../../../js/constants.js";

const TIMEOUTS = {
  SHORT: 200,
  LONG: 10000,
  LOGOUT: 2100,
};

const DISPLAY_STATES = {
  FLEX: "flex",
  NONE: "none",
  BLOCK: "block",
};

export class AuthTestHelper {
  constructor(page) {
    this.page = page;
    this.loginButton = page.locator("#loginBtn");
    this.overlay = page.locator("#loginOverlay");
    this.modal = page.locator(".modal");
    this.closeButton = page.locator("#closeModal");
    this.modalTitle = page.locator("#modal-title");
    this.loginTab = page.locator('[data-tab="login"]');
    this.signupTab = page.locator('[data-tab="signup"]');
    this.nameField = page.locator("#name");
    this.emailField = page.locator("#email");
    this.passwordField = page.locator("#password");
    this.confirmPasswordField = page.locator("#confirmPassword");
    this.submitButton = page.locator("#submitBtn");
    this.messageDiv = page.locator("#authMessage");
    this.footerText = page.locator("#authFooterText");
    this.startGameButton = page.locator("#startGameBtn");
    this.welcomeMessage = page.locator(".welcome-message");
  }

  async goto() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  async clearStorage() {
    await this.page.addInitScript(() => {
      localStorage.clear();
    });
  }

  async clickLoginButton() {
    await this.loginButton.click({ force: true });
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
  }

  async clickCloseButton() {
    await this.closeButton.click();
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
  }

  async clickLoginTab() {
    await this.loginTab.click();
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
  }

  async clickSignupTab() {
    await this.signupTab.click();
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
  }

  async clickSubmit() {
    await this.submitButton.click();
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
  }

  async clickStartGameButton() {
    await this.startGameButton.click();
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
  }

  async fillLoginForm({ email, password }) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
  }

  async fillSignupForm({ name, email, password, confirmPassword }) {
    if (name !== undefined) {
      await this.nameField.fill(name);
    }
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.confirmPasswordField.fill(confirmPassword);
  }

  async expectModalVisible() {
    await expect(this.overlay).toHaveCSS("display", DISPLAY_STATES.FLEX);
    await expect(this.modal).toBeVisible();
  }

  async expectModalHidden() {
    await expect(this.overlay).toHaveCSS("display", DISPLAY_STATES.NONE);
  }

  async expectModalTitle(title) {
    await expect(this.modalTitle).toHaveText(title);
  }

  async expectNameFieldVisible() {
    await expect(this.nameField).toBeVisible();
  }

  async expectConfirmPasswordVisible() {
    await expect(this.confirmPasswordField).toBeVisible();
  }

  async expectFooterText(text) {
    await expect(this.footerText).toHaveText(text);
  }

  async expectErrorMessage(message) {
    await expect(this.messageDiv).toHaveText(message, {
      timeout: TIMEOUTS.LONG,
    });
  }

  async expectSuccessMessage(message) {
    await expect(this.messageDiv).toHaveText(message, {
      timeout: TIMEOUTS.LONG,
    });
  }

  async expectInfoMessage(message) {
    await expect(this.messageDiv).toHaveText(message, {
      timeout: TIMEOUTS.LONG,
    });
  }

  async expectLoggedIn(name) {
    await expect(this.loginButton).toHaveText("Logout", {
      timeout: TIMEOUTS.LONG,
    });
    await expect(this.welcomeMessage).toBeVisible({ timeout: TIMEOUTS.LONG });
    await expect(this.welcomeMessage).toContainText(`Welcome back, ${name}!`);
  }

  async expectWelcomeMessageVisible() {
    await expect(this.welcomeMessage).toBeVisible();
  }

  async expectWelcomeMessageHidden() {
    const count = await this.welcomeMessage.count();
    expect(count).toBe(0);
  }

  async expectUserInLocalStorage(name, email) {
    const authData = await this.page.evaluate(() => {
      return localStorage.getItem("animation_arcade_auth");
    });

    expect(authData).toBeTruthy();

    const user = JSON.parse(authData);
    expect(user.name).toBe(name);
    expect(user.email).toBe(email);
    expect(user.id).toBeTruthy();
  }

  async getAuthFromLocalStorage() {
    const authData = await this.page.evaluate(() => {
      return localStorage.getItem("animation_arcade_auth");
    });

    return authData ? JSON.parse(authData) : null;
  }

  async getLoginButtonText() {
    return await this.loginButton.textContent();
  }

  async logout() {
    this.page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    await this.loginButton.click();
    await this.page.waitForTimeout(TIMEOUTS.LOGOUT);
  }

  async signupUser({ name, email, password }) {
    await this.clickLoginButton();
    await this.clickSignupTab();

    await this.fillSignupForm({
      name,
      email,
      password,
      confirmPassword: password,
    });

    await this.clickSubmit();
    await this.page.waitForTimeout(UI_DELAYS.SIGNUP_COMPLETE);
  }
}
