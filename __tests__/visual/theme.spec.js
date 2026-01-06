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
      await helper.clickToggle();
      await helper.expectThemeState(expectedTheme);
    };

    test("should toggle from light to dark", async () => {
      await testToggleFromTheme(THEMES.LIGHT, THEMES.DARK);
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
      const toggleCount = 5;
      for (let i = 0; i < toggleCount; i++) {
        await helper.clickToggle();
      }
      const expected =
        toggleCount % 2 === 1 ? THEMES.DARK : THEMES.LIGHT;
      await helper.expectThemeState(expected);
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
});