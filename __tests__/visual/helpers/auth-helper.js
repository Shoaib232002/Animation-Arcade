import { expect } from "@playwright/test";

export class AuthTestHelper {
  constructor(page) {
    this.page = page;
    this.defaultTimeout = 10000;
    this.clickDelay = 200;
    
    this.loginButton = page.locator("#loginBtn");
    this.overlay = page.locator("#loginOverlay");
    this.modal = page.locator(".modal");
    this.closeButton = page.locator("#closeModal");
    this.modalTitle = page.locator("#modal-title");
    this.loginTab = page.locator("[data-tab=\"login\"]");
    this.signupTab = page.locator("[data-tab=\"signup\"]");
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

  async clickElement(locator) {
    await locator.click({ force: true });
    await this.page.waitForTimeout(this.clickDelay);
  }

  async clickLoginButton() {
    await this.clickElement(this.loginButton);
  }

  async clickCloseButton() {
    await this.clickElement(this.closeButton);
  }

  async clickLoginTab() {
    await this.clickElement(this.loginTab);
  }

  async clickSignupTab() {
    await this.clickElement(this.signupTab);
  }

  async clickSubmit() {
    await this.clickElement(this.submitButton);
  }

  async clickStartGameButton() {
    await this.clickElement(this.startGameButton);
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
    await expect(this.overlay).toHaveCSS("display", "flex");
    await expect(this.modal).toBeVisible();
  }

  async expectModalHidden() {
    await expect(this.overlay).toHaveCSS("display", "none");
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

  async expectMessage(message) {
    await expect(this.messageDiv).toHaveText(message, { 
      timeout: this.defaultTimeout 
    });
  }

  async expectErrorMessage(message) {
    await this.expectMessage(message);
  }

  async expectSuccessMessage(message) {
    await this.expectMessage(message);
  }

  async expectInfoMessage(message) {
    await this.expectMessage(message);
  }

  async expectLoggedIn(name) {
    const timeoutConfig = { timeout: this.defaultTimeout };
    await expect(this.loginButton).toHaveText("Logout", timeoutConfig);
    await expect(this.welcomeMessage).toBeVisible(timeoutConfig);
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
    const user = await this.getAuthFromLocalStorage();
    expect(user).toBeTruthy();
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
    this.page.once("dialog", async dialog => {
      await dialog.accept();
    });
    await this.loginButton.click();
    await this.page.waitForTimeout(2100);
  }

  async signupUser({ name, email, password }) {
    await this.clickLoginButton();
    await this.clickSignupTab();
    await this.fillSignupForm({ name, email, password, confirmPassword: password });
    await this.clickSubmit();
    await this.page.waitForTimeout(1200);
  }
}