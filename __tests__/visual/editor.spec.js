import { test, expect } from "@playwright/test";

const CONFIG = {
  url: "http://localhost:3000/game.html",
  timeouts: {
    short: 50,
    medium: 100,
    long: 200,
    page: 30000,
  },
  levels: {
    first: "1",
    total: 15,
    increment: 1,
    decrement: -1,
  },
  states: {
    correct: "correct",
    error: "error",
  },
  testValues: {
    transform: "translateX(200px)",
    wrongAnswer: "wrong answer",
  },
  keyboard: {
    ctrlEnter: "Control+Enter",
  },
};

const selectors = {
  description: ".game-description",
  codeContent: "#codeContent",
  currentLevel: "#currentLevel",
  totalLevels: "#totalLevels",
  submitBtn: ".submit-btn",
  nextArrow: "#nextArrow",
  prevArrow: "#prevArrow",
  blankInput: ".blank-input",
  ball: ".ball",
  ground: ".ground",
  codeLine: ".code-line",
};

const waitForPageLoad = async (page) => {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector(selectors.blankInput, {
    state: "visible",
    timeout: CONFIG.timeouts.page,
  });
  await page.waitForTimeout(CONFIG.timeouts.long);
};

const getInput = async (page, index = 0) => {
  const inputs = await page.locator(selectors.blankInput).all();
  return inputs[index];
};

const fillInput = async (page, value, index = 0) => {
  const input = await getInput(page, index);
  await input.fill(value);
};

const getInputClass = async (page, index = 0) => {
  const input = await getInput(page, index);
  return await input.getAttribute("class");
};

const navigateLevel = async (page, direction) => {
  const arrow = direction > 0 ? selectors.nextArrow : selectors.prevArrow;
  await page.click(arrow);
  await page.waitForTimeout(CONFIG.timeouts.medium);
};

const assertVisibility = async (page, selector) => {
  await expect(page.locator(selector)).toBeVisible();
};

const getCurrentLevel = async (page) => {
  return await page.locator(selectors.currentLevel).textContent();
};

test.describe("GameEditor Core Functionality", () => {
  test("should initialize game with default state", async ({ page }) => {
    await page.goto(CONFIG.url);
    await waitForPageLoad(page);

    await assertVisibility(page, selectors.description);
    await assertVisibility(page, selectors.codeContent);
    await assertVisibility(page, selectors.submitBtn);
    await assertVisibility(page, selectors.ball);
    await assertVisibility(page, selectors.ground);
    await assertVisibility(page, selectors.blankInput);

    const currentLevel = await getCurrentLevel(page);
    expect(currentLevel).toBe(CONFIG.levels.first);

    const totalLevels = await page.locator(selectors.totalLevels).textContent();
    expect(totalLevels).toBe(String(CONFIG.levels.total));
  });

  test("should navigate between levels correctly", async ({ page }) => {
    await page.goto(CONFIG.url);
    await waitForPageLoad(page);

    const initialLevel = await getCurrentLevel(page);
    await navigateLevel(page, CONFIG.levels.increment);

    const nextLevel = await getCurrentLevel(page);
    expect(parseInt(nextLevel)).toBe(
      parseInt(initialLevel) + CONFIG.levels.increment
    );

    await navigateLevel(page, CONFIG.levels.decrement);
    const previousLevel = await getCurrentLevel(page);
    expect(previousLevel).toBe(initialLevel);
  });

  test("should handle user input and validation", async ({ page }) => {
    await page.goto(CONFIG.url);
    await waitForPageLoad(page);

    await fillInput(page, CONFIG.testValues.transform);
    const input = await getInput(page);
    const inputValue = await input.inputValue();
    expect(inputValue).toBe(CONFIG.testValues.transform);

    await page.keyboard.press(CONFIG.keyboard.ctrlEnter);
    await page.waitForTimeout(CONFIG.timeouts.medium);

    const className = await getInputClass(page);
    const hasStateClass =
      className.includes(CONFIG.states.correct) ||
      className.includes(CONFIG.states.error);
    expect(hasStateClass).toBe(true);
  });

  test("should clear input state when navigating", async ({ page }) => {
    await page.goto(CONFIG.url);
    await waitForPageLoad(page);

    await fillInput(page, CONFIG.testValues.wrongAnswer);
    await page.click(selectors.submitBtn);
    await page.waitForTimeout(CONFIG.timeouts.medium);

    await navigateLevel(page, CONFIG.levels.increment);
    await navigateLevel(page, CONFIG.levels.decrement);

    const input = await getInput(page);
    const inputValue = await input.inputValue();
    const className = await getInputClass(page);

    expect(inputValue).toBe("");
    expect(className).not.toContain(CONFIG.states.error);
    expect(className).not.toContain(CONFIG.states.correct);
  });

  test("should update description on level change", async ({ page }) => {
    await page.goto(CONFIG.url);
    await waitForPageLoad(page);

    const firstDescription = await page
      .locator(selectors.description)
      .textContent();
    await navigateLevel(page, CONFIG.levels.increment);

    const secondDescription = await page
      .locator(selectors.description)
      .textContent();
    expect(secondDescription).not.toBe(firstDescription);
  });

  test("should render code lines correctly", async ({ page }) => {
    await page.goto(CONFIG.url);
    await waitForPageLoad(page);

    const codeLines = await page.locator(selectors.codeLine).all();
    expect(codeLines.length).toBeGreaterThan(0);

    const input = await getInput(page);
    const dataAnswer = await input.getAttribute("data-answer");
    expect(dataAnswer).toBeTruthy();
  });
});
