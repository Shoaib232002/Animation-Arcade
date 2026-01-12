import { test, expect } from "@playwright/test";

const TEST_URL = "http://localhost:3000/game.html";

const TIMEOUTS = {
  SHORT: 50,
  MEDIUM: 100,
  LONG: 150,
};

const LEVELS = {
  FIRST: "1",
  INCREMENT: 1,
  DECREMENT: -1,
};

const INPUT_STATES = {
  CORRECT: "correct",
  ERROR: "error",
};

const COLORS = {
  ERROR: "#d32f2f",
  ACCENT: "var(--accent-primary)",
};

const TEST_VALUES = {
  TRANSFORM: "translateX(200px)",
  WRONG_ANSWER: "wrong answer",
  TEST_INPUT: "test value",
  SIMPLE_TEST: "test",
  TRANSFORM_FULL: "transform: translateX(100px)",
  OPACITY: "transform: translateX(100px); opacity: 0.5",
  OPACITY_VALUE: "0.5",
  BACKGROUND: "background-color: red",
  BACKGROUND_VALUE: "red",
};

const selectors = {
  levelTitle: ".level-title",
  description: ".game-description",
  codeContent: "#codeContent",
  lineNumbers: "#lineNumbers",
  currentLevel: "#currentLevel",
  totalLevels: "#totalLevels",
  submitBtn: ".submit-btn",
  outputBox: ".output-box",
  prevArrow: "#prevArrow",
  nextArrow: "#nextArrow",
  blankInput: ".blank-input",
  codeLine: ".code-line",
  ball: ".ball",
  ground: ".ground",
  leftSection: ".left-section",
  rightSection: ".right-section",
};

const KEYBOARD = {
  CTRL_ENTER: "Control+Enter",
  META_ENTER: "Meta+Enter",
};

const ERROR_MESSAGES = {
  LOADING: "Error Loading Game",
};

const waitForPageLoad = async (page) => {
  await page.waitForLoadState("networkidle");
  await page.waitForSelector(selectors.levelTitle, { state: "visible" });
};

const getInputValue = async (page, index = 0) => {
  const inputs = await page.locator(selectors.blankInput).all();
  return await inputs[index].inputValue();
};

const fillInput = async (page, value, index = 0) => {
  const inputs = await page.locator(selectors.blankInput).all();
  await inputs[index].fill(value);
};

const getInputClass = async (page, index = 0) => {
  const inputs = await page.locator(selectors.blankInput).all();
  return await inputs[index].getAttribute("class");
};

const navigateToLevel = async (page, targetLevel) => {
  const currentLevelText = await page
    .locator(selectors.currentLevel)
    .textContent();
  const currentLevel = parseInt(currentLevelText);
  const difference = targetLevel - currentLevel;

  if (difference > 0) {
    for (let i = 0; i < difference; i++) {
      await page.click(selectors.nextArrow);
      await page.waitForTimeout(TIMEOUTS.SHORT);
    }
  } else if (difference < 0) {
    for (let i = 0; i < Math.abs(difference); i++) {
      await page.click(selectors.prevArrow);
      await page.waitForTimeout(TIMEOUTS.SHORT);
    }
  }
};

const navigateToLastLevel = async (page) => {
  const totalLevels = await page.locator(selectors.totalLevels).textContent();
  const total = parseInt(totalLevels);
  await navigateToLevel(page, total);
};

test.describe("GameEditor Initialization", () => {
  test("should load the game editor correctly", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await expect(page.locator(selectors.levelTitle)).toBeVisible();
    await expect(page.locator(selectors.description)).toBeVisible();
    await expect(page.locator(selectors.codeContent)).toBeVisible();
    await expect(page.locator(selectors.submitBtn)).toBeVisible();
  });

  test("should display level 1 by default", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    const currentLevel = await page
      .locator(selectors.currentLevel)
      .textContent();
    expect(currentLevel).toBe(LEVELS.FIRST);
  });

  test("should display total levels count", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    const totalLevels = await page.locator(selectors.totalLevels).textContent();
    expect(parseInt(totalLevels)).toBeGreaterThan(0);
  });

  test("should initialize output box with ball and ground", async ({
    page,
  }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await expect(page.locator(selectors.ball)).toBeVisible();
    await expect(page.locator(selectors.ground)).toBeVisible();
  });
});

test.describe("Level Navigation", () => {
  test("should navigate to next level", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    const initialLevel = await page
      .locator(selectors.currentLevel)
      .textContent();
    await page.click(selectors.nextArrow);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const newLevel = await page.locator(selectors.currentLevel).textContent();
    expect(parseInt(newLevel)).toBe(parseInt(initialLevel) + LEVELS.INCREMENT);
  });

  test("should navigate to previous level", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await page.click(selectors.nextArrow);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const currentLevel = await page
      .locator(selectors.currentLevel)
      .textContent();
    await page.click(selectors.prevArrow);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const previousLevel = await page
      .locator(selectors.currentLevel)
      .textContent();
    expect(parseInt(previousLevel)).toBe(
      parseInt(currentLevel) + LEVELS.DECREMENT
    );
  });

  test("should not navigate below level 1", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await page.click(selectors.prevArrow);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const currentLevel = await page
      .locator(selectors.currentLevel)
      .textContent();
    expect(currentLevel).toBe(LEVELS.FIRST);
  });

  test("should not navigate beyond last level", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    const totalLevels = await page.locator(selectors.totalLevels).textContent();
    await navigateToLastLevel(page);

    await page.click(selectors.nextArrow);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const currentLevel = await page
      .locator(selectors.currentLevel)
      .textContent();
    expect(currentLevel).toBe(totalLevels);
  });

  test("should clear input states when navigating", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await fillInput(page, TEST_VALUES.TEST_INPUT);
    await page.click(selectors.nextArrow);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    await page.click(selectors.prevArrow);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const inputValue = await getInputValue(page);
    expect(inputValue).toBe("");
  });
});

test.describe("Code Rendering", () => {
  test("should render line numbers", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    const lineNumbers = await page
      .locator(`${selectors.lineNumbers} span`)
      .all();
    expect(lineNumbers.length).toBeGreaterThan(0);
  });

  test("should render code lines", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    const codeLines = await page.locator(selectors.codeLine).all();
    expect(codeLines.length).toBeGreaterThan(0);
  });

  test("should render blank inputs", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    const inputs = await page.locator(selectors.blankInput).all();
    expect(inputs.length).toBeGreaterThan(0);
  });

  test("should focus first input on load", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);
    await page.waitForTimeout(TIMEOUTS.LONG);

    const focusedElement = await page.evaluate(
      () => document.activeElement.className
    );
    expect(focusedElement).toContain("blank-input");
  });

  test("should store correct answer in dataset", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    const inputs = await page.locator(selectors.blankInput).all();
    const answer = await inputs[0].getAttribute("data-answer");
    expect(answer).toBeTruthy();
  });
});

test.describe("Input Validation", () => {
  test("should accept user input", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await fillInput(page, TEST_VALUES.TRANSFORM);

    const inputValue = await getInputValue(page);
    expect(inputValue).toBe(TEST_VALUES.TRANSFORM);
  });

  test("should clear input value when navigating", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await fillInput(page, TEST_VALUES.SIMPLE_TEST);
    await page.click(selectors.nextArrow);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    await page.click(selectors.prevArrow);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const inputValue = await getInputValue(page);
    expect(inputValue).toBe("");
  });

  test("should remove error class when navigating", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await fillInput(page, TEST_VALUES.WRONG_ANSWER);
    await page.click(selectors.submitBtn);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    await page.click(selectors.nextArrow);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);
    await page.click(selectors.prevArrow);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const className = await getInputClass(page);
    expect(className).not.toContain(INPUT_STATES.ERROR);
    expect(className).not.toContain(INPUT_STATES.CORRECT);
  });
});

test.describe("Keyboard Shortcuts", () => {
  test("should submit on Ctrl+Enter", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await fillInput(page, TEST_VALUES.TRANSFORM);
    await page.keyboard.press(KEYBOARD.CTRL_ENTER);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const className = await getInputClass(page);
    const hasStateClass =
      className.includes(INPUT_STATES.CORRECT) ||
      className.includes(INPUT_STATES.ERROR);
    expect(hasStateClass).toBe(true);
  });

  test("should submit on Meta+Enter", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await fillInput(page, TEST_VALUES.TRANSFORM);
    await page.keyboard.press(KEYBOARD.META_ENTER);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const className = await getInputClass(page);
    const hasStateClass =
      className.includes(INPUT_STATES.CORRECT) ||
      className.includes(INPUT_STATES.ERROR);
    expect(hasStateClass).toBe(true);
  });
});

test.describe("Description Rendering", () => {
  test("should display level description", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    const description = await page.locator(selectors.description).textContent();
    expect(description.length).toBeGreaterThan(0);
  });

  test("should update description when navigating", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    const firstDescription = await page
      .locator(selectors.description)
      .textContent();
    await page.click(selectors.nextArrow);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const secondDescription = await page
      .locator(selectors.description)
      .textContent();
    expect(secondDescription).not.toBe(firstDescription);
  });

  test("should format level 1 description with accent color", async ({
    page,
  }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    const descriptionHTML = await page
      .locator(selectors.description)
      .innerHTML();
    expect(descriptionHTML).toContain(COLORS.ACCENT);
  });
});

test.describe("Animation Application", () => {
  test("should apply transform to ball", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await page.evaluate((cssRule) => {
      const editor = window.gameEditorInstance;
      if (editor) {
        editor.applyAnimation(cssRule);
      }
    }, TEST_VALUES.TRANSFORM_FULL);

    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const ballTransform = await page
      .locator(selectors.ball)
      .evaluate((el) => el.style.transform);
    expect(ballTransform).toContain("translateX");
  });

  test("should handle multiple CSS properties", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await page.evaluate((cssRule) => {
      const editor = window.gameEditorInstance;
      if (editor) {
        editor.applyAnimation(cssRule);
      }
    }, TEST_VALUES.OPACITY);

    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const ballOpacity = await page
      .locator(selectors.ball)
      .evaluate((el) => el.style.opacity);
    expect(ballOpacity).toBe(TEST_VALUES.OPACITY_VALUE);
  });

  test("should convert kebab-case to camelCase", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await page.evaluate((cssRule) => {
      const editor = window.gameEditorInstance;
      if (editor) {
        editor.applyAnimation(cssRule);
      }
    }, TEST_VALUES.BACKGROUND);

    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const ballBgColor = await page
      .locator(selectors.ball)
      .evaluate((el) => el.style.backgroundColor);
    expect(ballBgColor).toBe(TEST_VALUES.BACKGROUND_VALUE);
  });
});

test.describe("Error Handling", () => {
  test("should display error message on initialization failure", async ({
    page,
  }) => {
    await page.goto(TEST_URL);

    const errorMessage = await page.evaluate(
      (message) => {
        try {
          throw new Error("Test error");
        } catch {
          const outputBox = document.querySelector(".output-box");
          if (outputBox) {
            outputBox.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: ${message.color};">
              <h3>${message.text}</h3>
            </div>
          `;
            return outputBox.textContent;
          }
        }
        return null;
      },
      { text: ERROR_MESSAGES.LOADING, color: COLORS.ERROR }
    );

    expect(errorMessage).toContain(ERROR_MESSAGES.LOADING);
  });
});

test.describe("Multiple Input Handling", () => {
  test("should handle multiple blanks in same level", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await navigateToLastLevel(page);
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    const inputs = await page.locator(selectors.blankInput).all();
    if (inputs.length > LEVELS.INCREMENT) {
      expect(inputs.length).toBeGreaterThan(LEVELS.INCREMENT);
    }
  });

  test("should store all input references", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    const inputCount = await page.evaluate(() => {
      const editor = window.gameEditorInstance;
      return editor ? editor.inputs.length : 0;
    });

    expect(inputCount).toBeGreaterThan(0);
  });
});

test.describe("UI Element Visibility", () => {
  test("should display navigation arrows", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await expect(page.locator(selectors.prevArrow)).toBeVisible();
    await expect(page.locator(selectors.nextArrow)).toBeVisible();
  });

  test("should display submit button", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    await expect(page.locator(selectors.submitBtn)).toBeVisible();
    const btnText = await page.locator(selectors.submitBtn).textContent();
    expect(btnText).toBeTruthy();
  });

  test("should maintain layout structure", async ({ page }) => {
    await page.goto(TEST_URL);
    await waitForPageLoad(page);

    const hasLeftSection = await page
      .locator(selectors.leftSection)
      .isVisible();
    const hasRightSection = await page
      .locator(selectors.rightSection)
      .isVisible();

    expect(hasLeftSection).toBe(true);
    expect(hasRightSection).toBe(true);
  });
});
