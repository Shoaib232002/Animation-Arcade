import { loadLevels, getLevels } from "./levelsData.js";
import "./animation.js";
import { GameValidator } from "./validator.js";
import { renderHints } from "./hints.js";
import { UI_STRINGS } from "./constants.js";

const CONSTANTS = {
  LINE_NUMBER_START: 1,
  LINE_INCREMENT: 1,
  FOCUS_DELAY: 100,
  FIRST_INPUT_INDEX: 0,
  LEVEL_START: 0,
  NAVIGATION: {
    BACKWARD: -1,
    FORWARD: 1,
  },
  BLANK_PLACEHOLDER: "_____",
  FIRST_LEVEL_ID: 1,
  REGEX: {
    SENTENCE_END: /[.!?]/,
    NOT_FOUND: -1,
  },
  KEYS: {
    ENTER: "Enter",
  },
  CSS: {
    HYPHEN_LOWERCASE: /-([a-z])/g,
  },
};

const SELECTORS = {
  LEVEL_TITLE: ".level-title",
  DESCRIPTION: ".game-description",
  CODE_CONTENT: "#codeContent",
  LINE_NUMBERS: "#lineNumbers",
  HINTS_LIST: "#hintsList",
  CURRENT_LEVEL: "#currentLevel",
  TOTAL_LEVELS: "#totalLevels",
  SUBMIT_BTN: ".submit-btn",
  OUTPUT_BOX: ".output-box",
  PREV_ARROW: "#prevArrow",
  NEXT_ARROW: "#nextArrow",
  BALL: ".ball",
  GROUND: ".ground",
};

const CSS_CLASSES = {
  CODE_LINE: "code-line",
  CODE_LINE_TEXT: "code-line-text",
  CODE_LINE_BLANK: "code-line-blank",
  BLANK_INPUT: "blank-input",
  CORRECT: "correct",
  ERROR: "error",
  COMPLETION_CONTAINER: "completion-container",
  ERROR_CONTAINER: "error-container",
};

const HTML_TEMPLATES = {
  OUTPUT_BOX: `
    <div class="${CSS_CLASSES.GROUND}">
      <div class="${SELECTORS.BALL.slice(1)}"></div>
    </div>
  `,
  COMPLETION_MESSAGE: `
    <div class="${CSS_CLASSES.COMPLETION_CONTAINER}">
      <h2>${UI_STRINGS.COMPLETION_TITLE}</h2>
    </div>
  `,
  ERROR_MESSAGE: `
    <div class="${CSS_CLASSES.ERROR_CONTAINER}">
      <h3>${UI_STRINGS.ERROR_TITLE}</h3>
      <p>${UI_STRINGS.ERROR_MESSAGE_1}</p>
      <p>${UI_STRINGS.ERROR_MESSAGE_2}</p>
    </div>
  `,
};

class GameEditor {
  constructor() {
    this.currentLevel = CONSTANTS.LEVEL_START;
    this.inputs = [];
    this.initializeElements();
    this.validator = new GameValidator(this);
    this.setupEventListeners();
    this.loadLevel(this.currentLevel);
  }

  initializeElements() {
    this.elements = {
      levelTitle: document.querySelector(SELECTORS.LEVEL_TITLE),
      description: document.querySelector(SELECTORS.DESCRIPTION),
      codeContent: document.querySelector(SELECTORS.CODE_CONTENT),
      lineNumbers: document.querySelector(SELECTORS.LINE_NUMBERS),
      hintsList: document.querySelector(SELECTORS.HINTS_LIST),
      currentLevel: document.querySelector(SELECTORS.CURRENT_LEVEL),
      totalLevels: document.querySelector(SELECTORS.TOTAL_LEVELS),
      submitBtn: document.querySelector(SELECTORS.SUBMIT_BTN),
      outputBox: document.querySelector(SELECTORS.OUTPUT_BOX),
      prevArrow: document.querySelector(SELECTORS.PREV_ARROW),
      nextArrow: document.querySelector(SELECTORS.NEXT_ARROW),
    };
  }

  setupEventListeners() {
    this.elements.submitBtn?.addEventListener("click", () =>
      this.validator.checkAnswer()
    );
    this.elements.prevArrow?.addEventListener("click", () =>
      this.navigateLevel(CONSTANTS.NAVIGATION.BACKWARD)
    );
    this.elements.nextArrow?.addEventListener("click", () =>
      this.navigateLevel(CONSTANTS.NAVIGATION.FORWARD)
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === CONSTANTS.KEYS.ENTER && (e.ctrlKey || e.metaKey)) {
        this.validator.checkAnswer();
      }
    });
  }

  loadLevel(levelIndex) {
    const levels = getLevels();
    if (levelIndex < CONSTANTS.LEVEL_START || levelIndex >= levels.length)
      return;

    this.currentLevel = levelIndex;
    const level = levels[levelIndex];

    this.updateLevelInfo(level);
    this.renderCode(level);
    renderHints(this, level);
    this.renderOutput();
    this.clearInputStates();
  }

  updateLevelInfo(level) {
    this.setLevelTitle(level.title);
    this.setDescription(level);
    this.setLevelCount(level.id, getLevels().length);
  }

  setLevelTitle(title) {
    if (this.elements.levelTitle) {
      this.elements.levelTitle.textContent = title;
    }
  }

  setDescription(level) {
    if (!this.elements.description) return;
    const descHTML =
      level?.id === CONSTANTS.FIRST_LEVEL_ID
        ? this.formatSpecialDescription(level)
        : this.formatStandardDescription(level);
    this.elements.description.innerHTML = descHTML;
  }

  formatSpecialDescription(level) {
    if (!level.description) return this.addQuestion("", level.question);
    const firstSentenceEnd = level.description.search(
      CONSTANTS.REGEX.SENTENCE_END
    );
    const splitAt =
      firstSentenceEnd === CONSTANTS.REGEX.NOT_FOUND
        ? level.description.length
        : firstSentenceEnd + CONSTANTS.LINE_INCREMENT;
    const firstPart = level.description
      .slice(CONSTANTS.LEVEL_START, splitAt)
      .trim();
    const restPart = level.description.slice(splitAt).trim();
    let result = `<span class="description-highlight">${firstPart}</span>`;
    if (restPart) result += `<br/><span>${restPart}</span>`;
    return this.addQuestion(result, level.question);
  }

  formatStandardDescription(level) {
    const base = level.description || "";
    return this.addQuestion(base, level.question);
  }

  addQuestion(html, question) {
    if (question) {
      html += `<br/><br/><strong class="question-highlight">${question}</strong>`;
    }
    return html;
  }

  setLevelCount(current, total) {
    if (this.elements.currentLevel) {
      this.elements.currentLevel.textContent = current;
    }
    if (this.elements.totalLevels) {
      this.elements.totalLevels.textContent = total;
    }
  }

  renderCode(level) {
    if (!this.elements.codeContent || !this.elements.lineNumbers) return;

    this.elements.codeContent.innerHTML = "";
    this.elements.lineNumbers.innerHTML = "";
    this.inputs = [];

    level.code.forEach((line, index) => {
      const lineNumber = document.createElement("span");
      lineNumber.textContent = index + CONSTANTS.LINE_NUMBER_START;
      this.elements.lineNumbers.appendChild(lineNumber);

      const codeLine = document.createElement("div");
      codeLine.className = CSS_CLASSES.CODE_LINE;

      const blank = level.blanks.find((b) => b.line === index);

      if (blank) {
        const parts = line.split(CONSTANTS.BLANK_PLACEHOLDER);

        if (parts[CONSTANTS.LEVEL_START]) {
          const textBefore = document.createElement("span");
          textBefore.className = CSS_CLASSES.CODE_LINE_TEXT;
          textBefore.textContent = parts[CONSTANTS.LEVEL_START];
          codeLine.appendChild(textBefore);
        }

        const input = document.createElement("input");
        input.type = "text";
        input.className = CSS_CLASSES.BLANK_INPUT;
        input.dataset.answer = blank.answer;
        input.dataset.line = index;
        input.placeholder = "";
        this.inputs.push(input);

        const blankContainer = document.createElement("span");
        blankContainer.className = CSS_CLASSES.CODE_LINE_BLANK;
        blankContainer.appendChild(input);
        codeLine.appendChild(blankContainer);

        if (parts[CONSTANTS.LINE_INCREMENT]) {
          const textAfter = document.createElement("span");
          textAfter.className = CSS_CLASSES.CODE_LINE_TEXT;
          textAfter.textContent = parts[CONSTANTS.LINE_INCREMENT];
          codeLine.appendChild(textAfter);
        }
      } else {
        const text = document.createElement("span");
        text.className = CSS_CLASSES.CODE_LINE_TEXT;
        text.textContent = line;
        codeLine.appendChild(text);
      }

      this.elements.codeContent.appendChild(codeLine);
    });

    if (this.inputs.length > CONSTANTS.LEVEL_START) {
      setTimeout(() => {
        this.inputs[CONSTANTS.FIRST_INPUT_INDEX]?.focus();
      }, CONSTANTS.FOCUS_DELAY);
    }
  }

  renderOutput() {
    if (!this.elements.outputBox) return;
    this.elements.outputBox.innerHTML = HTML_TEMPLATES.OUTPUT_BOX;
  }

  applyAnimation(cssRule) {
    const ball = document.querySelector(SELECTORS.BALL);
    if (!ball) return;

    ball.removeAttribute("style");

    const rules = cssRule.split(";").filter((r) => r.trim());
    rules.forEach((rule) => {
      const [property, value] = rule.split(":").map((s) => s.trim());
      if (property && value) {
        const camelCase = property.replace(
          CONSTANTS.CSS.HYPHEN_LOWERCASE,
          (match, letter) => letter.toUpperCase()
        );
        ball.style[camelCase] = value;
      }
    });
  }

  clearInputStates() {
    this.inputs.forEach((input) => {
      input.classList.remove(CSS_CLASSES.CORRECT, CSS_CLASSES.ERROR);
      input.value = "";
    });
  }

  navigateLevel(direction) {
    const levels = getLevels();
    const newLevel = this.currentLevel + direction;
    if (newLevel >= CONSTANTS.LEVEL_START && newLevel < levels.length) {
      this.loadLevel(newLevel);
    }
  }

  showCompletionMessage() {
    if (this.elements.outputBox) {
      this.elements.outputBox.innerHTML = HTML_TEMPLATES.COMPLETION_MESSAGE;
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadLevels();
    new GameEditor();
  } catch (error) {
    console.error("Failed to initialize game:", error);
    const outputBox = document.querySelector(SELECTORS.OUTPUT_BOX);
    if (outputBox) {
      outputBox.innerHTML = HTML_TEMPLATES.ERROR_MESSAGE;
    }
  }
});
