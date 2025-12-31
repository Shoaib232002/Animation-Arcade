import { test, expect } from "@playwright/test";
import { ThemeTestHelper, THEMES } from "./helpers/theme-helper.js";

test.describe("ThemeManager Visual Tests", () => {
  let helper;

  test.beforeEach(async ({ page }) => {
    helper = new ThemeTestHelper(page);
    await helper.clearLocalStorage();
    await helper.goto();
  });

  test.describe("Initialization", () => {
    test("should initialize with light theme by default", async () => {
      await helper.expectThemeState(THEMES.LIGHT);
    });

    test("should load dark theme from localStorage on init", async ({ page }) => {
      await helper.setThemeInLocalStorage(THEMES.DARK);
      await page.reload();
      await page.waitForLoadState("networkidle");
      await helper.expectThemeState(THEMES.DARK);
    });
  });

  test.describe("Theme Application", () => {
    const testThemeApplication = async (targetTheme) => {
      await helper.page.evaluate((theme) => {
        window.ThemeManager.applyTheme(theme);
      }, targetTheme);
      await helper.expectThemeState(targetTheme);
    };

    test("should apply dark theme correctly", async () => {
      await testThemeApplication(THEMES.DARK);
    });

    test("should apply light theme correctly", async () => {
      await testThemeApplication(THEMES.LIGHT);
    });
  });

  test.describe("Theme Toggle", () => {
    const testToggleFromTheme = async (initialTheme, expectedTheme) => {
      if (initialTheme === THEMES.DARK) {
        await helper.setThemeInLocalStorage(THEMES.DARK);
        await helper.page.reload();
        await helper.page.waitForLoadState("networkidle");
      }
      
      await helper.clickToggle();
      await helper.expectThemeState(expectedTheme);
    };

    test("should toggle from light to dark", async () => {
      await testToggleFromTheme(THEMES.LIGHT, THEMES.DARK);
    });

    test("should toggle from dark to light", async () => {
      await testToggleFromTheme(THEMES.DARK, THEMES.LIGHT);
    });
  });

  test.describe("Theme Getter", () => {
    test("should return correct current theme", async () => {
      let currentTheme = await helper.getCurrentTheme();
      expect(currentTheme).toBe(THEMES.LIGHT);

      await helper.page.evaluate((theme) => {
        window.ThemeManager.applyTheme(theme);
      }, THEMES.DARK);

      currentTheme = await helper.getCurrentTheme();
      expect(currentTheme).toBe(THEMES.DARK);
    });
  });

  test.describe("Edge Cases", () => {
    test("should handle multiple rapid toggles", async () => {
      for (let i = 0; i < 5; i++) {
        await helper.clickToggle();
      }
      await helper.expectThemeState(THEMES.DARK);
    });

    test("should handle missing theme icon gracefully", async () => {
      await helper.page.evaluate(() => {
        const toggle = document.getElementById("themeToggle");
        if (toggle) toggle.innerHTML = "";
      });

      await expect(async () => {
        await helper.page.evaluate((theme) => {
          window.ThemeManager.updateIcon(theme);
        }, THEMES.DARK);
      }).not.toThrow();
    });
  });

  test.describe("Visual Regression", () => {
    test("should match light theme snapshot", async () => {
      await helper.takeSnapshot("theme-light");
    });

    test("should match dark theme snapshot", async () => {
      await helper.clickToggle();
      await helper.takeSnapshot("theme-dark");
    });
  });
});