import { test, expect } from "@playwright/test";

test.describe("Game UI Visual Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/game.html");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should render header with logo and buttons", async ({ page }) => {
    const header = page.locator(".top-bar");
    await expect(header).toBeVisible();

    const logo = page.locator(".logo");
    await expect(logo).toContainText("Animation Arcade");

    const homeBtn = page.locator(".home-btn");
    await expect(homeBtn).toBeVisible();

    const themeToggle = page.locator("#themeToggle");
    await expect(themeToggle).toBeVisible();
  });

  test("should render main layout with left and right sections", async ({
    page,
  }) => {
    const mainLayout = page.locator(".main-layout");
    await expect(mainLayout).toBeVisible();

    const leftSection = page.locator(".left-section");
    await expect(leftSection).toBeVisible();

    const rightSection = page.locator(".right-section");
    await expect(rightSection).toBeVisible();
  });

  test("should render editor container with input", async ({ page }) => {
    const editorContainer = page.locator(".editor-container");
    await expect(editorContainer).toBeVisible();

    const editor = page.locator(".editor");
    await expect(editor).toBeVisible();

    const lineNumbers = page.locator(".line-numbers");
    await expect(lineNumbers).toBeVisible();

    const textarea = page.locator(".editor-input");
    await expect(textarea).toBeVisible();
  });

  test("should render editor footer with level and submit button", async ({
    page,
  }) => {
    const footer = page.locator(".editor-footer");
    await expect(footer).toBeVisible();

    const levelText = page.locator(".editor-footer .level-text");
    await expect(levelText).toContainText("Level:");

    const submitBtn = page.locator(".editor-footer .submit-btn");
    await expect(submitBtn).toContainText("Submit");
  });

  test("should render hints section", async ({ page }) => {
    const hints = page.locator(".hints");
    await expect(hints).toBeVisible();

    const hintsTitle = page.locator(".hints h3");
    await expect(hintsTitle).toContainText("Hints:");
  });

  test("should render levels bar with navigation arrows", async ({ page }) => {
    const levelsBar = page.locator(".levels-bar");
    await expect(levelsBar).toBeVisible();

    const levelsText = page.locator(".levels-bar .level-text");
    await expect(levelsText).toContainText("Levels");

    const arrows = page.locator(".arrows");
    expect(await arrows.count()).toBe(2); 
  });

  test("should render output box for animation preview", async ({ page }) => {
    const outputBox = page.locator(".output-box");
    await expect(outputBox).toBeVisible();
  });

  test("should toggle between light and dark theme", async ({ page }) => {
    const body = page.locator("body");
    let hasDarkClass = await body.evaluate((el) =>
      el.classList.contains("dark-theme")
    );
    expect(hasDarkClass).toBe(false);
    const themeToggle = page.locator("#themeToggle");
    await themeToggle.click();
    await page.waitForTimeout(300);

    hasDarkClass = await body.evaluate((el) =>
      el.classList.contains("dark-theme")
    );
    expect(hasDarkClass).toBe(true);

    await themeToggle.click();
    await page.waitForTimeout(300);

    hasDarkClass = await body.evaluate((el) =>
      el.classList.contains("dark-theme")
    );
    expect(hasDarkClass).toBe(false);
  });
});