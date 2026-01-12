import { test, expect } from "@playwright/test";

const gotoGame = async (page) =>
  page.goto("/game.html", { waitUntil: "networkidle" });

const expectVisible = async (page, selector, text) => {
  const el = page.locator(selector);
  await expect(el).toBeVisible();
  if (text) await expect(el).toContainText(text);
};

test.describe("Game UI Tests", () => {
  test.beforeEach(async ({ page }) => {
    await gotoGame(page);
  });

  test("renders header", async ({ page }) => {
    await expectVisible(page, ".top-bar");
    await expectVisible(page, ".logo", "Animation Arcade");
    await expectVisible(page, ".home-btn", "Home");
    await expectVisible(page, "#themeToggle");
  });

  test("renders main layout", async ({ page }) => {
    for (const sel of [".main-layout", ".left-section", ".right-section"]) {
      await expectVisible(page, sel);
    }
  });

  test("renders editor container", async ({ page }) => {
    for (const sel of [
      ".editor-container",
      ".description-box",
      ".code-editor",
      "#lineNumbers",
      "#codeContent",
    ]) {
      await expectVisible(page, sel);
    }
  });

  test("renders editor footer", async ({ page }) => {
    await expectVisible(page, ".editor-footer");
    await expectVisible(page, ".editor-footer .submit-btn", "Next");
    await expect(page.locator("#currentLevel")).toHaveText(/\d+/);
  });

  test("renders hints section", async ({ page }) => {
    await expectVisible(page, ".hints");
    await expectVisible(page, ".hints h3", "Hints:");
    await expectVisible(page, "#hintsList");
  });
});
