import { test, expect } from "@playwright/test";
import {TOTAL_LEVELS} from "../../js/constants";

const gotoGame = async (page) =>
  page.goto("/game.html", { waitUntil: "networkidle" });

const openLevelsOverlay = async (page) => {
  await page.locator("#levelTextTrigger").click();
  await expect(page.locator("#levelsOverlay")).toHaveClass(/active/);
};

const closeOverlayAndWait = async (page) => {
  await expect(page.locator("#levelsOverlay")).not.toHaveClass(/active/);
};

const expectVisible = async (page, selector, text) => {
  const el = page.locator(selector);
  await expect(el).toBeVisible();
  if (text) await expect(el).toContainText(text);
};

const getCssValue = async (locator, prop) =>
  locator.evaluate((el, prop) => getComputedStyle(el)[prop], prop);

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

  test("renders levels bar", async ({ page }) => {
    await expectVisible(page, ".levels-bar");
    await expect(page.locator(".levels-bar .arrows")).toHaveCount(2);
    await expectVisible(page, "#levelTextTrigger", "Level");
    await expect(page.locator("#currentLevel")).toHaveText("1");
    await expect(page.locator("#totalLevels")).toHaveText(String(TOTAL_LEVELS));
  });

  test("opens and closes levels overlay", async ({ page }) => {
    await openLevelsOverlay(page);
    await page.locator("#closeModal").click();
    await closeOverlayAndWait(page);
  });

  test("overlay closes via background and ESC", async ({ page }) => {
    await openLevelsOverlay(page);
    await page.locator("#levelsOverlay").click({ position: { x: 10, y: 10 } });
    await closeOverlayAndWait(page);

    await openLevelsOverlay(page);
    await page.keyboard.press("Escape");
    await closeOverlayAndWait(page);
  });

  test("renders correct number of level circles", async ({ page }) => {
    await openLevelsOverlay(page);
    const circles = page.locator(".level-circle");

    await expect(circles).toHaveCount(TOTAL_LEVELS);

    for (let i = 0; i < TOTAL_LEVELS; i++) {
      await expect(circles.nth(i)).toContainText(String(i + 1));
    }
  });

  test("highlights current level circle", async ({ page }) => {
    await openLevelsOverlay(page);
    await expect(page.locator(".level-circle.current")).toContainText("1");

    await page.locator(".level-circle").nth(4).click();
    await openLevelsOverlay(page);
    await expect(page.locator(".level-circle.current")).toContainText("5");
  });

  test("navigates to new level", async ({ page }) => {
    await openLevelsOverlay(page);
    await page.locator(".level-circle").nth(2).click();
    await expect(page.locator("#currentLevel")).toHaveText("3");
    await expect(page.locator("#levelsOverlay")).not.toHaveClass(/active/);
  });

  test("level circles have pointer cursor", async ({ page }) => {
    await openLevelsOverlay(page);
    const circle = page.locator(".level-circle").first();
    expect(await getCssValue(circle, "cursor")).toBe("pointer");
  });

  test("toggles between light and dark theme", async ({ page }) => {
    const body = page.locator("body");

    await expect(body).not.toHaveClass(/dark-theme/);
    await page.locator("#themeToggle").click();
    await expect(body).toHaveClass(/dark-theme/);

    await page.locator("#themeToggle").click();
    await expect(body).not.toHaveClass(/dark-theme/);
  });

  test("level circles scale on hover", async ({ page }) => {
    await openLevelsOverlay(page);
    const circle = page.locator(".level-circle").first();

    const before = await getCssValue(circle, "transform");
    await circle.hover();
    const after = await getCssValue(circle, "transform");

    expect(before).not.toBe(after);
  });

  test("overlay modal structure", async ({ page }) => {
    await openLevelsOverlay(page);

    for (const [sel, text] of [
      [".levels-modal"],
      [".levels-modal-header"],
      [".levels-modal-header h2", "Select Level"],
      [".close-modal", "×"],
      [".levels-grid"],
    ]) {
      await expectVisible(page, sel, text);
    }
  });
});
