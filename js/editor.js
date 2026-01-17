import { loadLevels, getLevels } from "./levels-data.js";
import "./animation.js";
import { GameValidator } from "./validator.js";
import { renderHints } from "./hints.js";
import { KeyframesManager } from "./keyframes-manager.js";
import { DescriptionFormatter } from "./description-formatter.js";
import { ProgressManager } from "./progress.js";
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
    this.keyframesManager = new KeyframesManager();
    this.descriptionFormatter = new DescriptionFormatter();
    this.progressManager = new ProgressManager();
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
    this.updateNavigationButtons();
  }

  updateNavigationButtons() {
    const levels = getLevels();
    const canGoPrev = this.currentLevel > 0;
    const canGoNext =
      this.currentLevel < levels.length - 1 &&
      this.progressManager.isLevelCompleted(this.currentLevel);

    if (this.elements.prevArrow) {
      if (canGoPrev) {
        this.elements.prevArrow.classList.remove("disabled");
        this.elements.prevArrow.style.opacity = "1";
        this.elements.prevArrow.style.pointerEvents = "auto";
      } else {
        this.elements.prevArrow.classList.add("disabled");
        this.elements.prevArrow.style.opacity = "0.5";
        this.elements.prevArrow.style.pointerEvents = "none";
      }
    }

    if (this.elements.nextArrow) {
      if (canGoNext) {
        this.elements.nextArrow.classList.remove("disabled");
        this.elements.nextArrow.style.opacity = "1";
        this.elements.nextArrow.style.pointerEvents = "auto";
      } else {
        this.elements.nextArrow.classList.add("disabled");
        this.elements.nextArrow.style.opacity = "0.5";
        this.elements.nextArrow.style.pointerEvents = "none";
      }
    }
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
    const descHTML = this.descriptionFormatter.getFormattedDescription(level);
    this.elements.description.innerHTML = descHTML;
  }

  setupKeyframeHoverListeners() {
    this.keyframesManager.setupKeyframeListeners(
      (e) => this.showKeyframeTooltip(e),
      (e, force) => this.hideKeyframeTooltip(e, force)
    );
  }

  showKeyframeTooltip(event) {
    this.keyframesManager.showKeyframeTooltip(
      event,
      (text) => this.descriptionFormatter.escapeHtml(text),
      (e, force) => this.hideKeyframeTooltip(e, force)
    );
  }

  hideKeyframeTooltip(event, force = false) {
    this.keyframesManager.hideKeyframeTooltip(event, force);
  }

  toggleKeyframeTooltip(event, showCallback, hideCallback) {
    this.keyframesManager.toggleKeyframeTooltip(
      event,
      showCallback,
      hideCallback
    );
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

    if (level.keyframes) {
      const keyframesHeader =
        this.keyframesManager.createKeyframesHeader(level);
      if (keyframesHeader) {
        this.elements.codeContent.appendChild(keyframesHeader);
      }
    }

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

    this.setupKeyframeHoverListeners();
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
      if (this.progressManager.isLevelAccessible(newLevel)) {
        this.loadLevel(newLevel);
      }
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
