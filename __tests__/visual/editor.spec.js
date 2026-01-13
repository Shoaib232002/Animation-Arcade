import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";
import * as fs from "fs";

const envTestPath = ".env.test";
const envExamplePath = ".env.test.example";

if (fs.existsSync(envTestPath)) {
  dotenv.config({ path: envTestPath });
} else if (fs.existsSync(envExamplePath)) {
  dotenv.config({ path: envExamplePath });
} else {
  throw new Error(`Neither ${envTestPath} nor ${envExamplePath} found`);
}

const CONFIG = {
  url: process.env.Test_URL,
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

class GamePage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(CONFIG.url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForSelector(selectors.blankInput, {
      state: "visible",
      timeout: CONFIG.timeouts.page,
    });
    await this.page.waitForTimeout(CONFIG.timeouts.long);
  }

  async getInput(index = 0) {
    const inputs = await this.page.locator(selectors.blankInput).all();
    return inputs[index];
  }

  async fillInput(value, index = 0) {
    const input = await this.getInput(index);
    await input.fill(value);
  }

  async getInputValue(index = 0) {
    const input = await this.getInput(index);
    return await input.inputValue();
  }

  async getInputClass(index = 0) {
    const input = await this.getInput(index);
    return (await input.getAttribute("class")) || "";
  }

  async getInputDataAnswer(index = 0) {
    const input = await this.getInput(index);
    return await input.getAttribute("data-answer");
  }

  async navigateLevel(direction) {
    const arrow =
      direction > CONFIG.levels.decrement
        ? selectors.nextArrow
        : selectors.prevArrow;
    await this.page.click(arrow);
    await this.page.waitForTimeout(CONFIG.timeouts.medium);
  }

  async submit() {
    await this.page.click(selectors.submitBtn);
    await this.page.waitForTimeout(CONFIG.timeouts.medium);
  }

  async submitWithKeyboard() {
    await this.page.keyboard.press(CONFIG.keyboard.ctrlEnter);
    await this.page.waitForTimeout(CONFIG.timeouts.medium);
  }

  async assertVisible(selector) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async getCurrentLevel() {
    return (
      (await this.page.locator(selectors.currentLevel).textContent()) || ""
    );
  }

  async getTotalLevels() {
    return (await this.page.locator(selectors.totalLevels).textContent()) || "";
  }

  async getDescription() {
    return (await this.page.locator(selectors.description).textContent()) || "";
  }

  async getCodeLines() {
    return await this.page.locator(selectors.codeLine).all();
  }

  hasStateClass(className) {
    return (
      className.includes(CONFIG.states.correct) ||
      className.includes(CONFIG.states.error)
    );
  }

  doesNotHaveStateClasses(className) {
    return (
      !className.includes(CONFIG.states.error) &&
      !className.includes(CONFIG.states.correct)
    );
  }
}

test.describe("GameEditor Core Functionality", () => {
  let gamePage;

  test.beforeEach(async ({ page }) => {
    gamePage = new GamePage(page);
    await gamePage.goto();
  });

  test("should navigate between levels correctly", async () => {
    const initialLevel = await gamePage.getCurrentLevel();
    await gamePage.navigateLevel(CONFIG.levels.increment);

    const nextLevel = await gamePage.getCurrentLevel();
    expect(parseInt(nextLevel)).toBe(
      parseInt(initialLevel) + CONFIG.levels.increment
    );

    await gamePage.navigateLevel(CONFIG.levels.decrement);
    const previousLevel = await gamePage.getCurrentLevel();
    expect(previousLevel).toBe(initialLevel);
  });

  test("should handle user input and validation", async () => {
    await gamePage.fillInput(CONFIG.testValues.transform);
    const inputValue = await gamePage.getInputValue();
    expect(inputValue).toBe(CONFIG.testValues.transform);

    await gamePage.submitWithKeyboard();

    const className = await gamePage.getInputClass();
    expect(gamePage.hasStateClass(className)).toBe(true);
  });

  test("should clear input state when navigating", async () => {
    await gamePage.fillInput(CONFIG.testValues.wrongAnswer);
    await gamePage.submit();

    await gamePage.navigateLevel(CONFIG.levels.increment);
    await gamePage.navigateLevel(CONFIG.levels.decrement);

    const inputValue = await gamePage.getInputValue();
    const className = await gamePage.getInputClass();

    expect(inputValue).toBe("");
    expect(gamePage.doesNotHaveStateClasses(className)).toBe(true);
  });

  test("should update description on level change", async () => {
    const firstDescription = await gamePage.getDescription();
    await gamePage.navigateLevel(CONFIG.levels.increment);

    const secondDescription = await gamePage.getDescription();
    expect(secondDescription).not.toBe(firstDescription);
  });

  test("should render code lines correctly", async () => {
    const codeLines = await gamePage.getCodeLines();
    expect(codeLines.length).toBeGreaterThan(CONFIG.levels.decrement);

    const dataAnswer = await gamePage.getInputDataAnswer();
    expect(dataAnswer).toBeTruthy();
  });
});
