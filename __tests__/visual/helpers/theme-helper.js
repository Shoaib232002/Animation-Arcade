import { expect } from "@playwright/test";
import { DARK_THEME, LIGHT_THEME } from "../../../js/constants.js";

export class ThemeTestHelper {
  constructor(page) {
    this.page = page;
    this.themeToggle = page.locator("#themeToggle");
    this.themeIcon = page.locator("#themeToggle img");
  }

  async goto() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  async clearLocalStorage() {
    await this.page.addInitScript(() => {
      localStorage.clear();
    });
  }

  async getThemeFromLocalStorage() {
    return await this.page.evaluate(() => localStorage.getItem("theme"));
  }

  async setThemeInLocalStorage(theme) {
    await this.page.evaluate((t) => localStorage.setItem("theme", t), theme);
  }

  async waitForTheme(theme) {
    const isDark = theme === DARK_THEME;

    await this.page.waitForFunction(
      (expectedDark) => {
        return (
          document.body.classList.contains("dark-theme") === expectedDark
        );
      },
      isDark
    );
  }

  async getIconSrc() {
    return await this.themeIcon.getAttribute("src");
  }

  async clickToggle() {
    await this.themeToggle.click();
    await this.page.waitForTimeout(100);
  }

  async expectThemeState(theme) {
    const isDark = theme === DARK_THEME;
    const expectedIcon = isDark ? "lightmode.png" : "darkmode.jpeg";

    // ✅ wait until theme is actually applied
    await this.waitForTheme(theme);

    const hasDarkClass = await this.page.locator("body").evaluate(
      (el) => el.classList.contains("dark-theme")
    );
    expect(hasDarkClass).toBe(isDark);

    const storedTheme = await this.getThemeFromLocalStorage();
    expect(storedTheme).toBe(theme);

    const iconSrc = await this.getIconSrc();
    expect(iconSrc).toContain(expectedIcon);
  }

  async getCurrentTheme() {
    return await this.page.evaluate(() => {
      return window.ThemeManager?.getCurrentTheme?.();
    });
  }

  async takeSnapshot(name) {
    await expect(this.page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
    });
  }
}

export const THEMES = {
  DARK: DARK_THEME,
  LIGHT: LIGHT_THEME,
};
