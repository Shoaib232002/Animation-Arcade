import { loadLevels, getLevels } from "./levelsData.js";
import "./animation.js";
import { GameValidator } from "./validator.js";
import { renderHints } from "./hints.js";
import {
  EDITOR_CONSTANTS,
  SELECTORS,
  EDITOR_CSS_CLASSES,
  getHTMLTemplates,
} from "./constants.js";

class GameEditor {
  constructor() {
    this.currentLevel = EDITOR_CONSTANTS.LEVEL_START;
    this.inputs = [];
    this.HTML_TEMPLATES = getHTMLTemplates();
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
      this.navigateLevel(EDITOR_CONSTANTS.NAVIGATION.BACKWARD)
    );
    this.elements.nextArrow?.addEventListener("click", () =>
      this.navigateLevel(EDITOR_CONSTANTS.NAVIGATION.FORWARD)
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === EDITOR_CONSTANTS.KEYS.ENTER && (e.ctrlKey || e.metaKey)) {
        this.validator.checkAnswer();
      }
    });
  }

  loadLevel(levelIndex) {
    const levels = getLevels();
    if (
      levelIndex < EDITOR_CONSTANTS.LEVEL_START ||
      levelIndex >= levels.length
    )
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
      level?.id === EDITOR_CONSTANTS.FIRST_LEVEL_ID
        ? this.formatSpecialDescription(level)
        : this.formatStandardDescription(level);
    this.elements.description.innerHTML = descHTML;
  }

  formatSpecialDescription(level) {
    if (!level.description) return this.addQuestion("", level.question);
    const firstSentenceEnd = level.description.search(/[.!?]/);
    const splitAt =
      firstSentenceEnd === -1
        ? level.description.length
        : firstSentenceEnd + EDITOR_CONSTANTS.LINE_INCREMENT;
    const firstPart = level.description
      .slice(EDITOR_CONSTANTS.LEVEL_START, splitAt)
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
      lineNumber.textContent = index + EDITOR_CONSTANTS.LINE_NUMBER_START;
      this.elements.lineNumbers.appendChild(lineNumber);

      const codeLine = document.createElement("div");
      codeLine.className = EDITOR_CSS_CLASSES.CODE_LINE;

      const blank = level.blanks.find((b) => b.line === index);

      if (blank) {
        const parts = line.split(EDITOR_CONSTANTS.BLANK_PLACEHOLDER);

        if (parts[EDITOR_CONSTANTS.LEVEL_START]) {
          const textBefore = document.createElement("span");
          textBefore.className = EDITOR_CSS_CLASSES.CODE_LINE_TEXT;
          textBefore.textContent = parts[EDITOR_CONSTANTS.LEVEL_START];
          codeLine.appendChild(textBefore);
        }

        const input = document.createElement("input");
        input.type = "text";
        input.className = EDITOR_CSS_CLASSES.BLANK_INPUT;
        input.dataset.answer = blank.answer;
        input.dataset.line = index;
        input.placeholder = "";
        this.inputs.push(input);

        const blankContainer = document.createElement("span");
        blankContainer.className = EDITOR_CSS_CLASSES.CODE_LINE_BLANK;
        blankContainer.appendChild(input);
        codeLine.appendChild(blankContainer);

        if (parts[EDITOR_CONSTANTS.LINE_INCREMENT]) {
          const textAfter = document.createElement("span");
          textAfter.className = EDITOR_CSS_CLASSES.CODE_LINE_TEXT;
          textAfter.textContent = parts[EDITOR_CONSTANTS.LINE_INCREMENT];
          codeLine.appendChild(textAfter);
        }
      } else {
        const text = document.createElement("span");
        text.className = EDITOR_CSS_CLASSES.CODE_LINE_TEXT;
        text.textContent = line;
        codeLine.appendChild(text);
      }

      this.elements.codeContent.appendChild(codeLine);
    });

    if (this.inputs.length > EDITOR_CONSTANTS.LEVEL_START) {
      setTimeout(() => {
        this.inputs[EDITOR_CONSTANTS.FIRST_INPUT_INDEX]?.focus();
      }, EDITOR_CONSTANTS.FOCUS_DELAY);
    }
  }

  renderOutput() {
    if (!this.elements.outputBox) return;
    this.elements.outputBox.innerHTML = this.HTML_TEMPLATES.OUTPUT_BOX;
  }

  applyAnimation(cssRule) {
    const ball = document.querySelector(SELECTORS.BALL);
    if (!ball) return;

    ball.removeAttribute("style");

    const rules = cssRule.split(";").filter((r) => r.trim());
    rules.forEach((rule) => {
      const [property, value] = rule.split(":").map((s) => s.trim());
      if (property && value) {
        const camelCase = property.replace(/-([a-z])/g, (match, letter) =>
          letter.toUpperCase()
        );
        ball.style[camelCase] = value;
      }
    });
  }

  clearInputStates() {
    this.inputs.forEach((input) => {
      input.classList.remove(
        EDITOR_CSS_CLASSES.CORRECT,
        EDITOR_CSS_CLASSES.ERROR
      );
      input.value = "";
    });
  }

  navigateLevel(direction) {
    const levels = getLevels();
    const newLevel = this.currentLevel + direction;
    if (newLevel >= EDITOR_CONSTANTS.LEVEL_START && newLevel < levels.length) {
      this.loadLevel(newLevel);
    }
  }

  showCompletionMessage() {
    if (this.elements.outputBox) {
      this.elements.outputBox.innerHTML =
        this.HTML_TEMPLATES.COMPLETION_MESSAGE;
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadLevels();
    new GameEditor();
  } catch {
    const outputBox = document.querySelector(SELECTORS.OUTPUT_BOX);
    if (outputBox) {
      outputBox.innerHTML = getHTMLTemplates().ERROR_MESSAGE;
    }
  }
});
