import { test, expect } from "@playwright/test";

test.describe("Game UI Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/game.html", { waitUntil: "networkidle" });
  });

  const openLevelsOverlay = async (page) => {
    await page.locator("#levelTextTrigger").click();
  };

  const verifyElementVisible = async (page, selector, text = null) => {
    const locator = page.locator(selector);
    await expect(locator).toBeVisible();
    if (text) {
      await expect(locator).toContainText(text);
    }
  };

  test("renders header with logo and actions", async ({ page }) => {
    await verifyElementVisible(page, ".top-bar");
    await verifyElementVisible(page, ".logo", "Animation Arcade");
    await verifyElementVisible(page, ".home-btn", "Home");
    await verifyElementVisible(page, "#themeToggle");
  });

  test("renders main layout with left and right sections", async ({ page }) => {
    await verifyElementVisible(page, ".main-layout");
    await verifyElementVisible(page, ".left-section");
    await verifyElementVisible(page, ".right-section");
  });

  test("renders editor container with description and code editor", async ({
    page,
  }) => {
    await verifyElementVisible(page, ".editor-container");
    await verifyElementVisible(page, ".description-box");
    await verifyElementVisible(page, ".code-editor");
    await verifyElementVisible(page, "#lineNumbers");
    await verifyElementVisible(page, "#codeContent");
  });

  test("renders editor footer with Next button and level display", async ({
    page,
  }) => {
    await verifyElementVisible(page, ".editor-footer");
    await verifyElementVisible(page, ".editor-footer .submit-btn", "Next");
    await expect(page.locator("#currentLevel")).toHaveText(/\d+/);
  });

  test("renders hints section with title", async ({ page }) => {
    await verifyElementVisible(page, ".hints");
    await verifyElementVisible(page, ".hints h3", "Hints:");
    await verifyElementVisible(page, "#hintsList");
  });

  test("renders levels bar with arrow buttons and level trigger", async ({
    page,
  }) => {
    await verifyElementVisible(page, ".levels-bar");
    await expect(page.locator(".levels-bar .arrows")).toHaveCount(2);
    await verifyElementVisible(page, "#levelTextTrigger", "Level");
    await expect(page.locator("#currentLevel")).toHaveText("1");
    await expect(page.locator("#totalLevels")).toHaveText("10");
  });

  test("renders output box for animation preview", async ({ page }) => {
    await verifyElementVisible(page, ".output-box");
  });

  test("opens levels overlay when level text is clicked", async ({ page }) => {
    await openLevelsOverlay(page);
    await expect(page.locator("#levelsOverlay")).toHaveClass(/active/);
    await verifyElementVisible(page, ".levels-modal");
    await verifyElementVisible(page, ".levels-modal-header h2", "Select Level");
  });

  test("closes levels overlay on close button click", async ({ page }) => {
    await openLevelsOverlay(page);
    await expect(page.locator("#levelsOverlay")).toHaveClass(/active/);
    await page.locator("#closeModal").click();
    await expect(page.locator("#levelsOverlay")).not.toHaveClass(/active/);
  });

  test("closes levels overlay on background click", async ({ page }) => {
    await openLevelsOverlay(page);
    const overlay = page.locator("#levelsOverlay");
    await expect(overlay).toHaveClass(/active/);
    await overlay.click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(100);
    await expect(overlay).not.toHaveClass(/active/);
  });

  test("closes levels overlay on ESC key press", async ({ page }) => {
    await openLevelsOverlay(page);
    await expect(page.locator("#levelsOverlay")).toHaveClass(/active/);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);
    await expect(page.locator("#levelsOverlay")).not.toHaveClass(/active/);
  });

  test("displays correct number of level circles (10 levels)", async ({
    page,
  }) => {
    await openLevelsOverlay(page);
    const levelCircles = page.locator(".level-circle");
    await expect(levelCircles).toHaveCount(10);

    for (let i = 1; i <= 10; i++) {
      await expect(levelCircles.nth(i - 1)).toContainText(String(i));
    }
  });

  test("highlights current level circle", async ({ page }) => {
    await openLevelsOverlay(page);
    const currentCircle = page.locator(".level-circle.current");
    await expect(currentCircle).toBeVisible();
    await expect(currentCircle).toContainText("1");

    await page.locator(".level-circle").nth(4).click();
    await openLevelsOverlay(page);
    await expect(page.locator(".level-circle.current")).toContainText("5");
  });

  test("navigates to new level when level circle is clicked", async ({
    page,
  }) => {
    await openLevelsOverlay(page);
    await page.locator(".level-circle").nth(2).click();
    await expect(page.locator("#currentLevel")).toHaveText("3");
    await expect(page.locator("#levelsOverlay")).not.toHaveClass(/active/);
  });

  test("level circles have pointer cursor", async ({ page }) => {
    await openLevelsOverlay(page);
    const firstCircle = page.locator(".level-circle").first();
    const cursor = await firstCircle.evaluate((el) =>
      window.getComputedStyle(el).cursor
    );
    expect(cursor).toBe("pointer");
  });

  test("toggles between light and dark theme", async ({ page }) => {
    const body = page.locator("body");
    await expect(body).not.toHaveClass(/dark-theme/);

    await page.locator("#themeToggle").click();
    await page.waitForTimeout(350);
    await expect(body).toHaveClass(/dark-theme/);

    await page.locator("#themeToggle").click();
    await page.waitForTimeout(350);
    await expect(body).not.toHaveClass(/dark-theme/);
  });

  test("level circles are interactive and scale on hover", async ({
    page,
  }) => {
    await openLevelsOverlay(page);
    const firstCircle = page.locator(".level-circle").first();

    const initialTransform = await firstCircle.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    await firstCircle.hover();
    await page.waitForTimeout(100);

    const hoverTransform = await firstCircle.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    expect(initialTransform).not.toBe(hoverTransform);
  });

  test("overlay modal has proper structure", async ({ page }) => {
    await openLevelsOverlay(page);
    await verifyElementVisible(page, ".levels-modal");
    await verifyElementVisible(page, ".levels-modal-header");
    await verifyElementVisible(page, ".levels-modal-header h2", "Select Level");
    await verifyElementVisible(page, ".close-modal", "×");
    await verifyElementVisible(page, ".levels-grid");
  });
});